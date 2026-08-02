import type { SQL } from 'drizzle-orm';
import type { Viewer, VisibilityScope } from '@/lib/auth/scope';
import type { SnapshotSubject } from '@/lib/auth/snapshotAccess';
import type { MeData } from '@/services/auth/types';
import type { AppliedGeo, DimensionRollupView, SnapshotFactView, SnapshotView } from './types';
import { createServerFn } from '@tanstack/react-start';
import { asc, eq, inArray, sum } from 'drizzle-orm';
import { rollupDimensionFor } from '@/lib/auth/dimensionRollup';
import { FORBIDDEN_MESSAGE, requireUser } from '@/lib/auth/guards';
import { scopeFor } from '@/lib/auth/scope';
import { snapshotAccessFor } from '@/lib/auth/snapshotAccess';
import { db } from '@/lib/db';
import {
    appliedRuleset,
    appliedRulesetGeo,
    presetVersion,
    sharedSettingsVersion,
    snapshot,
    snapshotFact,
} from '@/lib/db/schema';
import { createSnapshotInputSchema, snapshotIdInputSchema } from './schemas';

// Snapshots API (T6, #8). Every read runs through `scopeFor(viewer)` (ADR-0007) — no hand-rolled role
// check — and Snapshots are immutable once saved (rows are only ever INSERTed, ADR-0002). Row-scope
// filters on the Snapshot's STAMPED `team_id`, so a member's transfer never re-attributes their past
// Snapshots. A Snapshot pins ALREADY-SAVED ruleset versions (spec story 35): the handler asserts each
// referenced version exists before freezing the bundle.

const NOT_FOUND_MESSAGE = 'Snapshot not found';
const UNSAVED_RULESET_MESSAGE = 'A snapshot can only be built from saved ruleset versions';

const viewerFrom = (me: MeData): Viewer => {
    return { id: me.id, role: me.role, teamId: me.teamId };
};

const subjectFrom = (row: { createdByUserId: string; teamId: string | null }): SnapshotSubject => {
    return { createdByUserId: row.createdByUserId, teamId: row.teamId };
};

const SNAPSHOT_COLUMNS = {
    id: snapshot.id,
    createdByUserId: snapshot.createdByUserId,
    teamId: snapshot.teamId,
    appliedRulesetId: snapshot.appliedRulesetId,
    reportDate: snapshot.reportDate,
    takenAt: snapshot.takenAt,
    sharedSettingsVersionId: appliedRuleset.sharedSettingsVersionId,
} as const;

// Translates the row-scope axis of the descriptor into a WHERE clause. `undefined` means "no filter"
// (head sees every row); a teamless team-scope viewer is excluded upstream so a bound teamId is
// expected here.
const snapshotRowFilter = (scope: VisibilityScope): SQL | undefined => {
    switch (scope.rowScope) {
        case 'all': {
            return undefined;
        }
        case 'team': {
            return eq(snapshot.teamId, scope.teamId ?? '');
        }
        case 'own': {
            return eq(snapshot.createdByUserId, scope.userId ?? '');
        }
    }
};

// Loads every pinned Geo for a set of Applied Rulesets in one query, grouped by ruleset id — avoids an
// N+1 when assembling a list of Snapshot views.
const loadGeosByRuleset = async (rulesetIds: string[]): Promise<Map<string, AppliedGeo[]>> => {
    const grouped = new Map<string, AppliedGeo[]>();

    if (rulesetIds.length === 0) {
        return grouped;
    }

    const rows = await db
        .select({
            appliedRulesetId: appliedRulesetGeo.appliedRulesetId,
            geo: appliedRulesetGeo.geo,
            presetVersionId: appliedRulesetGeo.presetVersionId,
        })
        .from(appliedRulesetGeo)
        .where(inArray(appliedRulesetGeo.appliedRulesetId, rulesetIds))
        .orderBy(appliedRulesetGeo.geo);

    for (const row of rows) {
        const list = grouped.get(row.appliedRulesetId) ?? [];
        // A pinned version is `set null` only if history is pruned; skip such an orphaned pin.
        if (row.presetVersionId !== null) {
            list.push({ geo: row.geo, presetVersionId: row.presetVersionId });
        }
        grouped.set(row.appliedRulesetId, list);
    }

    return grouped;
};

const toSnapshotView = (
    viewer: Viewer,
    row: {
        id: string;
        createdByUserId: string;
        teamId: string | null;
        appliedRulesetId: string;
        reportDate: string;
        takenAt: Date;
        sharedSettingsVersionId: string | null;
    },
    geos: AppliedGeo[]
): SnapshotView => {
    return {
        id: row.id,
        createdByUserId: row.createdByUserId,
        teamId: row.teamId,
        appliedRulesetId: row.appliedRulesetId,
        sharedSettingsVersionId: row.sharedSettingsVersionId,
        geos,
        reportDate: row.reportDate,
        takenAt: row.takenAt.toISOString(),
        access: snapshotAccessFor(viewer, subjectFrom(row)),
    };
};

export const listSnapshotsFn = createServerFn({ method: 'GET' }).handler(async (): Promise<SnapshotView[]> => {
    const me = await requireUser();
    const viewer = viewerFrom(me);
    const scope = scopeFor(viewer);

    // Snapshots roll up into the dollar dimensions; a viewer without them (designer/bdm) sees no whole
    // Snapshot — their company-wide dimension roll-up is `getDimensionRollupFn` (T7, #9).
    if (!scope.dimensions.includes('campaign')) {
        return [];
    }

    // A team-scoped viewer with no team bound (a lead not yet placed) can match no team's snapshots.
    if (scope.rowScope === 'team' && !scope.teamId) {
        return [];
    }

    const rows = await db
        .select(SNAPSHOT_COLUMNS)
        .from(snapshot)
        .innerJoin(appliedRuleset, eq(snapshot.appliedRulesetId, appliedRuleset.id))
        .where(snapshotRowFilter(scope))
        .orderBy(snapshot.takenAt);

    const geosByRuleset = await loadGeosByRuleset(
        rows.map((row) => {
            return row.appliedRulesetId;
        })
    );

    return rows.map((row) => {
        return toSnapshotView(viewer, row, geosByRuleset.get(row.appliedRulesetId) ?? []);
    });
});

// Loads one Snapshot and applies the row-scope verdict. A Snapshot the viewer may not see is reported
// as not-found rather than forbidden, so its existence never leaks across teams.
const loadVisibleSnapshot = async (viewer: Viewer, id: string) => {
    const [row] = await db
        .select(SNAPSHOT_COLUMNS)
        .from(snapshot)
        .innerJoin(appliedRuleset, eq(snapshot.appliedRulesetId, appliedRuleset.id))
        .where(eq(snapshot.id, id))
        .limit(1);

    if (!row || snapshotAccessFor(viewer, subjectFrom(row)) === 'none') {
        return undefined;
    }

    return row;
};

export const getSnapshotFn = createServerFn({ method: 'GET' })
    .inputValidator(snapshotIdInputSchema)
    .handler(async ({ data }): Promise<SnapshotView | null> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        const row = await loadVisibleSnapshot(viewer, data.id);

        if (!row) {
            return null;
        }

        const geosByRuleset = await loadGeosByRuleset([row.appliedRulesetId]);

        return toSnapshotView(viewer, row, geosByRuleset.get(row.appliedRulesetId) ?? []);
    });

export const getSnapshotFactsFn = createServerFn({ method: 'GET' })
    .inputValidator(snapshotIdInputSchema)
    .handler(async ({ data }): Promise<SnapshotFactView[]> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        // Facts are gated by the same row-scope as their Snapshot; an out-of-scope id is not-found.
        const row = await loadVisibleSnapshot(viewer, data.id);

        if (!row) {
            throw new Error(NOT_FOUND_MESSAGE);
        }

        const facts = await db
            .select()
            .from(snapshotFact)
            .where(eq(snapshotFact.snapshotId, data.id))
            .orderBy(snapshotFact.campaign, snapshotFact.creative, snapshotFact.reportDate);

        return facts.map((fact): SnapshotFactView => {
            return {
                id: fact.id,
                campaign: fact.campaign,
                creative: fact.creative,
                reportDate: fact.reportDate,
                geo: fact.geo,
                account: fact.account,
                offer: fact.offer,
                os: fact.os,
                spend: fact.spend,
                spendPlus: fact.spendPlus,
                revenue: fact.revenue,
                linkClicks: fact.linkClicks,
                installs: fact.installs,
                regs: fact.regs,
                sales: fact.sales,
                verdict: fact.verdict,
                zone: fact.zone,
            };
        });
    });

// The company-wide dimension roll-up (T7, #9). A dollar-barred viewer (Designer/BDM) reads no dollar
// fact — instead every Snapshot fact is summed by their one dimension (`rollupDimensionFor`, driven
// by `scopeFor`, ADR-0007). Company-wide because those roles carry `rowScope: 'all'`, so no Snapshot
// row filter applies. A viewer holding a dollar dimension has no roll-up here and is Forbidden — they
// use the fact path instead.
export const getDimensionRollupFn = createServerFn({ method: 'GET' }).handler(
    async (): Promise<DimensionRollupView[]> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);
        const dimension = rollupDimensionFor(viewer);

        if (dimension === null) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const keyColumn = dimension === 'creative' ? snapshotFact.creative : snapshotFact.offer;

        const rows = await db
            .select({
                // Funnel counts only — Spend / Spend⁺ / Revenue are never selected, so a dollar figure
                // for these viewers does not exist server-side either (ADR-0009).
                key: keyColumn,
                linkClicks: sum(snapshotFact.linkClicks).mapWith(Number),
                installs: sum(snapshotFact.installs).mapWith(Number),
                regs: sum(snapshotFact.regs).mapWith(Number),
                sales: sum(snapshotFact.sales).mapWith(Number),
            })
            .from(snapshotFact)
            .groupBy(keyColumn)
            .orderBy(asc(keyColumn));

        return rows.map((row): DimensionRollupView => {
            return {
                dimension,
                key: row.key,
                linkClicks: row.linkClicks ?? 0,
                installs: row.installs ?? 0,
                regs: row.regs ?? 0,
                sales: row.sales ?? 0,
            };
        });
    }
);

// Asserts every referenced ruleset version already exists (spec story 35 — "push forces save first").
// A missing preset/shared-settings version means the client tried to snapshot unsaved edits.
const assertSavedVersions = async (presetVersionIds: string[], sharedSettingsVersionId: string | null) => {
    const found = await db
        .select({ id: presetVersion.id })
        .from(presetVersion)
        .where(inArray(presetVersion.id, presetVersionIds));

    const foundIds = new Set(
        found.map((row) => {
            return row.id;
        })
    );

    for (const id of presetVersionIds) {
        if (!foundIds.has(id)) {
            throw new Error(UNSAVED_RULESET_MESSAGE);
        }
    }

    if (sharedSettingsVersionId !== null) {
        const [sharedRow] = await db
            .select({ id: sharedSettingsVersion.id })
            .from(sharedSettingsVersion)
            .where(eq(sharedSettingsVersion.id, sharedSettingsVersionId))
            .limit(1);

        if (!sharedRow) {
            throw new Error(UNSAVED_RULESET_MESSAGE);
        }
    }
};

export const createSnapshotFn = createServerFn({ method: 'POST' })
    .inputValidator(createSnapshotInputSchema)
    .handler(async ({ data }): Promise<SnapshotView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        // Saving is a dollar-dimension action; a designer/bdm cannot create a Snapshot.
        if (!scopeFor(viewer).dimensions.includes('campaign')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        await assertSavedVersions(
            data.geos.map((geo) => {
                return geo.presetVersionId;
            }),
            data.sharedSettingsVersionId
        );

        // Applied Ruleset + Snapshot + facts are written together — all or nothing — so a Snapshot is
        // never half-frozen. Creator-owned and stamped with the creator's CURRENT team.
        const snapshotId = await db.transaction(async (tx) => {
            const [ruleset] = await tx
                .insert(appliedRuleset)
                .values({ sharedSettingsVersionId: data.sharedSettingsVersionId })
                .returning({ id: appliedRuleset.id });

            await tx.insert(appliedRulesetGeo).values(
                data.geos.map((geo) => {
                    return { appliedRulesetId: ruleset.id, geo: geo.geo, presetVersionId: geo.presetVersionId };
                })
            );

            const [created] = await tx
                .insert(snapshot)
                .values({
                    createdByUserId: me.id,
                    teamId: me.teamId,
                    appliedRulesetId: ruleset.id,
                    reportDate: data.reportDate,
                    meta: data.meta ?? null,
                })
                .returning({ id: snapshot.id });

            await tx.insert(snapshotFact).values(
                data.facts.map((fact) => {
                    return { ...fact, snapshotId: created.id };
                })
            );

            return created.id;
        });

        const row = await loadVisibleSnapshot(viewer, snapshotId);

        if (!row) {
            throw new Error(NOT_FOUND_MESSAGE);
        }

        const geosByRuleset = await loadGeosByRuleset([row.appliedRulesetId]);

        return toSnapshotView(viewer, row, geosByRuleset.get(row.appliedRulesetId) ?? []);
    });
