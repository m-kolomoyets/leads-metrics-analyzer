import type { Totals } from '@/lib/domain/types';
import { describe, expect, it } from 'vitest';
import { hasUnallocatedSpend, rollUpRows, showsFooter } from './rollup';

// The table footer rule (CONTEXT.md): counts and money sum, every derived metric is re-derived from
// those sums, and a single-row table has nothing to roll up.

function totals(over: Partial<Totals>): Totals {
    return { spend: 0, spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0, ...over };
}

function row(over: Partial<Totals>): { metrics: Totals } {
    return { metrics: totals(over) };
}

describe('showsFooter', () => {
    it('is hidden for a single row, where the total would restate it verbatim', () => {
        expect(showsFooter([row({ installs: 10 })])).toBe(false);
    });

    it('appears as soon as there is more than one row to roll up', () => {
        expect(showsFooter([row({ installs: 10 }), row({ installs: 4 })])).toBe(true);
    });

    it('is hidden for an empty table', () => {
        expect(showsFooter([])).toBe(false);
    });
});

describe('rollUpRows', () => {
    it('derives the summary CPI from the summed bases, not from the mean of the rows', () => {
        // 100/2 = 50.00 and 100/2000 = 0.05. The mean of the rows' CPIs is 25.03; the honest figure
        // is 200 / 2002 = 0.0999.
        const rolled = rollUpRows([row({ spendPlus: 100, installs: 2 }), row({ spendPlus: 100, installs: 2000 })]);

        expect(rolled.cpi).toBeCloseTo(200 / 2002);
        expect(rolled.spendPlus).toBeCloseTo(200);
        expect(rolled.installs).toBe(2002);
    });

    it('re-derives ROI and Profit from the sums too', () => {
        const rolled = rollUpRows([row({ spendPlus: 100, revenue: 300 }), row({ spendPlus: 300, revenue: 100 })]);

        expect(rolled.profit).toBeCloseTo(0);
        expect(rolled.roi).toBeCloseTo(0);
    });

    it('leaves a derived metric null rather than zero when its denominator is', () => {
        expect(rollUpRows([row({ spendPlus: 100 }), row({ spendPlus: 50 })]).cpi).toBeNull();
    });

    it('folds a genuine unallocated bucket into the footer', () => {
        const rolled = rollUpRows([row({ spendPlus: 100, installs: 10 })], totals({ spendPlus: 40 }));

        expect(rolled.spendPlus).toBeCloseTo(140);
    });

    it('ignores a sub-cent unallocated remainder, which is float noise rather than cost', () => {
        const rolled = rollUpRows([row({ spendPlus: 100, installs: 10 })], totals({ spendPlus: 0.004 }));

        expect(rolled.spendPlus).toBeCloseTo(100);
        expect(hasUnallocatedSpend(totals({ spendPlus: 0.004 }))).toBe(false);
        expect(hasUnallocatedSpend(totals({ spendPlus: 0.01 }))).toBe(true);
    });
});
