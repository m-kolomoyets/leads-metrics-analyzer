import type { SQL } from 'drizzle-orm';
import type { Viewer } from '@/lib/auth/scope';
import type { DynamicsSnapshot } from '@/lib/domain/dynamics';
import type { MeData } from '@/services/auth/types';
import type { DynamicsRosterUser } from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, eq, inArray, isNotNull, sum } from 'drizzle-orm';
import { assertDimension } from '@/lib/auth/denial';
import { requireUser } from '@/lib/auth/guards';
import { scopeFor } from '@/lib/auth/scope';
import { USER_ROLES } from '@/lib/constants';
import { db } from '@/lib/db';
import { appliedRulesetGeo, snapshot, snapshotGeo, team, user } from '@/lib/db/schema';
import { SNAPSHOT_NOT_FOUND } from '@/services/snapshots/constants';
import { matchesNoRows, userRowFilter } from '@/services/snapshots/visibility';
import { dynamicsDayInputSchema, dynamicsRosterInputSchema } from './schemas';
import { toDynamicsSnapshots } from './toDay';
import { toRoster } from './toRoster';
import { dynamicsDayFilter, dynamicsDayTotalsFilter, dynamicsReplacedFilter, visibleBuyerFilter } from './visibility';

// The two reads behind the Dynamics page (ADR-0010, ADR-0017). Both go through `scopeFor(viewer)`
// (ADR-0007) — no hand-rolled role check — and neither touches a `snapshot_fact` row: a whole day is
// a handful of `snapshot_geo` rows, so the first paint costs one small query and the detailed tables
// come later from the existing bundle read (SPEC §8).
//
// SPEC I8 DIVERGENCE, deliberate: the spec asks for 403 when a buyer requests another buyer's day.
// This returns NOT-FOUND instead, the same verdict the detailed report already gives (spec story 42).
// A forbidden answer would confirm that the person exists, which is exactly what row-scope is meant
// to hide. The other half of I8 — dimension-scope denial for Designer and BDM — IS followed, via
// `assertDimension`: those roles get an explicit refusal rather than an empty day.

const viewerFrom = (me: MeData): Viewer => {
    return { id: me.id, role: me.role, teamId: me.teamId };
};

// The dollar dimension the whole page reads through. A Snapshot rolls up across it, so a role whose
// scope omits it may not read a trajectory at all.
const DYNAMICS_DIMENSION = 'campaign';

// The roles that could ever push a Snapshot — derived from the dimension scope, never listed by hand.
const CAMPAIGN_ROLES = USER_ROLES.filter((role) => {
    return scopeFor({ id: '', role }).dimensions.includes(DYNAMICS_DIMENSION);
});

// Resolves the asked-for buyer under the viewer's row-scope. `undefined` means the caller must
// answer not-found: either no such user, or one the viewer may not see — the two are deliberately
// indistinguishable from outside.
const findVisibleBuyer = async (filter: SQL | undefined): Promise<string | undefined> => {
    const [row] = await db.select({ id: user.id }).from(user).where(filter).limit(1);

    return row?.id;
};

// One buyer's day: every active Snapshot they pushed for that report date, ordered by `taken_at`
// (ADR-0017), each carrying its Frozen Geo Rollups and the thresholds its Ruleset Version copied per
// Geo. The shape is the domain's `DynamicsSnapshot`, so `buildSeries` consumes it directly.
export const listDayFn = createServerFn({ method: 'GET' })
    .inputValidator(dynamicsDayInputSchema)
    .handler(async ({ data }): Promise<DynamicsSnapshot[]> => {
        const me = await requireUser();
        const scope = scopeFor(viewerFrom(me));

        assertDimension(scope, DYNAMICS_DIMENSION);

        // A teamless lead can match no row, so there is no buyer to find and no day to read. Not a
        // refusal — they may ask; there is simply nobody under them yet.
        if (matchesNoRows(scope)) {
            throw new Error(SNAPSHOT_NOT_FOUND);
        }

        const buyerId = await findVisibleBuyer(visibleBuyerFilter(scope, data.buyerId));

        if (!buyerId) {
            throw new Error(SNAPSHOT_NOT_FOUND);
        }

        const rows = await db
            .select({
                id: snapshot.id,
                appliedRulesetId: snapshot.appliedRulesetId,
                takenAt: snapshot.takenAt,
            })
            .from(snapshot)
            .where(dynamicsDayFilter(scope, buyerId, data.reportDate))
            .orderBy(snapshot.takenAt);

        if (rows.length === 0) {
            return [];
        }

        // Rollups and thresholds are one query each, grouped in memory: a day is a handful of rows,
        // and the alternative is a round trip per push.
        const rulesetIds = rows.map((row) => {
            return row.appliedRulesetId;
        });
        const snapshotIds = rows.map((row) => {
            return row.id;
        });

        const [rollups, geoRules, replacements] = await Promise.all([
            db
                // Explicit columns: `select()` would carry the row's own primary key into the wire
                // shape, and a Frozen Geo Rollup is identified by its Snapshot and Geo, not by a row id.
                .select({
                    snapshotId: snapshotGeo.snapshotId,
                    geo: snapshotGeo.geo,
                    spendPlus: snapshotGeo.spendPlus,
                    geoTotal: snapshotGeo.geoTotal,
                    attributedRevenue: snapshotGeo.attributedRevenue,
                    linkClicks: snapshotGeo.linkClicks,
                    installs: snapshotGeo.installs,
                    regs: snapshotGeo.regs,
                    sales: snapshotGeo.sales,
                    profit: snapshotGeo.profit,
                    roi: snapshotGeo.roi,
                    cpc: snapshotGeo.cpc,
                    cpi: snapshotGeo.cpi,
                    cpr: snapshotGeo.cpr,
                    cps: snapshotGeo.cps,
                    waste: snapshotGeo.waste,
                })
                .from(snapshotGeo)
                .where(inArray(snapshotGeo.snapshotId, snapshotIds))
                .orderBy(snapshotGeo.geo),
            db
                .select({
                    appliedRulesetId: appliedRulesetGeo.appliedRulesetId,
                    geo: appliedRulesetGeo.geo,
                    thresholds: appliedRulesetGeo.thresholds,
                })
                .from(appliedRulesetGeo)
                .where(inArray(appliedRulesetGeo.appliedRulesetId, rulesetIds)),
            // The day's superseded pushes, reduced to their lifecycle columns (ADR-0018). Deliberately
            // the one read that looks past `status = 'active'`: no figure of theirs is selected, and
            // the point they are stamped onto is one the viewer may already see. Without it a buyer
            // who read the 15:00 figure has no way to learn that it was corrected rather than changed.
            db
                .select({ replacedBy: snapshot.replacedBy, replacedAt: snapshot.replacedAt })
                .from(snapshot)
                .where(
                    and(
                        dynamicsReplacedFilter(scope, buyerId, data.reportDate),
                        inArray(snapshot.replacedBy, snapshotIds),
                        isNotNull(snapshot.replacedAt)
                    )
                ),
        ]);

        return toDynamicsSnapshots(
            rows,
            rollups,
            geoRules,
            // The nulls are excluded in SQL; the narrowing is spelled here because the column is
            // nullable in the schema and a `replaced` row without a stamp would be a broken write.
            replacements.flatMap((row) => {
                return row.replacedBy === null || row.replacedAt === null
                    ? []
                    : [{ replacedBy: row.replacedBy, replacedAt: row.replacedAt }];
            })
        );
    });

// The tab row's companion read: the buyers the viewer may see, each with their latest active push
// FOR THAT DAY and the total that push froze, so the tabs' missing/stale/loss/profit states are
// decidable without fetching every buyer's trajectory (SPEC §6.2). Two queries, never one per tab.
export const listDayRosterFn = createServerFn({ method: 'GET' })
    .inputValidator(dynamicsRosterInputSchema)
    .handler(async ({ data }): Promise<DynamicsRosterUser[]> => {
        const me = await requireUser();
        const scope = scopeFor(viewerFrom(me));

        assertDimension(scope, DYNAMICS_DIMENSION);

        if (matchesNoRows(scope)) {
            return [];
        }

        // Disabled and still-invited users are excluded: an offboarded person must not sit
        // permanently red in the tab row (spec story 41). The team is joined for its name only — the
        // frame's first level is a label, never a second access check (ADR-0007).
        const [users, snapshots] = await Promise.all([
            db
                .select({
                    id: user.id,
                    nickname: user.nickname,
                    role: user.role,
                    teamId: user.teamId,
                    teamName: team.name,
                })
                .from(user)
                .leftJoin(team, eq(team.id, user.teamId))
                .where(and(eq(user.status, 'active'), inArray(user.role, CAMPAIGN_ROLES), userRowFilter(scope)))
                .orderBy(user.nickname),
            // One row per active Snapshot of the day, its Frozen Geo Rollups already summed by the
            // database. `leftJoin` so a push that froze no rollup still reports a `taken_at`: it is a
            // push with no total, which the tabs render differently from no push at all.
            db
                .select({
                    createdByUserId: snapshot.createdByUserId,
                    takenAt: snapshot.takenAt,
                    // `sum` returns text (or null when the push froze no rollup); the cast is done
                    // here rather than with `mapWith`, which would turn that null into a zero.
                    totalProfit: sum(snapshotGeo.profit),
                })
                .from(snapshot)
                .leftJoin(snapshotGeo, eq(snapshotGeo.snapshotId, snapshot.id))
                .where(dynamicsDayTotalsFilter(scope, data.reportDate))
                .groupBy(snapshot.id, snapshot.createdByUserId, snapshot.takenAt),
        ]);

        return toRoster(
            users,
            snapshots.map((row) => {
                return { ...row, totalProfit: row.totalProfit === null ? null : Number(row.totalProfit) };
            })
        );
    });
