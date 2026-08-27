import type { DynamicsBases, SeriesPoint } from '@/lib/domain/dynamics';
import { describe, expect, it } from 'vitest';
import { figuresFrom } from '@/lib/domain/dynamics';
import { COST_DASH } from '../constants';
import { STRIP_METRICS, stripCards, trajectoryProps } from './chartProps';

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

describe('trajectoryProps', () => {
    const series = [
        point('1', { spendPlus: 100, revenue: 90, installs: 4 }),
        point('2', { spendPlus: 200, revenue: 400, installs: 20 }),
        point('3', { spendPlus: 300, revenue: 900, installs: 60 }),
    ];

    function props(over: Partial<Parameters<typeof trajectoryProps>[0]> = {}) {
        return trajectoryProps({
            points: series,
            mode: 'cumulative',
            costMetrics: ['cpi'],
            figure: 'revenue',
            ...over,
        });
    }

    it('draws one row per push, keyed on its position rather than on its clock', () => {
        // Two pushes inside one minute print the same stamp, and a category axis keyed on the stamp
        // would mark the first of them whichever was pointed at.
        expect(
            props().rows.map((row) => {
                return row.index;
            })
        ).toEqual([0, 1, 2]);
    });

    it('carries only the drawn metrics onto the rows, in the metric’s own units', () => {
        const [first] = props({ costMetrics: ['cpi', 'cpc'] }).rows;

        expect(first).toMatchObject({ cpi: 25, revenue: 90 });
        expect(first.cps).toBeUndefined();
    });

    it('keeps an unmeasurable push as a gap rather than as a zero', () => {
        const rows = props({ points: [point('1', { spendPlus: 100, installs: 0 }), series[1]] }).rows;

        expect(rows[0].cpi).toBeNull();
    });

    describe('the series it grades', () => {
        it('grades every cost line against each Snapshot’s own frozen thresholds', () => {
            // $25, $10 and $5 per install against a green line at 10 and a red one at 20.
            expect(props().series[0].tones).toEqual(['red', 'yellow', 'green']);
        });

        it('leaves the right-axis figure ungraded, so no verdict is read into money', () => {
            const figure = props().series.at(-1);

            expect(figure).toMatchObject({ dataKey: 'revenue', axis: 'figure' });
            expect(figure?.tones).toBeUndefined();
        });

        it('tells cost lines apart by dash and never by hue, one dash per metric', () => {
            const dashes = props({ costMetrics: ['cpi', 'cpr', 'cps', 'cpc'] }).series.map((entry) => {
                return entry.dash;
            });

            expect(dashes).toEqual([COST_DASH.cpi, COST_DASH.cpr, COST_DASH.cps, COST_DASH.cpc, undefined]);
        });

        it('draws the costs in a fixed order, whatever order they were selected in', () => {
            expect(
                props({ costMetrics: ['cpc', 'cpi'] }).series.map((entry) => {
                    return entry.dataKey;
                })
            ).toEqual(['cpi', 'cpc', 'revenue']);
        });
    });

    describe('the axes it rounds', () => {
        it('prints round figures rather than a division of the raw extent', () => {
            // CPI runs 25 → 5 across the day, and every rule it prints is a figure a reader can
            // place a value between without arithmetic.
            expect(props().costTicks).toEqual([5, 10, 15, 20, 25]);
        });

        it('rounds an awkward span outward to a step a reader can place a value inside', () => {
            const awkward = [
                point('1', { spendPlus: 13, revenue: 1, installs: 1 }),
                point('2', { spendPlus: 47, revenue: 1, installs: 1 }),
            ];

            // 13 → 47 divided five ways is 8.5 a row, starting at 13. Rounded, it is a step of 10
            // from a round 10 — which still reaches past 47, and reads without thinking.
            expect(props({ points: awkward }).costTicks).toEqual([10, 20, 30, 40, 50]);
        });

        it('gives both scales the same number of rows, so both land on the same grid rules', () => {
            const built = props();

            expect(built.figureTicks).toHaveLength(built.costTicks.length);
        });

        it('keeps them agreeing when the cost axis needs a different step from the figure axis', () => {
            const built = props({ costMetrics: ['cpi', 'cpr', 'cps', 'cpc'], figure: 'roi' });

            expect(built.figureTicks).toHaveLength(built.costTicks.length);
        });

        it('draws over exactly the range it printed, so the end figures sit on the plot’s edges', () => {
            const built = props();

            expect(built.costDomain).toEqual([built.costTicks[0], built.costTicks.at(-1)]);
            expect(built.figureDomain).toEqual([built.figureTicks[0], built.figureTicks.at(-1)]);
        });

        it('gives a flat metric a scale to be read against rather than an axis of one figure', () => {
            const flat = [
                point('1', { spendPlus: 100, revenue: 50, installs: 10 }),
                point('2', { spendPlus: 200, revenue: 50, installs: 20 }),
            ];
            const built = props({ points: flat, figure: 'revenue' });

            expect(built.figureTicks.length).toBeGreaterThan(1);
            expect(built.figureDomain[1]).toBeGreaterThan(built.figureDomain[0]);
        });

        it('keeps a range around an axis nothing could be measured on', () => {
            const unmeasurable = [
                point('1', { spendPlus: 100, installs: 0 }),
                point('2', { spendPlus: 200, installs: 0 }),
            ];
            const built = props({ points: unmeasurable });

            expect(built.costTicks).toEqual([]);
            expect(built.costDomain[1]).toBeGreaterThan(built.costDomain[0]);
        });

        it('keeps a figure that swings through zero spanning it, so a loss reads as below the floor', () => {
            const built = props({ figure: 'profit' });

            expect(built.figureDomain[0]).toBeLessThan(0);
        });
    });

    describe('the mode it was asked for', () => {
        it('draws the day as it happened when the toggle says cumulative', () => {
            expect(
                props().points.map((entry) => {
                    return entry.figures.spendPlus;
                })
            ).toEqual([100, 200, 300]);
        });

        it('draws the intervals between pushes when the toggle says between-reports', () => {
            expect(
                props({ mode: 'delta' }).points.map((entry) => {
                    return entry.figures.spendPlus;
                })
            ).toEqual([100, 100, 100]);
        });

        it('grades the intervals it drew rather than the totals they came from', () => {
            // The second interval is $100 over 16 installs — $6.25, green — where the cumulative
            // reading at that push is $10 and yellow.
            expect(props({ mode: 'delta' }).series[0].tones?.[1]).toBe('green');
        });
    });
});
