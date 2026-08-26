import type { SQL } from 'drizzle-orm';
import type { Viewer, VisibilityScope } from '@/lib/auth/scope';
import { and, eq } from 'drizzle-orm';
import { scopeFor } from '@/lib/auth/scope';
import { snapshot, user } from '@/lib/db/schema';

// The one place a Snapshot read decides which rows it may see. Two independent axes meet here:
// row-scope (whose Snapshots — ADR-0007) and lifecycle (`status = 'active'` — ADR-0018). Both were
// previously spelled per query, and the lifecycle half is exactly the kind of filter a new read
// forgets: a read that omits it double-counts a corrected day. Every Snapshot read composes its WHERE
// from a function in this file, so the filter cannot be half-applied.
//
// Pure SQL construction, no `db` import — which is also what makes it testable (ADR-0005).

// The lifecycle filter on its own, for reads that join `snapshot` for its status alone.
// A replaced Snapshot contributes to no number anywhere: not the feed, not the archive, not a
// roster's "last taken at", not the company-wide dimension roll-up. The Head is NOT exempt here — a
// superseded push is wrong for everyone, not merely hidden from its author.
export const activeSnapshotsOnly = (): SQL => {
    return eq(snapshot.status, 'active');
};

// The row-scope axis as a WHERE clause over `snapshot`. Filters on the STAMPED `team_id`, so a
// member's transfer never re-attributes their past Snapshots. `undefined` means "no filter" (head
// sees every row); a teamless team-scope viewer is excluded upstream, so a bound teamId is expected.
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

// The filter every LIST read starts from — the Snapshot list, the Report feed and the archive. Extra
// predicates (a report-date range) are `and`-ed on top by the caller.
export const listSnapshotsFilter = (scope: VisibilityScope): SQL | undefined => {
    return and(snapshotRowFilter(scope), activeSnapshotsOnly());
};

// The row-scope axis as a WHERE clause over the `user` table — the roster's half of the same axis
// `snapshotRowFilter` applies to Snapshots. `undefined` means "no filter" (head sees every user); a
// teamless team-scope viewer matches no row at all, which `matchesNoRows` catches upstream.
export const userRowFilter = (scope: VisibilityScope): SQL | undefined => {
    switch (scope.rowScope) {
        case 'all': {
            return undefined;
        }
        case 'team': {
            return eq(user.teamId, scope.teamId ?? '');
        }
        case 'own': {
            return eq(user.id, scope.userId ?? '');
        }
    }
};

// True when the viewer's row-scope can match no row: a team lead not yet placed on a team. This is
// genuinely "no data", not a refusal — the lead may ask, there is simply nothing under them yet, so
// it stays separate from the dimension denial (`assertDimension`).
export const matchesNoRows = (scope: VisibilityScope): boolean => {
    return scope.rowScope === 'team' && !scope.teamId;
};

// The roster's join condition, NOT a WHERE clause: the lifecycle filter belongs in the `ON` so a
// buyer whose only push has been replaced still appears in the roster reading "never", instead of
// dropping out of the feed entirely. `reportDate` narrows the join to a single day for the Dynamics
// tab row, where "never" means "not today" rather than "not ever".
export const rosterSnapshotJoinOn = (reportDate?: string): SQL | undefined => {
    return and(
        eq(snapshot.createdByUserId, user.id),
        activeSnapshotsOnly(),
        reportDate === undefined ? undefined : eq(snapshot.reportDate, reportDate)
    );
};

// The single-Snapshot read behind the detailed report and its bundle. A replaced Snapshot is not
// openable as a report — but it is still fetchable by the Head, which is the whole point of keeping
// the row: the audit trail must outlive the correction. `undefined` means "no lifecycle filter".
export const readableSnapshotFilter = (viewer: Viewer): SQL | undefined => {
    const scope = scopeFor(viewer);
    const isHead = scope.rowScope === 'all' && scope.dimensions.includes('campaign');

    return isHead ? undefined : activeSnapshotsOnly();
};
