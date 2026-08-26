import type { RosterSnapshotRow, RosterUserRow } from './toRoster';
import { describe, expect, it } from 'vitest';
import { toRoster } from './toRoster';

const users: RosterUserRow[] = [
    { id: 'u1', nickname: 'ann', role: 'buyer', teamId: 't1', teamName: 'Alpha' },
    { id: 'u2', nickname: 'bob', role: 'buyer', teamId: 't1', teamName: 'Alpha' },
];

const push = (over: Partial<RosterSnapshotRow> & { createdByUserId: string }): RosterSnapshotRow => {
    return { takenAt: new Date('2026-08-26T09:00:00Z'), totalProfit: 0, ...over };
};

describe('toRoster', () => {
    it('reads the day from the latest push only — snapshots are cumulative, not additive', () => {
        const roster = toRoster(users, [
            push({ createdByUserId: 'u1', takenAt: new Date('2026-08-26T09:00:00Z'), totalProfit: 40 }),
            push({ createdByUserId: 'u1', takenAt: new Date('2026-08-26T12:00:00Z'), totalProfit: 55 }),
        ]);

        expect(roster[0]?.totalProfit).toBe(55);
        expect(roster[0]?.lastTakenAt).toBe('2026-08-26T12:00:00.000Z');
    });

    it('does not let an out-of-order row overwrite a newer push', () => {
        const roster = toRoster(users, [
            push({ createdByUserId: 'u1', takenAt: new Date('2026-08-26T12:00:00Z'), totalProfit: 55 }),
            push({ createdByUserId: 'u1', takenAt: new Date('2026-08-26T09:00:00Z'), totalProfit: 40 }),
        ]);

        expect(roster[0]?.totalProfit).toBe(55);
    });

    it('keeps a person with no push today, with nothing to colour from', () => {
        const roster = toRoster(users, [push({ createdByUserId: 'u1', totalProfit: 10 })]);

        expect(roster[1]).toEqual({
            id: 'u2',
            nickname: 'bob',
            role: 'buyer',
            teamId: 't1',
            teamName: 'Alpha',
            lastTakenAt: null,
            totalProfit: null,
        });
    });

    it('keeps a rollup-less push as null profit rather than zero', () => {
        const roster = toRoster(users, [push({ createdByUserId: 'u1', totalProfit: null })]);

        expect(roster[0]?.totalProfit).toBeNull();
        expect(roster[0]?.lastTakenAt).not.toBeNull();
    });

    it('ignores a snapshot from someone outside the roster', () => {
        const roster = toRoster(users, [push({ createdByUserId: 'ghost', totalProfit: 999 })]);

        expect(roster).toHaveLength(2);
        expect(
            roster.every((row) => {
                return row.totalProfit === null;
            })
        ).toBe(true);
    });
});
