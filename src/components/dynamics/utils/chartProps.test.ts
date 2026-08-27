import type { DynamicsBases, SeriesPoint } from '@/lib/domain/dynamics';
import { describe, expect, it } from 'vitest';
import { figuresFrom } from '@/lib/domain/dynamics';
import { STRIP_METRICS, stripCards } from './chartProps';

const THRESHOLDS = {
    installs: { gy: 10, yr: 20 },
    regs: { gy: 30, yr: 60 },
    sales: { gy: 100, yr: 200 },
    clicks: { gy: 1, yr: 2 },
};

function point(id: string, bases: Partial<DynamicsBases>): SeriesPoint {
    return {
        snapshotId: id,
        takenAt: `2026-08-26T1${id}:00:00Z`,
        geo: 'KR',
        figures: figuresFrom({ spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0, ...bases }),
        thresholds: THRESHOLDS,
        replacedAt: null,
    };
}

function cardFor(cards: ReturnType<typeof stripCards>, metric: string) {
    return cards.find((card) => {
        return card.metric === metric;
    });
}

describe('stripCards', () => {
    const series = [
        point('1', { spendPlus: 100, revenue: 90, installs: 4 }),
        point('2', { spendPlus: 200, revenue: 400, installs: 20 }),
    ];

    it('shows the four the spec fixes, in reading order', () => {
        expect(
            stripCards(series).map((card) => {
                return card.metric;
            })
        ).toEqual(STRIP_METRICS);
    });

    it('grades every push of a cost, and places the grade where the verdict crossed', () => {
        // $100 over 4 installs is $25 — past the red line at 20; $200 over 20 is $10, which sits ON
        // the green→yellow line and so grades yellow, not green.
        expect(cardFor(stripCards(series), 'cpi')?.tones).toEqual(['red', 'yellow']);
    });

    it('leaves an ungraded metric with no grades at all rather than a row of neutrals', () => {
        const cards = stripCards(series);

        expect(cardFor(cards, 'spend')?.tones).toBeUndefined();
        expect(cardFor(cards, 'roi')?.tones).toBeUndefined();
        expect(cardFor(cards, 'profit')?.tones).toBeUndefined();
    });

    it('carries the whole day per metric and prints the trailing figure in the metric’s own units', () => {
        const cards = stripCards(series);

        expect(cardFor(cards, 'spend')?.values).toEqual([100, 200]);
        expect(cardFor(cards, 'spend')?.value).toBe('$200.00');
        expect(cardFor(cards, 'cpi')?.value).toBe('10.00');
    });

    it('keeps an unmeasurable push as a gap in the series rather than as a zero', () => {
        const cards = stripCards([point('1', { spendPlus: 100, installs: 0 }), series[1]]);

        expect(cardFor(cards, 'cpi')?.values).toEqual([null, 10]);
    });

    it('draws nothing from an empty day, and prints the trailing figure as unmeasurable', () => {
        const cards = stripCards([]);

        expect(cards).toHaveLength(STRIP_METRICS.length);
        expect(cards[0]).toMatchObject({ values: [], value: '—' });
    });

    describe('the plot’s domain', () => {
        it('leaves air under the lowest point and above the highest, more below than above', () => {
            const [min, max] = cardFor(stripCards(series), 'spend')?.domain ?? [0, 0];

            expect(min).toBeLessThan(100);
            expect(max).toBeGreaterThan(200);
            expect(100 - min).toBeGreaterThan(max - 200);
        });

        it('gives a flat series a range to be drawn in rather than a line of zero height', () => {
            const flat = [point('1', { spendPlus: 100 }), point('2', { spendPlus: 100 })];
            const [min, max] = cardFor(stripCards(flat), 'spend')?.domain ?? [0, 0];

            expect(min).toBeLessThan(100);
            expect(max).toBeGreaterThan(100);
        });

        it('keeps a series that spans zero spanning it, so a loss still reads as below the floor', () => {
            const swing = [point('1', { spendPlus: 100, revenue: 40 }), point('2', { spendPlus: 100, revenue: 260 })];
            const [min, max] = cardFor(stripCards(swing), 'profit')?.domain ?? [0, 0];

            // −60 → 160.
            expect(min).toBeLessThan(-60);
            expect(max).toBeGreaterThan(160);
        });

        it('draws an unmeasurable metric in a range rather than in none', () => {
            const [min, max] = cardFor(stripCards([point('1', { spendPlus: 100, installs: 0 })]), 'cpi')?.domain ?? [
                0, 0,
            ];

            expect(max).toBeGreaterThan(min);
        });
    });
});
