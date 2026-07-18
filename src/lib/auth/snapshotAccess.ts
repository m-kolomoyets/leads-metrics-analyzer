import type { Viewer } from './scope';
import { scopeFor } from './scope';

// SERVER-usable pure seam (ADR-0007). Composes the access-policy descriptor (`scopeFor`) with a
// Snapshot's stamped identity into a single verdict. A Snapshot is immutable once saved, so unlike a
// Preset there is no 'edit' — visibility is only 'read' | 'none'. Row-scope decides: a Buyer sees own
// (by creator), a Team Lead sees its team (by the Snapshot's STAMPED `teamId`, so a member's transfer
// never re-attributes their past Snapshots — spec story 13), the Head sees all. Kept pure (no DB) so
// it is the tested authorization seam and the list/read queries filter on the same rules.

// The minimal Snapshot identity the verdict needs — the full row is not required.
export type SnapshotSubject = {
    createdByUserId: string;
    teamId: string | null;
};

// 'read' → visible (and immutable); 'none' → not visible.
export type SnapshotAccess = 'read' | 'none';

// A Snapshot rolls up across the dollar dimensions; a Designer/BDM carries only its creative/offer
// dimension (never a dollar table), so it sees no whole Snapshot here. Their company-wide roll-up
// lives in a separate read path (`getDimensionRollupFn`, T7 #9). `campaign` is a dollar dimension
// they lack — the gate.
const SNAPSHOT_DIMENSION = 'campaign';

export const snapshotAccessFor = (viewer: Viewer, subject: SnapshotSubject): SnapshotAccess => {
    const scope = scopeFor(viewer);

    if (!scope.dimensions.includes(SNAPSHOT_DIMENSION)) {
        return 'none';
    }

    switch (scope.rowScope) {
        case 'all': {
            return 'read';
        }
        case 'team': {
            return subject.teamId !== null && subject.teamId === scope.teamId ? 'read' : 'none';
        }
        case 'own': {
            return subject.createdByUserId === viewer.id ? 'read' : 'none';
        }
    }
};
