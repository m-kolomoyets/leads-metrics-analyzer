import type { DynamicsHistoryDay } from '@/services/dynamics/types';
import { describe, expect, it } from 'vitest';
import { monthDays } from '@/lib/utils/calendarMonth';
import { dimensionHeatDays, heatDays } from './heatDays';

const september = monthDays('2026-09-15');

const day = (over: Partial<DynamicsHistoryDay> & { reportDate: string }): DynamicsHistoryDay => {
    return { profit: 100, spendPlus: 100, geos: [], ...over };
};

const stateOn = (days: ReturnType<typeof heatDays>, date: string) => {
    return days.find((entry) => {
        return entry.date === date;
    })?.state;
};

describe('heatDays', () => {
    it('builds the whole calendar month, not only the days that carry a push', () => {
        const days = heatDays(september, [day({ reportDate: '2026-09-02' })], '2026-09-15');

        expect(days).toHaveLength(30);
    });

    it('separates a day nobody reported from a day still to come', () => {
        const days = heatDays(september, [], '2026-09-15');

        expect(stateOn(days, '2026-09-14')).toBe('unreported');
        expect(stateOn(days, '2026-09-15')).toBe('unreported');
        expect(stateOn(days, '2026-09-16')).toBe('future');
    });

    it('paints one dollar of loss red, whatever the ROI would have been', () => {
        const days = heatDays(
            september,
            [day({ reportDate: '2026-09-02', profit: -1, spendPlus: 10000 })],
            '2026-09-15'
        );

        expect(stateOn(days, '2026-09-02')).toBe('red');
    });

    it('grades a profitable day on ROI, so a small buyer is held to the same standard as a large one', () => {
        const days = heatDays(
            september,
            [
                day({ reportDate: '2026-09-02', profit: 60, spendPlus: 200 }),
                day({ reportDate: '2026-09-03', profit: 6000, spendPlus: 50000 }),
            ],
            '2026-09-15'
        );

        expect(stateOn(days, '2026-09-02')).toBe('green');
        expect(stateOn(days, '2026-09-03')).toBe('yellow');
    });

    it('refuses to grade a day with no Spend⁺ — nothing was risked', () => {
        const days = heatDays(september, [day({ reportDate: '2026-09-02', profit: 40, spendPlus: 0 })], '2026-09-15');

        expect(stateOn(days, '2026-09-02')).toBe('ungraded');
    });

    it('refuses to grade a push that froze no rollup, and says so as a reported day', () => {
        const days = heatDays(september, [day({ reportDate: '2026-09-02', profit: null, spendPlus: 0 })], '2026-09-15');

        expect(stateOn(days, '2026-09-02')).toBe('ungraded');
    });

    it('reports the ROI it graded on, and nothing when there was no denominator', () => {
        const days = heatDays(
            september,
            [
                day({ reportDate: '2026-09-02', profit: 50, spendPlus: 200 }),
                day({ reportDate: '2026-09-03', profit: 50, spendPlus: 0 }),
            ],
            '2026-09-15'
        );

        expect(
            days.find((entry) => {
                return entry.date === '2026-09-02';
            })?.roi
        ).toBe(25);
        expect(
            days.find((entry) => {
                return entry.date === '2026-09-03';
            })?.roi
        ).toBeNull();
    });
});

describe('dimensionHeatDays', () => {
    it('says only whether a day was reported, and carries no figure', () => {
        const days = dimensionHeatDays(september, ['2026-09-02'], '2026-09-15');

        expect(stateOn(days, '2026-09-02')).toBe('ungraded');
        expect(stateOn(days, '2026-09-03')).toBe('unreported');
        expect(stateOn(days, '2026-09-20')).toBe('future');
        expect(days[1]).toEqual({
            date: '2026-09-02',
            geos: [],
            state: 'ungraded',
            profit: null,
            spendPlus: 0,
            roi: null,
        });
    });
});
