import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Viewer } from '@/lib/auth/scope';
import type { SnapshotSubject } from '@/lib/auth/snapshotAccess';
import type { ReplacementVerdict } from '@/lib/auth/snapshotReplacement';
import type { MeData } from '@/services/auth/types';
import type { CreateSnapshotInput } from './schemas';
import type {
    AppliedGeo,
    AppliedGeoRuleView,
    DimensionRollupView,
    SnapshotBundleView,
    SnapshotCampaignModelView,
    SnapshotCreativeView,
    SnapshotFactView,
    SnapshotGeoView,
    SnapshotView,
} from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, asc, eq, gt, inArray, sum } from 'drizzle-orm';
import { rollupDimensionFor } from '@/lib/auth/dimensionRollup';
import { FORBIDDEN_MESSAGE, requireUser } from '@/lib/auth/guards';
import { scopeFor } from '@/lib/auth/scope';
import { snapshotAccessFor } from '@/lib/auth/snapshotAccess';
import { replacementVerdictFor } from '@/lib/auth/snapshotReplacement';
import { db } from '@/lib/db';
import {
    appliedRuleset,
    appliedRulesetGeo,
    presetVersion,
    sharedSettingsVersion,
    snapshot,
    snapshotCampaignModel,
    snapshotCreative,
    snapshotFact,
    snapshotGeo,
} from '@/lib/db/schema';
import {
    SNAPSHOT_ALREADY_REPLACED,
    SNAPSHOT_DATE_MISMATCH,
    SNAPSHOT_NOT_FOUND,
    SNAPSHOT_SUPERSEDED,
    SNAPSHOT_WINDOW_ELAPSED,
} from './constants';
import {
    appliedSettingsSchema,
    createSnapshotInputSchema,
    geoThresholdsSchema,
    mutedCampaignCount,
    replaceSnapshotInputSchema,
    snapshotIdInputSchema,
} from './schemas';
import { activeSnapshotsOnly, listSnapshotsFilter, readableSnapshotFilter } from './visibility';

// Snapshots API (T6, #8). Every read runs through `scopeFor(viewer)` (ADR-0007) — no hand-rolled role
// check — and composes its WHERE through `./visibility`, which carries BOTH axes: row-scope and the
// `status = 'active'` lifecycle filter, so no read can quietly count a corrected day (ADR-0018).
// Snapshots stay immutable once saved (ADR-0002): the only UPDATE in this file is the replacement
// flip, which writes the three lifecycle columns and nothing else. Row-scope filters on the
// Snapshot's STAMPED `team_id`, so a member's transfer never re-attributes their past Snapshots. A
// Snapshot pins ALREADY-SAVED ruleset versions (spec story 35): the handler asserts each referenced
// version exists before freezing the bundle.

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
        .where(listSnapshotsFilter(scope))
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
// as not-found rather than forbidden, so its existence never leaks across teams. A REPLACED Snapshot
// is not-found for the same reason and by the same mechanism — except to the Head, which reads it for
// audit (`readableSnapshotFilter`, ADR-0018).
const loadVisibleSnapshot = async (viewer: Viewer, id: string) => {
    const [row] = await db
        .select(SNAPSHOT_COLUMNS)
        .from(snapshot)
        .innerJoin(appliedRuleset, eq(snapshot.appliedRulesetId, appliedRuleset.id))
        .where(and(eq(snapshot.id, id), readableSnapshotFilter(viewer)))
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

// One Snapshot's facts, in a stable order. The visibility check is the CALLER's job — both callers
// below run it first, so this is only ever reached for a Snapshot the viewer may read.
const loadFacts = async (id: string): Promise<SnapshotFactView[]> => {
    const facts = await db
        .select()
        .from(snapshotFact)
        .where(eq(snapshotFact.snapshotId, id))
        .orderBy(snapshotFact.campaign, snapshotFact.creative, snapshotFact.reportDate);

    return facts.map((fact): SnapshotFactView => {
        return {
            id: fact.id,
            attribution: fact.attribution,
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
};

export const getSnapshotFactsFn = createServerFn({ method: 'GET' })
    .inputValidator(snapshotIdInputSchema)
    .handler(async ({ data }): Promise<SnapshotFactView[]> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        // Facts are gated by the same row-scope as their Snapshot; an out-of-scope id is not-found.
        const row = await loadVisibleSnapshot(viewer, data.id);

        if (!row) {
            throw new Error(SNAPSHOT_NOT_FOUND);
        }

        return loadFacts(data.id);
    });

// The read behind the detailed report (S2b, #54): one Snapshot's Facts, its three completeness tables
// and the ruleset it copied — everything `analyzeSnapshot` needs to rebuild the report, in one round
// trip. Gated by the same row-scope as its Snapshot, so an out-of-scope id is not-found rather than
// forbidden and another team's activity is never disclosed by its absence (spec story 42).
export const getSnapshotBundleFn = createServerFn({ method: 'GET' })
    .inputValidator(snapshotIdInputSchema)
    .handler(async ({ data }): Promise<SnapshotBundleView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        const row = await loadVisibleSnapshot(viewer, data.id);

        if (!row) {
            throw new Error(SNAPSHOT_NOT_FOUND);
        }

        const [geoRules, settingsRow, metaRow, facts, geoRollups, creatives, campaignModels] = await Promise.all([
            db
                .select({
                    geo: appliedRulesetGeo.geo,
                    presetVersionId: appliedRulesetGeo.presetVersionId,
                    thresholds: appliedRulesetGeo.thresholds,
                })
                .from(appliedRulesetGeo)
                .where(eq(appliedRulesetGeo.appliedRulesetId, row.appliedRulesetId))
                .orderBy(appliedRulesetGeo.geo),
            db
                .select({ settings: appliedRuleset.settings })
                .from(appliedRuleset)
                .where(eq(appliedRuleset.id, row.appliedRulesetId))
                .limit(1),
            // Read on its own rather than through SNAPSHOT_COLUMNS: only the report needs the meta
            // bag, and the Snapshot list would otherwise carry every row's jsonb for nothing.
            db.select({ meta: snapshot.meta }).from(snapshot).where(eq(snapshot.id, data.id)).limit(1),
            loadFacts(data.id),
            db.select().from(snapshotGeo).where(eq(snapshotGeo.snapshotId, data.id)).orderBy(snapshotGeo.geo),
            db
                .select()
                .from(snapshotCreative)
                .where(eq(snapshotCreative.snapshotId, data.id))
                .orderBy(snapshotCreative.campaign, snapshotCreative.adName),
            db
                .select()
                .from(snapshotCampaignModel)
                .where(eq(snapshotCampaignModel.snapshotId, data.id))
                .orderBy(snapshotCampaignModel.campaign, snapshotCampaignModel.dimension, snapshotCampaignModel.key),
        ]);

        // The copied ruleset comes back out of jsonb, so it is parsed rather than trusted: a column
        // written by an older client legitimately holds null, and anything unparseable must read as
        // "no ruleset" (grade neutral) rather than crash a report.
        const settings = appliedSettingsSchema.safeParse(settingsRow[0]?.settings);

        const geosByRule = geoRules.map((rule): AppliedGeoRuleView => {
            const thresholds = geoThresholdsSchema.safeParse(rule.thresholds);
            return {
                geo: rule.geo,
                presetVersionId: rule.presetVersionId,
                thresholds: thresholds.success ? thresholds.data : null,
            };
        });

        // The Snapshot view's pinned-version list is the same rows, minus the ones whose Preset was
        // deleted — derived here rather than re-queried through `loadGeosByRuleset`.
        const pinned = geosByRule.flatMap((rule): AppliedGeo[] => {
            return rule.presetVersionId === null ? [] : [{ geo: rule.geo, presetVersionId: rule.presetVersionId }];
        });

        return {
            snapshot: toSnapshotView(viewer, row, pinned),
            geos: geosByRule,
            settings: settings.success ? settings.data : null,
            facts,
            geoRollups: geoRollups.map((rollup): SnapshotGeoView => {
                return {
                    geo: rollup.geo,
                    spendPlus: rollup.spendPlus,
                    geoTotal: rollup.geoTotal,
                    attributedRevenue: rollup.attributedRevenue,
                    linkClicks: rollup.linkClicks,
                    installs: rollup.installs,
                    regs: rollup.regs,
                    sales: rollup.sales,
                    profit: rollup.profit,
                    roi: rollup.roi,
                    cpc: rollup.cpc,
                    cpi: rollup.cpi,
                    cpr: rollup.cpr,
                    cps: rollup.cps,
                    waste: rollup.waste,
                };
            }),
            creatives: creatives.map((creative): SnapshotCreativeView => {
                return {
                    geo: creative.geo,
                    campaign: creative.campaign,
                    adName: creative.adName,
                    spend: creative.spend,
                    impressions: creative.impressions,
                };
            }),
            campaignModels: campaignModels.map((model): SnapshotCampaignModelView => {
                return {
                    campaign: model.campaign,
                    dimension: model.dimension,
                    key: model.key,
                    label: model.label,
                    revenue: model.revenue,
                    linkClicks: model.linkClicks,
                    installs: model.installs,
                    regs: model.regs,
                    sales: model.sales,
                };
            }),
            mutedCampaigns: mutedCampaignCount(metaRow[0]?.meta),
        };
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
            // Joined for its lifecycle column alone: a replaced Snapshot's facts must not survive in
            // the one read that never touches the `snapshot` table otherwise (ADR-0018).
            .innerJoin(snapshot, eq(snapshotFact.snapshotId, snapshot.id))
            .where(activeSnapshotsOnly())
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

// The write half of a Snapshot push, shared by create and replace. Takes a transaction rather than
// opening one: a replacement must flip the old row and insert the new one atomically, so the caller
// owns the boundary. The OWNER is passed in rather than read from the session — a Head correcting a
// buyer's push must not re-attribute the day to itself, or the buyer's trajectory loses a point and
// the Head's gains one (ADR-0018).
// Derived from the DRIVER type, never from the `db` instance. `typeof db.transaction` would name a
// value from a module whose import opens a Postgres connection, and `verbatimModuleSyntax` keeps that
// import alive for the type alone — which drags `postgres` into the browser bundle and fails the
// build. A type-only import of the driver is erased and cannot.
type SnapshotWriter = Parameters<Parameters<PostgresJsDatabase['transaction']>[0]>[0];

type SnapshotOwner = {
    createdByUserId: string;
    teamId: string | null;
};

const insertSnapshot = async (tx: SnapshotWriter, owner: SnapshotOwner, data: CreateSnapshotInput): Promise<string> => {
    const [ruleset] = await tx
        .insert(appliedRuleset)
        .values({ sharedSettingsVersionId: data.sharedSettingsVersionId, settings: data.settings })
        .returning({ id: appliedRuleset.id });

    await tx.insert(appliedRulesetGeo).values(
        data.geos.map((geo) => {
            return {
                appliedRulesetId: ruleset.id,
                geo: geo.geo,
                presetVersionId: geo.presetVersionId,
                // Copied, not merely referenced: the pin above is `set null` when a Preset is
                // deleted, and grading that a delete can erase is not frozen.
                thresholds: geo.thresholds,
            };
        })
    );

    const [created] = await tx
        .insert(snapshot)
        .values({
            createdByUserId: owner.createdByUserId,
            teamId: owner.teamId,
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

    // The three completeness tables. Each can legitimately be empty — a Snapshot pushed by an
    // older client carries none of them (ADR-0015) — so an empty array is skipped rather than
    // sent as a zero-row INSERT, which drizzle rejects.
    if (data.geoRollups.length > 0) {
        await tx.insert(snapshotGeo).values(
            data.geoRollups.map((geo) => {
                return { ...geo, snapshotId: created.id };
            })
        );
    }

    if (data.creatives.length > 0) {
        await tx.insert(snapshotCreative).values(
            data.creatives.map((creative) => {
                return { ...creative, snapshotId: created.id };
            })
        );
    }

    if (data.campaignModels.length > 0) {
        await tx.insert(snapshotCampaignModel).values(
            data.campaignModels.map((model) => {
                return { ...model, snapshotId: created.id };
            })
        );
    }

    return created.id;
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

        // Applied Ruleset + Snapshot + facts + the completeness tables are written together — all or
        // nothing — so a Snapshot is never half-frozen: a report missing its Creative Splits or its
        // Frozen Geo Rollup would render partly `—` with nothing to say why (ADR-0015). Creator-owned
        // and stamped with the creator's CURRENT team.
        const snapshotId = await db.transaction((tx) => {
            return insertSnapshot(tx, { createdByUserId: me.id, teamId: me.teamId }, data);
        });

        const row = await loadVisibleSnapshot(viewer, snapshotId);

        if (!row) {
            throw new Error(SNAPSHOT_NOT_FOUND);
        }

        const geosByRuleset = await loadGeosByRuleset([row.appliedRulesetId]);

        return toSnapshotView(viewer, row, geosByRuleset.get(row.appliedRulesetId) ?? []);
    });

// Maps a refusal from the pure policy seam onto the message the client sees. Every branch throws —
// a refused replacement is never a silent no-op, because the buyer would go on believing the broken
// numbers had been corrected (ADR-0018).
const assertPermitted = (verdict: ReplacementVerdict) => {
    switch (verdict) {
        case 'ok': {
            return;
        }
        case 'forbidden': {
            throw new Error(FORBIDDEN_MESSAGE);
        }
        case 'already-replaced': {
            throw new Error(SNAPSHOT_ALREADY_REPLACED);
        }
        case 'window-elapsed': {
            throw new Error(SNAPSHOT_WINDOW_ELAPSED);
        }
        case 'superseded': {
            throw new Error(SNAPSHOT_SUPERSEDED);
        }
    }
};

// The correction path (ADR-0018): a buyer who pushed a broken analysis re-pushes it within the hour
// and the old Snapshot is SUPERSEDED, never edited and never deleted. The whole thing is one
// transaction — a failure must leave neither a flipped original nor an orphan successor — and the old
// row is locked `for update` inside it, so two corrections racing each other cannot both win.
export const replaceSnapshotFn = createServerFn({ method: 'POST' })
    .inputValidator(replaceSnapshotInputSchema)
    .handler(async ({ data }): Promise<SnapshotView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        // Checked outside the transaction: it reads tables the replacement does not write, and a
        // payload built from unsaved rulesets is refused before anything is locked (spec story 35).
        await assertSavedVersions(
            data.geos.map((geo) => {
                return geo.presetVersionId;
            }),
            data.sharedSettingsVersionId
        );

        const snapshotId = await db.transaction(async (tx) => {
            const [existing] = await tx
                .select({
                    id: snapshot.id,
                    createdByUserId: snapshot.createdByUserId,
                    teamId: snapshot.teamId,
                    status: snapshot.status,
                    takenAt: snapshot.takenAt,
                    reportDate: snapshot.reportDate,
                })
                .from(snapshot)
                .where(eq(snapshot.id, data.id))
                .limit(1)
                .for('update');

            // An id the viewer may not even read is not-found, so a replacement attempt never
            // discloses another team's activity by the shape of its refusal (spec story 42).
            if (!existing || snapshotAccessFor(viewer, subjectFrom(existing)) === 'none') {
                throw new Error(SNAPSHOT_NOT_FOUND);
            }

            // A correction re-states the same day. Moving the report date would silently relocate a
            // point on the trajectory rather than fix it, and the supersession rule below is written
            // per (buyer × report_date) — a mismatch would evaluate it against the wrong day.
            if (data.reportDate !== existing.reportDate) {
                throw new Error(SNAPSHOT_DATE_MISMATCH);
            }

            // The one fact the pure verdict cannot answer for itself: has the buyer already pushed
            // again for this day? Locked rows above plus this read inside the same transaction means
            // the answer cannot change under us.
            const [newer] = await tx
                .select({ id: snapshot.id })
                .from(snapshot)
                .where(
                    and(
                        eq(snapshot.createdByUserId, existing.createdByUserId),
                        eq(snapshot.reportDate, existing.reportDate),
                        activeSnapshotsOnly(),
                        gt(snapshot.takenAt, existing.takenAt)
                    )
                )
                .limit(1);

            assertPermitted(
                replacementVerdictFor(
                    viewer,
                    {
                        createdByUserId: existing.createdByUserId,
                        teamId: existing.teamId,
                        status: existing.status,
                        takenAt: existing.takenAt,
                        reportDate: existing.reportDate,
                        hasNewerActive: Boolean(newer),
                    },
                    new Date()
                )
            );

            // Attributed to the ORIGINAL creator, not to whoever pushed the correction: a Head fixing
            // a buyer's day must leave the day on the buyer's trajectory.
            const createdId = await insertSnapshot(
                tx,
                { createdByUserId: existing.createdByUserId, teamId: existing.teamId },
                data
            );

            // The only UPDATE a Snapshot ever receives. Re-asserting `status = 'active'` in the WHERE
            // makes the flip idempotent under concurrency even if the lock above were ever lost.
            await tx
                .update(snapshot)
                .set({ status: 'replaced', replacedBy: createdId, replacedAt: new Date() })
                .where(and(eq(snapshot.id, existing.id), activeSnapshotsOnly()));

            return createdId;
        });

        const row = await loadVisibleSnapshot(viewer, snapshotId);

        if (!row) {
            throw new Error(SNAPSHOT_NOT_FOUND);
        }

        const geosByRuleset = await loadGeosByRuleset([row.appliedRulesetId]);

        return toSnapshotView(viewer, row, geosByRuleset.get(row.appliedRulesetId) ?? []);
    });
