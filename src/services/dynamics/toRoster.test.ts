import type { RosterSnapshotRow, RosterUserRow } from './toRoster';
import { describe, expect, it } from 'vitest';
import { toRoster } from './toRoster';

const users: RosterUserRow[] = [
    { id: 'u1', nickname: 'ann', role: 'buyer', teamId: 't1', teamName: 'Alpha' },
    { id: 'u2', nickname: 'bob', role: 'buyer', teamId: 't1', teamName: 'Alpha' },
];

// One Frozen Geo Rollup row, as the query hands it over: a push repeated once per market it froze.
const rollup = (over: Partial<RosterSnapshotRow> & { createdByUserId: string }): RosterSnapshotRow => {
    return {
        takenAt: new Date('2026-08-26T09:00:00Z'),
        snapshotId: 's1',
        geo: 'SG',
        profit: 0,
        ...over,
    };
};

describe('toRoster', () => {
    it('reads the day from the latest push only — snapshots are cumulative, not additive', () => {
        const roster = toRoster(users, [
            rollup({ createdByUserId: 'u1', snapshotId: 's1', takenAt: new Date('2026-08-26T09:00:00Z'), profit: 40 }),
            rollup({ createdByUserId: 'u1', snapshotId: 's2', takenAt: new Date('2026-08-26T12:00:00Z'), profit: 55 }),
        ]);

        expect(roster[0]?.totalProfit).toBe(55);
        expect(roster[0]?.lastTakenAt).toBe('2026-08-26T12:00:00.000Z');
    });

    it('splits the latest push by market, and totals exactly those markets', () => {
        const roster = toRoster(users, [
            rollup({ createdByUserId: 'u1', snapshotId: 's1', geo: 'SG', profit: 10 }),
            rollup({ createdByUserId: 'u1', snapshotId: 's1', geo: 'MY', profit: -4 }),
        ]);

        expect(roster[0]?.geoProfits).toEqual([
            { geo: 'SG', profit: 10 },
            { geo: 'MY', profit: -4 },
        ]);
        expect(roster[0]?.totalProfit).toBe(6);
    });

    it('drops a market the latest push no longer carries', () => {
        const roster = toRoster(users, [
            rollup({
                createdByUserId: 'u1',
                snapshotId: 's1',
                takenAt: new Date('2026-08-26T09:00:00Z'),
                geo: 'TH',
                profit: 90,
            }),
            rollup({
                createdByUserId: 'u1',
                snapshotId: 's2',
                takenAt: new Date('2026-08-26T12:00:00Z'),
                geo: 'SG',
                profit: 5,
            }),
        ]);

        expect(roster[0]?.geoProfits).toEqual([{ geo: 'SG', profit: 5 }]);
        expect(roster[0]?.totalProfit).toBe(5);
    });

    it('does not let an out-of-order row overwrite a newer push', () => {
        const roster = toRoster(users, [
            rollup({ createdByUserId: 'u1', snapshotId: 's2', takenAt: new Date('2026-08-26T12:00:00Z'), profit: 55 }),
            rollup({ createdByUserId: 'u1', snapshotId: 's1', takenAt: new Date('2026-08-26T09:00:00Z'), profit: 40 }),
        ]);

        expect(roster[0]?.totalProfit).toBe(55);
    });

    it('keeps a person with no push today, with nothing to colour from', () => {
        const roster = toRoster(users, [rollup({ createdByUserId: 'u1', profit: 10 })]);

        expect(roster[1]).toEqual({
            id: 'u2',
            nickname: 'bob',
            role: 'buyer',
            teamId: 't1',
            teamName: 'Alpha',
            lastTakenAt: null,
            totalProfit: null,
            geoProfits: [],
        });
    });

    it('keeps a rollup-less push as null profit rather than zero', () => {
        const roster = toRoster(users, [rollup({ createdByUserId: 'u1', geo: null, profit: null })]);

        expect(roster[0]?.totalProfit).toBeNull();
        expect(roster[0]?.geoProfits).toEqual([]);
        expect(roster[0]?.lastTakenAt).not.toBeNull();
    });

    it('ignores a snapshot from someone outside the roster', () => {
        const roster = toRoster(users, [rollup({ createdByUserId: 'ghost', profit: 999 })]);

        expect(roster).toHaveLength(2);
        expect(
            roster.every((row) => {
                return row.totalProfit === null;
            })
        ).toBe(true);
    });
});
