import type { SQL } from 'drizzle-orm';
import type { VisibilityScope } from '@/lib/auth/scope';
import { and, eq, gte, lte } from 'drizzle-orm';
import { snapshot, user } from '@/lib/db/schema';
import { listSnapshotsFilter, snapshotRowFilter, userRowFilter } from '@/services/snapshots/visibility';

// Where the Dynamics day read decides which rows it may see. Both clauses are composed from the
// scope descriptor alone (ADR-0007) — no role literal appears here or in the handlers, so a role
// whose scope changes needs no edit in this file.
//
// Pure SQL construction, no `db` import, which is what makes the scope matrix testable (ADR-0005).

// The buyer whose day was asked for, as the viewer may see them: a buyer matches only themselves, a
// lead anyone on their team (themselves included, as an ordinary buyer), the Head anyone. A miss
// here is reported as not-found, never forbidden — see `listDayFn`.
export const visibleBuyerFilter = (scope: VisibilityScope, buyerId: string): SQL | undefined => {
    return and(eq(user.id, buyerId), eq(user.status, 'active'), userRowFilter(scope));
};

// One buyer's active Snapshots for one report date. Built on `listSnapshotsFilter`, so the lifecycle
// half (`status = 'active'`, ADR-0018) cannot be forgotten: a replaced push is not a point on the
// trajectory. Filters on `report_date`, never `taken_at` (ADR-0016) — a Monday day pushed after
// midnight still belongs to Monday.
export const dynamicsDayFilter = (scope: VisibilityScope, buyerId: string, reportDate: string): SQL | undefined => {
    return and(dynamicsDayTotalsFilter(scope, reportDate), eq(snapshot.createdByUserId, buyerId));
};

// Every visible buyer's active Snapshots for one report date — the tab row's half of the same read.
// The tabs need each buyer's latest push and its total, and one day-wide query answers for all of
// them at once; narrowing per buyer would cost a round trip per tab.
export const dynamicsDayTotalsFilter = (scope: VisibilityScope, reportDate: string): SQL | undefined => {
    return and(listSnapshotsFilter(scope), eq(snapshot.reportDate, reportDate));
};

// The one read that deliberately asks for superseded rows: the chart's replacement badges (ADR-0018).
// Nothing is counted from them — only `replaced_at` and `replaced_by` are selected — so the lifecycle
// clause is inverted here rather than forgotten, and row-scope still applies in full.
export const dynamicsReplacedFilter = (
    scope: VisibilityScope,
    buyerId: string,
    reportDate: string
): SQL | undefined => {
    return and(
        snapshotRowFilter(scope),
        eq(snapshot.status, 'replaced'),
        eq(snapshot.createdByUserId, buyerId),
        eq(snapshot.reportDate, reportDate)
    );
};

// Every visible buyer's active Snapshots across a range of report dates — the day picker's month.
// Deliberately built on the same `listSnapshotsFilter` as the day read rather than beside it: a
// replaced push is not a square on anyone's month either (ADR-0018). Filters on `report_date`, never
// `taken_at` (ADR-0016), so a day pushed after midnight still lands on the day it reports.
export const dynamicsRangeTotalsFilter = (scope: VisibilityScope, from: string, to: string): SQL | undefined => {
    return and(listSnapshotsFilter(scope), gte(snapshot.reportDate, from), lte(snapshot.reportDate, to));
};
