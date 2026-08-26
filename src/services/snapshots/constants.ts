import { REPLACEMENT_WINDOW_MINUTES } from '@/lib/auth/snapshotReplacement';

// The verdict a Snapshot read returns for an id the viewer may not see. A Snapshot outside the
// viewer's scope is reported as not-found rather than forbidden, so another team's activity is never
// disclosed by its absence (spec story 42) — and the routes that translate it into `notFound()` match
// on this one string rather than on a message spelled twice.
export const SNAPSHOT_NOT_FOUND = 'Snapshot not found';

// The refusals a replacement can return (ADR-0018). Distinct strings because they mean different
// things to a buyer staring at a failed correction — "too late" is not "you already pushed again" —
// and a stale window is a refusal, never a silent no-op.
export const SNAPSHOT_ALREADY_REPLACED = 'This snapshot has already been replaced';
export const SNAPSHOT_WINDOW_ELAPSED = `A snapshot can only be replaced within ${REPLACEMENT_WINDOW_MINUTES} minutes of being pushed`;
export const SNAPSHOT_SUPERSEDED = 'A newer snapshot already exists for this day';
export const SNAPSHOT_DATE_MISMATCH = 'A replacement must carry the same report date';
