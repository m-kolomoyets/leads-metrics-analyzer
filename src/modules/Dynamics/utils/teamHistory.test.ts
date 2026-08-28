import type { DynamicsHistoryDay } from '@/services/dynamics/types';
import { describe, expect, it } from 'vitest';
import { teamDimensionHistory, teamHistory } from './teamHistory';

const day = (over: Partial<DynamicsHistoryDay> & { reportDate: string }): DynamicsHistoryDay => {
    return { profit: 0, spendPlus: 0, geos: [], ...over };
};

describe('teamHistory', () => {
    it('adds every buyer’s day into one team day', () => {
        const days = teamHistory([
            { buyerId: 'a', days: [day({ reportDate: '2026-09-01', profit: 100, spendPlus: 400 })] },
            { buyerId: 'b', days: [day({ reportDate: '2026-09-01', profit: -40, spendPlus: 200 })] },
        ]);

        expect(days).toEqual([day({ reportDate: '2026-09-01', profit: 60, spendPlus: 600 })]);
    });

    it('keeps a day ungraded only while nobody froze a total', () => {
        const [allNull] = teamHistory([
            { buyerId: 'a', days: [day({ reportDate: '2026-09-01', profit: null, spendPlus: 0 })] },
            { buyerId: 'b', days: [day({ reportDate: '2026-09-01', profit: null, spendPlus: 0 })] },
        ]);

        expect(allNull.profit).toBeNull();

        const [oneTotal] = teamHistory([
            { buyerId: 'a', days: [day({ reportDate: '2026-09-01', profit: null, spendPlus: 0 })] },
            { buyerId: 'b', days: [day({ reportDate: '2026-09-01', profit: 90, spendPlus: 300 })] },
        ]);

        expect(oneTotal).toEqual(day({ reportDate: '2026-09-01', profit: 90, spendPlus: 300 }));
    });

    it('carries a day only one buyer reported', () => {
        const days = teamHistory([
            { buyerId: 'a', days: [day({ reportDate: '2026-09-01', profit: 10, spendPlus: 50 })] },
            { buyerId: 'b', days: [] },
        ]);

        expect(days).toEqual([day({ reportDate: '2026-09-01', profit: 10, spendPlus: 50 })]);
    });

    it('merges two buyers’ markets into one line each, biggest mover first', () => {
        const [teamDay] = teamHistory([
            {
                buyerId: 'a',
                days: [
                    day({
                        reportDate: '2026-09-01',
                        profit: 60,
                        spendPlus: 200,
                        geos: [
                            { geo: 'IN', profit: 100 },
                            { geo: 'BR', profit: -40 },
                        ],
                    }),
                ],
            },
            {
                buyerId: 'b',
                days: [
                    day({
                        reportDate: '2026-09-01',
                        profit: -70,
                        spendPlus: 300,
                        geos: [{ geo: 'BR', profit: -70 }],
                    }),
                ],
            },
        ]);

        expect(teamDay.geos).toEqual([
            { geo: 'BR', profit: -110 },
            { geo: 'IN', profit: 100 },
        ]);
    });

    it('unions the dollar-free dates without repeating a day', () => {
        expect(
            teamDimensionHistory([
                { buyerId: 'a', reportedDates: ['2026-09-01', '2026-09-02'] },
                { buyerId: 'b', reportedDates: ['2026-09-02'] },
            ])
        ).toEqual(['2026-09-01', '2026-09-02']);
    });
});
