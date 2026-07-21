import type { SQL } from 'drizzle-orm';
import type { Viewer, VisibilityScope } from '@/lib/auth/scope';
import type { MeData } from '@/services/auth/types';
import type { PresetView, SharedSettingsView } from './types';
import { createServerFn } from '@tanstack/react-start';
import { eq, isNull } from 'drizzle-orm';
import { FORBIDDEN_MESSAGE, requireUser } from '@/lib/auth/guards';
import { presetAccessFor } from '@/lib/auth/presetAccess';
import { scopeFor } from '@/lib/auth/scope';
import { db } from '@/lib/db';
import { preset, presetVersion, sharedSettings, sharedSettingsVersion, team, user } from '@/lib/db/schema';
import {
    createPresetInputSchema,
    deletePresetInputSchema,
    presetThresholdsSchema,
    renamePresetInputSchema,
    savePresetVersionInputSchema,
    saveSharedSettingsInputSchema,
    sharedSettingsPayloadSchema,
    sharedSettingsScopeSchema,
} from './schemas';

// Presets API (T5, #7). Every read runs through `scopeFor(viewer)` (ADR-0007) — no hand-rolled role
// check — and every write appends an immutable version rather than mutating in place (ADR-0002).
// Write access is `presetAccessFor` → 'edit': visibility grants edit, so any viewer the row/dimension
// scope surfaces a preset to may retune, rename or delete it (the owner always can).

const viewerFrom = (me: MeData): Viewer => {
    return { id: me.id, role: me.role, teamId: me.teamId };
};

// Team-global shared settings are writable by the dollar-dimension roles (they carry the Geo/account
// dimensions the tunables feed); designer/bdm never touch them. Gated further by team membership.
const SHARED_SETTINGS_WRITE_ROLES: MeData['role'][] = ['team_lead', 'head', 'buyer'];

const PRESET_COLUMNS = {
    id: preset.id,
    teamId: preset.teamId,
    ownerUserId: preset.ownerUserId,
    geo: preset.geo,
    name: preset.name,
    activeVersionId: preset.activeVersionId,
} as const;

// Translates the row-scope axis of the descriptor into a WHERE clause. `undefined` means "no filter"
// (head/designer/bdm see every row); the dimension axis is applied separately by the caller.
const presetRowFilter = (scope: VisibilityScope): SQL | undefined => {
    switch (scope.rowScope) {
        case 'all': {
            return undefined;
        }
        case 'team': {
            // A teamless lead is excluded upstream (see listPresetsFn), so a bound teamId is expected.
            return eq(preset.teamId, scope.teamId ?? '');
        }
        case 'own': {
            return eq(preset.ownerUserId, scope.userId ?? '');
        }
    }
};

// Parses a jsonb thresholds blob back into the typed shape; a version written by an incompatible
// older shape yields null rather than a lie.
const parseThresholds = (value: unknown): PresetView['thresholds'] => {
    const parsed = presetThresholdsSchema.safeParse(value);

    return parsed.success ? parsed.data : null;
};

const toPresetView = (
    viewer: Viewer,
    row: {
        id: string;
        teamId: string | null;
        ownerUserId: string;
        ownerEmail: string | null;
        teamName: string | null;
        geo: string;
        name: string;
        activeVersionId: string | null;
        thresholds: unknown;
    }
): PresetView => {
    return {
        id: row.id,
        teamId: row.teamId,
        ownerUserId: row.ownerUserId,
        // The owner FK cascades on user delete, so a listed preset always has one; guard anyway.
        ownerEmail: row.ownerEmail ?? '',
        teamName: row.teamName,
        geo: row.geo,
        name: row.name,
        activeVersionId: row.activeVersionId,
        thresholds: parseThresholds(row.thresholds),
        access: presetAccessFor(viewer, { ownerUserId: row.ownerUserId, teamId: row.teamId }),
    };
};

// The owner email + team name every read joins in, so the management table has creator + team without
// a second round-trip.
const PRESET_META_COLUMNS = {
    ownerEmail: user.email,
    teamName: team.name,
} as const;

export const listPresetsFn = createServerFn({ method: 'GET' }).handler(async (): Promise<PresetView[]> => {
    const me = await requireUser();
    const viewer = viewerFrom(me);
    const scope = scopeFor(viewer);

    // Presets are a dollar-dimension table; a viewer without the Geo dimension (designer/bdm) sees none.
    if (!scope.dimensions.includes('geo')) {
        return [];
    }

    // A team-scoped viewer with no team bound (a lead not yet placed) can match no team's presets.
    if (scope.rowScope === 'team' && !scope.teamId) {
        return [];
    }

    const rows = await db
        .select({ ...PRESET_COLUMNS, ...PRESET_META_COLUMNS, thresholds: presetVersion.thresholds })
        .from(preset)
        .leftJoin(presetVersion, eq(preset.activeVersionId, presetVersion.id))
        .leftJoin(user, eq(preset.ownerUserId, user.id))
        .leftJoin(team, eq(preset.teamId, team.id))
        .where(presetRowFilter(scope))
        .orderBy(preset.geo, preset.name);

    return rows.map((row) => {
        return toPresetView(viewer, row);
    });
});

// Reloads a preset joined to its active version and re-derives the view — the single shape returned by
// every write, so the client always gets identity + current thresholds + access in one payload.
const loadPresetView = async (viewer: Viewer, presetId: string): Promise<PresetView | undefined> => {
    const [row] = await db
        .select({ ...PRESET_COLUMNS, ...PRESET_META_COLUMNS, thresholds: presetVersion.thresholds })
        .from(preset)
        .leftJoin(presetVersion, eq(preset.activeVersionId, presetVersion.id))
        .leftJoin(user, eq(preset.ownerUserId, user.id))
        .leftJoin(team, eq(preset.teamId, team.id))
        .where(eq(preset.id, presetId))
        .limit(1);

    if (!row) {
        return undefined;
    }

    return toPresetView(viewer, row);
};

export const createPresetFn = createServerFn({ method: 'POST' })
    .inputValidator(createPresetInputSchema)
    .handler(async ({ data }): Promise<PresetView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        // The creator owns it and it is stamped with their current team. Preset + first version are
        // written together, then the active pointer is set — all or nothing.
        const presetId = await db.transaction(async (tx) => {
            const [created] = await tx
                .insert(preset)
                .values({ ownerUserId: me.id, teamId: me.teamId, geo: data.geo, name: data.name })
                .returning({ id: preset.id });

            const [version] = await tx
                .insert(presetVersion)
                .values({ presetId: created.id, thresholds: data.thresholds })
                .returning({ id: presetVersion.id });

            await tx.update(preset).set({ activeVersionId: version.id }).where(eq(preset.id, created.id));

            return created.id;
        });

        const view = await loadPresetView(viewer, presetId);

        if (!view) {
            throw new Error('Preset not found');
        }

        return view;
    });

export const savePresetVersionFn = createServerFn({ method: 'POST' })
    .inputValidator(savePresetVersionInputSchema)
    .handler(async ({ data }): Promise<PresetView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        // Edit gate + append: a new version is minted and the pointer moved; the prior version is never
        // touched (ADR-0002). The access check and the two writes share one transaction so a concurrent
        // transfer cannot slip between the gate and the append.
        await db.transaction(async (tx) => {
            const [row] = await tx
                .select({ ownerUserId: preset.ownerUserId, teamId: preset.teamId })
                .from(preset)
                .where(eq(preset.id, data.presetId))
                .limit(1);

            if (!row) {
                throw new Error('Preset not found');
            }

            if (presetAccessFor(viewer, row) !== 'edit') {
                throw new Error(FORBIDDEN_MESSAGE);
            }

            const [version] = await tx
                .insert(presetVersion)
                .values({ presetId: data.presetId, thresholds: data.thresholds })
                .returning({ id: presetVersion.id });

            await tx.update(preset).set({ activeVersionId: version.id }).where(eq(preset.id, data.presetId));
        });

        // Re-read after commit — loadPresetView runs on the pool, so it must run outside the tx.
        const view = await loadPresetView(viewer, data.presetId);

        if (!view) {
            throw new Error('Preset not found');
        }

        return view;
    });

export const renamePresetFn = createServerFn({ method: 'POST' })
    .inputValidator(renamePresetInputSchema)
    .handler(async ({ data }): Promise<PresetView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        // Rename touches identity, not thresholds, so it does not mint a version — but it still needs
        // the edit gate.
        await db.transaction(async (tx) => {
            const [row] = await tx
                .select({ ownerUserId: preset.ownerUserId, teamId: preset.teamId })
                .from(preset)
                .where(eq(preset.id, data.presetId))
                .limit(1);

            if (!row) {
                throw new Error('Preset not found');
            }

            if (presetAccessFor(viewer, row) !== 'edit') {
                throw new Error(FORBIDDEN_MESSAGE);
            }

            await tx.update(preset).set({ name: data.name }).where(eq(preset.id, data.presetId));
        });

        const view = await loadPresetView(viewer, data.presetId);

        if (!view) {
            throw new Error('Preset not found');
        }

        return view;
    });

export const deletePresetFn = createServerFn({ method: 'POST' })
    .inputValidator(deletePresetInputSchema)
    .handler(async ({ data }): Promise<{ id: string }> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        // Delete — same gate as edit. `preset_version` rows cascade off the FK, and any
        // Snapshot that pinned one of those versions keeps it (`snapshot_geo_preset.preset_version_id`
        // is `set null`, ADR-0002), so a past judgement is never silently rewritten.
        await db.transaction(async (tx) => {
            const [row] = await tx
                .select({ ownerUserId: preset.ownerUserId, teamId: preset.teamId })
                .from(preset)
                .where(eq(preset.id, data.presetId))
                .limit(1);

            if (!row) {
                throw new Error('Preset not found');
            }

            if (presetAccessFor(viewer, row) !== 'edit') {
                throw new Error(FORBIDDEN_MESSAGE);
            }

            await tx.delete(preset).where(eq(preset.id, data.presetId));
        });

        return { id: data.presetId };
    });

const parsePayload = (value: unknown): SharedSettingsView['payload'] => {
    const parsed = sharedSettingsPayloadSchema.safeParse(value);

    return parsed.success ? parsed.data : null;
};

export const getSharedSettingsFn = createServerFn({ method: 'GET' })
    .inputValidator(sharedSettingsScopeSchema)
    .handler(async ({ data }): Promise<SharedSettingsView | null> => {
        const me = await requireUser();

        // Which row applies: a Head may read any team's (or the global, null-team row) via `teamId`,
        // defaulting to global; every other role is pinned to their own team, and a teamless non-Head
        // (designer/bdm/unplaced) has none.
        const isHead = me.role === 'head';
        const teamId = isHead ? (data.teamId ?? null) : (me.teamId ?? null);
        if (teamId === null && !isHead) {
            return null;
        }

        const teamFilter = teamId === null ? isNull(sharedSettings.teamId) : eq(sharedSettings.teamId, teamId);

        const [row] = await db
            .select({
                id: sharedSettings.id,
                teamId: sharedSettings.teamId,
                activeVersionId: sharedSettings.activeVersionId,
                payload: sharedSettingsVersion.payload,
            })
            .from(sharedSettings)
            .leftJoin(sharedSettingsVersion, eq(sharedSettings.activeVersionId, sharedSettingsVersion.id))
            .where(teamFilter)
            .limit(1);

        if (!row) {
            return null;
        }

        return {
            id: row.id,
            teamId: row.teamId,
            activeVersionId: row.activeVersionId,
            payload: parsePayload(row.payload),
        };
    });

export const saveSharedSettingsFn = createServerFn({ method: 'POST' })
    .inputValidator(saveSharedSettingsInputSchema)
    .handler(async ({ data }): Promise<SharedSettingsView> => {
        const me = await requireUser();

        // Team-global tunables are set by the dollar-dimension roles (team_lead / head / buyer). A Head
        // may write any team's row (or the global, null-team row) via `data.teamId`; team_lead / buyer
        // are pinned to their own team's row and so must belong to one.
        if (!SHARED_SETTINGS_WRITE_ROLES.includes(me.role)) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const isHead = me.role === 'head';
        const teamId = isHead ? (data.teamId ?? null) : (me.teamId ?? null);
        if (teamId === null && !isHead) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const teamFilter = teamId === null ? isNull(sharedSettings.teamId) : eq(sharedSettings.teamId, teamId);

        const view = await db.transaction(async (tx) => {
            // One `shared_settings` row per scope (upsert-by-team, or the global row); versions append.
            const [existing] = await tx
                .select({ id: sharedSettings.id })
                .from(sharedSettings)
                .where(teamFilter)
                .limit(1);

            const settingsId =
                existing?.id ??
                (await tx.insert(sharedSettings).values({ teamId }).returning({ id: sharedSettings.id }))[0].id;

            const [version] = await tx
                .insert(sharedSettingsVersion)
                .values({ sharedSettingsId: settingsId, payload: data.payload })
                .returning({ id: sharedSettingsVersion.id });

            await tx
                .update(sharedSettings)
                .set({ activeVersionId: version.id })
                .where(eq(sharedSettings.id, settingsId));

            return { id: settingsId, teamId, activeVersionId: version.id, payload: data.payload };
        });

        return view;
    });
