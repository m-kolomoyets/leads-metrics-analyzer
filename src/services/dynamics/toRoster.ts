import type { UserRole } from '@/lib/constants';
import type { DynamicsRosterUser } from './types';

// The roster read's shaping half, kept clear of the DB so it is testable on its own (ADR-0005): the
// visible people in one set of rows, the day's Snapshot totals in another, one tab per person out.

// A person the viewer may see. Lifecycle filtering happened in SQL — everyone here belongs in the row.
export type RosterUserRow = {
    id: string;
    nickname: string;
    role: UserRole;
    teamId: string | null;
    teamName: string | null;
};

// One active Snapshot pushed for the day, with its Frozen Geo Rollups already summed. `totalProfit`
// is null when the Snapshot froze no rollup at all (a push from before ADR-0015): there is no total
// to colour, which is not the same as a total of zero.
export type RosterSnapshotRow = {
    createdByUserId: string;
    takenAt: Date;
    totalProfit: number | null;
};

// Snapshots are cumulative — each push restates the day so far — so the latest one IS the day's
// total, and nothing is summed across pushes (SPEC §3.1, ADR-0017). Ties on `taken_at` are broken by
// arrival order, which is the order the query returned.
const latestPerUser = (rows: RosterSnapshotRow[]): Map<string, RosterSnapshotRow> => {
    const latest = new Map<string, RosterSnapshotRow>();

    for (const row of rows) {
        const current = latest.get(row.createdByUserId);

        if (!current || row.takenAt.getTime() >= current.takenAt.getTime()) {
            latest.set(row.createdByUserId, row);
        }
    }

    return latest;
};

export const toRoster = (users: RosterUserRow[], snapshots: RosterSnapshotRow[]): DynamicsRosterUser[] => {
    const latest = latestPerUser(snapshots);

    return users.map((row): DynamicsRosterUser => {
        const push = latest.get(row.id);

        return {
            ...row,
            // Null means "has not pushed today" — the missing state the tab paints red, never "never
            // pushed at all".
            lastTakenAt: push?.takenAt.toISOString() ?? null,
            totalProfit: push?.totalProfit ?? null,
        };
    });
};
