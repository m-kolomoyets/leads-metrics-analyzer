import type { HistoryPushRow } from './toHistory';
import { describe, expect, it } from 'vitest';
import { toDimensionHistory, toHistory } from './toHistory';

const push = (over: Partial<HistoryPushRow> & { createdByUserId: string; reportDate: string }): HistoryPushRow => {
    return { takenAt: new Date('2026-09-01T09:00:00Z'), profit: 0, spendPlus: 100, ...over };
};

describe('toHistory', () => {
    it('reads each day from its latest push only — snapshots are cumulative, not additive', () => {
        const [history] = toHistory(
            ['u1'],
            [
                push({
                    createdByUserId: 'u1',
                    reportDate: '2026-09-01',
                    takenAt: new Date('2026-09-01T09:00:00Z'),
                    profit: 40,
                }),
                push({
                    createdByUserId: 'u1',
                    reportDate: '2026-09-01',
                    takenAt: new Date('2026-09-01T15:00:00Z'),
                    profit: 55,
                }),
            ]
        );

        expect(history?.days).toHaveLength(1);
        expect(history?.days[0]?.profit).toBe(55);
    });

    it('does not let an out-of-order row overwrite a newer push', () => {
        const [history] = toHistory(
            ['u1'],
            [
                push({
                    createdByUserId: 'u1',
                    reportDate: '2026-09-01',
                    takenAt: new Date('2026-09-01T15:00:00Z'),
                    profit: 55,
                }),
                push({
                    createdByUserId: 'u1',
                    reportDate: '2026-09-01',
                    takenAt: new Date('2026-09-01T09:00:00Z'),
                    profit: 40,
                }),
            ]
        );

        expect(history?.days[0]?.profit).toBe(55);
    });

    it('keeps one buyer’s day out of another’s', () => {
        const history = toHistory(
            ['u1', 'u2'],
            [
                push({ createdByUserId: 'u1', reportDate: '2026-09-01', profit: 10 }),
                push({ createdByUserId: 'u2', reportDate: '2026-09-01', profit: 20 }),
            ]
        );

        expect(history[0]?.days[0]?.profit).toBe(10);
        expect(history[1]?.days[0]?.profit).toBe(20);
    });

    it('returns an empty month for a buyer who pushed nothing, rather than dropping them', () => {
        const history = toHistory(['u1', 'u2'], [push({ createdByUserId: 'u1', reportDate: '2026-09-01' })]);

        expect(history).toHaveLength(2);
        expect(history[1]).toEqual({ buyerId: 'u2', days: [] });
    });

    it('orders days ascending whatever order the rows arrived in', () => {
        const [history] = toHistory(
            ['u1'],
            [
                push({ createdByUserId: 'u1', reportDate: '2026-09-12' }),
                push({ createdByUserId: 'u1', reportDate: '2026-09-03' }),
            ]
        );

        expect(
            history?.days.map((day) => {
                return day.reportDate;
            })
        ).toEqual(['2026-09-03', '2026-09-12']);
    });

    it('keeps a push that froze no rollup as a reported day with no total', () => {
        const [history] = toHistory(
            ['u1'],
            [push({ createdByUserId: 'u1', reportDate: '2026-09-01', profit: null, spendPlus: null })]
        );

        expect(history?.days[0]).toEqual({ reportDate: '2026-09-01', profit: null, spendPlus: 0 });
    });
});

describe('toDimensionHistory', () => {
    it('reduces a month to the dates that were reported, deduplicated and sorted', () => {
        const [history] = toDimensionHistory(
            ['u1'],
            [
                { createdByUserId: 'u1', reportDate: '2026-09-12' },
                { createdByUserId: 'u1', reportDate: '2026-09-03' },
                { createdByUserId: 'u1', reportDate: '2026-09-03' },
            ]
        );

        expect(history?.reportedDates).toEqual(['2026-09-03', '2026-09-12']);
    });

    it('carries no figure of any kind', () => {
        const [history] = toDimensionHistory(['u1'], [{ createdByUserId: 'u1', reportDate: '2026-09-01' }]);

        expect(Object.keys(history ?? {})).toEqual(['buyerId', 'reportedDates']);
    });
});
