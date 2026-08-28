import type { UserRole } from '@/lib/constants';
import type { DynamicsDimensionRosterUser, DynamicsRosterUser, RosterGeoProfit } from './types';

// The roster read's shaping half, kept clear of the DB so it is testable on its own (ADR-0005): the
// visible people in one set of rows, the day's Frozen Geo Rollups in another, one card per person out.

// A person the viewer may see. Lifecycle filtering happened in SQL — everyone here belongs in the row.
export type RosterUserRow = {
    id: string;
    nickname: string;
    role: UserRole;
    teamId: string | null;
    teamName: string | null;
};

// One active Snapshot pushed for the day, reduced to who pushed it and when — all the dollar-free
// roster needs, and the half of a push that decides "latest" for both rosters.
export type RosterPushRow = {
    createdByUserId: string;
    takenAt: Date;
};

// One Frozen Geo Rollup of one push, carried unsummed: the card prints the markets as well as the
// total, so the split has to survive the read. `geo` is null when the push froze no rollup at all (a
// push from before ADR-0015) — a push with no total, which the card renders differently from no push.
export type RosterSnapshotRow = RosterPushRow & {
    snapshotId: string;
    geo: string | null;
    profit: number | null;
};

// Snapshots are cumulative — each push restates the day so far — so the latest one IS the day's
// total, and nothing is summed across pushes (SPEC §3.1, ADR-0017). Ties on `taken_at` are broken by
// arrival order, which is the order the query returned.
const latestPerUser = <TRow extends RosterPushRow>(rows: TRow[]): Map<string, TRow> => {
    const latest = new Map<string, TRow>();

    for (const row of rows) {
        const current = latest.get(row.createdByUserId);

        if (!current || row.takenAt.getTime() >= current.takenAt.getTime()) {
            latest.set(row.createdByUserId, row);
        }
    }

    return latest;
};

export const toRoster = (users: RosterUserRow[], rollups: RosterSnapshotRow[]): DynamicsRosterUser[] => {
    const latest = latestPerUser(rollups);
    // The rollup rows arrive one per Geo, so the "latest" row above is only ONE market of that push.
    // The rest are collected by Snapshot id, which is what identifies a push across its own rows.
    const geosOf = new Map<string, RosterGeoProfit[]>();

    for (const row of rollups) {
        if (row.geo === null || row.profit === null) {
            continue;
        }

        const geos = geosOf.get(row.snapshotId) ?? [];

        geos.push({ geo: row.geo, profit: row.profit });
        geosOf.set(row.snapshotId, geos);
    }

    return users.map((row): DynamicsRosterUser => {
        const push = latest.get(row.id);
        const geoProfits = push ? (geosOf.get(push.snapshotId) ?? []) : [];

        return {
            ...row,
            // Null means "has not pushed today" — the missing state the tab paints red, never "never
            // pushed at all".
            lastTakenAt: push?.takenAt.toISOString() ?? null,
            // Σ of that same push's markets, so the header and the lines under it cannot disagree.
            // Null when the push froze no rollup: no total to colour, which is not a total of zero.
            totalProfit:
                push && geoProfits.length > 0
                    ? geoProfits.reduce((total, geo) => {
                          return total + geo.profit;
                      }, 0)
                    : null,
            geoProfits,
        };
    });
};

// The dollar-free roster (#10). Same day, same "latest push wins" rule, one field short: a Designer
// or BDM holds no dollar dimension, so no total was selected for them and none is invented here.
export const toDimensionRoster = (
    users: RosterUserRow[],
    snapshots: RosterPushRow[]
): DynamicsDimensionRosterUser[] => {
    const latest = latestPerUser(snapshots);

    return users.map((row): DynamicsDimensionRosterUser => {
        return { ...row, lastTakenAt: latest.get(row.id)?.takenAt.toISOString() ?? null };
    });
};
