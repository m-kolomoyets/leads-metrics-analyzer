import type { SQL } from 'drizzle-orm';
import type { Viewer, VisibilityScope } from '@/lib/auth/scope';
import type { DynamicsSnapshot } from '@/lib/domain/dynamics';
import type { MeData } from '@/services/auth/types';
import type {
    DynamicsBuyerHistory,
    DynamicsDimensionBuyerHistory,
    DynamicsDimensionDay,
    DynamicsDimensionRosterUser,
    DynamicsDimensionRow,
    DynamicsRosterUser,
} from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, asc, desc, eq, inArray, isNotNull, sum } from 'drizzle-orm';
import { assertDimension } from '@/lib/auth/denial';
import { assertRollupRead, ROLLUP_ONLY, rollupDimensionFor } from '@/lib/auth/dimensionRollup';
import { requireUser } from '@/lib/auth/guards';
import { scopeFor } from '@/lib/auth/scope';
import { USER_ROLES } from '@/lib/constants';
import { db } from '@/lib/db';
import { appliedRulesetGeo, snapshot, snapshotFact, snapshotGeo, team, user } from '@/lib/db/schema';
import { SNAPSHOT_NOT_FOUND } from '@/services/snapshots/constants';
import { matchesNoRows, userRowFilter } from '@/services/snapshots/visibility';
import {
    dynamicsDayInputSchema,
    dynamicsDimensionDayInputSchema,
    dynamicsHistoryInputSchema,
    dynamicsRosterInputSchema,
} from './schemas';
import { toDynamicsSnapshots } from './toDay';
import { toDimensionHistory, toHistory } from './toHistory';
import { toDimensionRoster, toRoster } from './toRoster';
import {
    dynamicsDayFilter,
    dynamicsDayTotalsFilter,
    dynamicsRangeTotalsFilter,
    dynamicsReplacedFilter,
    visibleBuyerFilter,
} from './visibility';

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
        const [users, rollups] = await Promise.all([
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
            // One row per Frozen Geo Rollup of the day, UNSUMMED: the card prints each market's own
            // profit under the name, so the split has to survive the read, and the total is Σ of the
            // latest push's markets rather than a second figure the database works out separately.
            // `leftJoin` so a push that froze no rollup still reports a `taken_at`: it is a push with
            // no total, which the cards render differently from no push at all.
            db
                .select({
                    createdByUserId: snapshot.createdByUserId,
                    takenAt: snapshot.takenAt,
                    snapshotId: snapshot.id,
                    geo: snapshotGeo.geo,
                    profit: snapshotGeo.profit,
                })
                .from(snapshot)
                .leftJoin(snapshotGeo, eq(snapshotGeo.snapshotId, snapshot.id))
                .where(dynamicsDayTotalsFilter(scope, data.reportDate))
                .orderBy(asc(snapshotGeo.geo)),
        ]);

        return toRoster(users, rollups);
    });

// The two reads behind the Designer and BDM frames (#10). Same Team → Buyer → Geo frame, one table
// instead of a trajectory, and not one dollar column selected anywhere on the path: `snapshot_fact`
// carries Spend and Revenue, and neither is named in the projection below, so the figure does not
// exist server-side for these viewers rather than being hidden client-side.
//
// Which branch a viewer is on is `rollupDimensionFor` — a `scopeFor` read (ADR-0007), never a role
// literal — and which table they asked for is checked against their scope, so a Designer asking for
// offers is REFUSED (`assertRollupRead`) rather than handed an empty array that would read as "this
// buyer ran none".

// The dollar-free tab row. The same people, the same missing/stale rules, minus the day's total:
// there is no money dimension to colour a tab with, so none is summed.
export const listDimensionRosterFn = createServerFn({ method: 'GET' })
    .inputValidator(dynamicsRosterInputSchema)
    .handler(async ({ data }): Promise<DynamicsDimensionRosterUser[]> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);
        const scope = scopeFor(viewer);

        if (rollupDimensionFor(viewer) === null) {
            throw new Error(ROLLUP_ONLY);
        }

        if (matchesNoRows(scope)) {
            return [];
        }

        const [users, pushes] = await Promise.all([
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
            db
                .select({ createdByUserId: snapshot.createdByUserId, takenAt: snapshot.takenAt })
                .from(snapshot)
                .where(dynamicsDayTotalsFilter(scope, data.reportDate)),
        ]);

        return toDimensionRoster(users, pushes);
    });

// One buyer's day, keyed by the viewer's single dimension. The rows come from the LATEST active push
// of that day and nothing is summed across pushes: a Snapshot restates the day so far (ADR-0017), so
// adding two of them would double-count it. Grouped by Geo as well as by the dimension, because the
// frame's third level is still the market — the client splits the rows, at no extra round trip.
//
// There is no cross-buyer aggregate here or anywhere: the read is always narrowed to one person, and
// a creative is buyer-specific (#10).
export const listDimensionDayFn = createServerFn({ method: 'GET' })
    .inputValidator(dynamicsDimensionDayInputSchema)
    .handler(async ({ data }): Promise<DynamicsDimensionDay> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);
        const scope = scopeFor(viewer);

        const dimension = assertRollupRead(viewer, data.dimension);

        if (matchesNoRows(scope)) {
            throw new Error(SNAPSHOT_NOT_FOUND);
        }

        // The buyer is resolved under row-scope first, and a miss is not-found rather than forbidden
        // — the same verdict, for the same reason, as the trajectory read above.
        const [buyer] = await db
            .select({ id: user.id, nickname: user.nickname })
            .from(user)
            .where(visibleBuyerFilter(scope, data.buyerId))
            .limit(1);

        if (!buyer) {
            throw new Error(SNAPSHOT_NOT_FOUND);
        }

        const [latest] = await db
            .select({ id: snapshot.id, takenAt: snapshot.takenAt })
            .from(snapshot)
            .where(dynamicsDayFilter(scope, buyer.id, data.reportDate))
            // The id is a tie-break, not a second opinion: two pushes stamped the same second must
            // resolve to the SAME one on every read, or the table flips between refreshes.
            .orderBy(desc(snapshot.takenAt), desc(snapshot.id))
            .limit(1);

        if (!latest) {
            return { dimension, buyerNickname: buyer.nickname, takenAt: null, rows: [] };
        }

        const keyColumn = dimension === 'creative' ? snapshotFact.creative : snapshotFact.offer;

        const rows = await db
            .select({
                geo: snapshotFact.geo,
                key: keyColumn,
                // Funnel counts only. Spend / Spend⁺ / Revenue are deliberately absent (ADR-0009).
                linkClicks: sum(snapshotFact.linkClicks).mapWith(Number),
                installs: sum(snapshotFact.installs).mapWith(Number),
                regs: sum(snapshotFact.regs).mapWith(Number),
                sales: sum(snapshotFact.sales).mapWith(Number),
            })
            .from(snapshotFact)
            .where(eq(snapshotFact.snapshotId, latest.id))
            .groupBy(snapshotFact.geo, keyColumn)
            .orderBy(asc(snapshotFact.geo), asc(keyColumn));

        return {
            dimension,
            buyerNickname: buyer.nickname,
            takenAt: latest.takenAt.toISOString(),
            rows: rows.map((row): DynamicsDimensionRow => {
                return {
                    geo: row.geo,
                    key: row.key,
                    linkClicks: row.linkClicks ?? 0,
                    installs: row.installs ?? 0,
                    regs: row.regs ?? 0,
                    sales: row.sales ?? 0,
                };
            }),
        };
    });

// The people a month may be drawn for — the roster's own row-scope clause, asked for ids alone. The
// history reads resolve it themselves rather than trusting a list of ids from the client: a caller
// could otherwise ask for a month belonging to somebody they may not see.
const visibleBuyerIds = async (scope: VisibilityScope): Promise<string[]> => {
    const rows = await db
        .select({ id: user.id })
        .from(user)
        .where(and(eq(user.status, 'active'), inArray(user.role, CAMPAIGN_ROLES), userRowFilter(scope)))
        .orderBy(user.nickname);

    return rows.map((row) => {
        return row.id;
    });
};

// The day picker's heatmap: every visible buyer's day-by-day totals across one calendar month, in
// ONE query rather than one per buyer. A month of a team is a few hundred `snapshot` rows and the
// Frozen Geo Rollups are summed by the database, so the cost is the same shape as the roster read —
// one round trip, no `snapshot_fact` row touched. Every buyer comes back rather than only the one
// being read, because the picker follows the card row and switching people must not refetch.
export const listMonthHistoryFn = createServerFn({ method: 'GET' })
    .inputValidator(dynamicsHistoryInputSchema)
    .handler(async ({ data }): Promise<DynamicsBuyerHistory[]> => {
        const me = await requireUser();
        const scope = scopeFor(viewerFrom(me));

        assertDimension(scope, DYNAMICS_DIMENSION);

        if (matchesNoRows(scope)) {
            return [];
        }

        const [buyerIds, pushes] = await Promise.all([
            visibleBuyerIds(scope),
            // One row per Frozen Geo Rollup, UNSUMMED — the same shape the roster read takes, and for
            // the same reason: the calendar cell prints the markets behind the day's total, so the
            // split has to survive the read. `leftJoin` so a push that froze no rollup still reports
            // its day: a day with a report and no total, which the calendar paints differently from
            // a day with no report.
            db
                .select({
                    snapshotId: snapshot.id,
                    createdByUserId: snapshot.createdByUserId,
                    reportDate: snapshot.reportDate,
                    takenAt: snapshot.takenAt,
                    geo: snapshotGeo.geo,
                    profit: snapshotGeo.profit,
                    spendPlus: snapshotGeo.spendPlus,
                })
                .from(snapshot)
                .leftJoin(snapshotGeo, eq(snapshotGeo.snapshotId, snapshot.id))
                .where(dynamicsRangeTotalsFilter(scope, data.from, data.to))
                .orderBy(asc(snapshotGeo.geo)),
        ]);

        return toHistory(buyerIds, pushes);
    });

// The dollar-free month (#10). Same range, same row-scope, and not one figure selected: the calendar
// can only say whether a day was reported, so the dates are all that is read.
export const listDimensionMonthHistoryFn = createServerFn({ method: 'GET' })
    .inputValidator(dynamicsHistoryInputSchema)
    .handler(async ({ data }): Promise<DynamicsDimensionBuyerHistory[]> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);
        const scope = scopeFor(viewer);

        if (rollupDimensionFor(viewer) === null) {
            throw new Error(ROLLUP_ONLY);
        }

        if (matchesNoRows(scope)) {
            return [];
        }

        const [buyerIds, pushes] = await Promise.all([
            visibleBuyerIds(scope),
            db
                .select({ createdByUserId: snapshot.createdByUserId, reportDate: snapshot.reportDate })
                .from(snapshot)
                .where(dynamicsRangeTotalsFilter(scope, data.from, data.to)),
        ]);

        return toDimensionHistory(buyerIds, pushes);
    });
