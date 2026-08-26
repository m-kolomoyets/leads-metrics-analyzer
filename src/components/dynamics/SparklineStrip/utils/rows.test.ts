import type { DynamicsBases, SeriesPoint } from '@/lib/domain/dynamics';
import { describe, expect, it } from 'vitest';
import { figuresFrom } from '@/lib/domain/dynamics';
import { SPARKLINE_METRICS, sparklineRows, sparklineTone } from './rows';

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

describe('sparklineTone', () => {
    it('colours a cost by meaning: a CPI that fell is better, one that rose is worse', () => {
        expect(sparklineTone('cpi', -4)).toBe('good');
        expect(sparklineTone('cpi', 4)).toBe('bad');
    });

    it('leaves ROI and Profit neutral — up-good in the map, but no zone line to be graded against', () => {
        expect(sparklineTone('roi', 12)).toBe('neutral');
        expect(sparklineTone('profit', -50)).toBe('neutral');
    });

    it('leaves Spend neutral in either direction — spending more is neither good nor bad alone', () => {
        expect(sparklineTone('spend', 500)).toBe('neutral');
        expect(sparklineTone('spend', -500)).toBe('neutral');
    });

    it('reads an unmeasurable movement as no verdict rather than as a bad one', () => {
        expect(sparklineTone('cpi', null)).toBe('neutral');
    });
});

describe('sparklineRows', () => {
    const series = [
        point('1', { spendPlus: 100, revenue: 90, installs: 4 }),
        point('2', { spendPlus: 200, revenue: 400, installs: 20 }),
    ];

    it('shows the four the spec fixes, in reading order', () => {
        expect(
            sparklineRows(series).map((row) => {
                return row.metric;
            })
        ).toEqual(SPARKLINE_METRICS);
    });

    it('grades every push of a cost and leaves an ungraded metric flat neutral', () => {
        const rows = sparklineRows(series);
        const cpi = rows.find((row) => {
            return row.metric === 'cpi';
        });
        const spend = rows.find((row) => {
            return row.metric === 'spend';
        });

        // $100 over 4 installs is $25 — past the red line at 20; $200 over 20 is $10, which sits ON
        // the green→yellow line and so grades yellow, not green.
        expect(cpi?.zones).toEqual(['red', 'yellow']);
        expect(spend?.zones).toEqual(['neutral', 'neutral']);
    });

    it('carries the whole day per metric and prints the trailing figure', () => {
        const [roi, spend] = sparklineRows(series);

        expect(spend.values).toEqual([100, 200]);
        expect(spend.current).toBe(200);
        expect(roi.current).toBeCloseTo(100);
    });

    it('grades the trailing movement, so a CPI that halved reads better', () => {
        const cpi = sparklineRows(series).at(-1);

        // 25.00 → 10.00.
        expect(cpi?.change).toBeCloseTo(-15);
        expect(cpi?.tone).toBe('good');
    });

    it('has no verdict on the first push of the day — there is nothing behind it to have moved from', () => {
        const [, , , cpi] = sparklineRows([series[0]]);

        expect(cpi.change).toBeNull();
        expect(cpi.tone).toBe('neutral');
    });

    it('keeps an unmeasurable push as a gap in the series rather than as a zero', () => {
        const [, , , cpi] = sparklineRows([point('1', { spendPlus: 100, installs: 0 }), series[1]]);

        expect(cpi.values).toEqual([null, 10]);
    });

    it('draws nothing from an empty day', () => {
        expect(sparklineRows([])).toHaveLength(SPARKLINE_METRICS.length);
        expect(sparklineRows([])[0]).toMatchObject({ values: [], current: null, change: null });
    });
});
