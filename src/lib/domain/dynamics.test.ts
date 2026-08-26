import type { DynamicsBases, DynamicsSnapshot, SeriesPoint } from './dynamics';
import type { FrozenGeoRollup } from './snapshot';
import type { GeoThresholds } from './types';
import { describe, expect, it } from 'vitest';
import {
    buildSeries,
    compareFigures,
    deltaBetween,
    deltasFor,
    deriveFrom,
    figuresFrom,
    meaningOf,
    METRIC_MEANING,
    summarize,
    toneOf,
    zoneOfPoint,
} from './dynamics';

// The trajectory arithmetic (ADR-0017): pushes are cumulative, so the shape of a day is what changed
// between them. Every derived figure is rebuilt from subtracted bases — never averaged, never
// subtracted itself — and every undefined figure is null rather than 0.

const THRESHOLDS: GeoThresholds = {
    installs: { gy: 10, yr: 20 },
    regs: { gy: 30, yr: 60 },
    sales: { gy: 100, yr: 200 },
    clicks: { gy: 1, yr: 2 },
};

function rollup(over: Partial<FrozenGeoRollup> & { geo: string }): FrozenGeoRollup {
    return {
        spendPlus: 0,
        geoTotal: 0,
        attributedRevenue: 0,
        linkClicks: 0,
        installs: 0,
        regs: 0,
        sales: 0,
        profit: 0,
        roi: null,
        cpc: null,
        cpi: null,
        cpr: null,
        cps: null,
        waste: 0,
        ...over,
    };
}

function snapshot(id: string, takenAt: string, rollups: FrozenGeoRollup[]): DynamicsSnapshot {
    return {
        id,
        takenAt,
        geoRollups: rollups,
        thresholds: Object.fromEntries(
            rollups.map((one) => {
                return [one.geo, THRESHOLDS];
            })
        ),
        replacedAt: null,
    };
}

function point(
    over: Partial<DynamicsBases> & { id?: string; takenAt?: string; thresholds?: GeoThresholds | null }
): SeriesPoint {
    const { id = 'p', takenAt = '2026-08-26T10:00:00Z', thresholds = THRESHOLDS, ...bases } = over;
    return {
        snapshotId: id,
        takenAt,
        geo: 'KR',
        figures: figuresFrom({
            spendPlus: 0,
            revenue: 0,
            linkClicks: 0,
            installs: 0,
            regs: 0,
            sales: 0,
            ...bases,
        }),
        thresholds,
        replacedAt: null,
    };
}

describe('buildSeries', () => {
    it('orders points by taken_at, never by the dates inside the upload', () => {
        const snapshots = [
            snapshot('b', '2026-08-26T14:00:00Z', [rollup({ geo: 'KR', spendPlus: 300 })]),
            snapshot('a', '2026-08-26T09:00:00Z', [rollup({ geo: 'KR', spendPlus: 100 })]),
            snapshot('c', '2026-08-26T11:00:00Z', [rollup({ geo: 'KR', spendPlus: 200 })]),
        ];

        expect(
            buildSeries(snapshots, 'KR').map((one) => {
                return one.snapshotId;
            })
        ).toEqual(['a', 'c', 'b']);
    });

    it('breaks a taken_at tie on id rather than merging the two pushes', () => {
        const snapshots = [
            snapshot('z', '2026-08-26T09:00:00Z', [rollup({ geo: 'KR' })]),
            snapshot('a', '2026-08-26T09:00:00Z', [rollup({ geo: 'KR' })]),
        ];

        expect(
            buildSeries(snapshots, 'KR').map((one) => {
                return one.snapshotId;
            })
        ).toEqual(['a', 'z']);
    });

    it('keeps each point on its own copied thresholds, so the buyer grades their own day', () => {
        const later: GeoThresholds = { ...THRESHOLDS, installs: { gy: 99, yr: 199 } };
        const snapshots: DynamicsSnapshot[] = [
            snapshot('a', '2026-08-26T09:00:00Z', [rollup({ geo: 'KR' })]),
            { ...snapshot('b', '2026-08-26T10:00:00Z', [rollup({ geo: 'KR' })]), thresholds: { KR: later } },
        ];

        const series = buildSeries(snapshots, 'KR');

        expect(series[0].thresholds).toEqual(THRESHOLDS);
        expect(series[1].thresholds).toEqual(later);
    });

    it('leaves a geo ungraded when the snapshot copied no thresholds for it', () => {
        const snapshots: DynamicsSnapshot[] = [
            { ...snapshot('a', '2026-08-26T09:00:00Z', [rollup({ geo: 'KR' })]), thresholds: {} },
        ];

        expect(buildSeries(snapshots, 'KR')[0].thresholds).toBeNull();
    });

    it('skips a snapshot that froze no rollup for the geo — silence is not a zero', () => {
        const snapshots = [
            snapshot('a', '2026-08-26T09:00:00Z', [rollup({ geo: 'KR' })]),
            snapshot('b', '2026-08-26T10:00:00Z', [rollup({ geo: 'IN' })]),
        ];

        expect(buildSeries(snapshots, 'KR')).toHaveLength(1);
    });

    it('reads the Geo Total, untagged revenue included, as the point revenue', () => {
        const snapshots = [
            snapshot('a', '2026-08-26T09:00:00Z', [
                rollup({ geo: 'KR', spendPlus: 100, geoTotal: 180, attributedRevenue: 150 }),
            ]),
        ];

        expect(buildSeries(snapshots, 'KR')[0].figures.revenue).toBe(180);
    });
});

describe('deltaBetween', () => {
    it('is the snapshot itself on the first push of the day', () => {
        const first = point({ id: 'a', spendPlus: 106, revenue: 200, installs: 10, linkClicks: 100 });
        const delta = deltaBetween(null, first);

        expect(delta.flags.firstOfDay).toBe(true);
        expect(delta.bases).toEqual({ spendPlus: 106, revenue: 200, linkClicks: 100, installs: 10, regs: 0, sales: 0 });
        expect(delta.derived.cpi).toBeCloseTo(10.6);
        expect(delta.derived.profit).toBe(94);
        expect(delta.from).toBeNull();
    });

    it('subtracts counts and money, then recomputes every derived metric from the remainder', () => {
        const before = point({ spendPlus: 100, revenue: 200, linkClicks: 100, installs: 10, regs: 5, sales: 2 });
        const after = point({ spendPlus: 300, revenue: 500, linkClicks: 260, installs: 30, regs: 15, sales: 6 });

        const delta = deltaBetween(before, after);

        expect(delta.bases).toEqual({
            spendPlus: 200,
            revenue: 300,
            linkClicks: 160,
            installs: 20,
            regs: 10,
            sales: 4,
        });
        // Every one of these is Δ Spend⁺ ÷ Δ count — NOT the difference of the two points' own costs.
        expect(delta.derived.cpi).toBe(10);
        expect(delta.derived.cpc).toBe(1.25);
        expect(delta.derived.cpr).toBe(20);
        expect(delta.derived.cps).toBe(50);
        expect(delta.derived.profit).toBe(100);
        expect(delta.derived.roi).toBe(50);
        expect(delta.flags).toEqual({ firstOfDay: false, corrected: false, spendWithoutConversions: false });
    });

    it('divides Spend⁺ and never raw spend: ROI and Profit carry commission', () => {
        // $100 of traffic at 6% is $106 of cost. A commission-free ROI would read 0%; the true one is
        // negative, and it is the only one this repo computes (CONTEXT.md, SPEC §4.2 not implemented).
        const delta = deltaBetween(null, point({ spendPlus: 106, revenue: 100, installs: 10 }));

        expect(delta.derived.profit).toBe(-6);
        expect(delta.derived.roi).toBeCloseTo(-5.6603773);
        expect(delta.derived.cpi).toBeCloseTo(10.6);
    });

    describe('corrected', () => {
        it('clamps a base that went backwards, nulls every derived metric and flags the segment', () => {
            const before = point({ spendPlus: 300, revenue: 500, linkClicks: 260, installs: 30, regs: 15, sales: 6 });
            // Facebook restated the day: installs and revenue came down.
            const after = point({ spendPlus: 320, revenue: 450, linkClicks: 265, installs: 25, regs: 15, sales: 6 });

            const delta = deltaBetween(before, after);

            expect(delta.flags.corrected).toBe(true);
            expect(delta.bases).toEqual({
                spendPlus: 20,
                revenue: 0,
                linkClicks: 5,
                installs: 0,
                regs: 0,
                sales: 0,
            });
            expect(delta.derived).toEqual({ profit: null, roi: null, cpc: null, cpi: null, cpr: null, cps: null });
        });

        it('does not also claim spend-without-conversions — the interval measured nothing at all', () => {
            const before = point({ spendPlus: 300, installs: 30 });
            const after = point({ spendPlus: 320, installs: 20 });

            expect(deltaBetween(before, after).flags.spendWithoutConversions).toBe(false);
        });
    });

    describe('spend_without_conversions', () => {
        it('flags money moving with no installs, and leaves CPI null rather than Infinity', () => {
            const before = point({ spendPlus: 100, installs: 10 });
            const after = point({ spendPlus: 180, installs: 10 });

            const delta = deltaBetween(before, after);

            expect(delta.flags.spendWithoutConversions).toBe(true);
            expect(delta.derived.cpi).toBeNull();
            expect(delta.bases.spendPlus).toBe(80);
        });

        it('does not flag an interval where nothing moved at all', () => {
            const still = point({ spendPlus: 100, installs: 10 });

            expect(deltaBetween(still, still).flags.spendWithoutConversions).toBe(false);
        });
    });

    it('never produces Infinity or NaN, whatever the bases', () => {
        const cases = [
            deltaBetween(null, point({})),
            deltaBetween(null, point({ spendPlus: 50 })),
            deltaBetween(point({ spendPlus: 50 }), point({ spendPlus: 50 })),
            deltaBetween(point({ spendPlus: 50, revenue: 10 }), point({ spendPlus: 10 })),
            deltaBetween(point({}), point({ installs: 5, regs: 5, sales: 5, linkClicks: 5 })),
        ];

        for (const delta of cases) {
            for (const value of [...Object.values(delta.bases), ...Object.values(delta.derived)]) {
                expect(Number.isNaN(value)).toBe(false);
                expect(value === Infinity || value === -Infinity).toBe(false);
            }
        }
    });

    it('reads a zero-spend interval as no ROI rather than −100%', () => {
        const delta = deltaBetween(point({ revenue: 10 }), point({ revenue: 40 }));

        expect(delta.derived.roi).toBeNull();
        expect(delta.derived.cpi).toBeNull();
    });
});

describe('deltasFor', () => {
    it('returns one delta per point, the first of them first_of_day', () => {
        const points = buildSeries(
            [
                snapshot('a', '2026-08-26T09:00:00Z', [rollup({ geo: 'KR', spendPlus: 100, installs: 10 })]),
                snapshot('b', '2026-08-26T12:00:00Z', [rollup({ geo: 'KR', spendPlus: 260, installs: 30 })]),
                snapshot('c', '2026-08-26T15:00:00Z', [rollup({ geo: 'KR', spendPlus: 460, installs: 50 })]),
            ],
            'KR'
        );

        const deltas = deltasFor(points);

        expect(deltas).toHaveLength(3);
        expect(
            deltas.map((one) => {
                return one.flags.firstOfDay;
            })
        ).toEqual([true, false, false]);
        expect(
            deltas.map((one) => {
                return one.bases.spendPlus;
            })
        ).toEqual([100, 160, 200]);
        expect(
            deltas.map((one) => {
                return one.derived.cpi;
            })
        ).toEqual([10, 8, 10]);
    });

    it('returns nothing for an empty series', () => {
        expect(deltasFor([])).toEqual([]);
    });
});

describe('summarize', () => {
    it('rebuilds CPI as Σ Spend⁺ ÷ Σ installs, not the mean of the segments own CPIs', () => {
        // Segment costs are 10.00 and 1.00; their mean is 5.50. The true day CPI is 210 ÷ 110 ≈ 1.909.
        const deltas = deltasFor([point({ spendPlus: 100, installs: 10 }), point({ spendPlus: 210, installs: 110 })]);

        const day = summarize(
            deltas.map((one) => {
                return one.bases;
            })
        );

        expect(day.spendPlus).toBe(210);
        expect(day.installs).toBe(110);
        expect(day.cpi).toBeCloseTo(1.9090909);
        expect(day.cpi).not.toBeCloseTo(5.5);
    });

    it('sums bases across geos and re-derives ROI from the sums', () => {
        const day = summarize([
            { spendPlus: 100, revenue: 200, linkClicks: 50, installs: 10, regs: 5, sales: 1 },
            { spendPlus: 300, revenue: 300, linkClicks: 150, installs: 30, regs: 10, sales: 2 },
        ]);

        expect(day.spendPlus).toBe(400);
        expect(day.revenue).toBe(500);
        expect(day.profit).toBe(100);
        expect(day.roi).toBe(25);
    });

    it('is all zeros and nulls for nothing at all', () => {
        expect(summarize([])).toEqual({
            spendPlus: 0,
            revenue: 0,
            linkClicks: 0,
            installs: 0,
            regs: 0,
            sales: 0,
            profit: 0,
            roi: null,
            cpc: null,
            cpi: null,
            cpr: null,
            cps: null,
        });
    });
});

describe('METRIC_MEANING', () => {
    it('points cost metrics down and earnings up, and refuses to judge spend alone', () => {
        expect(meaningOf('cpi')).toBe('down-good');
        expect(meaningOf('cpc')).toBe('down-good');
        expect(meaningOf('cpr')).toBe('down-good');
        expect(meaningOf('cps')).toBe('down-good');
        expect(meaningOf('roi')).toBe('up-good');
        expect(meaningOf('revenue')).toBe('up-good');
        expect(meaningOf('profit')).toBe('up-good');
        expect(meaningOf('spend')).toBe('neutral');
    });

    it('covers every metric the page renders, so no caller invents a direction of its own', () => {
        expect(Object.keys(METRIC_MEANING).sort()).toEqual(
            ['cpc', 'cpi', 'cpr', 'cps', 'profit', 'revenue', 'roi', 'spend'].sort()
        );
    });
});

describe('deriveFrom', () => {
    it('is the only divider, and returns null on every zero denominator', () => {
        expect(deriveFrom({ spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0 })).toEqual({
            profit: 0,
            roi: null,
            cpc: null,
            cpi: null,
            cpr: null,
            cps: null,
        });
    });
});

describe('axis ordering', () => {
    it('compares taken_at as an instant, not as text', () => {
        // The same three moments, written in three notations. Sorted as strings, `+03:00` would lead.
        const snapshots = [
            snapshot('c', '2026-08-26T15:00:00.000Z', [rollup({ geo: 'KR' })]),
            snapshot('a', '2026-08-26T12:00:00+03:00', [rollup({ geo: 'KR' })]), // 09:00Z
            snapshot('b', '2026-08-26T11:00:00Z', [rollup({ geo: 'KR' })]),
        ];

        expect(
            buildSeries(snapshots, 'KR').map((one) => {
                return one.snapshotId;
            })
        ).toEqual(['a', 'b', 'c']);
    });
});

describe('toneOf', () => {
    it('colours by meaning, not by the sign: a cheaper CPI is good, a falling ROI is bad', () => {
        expect(toneOf('cpi', -4.1)).toBe('good');
        expect(toneOf('cpi', 4.1)).toBe('bad');
        expect(toneOf('roi', -5)).toBe('bad');
        expect(toneOf('roi', 5)).toBe('good');
    });

    it('leaves spend neutral in every direction, because spend alone judges nothing', () => {
        expect(toneOf('spend', 250)).toBe('neutral');
        expect(toneOf('spend', -250)).toBe('neutral');
    });

    it('reads no verdict into no movement, or into a change nobody could measure', () => {
        expect(toneOf('profit', 0)).toBe('neutral');
        expect(toneOf('cpi', null)).toBe('neutral');
    });
});

describe('compareFigures', () => {
    it('subtracts the displayed figures, so a CPI of 22.50 then 18.40 moved by -4.10', () => {
        const previous = figuresFrom({ spendPlus: 225, revenue: 0, linkClicks: 0, installs: 10, regs: 0, sales: 0 });
        const current = figuresFrom({ spendPlus: 460, revenue: 0, linkClicks: 0, installs: 25, regs: 0, sales: 0 });

        const cpi = compareFigures(previous, current).find((one) => {
            return one.metric === 'cpi';
        });

        expect(cpi?.previous).toBeCloseTo(22.5);
        expect(cpi?.current).toBeCloseTo(18.4);
        expect(cpi?.change).toBeCloseTo(-4.1);
        expect(cpi?.tone).toBe('good');
    });

    it('keeps spend neutral while the profit it bought reads red', () => {
        const previous = figuresFrom({ spendPlus: 100, revenue: 300, linkClicks: 0, installs: 0, regs: 0, sales: 0 });
        const current = figuresFrom({ spendPlus: 250, revenue: 300, linkClicks: 0, installs: 0, regs: 0, sales: 0 });

        const rows = compareFigures(previous, current);
        const spend = rows.find((one) => {
            return one.metric === 'spend';
        });
        const profit = rows.find((one) => {
            return one.metric === 'profit';
        });

        expect(spend?.change).toBe(150);
        expect(spend?.tone).toBe('neutral');
        expect(profit?.change).toBe(-150);
        expect(profit?.tone).toBe('bad');
    });

    it('reports every metric the panel renders, in reading order', () => {
        const figures = figuresFrom({ spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0 });

        expect(
            compareFigures(null, figures).map((one) => {
                return one.metric;
            })
        ).toEqual(['spend', 'revenue', 'profit', 'roi', 'cpi', 'cpr', 'cps', 'cpc']);
    });

    it('changes nothing against a first push: there is no previous figure to subtract', () => {
        const current = figuresFrom({ spendPlus: 250, revenue: 400, linkClicks: 0, installs: 10, regs: 0, sales: 0 });

        for (const row of compareFigures(null, current)) {
            expect(row.previous).toBeNull();
            expect(row.change).toBeNull();
            expect(row.tone).toBe('neutral');
        }
    });

    it('refuses to call an unmeasurable figure a change of zero', () => {
        const previous = figuresFrom({ spendPlus: 100, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0 });
        const current = figuresFrom({ spendPlus: 200, revenue: 0, linkClicks: 0, installs: 8, regs: 0, sales: 0 });

        const cpi = compareFigures(previous, current).find((one) => {
            return one.metric === 'cpi';
        });

        expect(cpi?.previous).toBeNull();
        expect(cpi?.current).toBe(25);
        expect(cpi?.change).toBeNull();
    });
});

describe('zoneOfPoint', () => {
    it('grades a cost against the pair its own stage owns', () => {
        const graded = point({ spendPlus: 90, installs: 10, regs: 1, sales: 1, linkClicks: 100 });

        // CPI 9 against installs 10/20 → green; CPR 90 against regs 30/60 → red.
        expect(zoneOfPoint(graded, 'cpi')).toBe('green');
        expect(zoneOfPoint(graded, 'cpr')).toBe('red');
        expect(zoneOfPoint(graded, 'cpc')).toBe('green');
    });

    it('grades against the point OWN frozen thresholds, never a passed-in live ruleset', () => {
        const strict: GeoThresholds = {
            installs: { gy: 5, yr: 8 },
            regs: { gy: 30, yr: 60 },
            sales: { gy: 100, yr: 200 },
            clicks: { gy: 1, yr: 2 },
        };
        const bases = { spendPlus: 90, installs: 10, regs: 0, sales: 0, linkClicks: 0 };

        expect(zoneOfPoint(point(bases), 'cpi')).toBe('green');
        expect(zoneOfPoint(point({ ...bases, thresholds: strict }), 'cpi')).toBe('red');
    });

    it('is neutral when the figure is unmeasurable — an ungraded point is not a bad one', () => {
        const ungraded = point({ spendPlus: 90, installs: 0, regs: 0, sales: 0, linkClicks: 0 });

        expect(zoneOfPoint(ungraded, 'cpi')).toBe('neutral');
    });

    it('is neutral when the snapshot froze no readable thresholds', () => {
        const unreadable = point({ spendPlus: 90, installs: 10, regs: 0, sales: 0, linkClicks: 0, thresholds: null });

        expect(zoneOfPoint(unreadable, 'cpi')).toBe('neutral');
    });
});
