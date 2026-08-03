// The verdict a Snapshot read returns for an id the viewer may not see. A Snapshot outside the
// viewer's scope is reported as not-found rather than forbidden, so another team's activity is never
// disclosed by its absence (spec story 42) — and the routes that translate it into `notFound()` match
// on this one string rather than on a message spelled twice.
export const SNAPSHOT_NOT_FOUND = 'Snapshot not found';
