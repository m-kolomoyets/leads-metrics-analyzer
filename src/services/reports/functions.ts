import type { Viewer } from '@/lib/auth/scope';
import type { UserRole } from '@/lib/constants';
import type { MeData } from '@/services/auth/types';
import type { ReportGeoView, ReportRosterUser, ReportSnapshotView } from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, eq, gte, inArray, lte, max } from 'drizzle-orm';
import { assertDimension } from '@/lib/auth/denial';
import { requireUser } from '@/lib/auth/guards';
import { scopeFor } from '@/lib/auth/scope';
import { USER_ROLES } from '@/lib/constants';
import { db } from '@/lib/db';
import { appliedRuleset, appliedRulesetGeo, snapshot, snapshotGeo, user } from '@/lib/db/schema';
import { appliedSettingsSchema, geoThresholdsSchema } from '@/services/snapshots/schemas';
import {
    listSnapshotsFilter,
    matchesNoRows,
    rosterSnapshotJoinOn,
    userRowFilter,
} from '@/services/snapshots/visibility';
import { reportRangeInputSchema } from './schemas';

// The two reads behind the Report feed (S4, #56). Both run through `scopeFor(viewer)` (ADR-0007) —
// no hand-rolled role check — and neither returns a single Fact: a feed row is rendered from the
// Frozen Geo Rollup alone (ADR-0015), so a month-wide range stays one small query.

const viewerFrom = (me: MeData): Viewer => {
    return { id: me.id, role: me.role, teamId: me.teamId };
};

// The dollar dimension the Report surfaces read through. A role whose scope omits it may not read a
// Snapshot at all (spec story 40) — and is told so, rather than handed an empty feed.
const REPORT_DIMENSION = 'campaign';

// The roles that could ever push a Snapshot — derived from the dimension scope, never listed by hand.
// Designer and BDM fall out because their scope carries no campaign dimension (spec story 40); if a
// role's scope changes, the roster follows it without an edit here.
const CAMPAIGN_ROLES: UserRole[] = USER_ROLES.filter((role) => {
    return scopeFor({ id: '', role }).dimensions.includes(REPORT_DIMENSION);
});

// The feed's roster: every user the viewer may see who could push a Snapshot, with their last push
// EVER. Deliberately NOT `requireHead` — the Head-only admin user API stays as it is; this one is
// scoped by the same seam every Report read uses, and returns handles rather than administrative data.
export const listVisibleUsersFn = createServerFn({ method: 'GET' }).handler(async (): Promise<ReportRosterUser[]> => {
    const me = await requireUser();
    const scope = scopeFor(viewerFrom(me));

    // Designer and BDM are refused outright: an empty roster would read as "nobody works here"
    // rather than "this is not yours" (SPEC I8, dimension half).
    assertDimension(scope, REPORT_DIMENSION);

    if (matchesNoRows(scope)) {
        return [];
    }

    // Disabled and still-invited users are excluded: an offboarded person must not sit permanently
    // dimmed in the feed (spec story 41).
    const rows = await db
        .select({
            id: user.id,
            nickname: user.nickname,
            role: user.role,
            lastTakenAt: max(snapshot.takenAt),
        })
        .from(user)
        // The lifecycle filter rides in the JOIN, not the WHERE: a buyer whose only push has been
        // replaced must still appear in the roster reading "never", not drop out of the feed.
        .leftJoin(snapshot, rosterSnapshotJoinOn())
        .where(and(eq(user.status, 'active'), inArray(user.role, CAMPAIGN_ROLES), userRowFilter(scope)))
        .groupBy(user.id, user.nickname, user.role)
        .orderBy(user.nickname);

    return rows.map((row): ReportRosterUser => {
        return {
            id: row.id,
            nickname: row.nickname,
            role: row.role,
            lastTakenAt: row.lastTakenAt?.toISOString() ?? null,
        };
    });
});

// The Snapshots a Report is made of: everything in the viewer's scope whose REPORT DATE falls in the
// range (ADR-0016 — never `takenAt`, so a Monday report pushed on Wednesday reads as Monday), each
// carrying its Frozen Geo Rollups and the ruleset figures the cards need to tint themselves.
export const listReportFn = createServerFn({ method: 'GET' })
    .inputValidator(reportRangeInputSchema)
    .handler(async ({ data }): Promise<ReportSnapshotView[]> => {
        const me = await requireUser();
        const scope = scopeFor(viewerFrom(me));

        assertDimension(scope, REPORT_DIMENSION);

        // A team lead not yet placed on a team matches no row. That IS an empty feed — they may ask,
        // there is simply nothing under them — so it stays a legitimate empty result, not a denial.
        if (matchesNoRows(scope)) {
            return [];
        }

        const rows = await db
            .select({
                id: snapshot.id,
                createdByUserId: snapshot.createdByUserId,
                appliedRulesetId: snapshot.appliedRulesetId,
                reportDate: snapshot.reportDate,
                takenAt: snapshot.takenAt,
                settings: appliedRuleset.settings,
            })
            .from(snapshot)
            .innerJoin(appliedRuleset, eq(snapshot.appliedRulesetId, appliedRuleset.id))
            .where(
                and(listSnapshotsFilter(scope), gte(snapshot.reportDate, data.from), lte(snapshot.reportDate, data.to))
            )
            .orderBy(snapshot.takenAt);

        if (rows.length === 0) {
            return [];
        }

        // Rollups and thresholds are loaded in one query each and grouped in memory — the alternative
        // is a per-Snapshot round trip, and a month-wide range is hundreds of Snapshots.
        const [rollups, geoRules] = await Promise.all([
            db
                .select()
                .from(snapshotGeo)
                .where(
                    inArray(
                        snapshotGeo.snapshotId,
                        rows.map((row) => {
                            return row.id;
                        })
                    )
                )
                .orderBy(snapshotGeo.geo),
            db
                .select({
                    appliedRulesetId: appliedRulesetGeo.appliedRulesetId,
                    geo: appliedRulesetGeo.geo,
                    thresholds: appliedRulesetGeo.thresholds,
                })
                .from(appliedRulesetGeo)
                .where(
                    inArray(
                        appliedRulesetGeo.appliedRulesetId,
                        rows.map((row) => {
                            return row.appliedRulesetId;
                        })
                    )
                ),
        ]);

        // Thresholds come back out of jsonb, so they are parsed rather than trusted: an unparseable
        // copy must read as "ungraded" rather than crash a feed of a hundred cards.
        const thresholdsByRulesetGeo = new Map<string, ReportGeoView['thresholds']>();
        for (const rule of geoRules) {
            const parsed = geoThresholdsSchema.safeParse(rule.thresholds);
            thresholdsByRulesetGeo.set(`${rule.appliedRulesetId}:${rule.geo}`, parsed.success ? parsed.data : null);
        }

        const rollupsBySnapshot = new Map<string, typeof rollups>();
        for (const rollup of rollups) {
            const list = rollupsBySnapshot.get(rollup.snapshotId) ?? [];
            list.push(rollup);
            rollupsBySnapshot.set(rollup.snapshotId, list);
        }

        return rows.map((row): ReportSnapshotView => {
            const settings = appliedSettingsSchema.safeParse(row.settings);

            return {
                id: row.id,
                createdByUserId: row.createdByUserId,
                reportDate: row.reportDate,
                takenAt: row.takenAt.toISOString(),
                wasteZones: settings.success ? settings.data.wasteZones : null,
                geos: (rollupsBySnapshot.get(row.id) ?? []).map((rollup): ReportGeoView => {
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
                        thresholds: thresholdsByRulesetGeo.get(`${row.appliedRulesetId}:${rollup.geo}`) ?? null,
                    };
                }),
            };
        });
    });
