import type { GeoThresholds, Totals } from './types';
import { accountWaste, problemAccount, verdictFor, waste, zoneFor } from './verdict';

const TH: GeoThresholds = {
    installs: { gy: 2, yr: 4 },
    regs: { gy: 5, yr: 10 },
    sales: { gy: 30, yr: 60 },
    clicks: { gy: 0.2, yr: 0.5 },
};

function totals(over: Partial<Totals>): Totals {
    return { spend: 0, spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0, ...over };
}

describe('zoneFor', () => {
    it('lower cost is better; yr inclusive', () => {
        expect(zoneFor(1, { gy: 2, yr: 4 })).toBe('green');
        expect(zoneFor(4, { gy: 2, yr: 4 })).toBe('yellow');
        expect(zoneFor(4.01, { gy: 2, yr: 4 })).toBe('red');
    });
});

describe('verdictFor waterfall', () => {
    it('deepest stage with a result decides (sales over installs)', () => {
        const v = verdictFor(totals({ spendPlus: 40, sales: 1, installs: 100 }), TH);
        expect(v.reason && 'stage' in v.reason && v.reason.stage).toBe('sales');
        expect(v.verdict).toBe('yellow'); // cps 40 in [30,60]
    });

    it('a clicks-only campaign is never green (holds at yellow)', () => {
        const v = verdictFor(totals({ spendPlus: 0.1, linkClicks: 10 }), TH);
        expect(v.reason?.kind).toBe('clicksWaiting'); // cpc 0.01 < gy → would be green
        expect(v.verdict).toBe('yellow');
    });

    it('zero-result but spend over a red line → red', () => {
        const v = verdictFor(totals({ spendPlus: 5 }), TH); // > clicks.yr 0.5
        expect(v.verdict).toBe('red');
    });

    it('zero-result under every red line → neutral', () => {
        const v = verdictFor(totals({ spendPlus: 0.1 }), TH);
        expect(v.verdict).toBe('neutral');
    });
});

describe('waste', () => {
    it('only counts spend above the red line', () => {
        expect(waste(300, 1, 250)).toBe(50);
        expect(waste(200, 1, 250)).toBe(0);
    });
});

describe('verdictFor waste (doc 06)', () => {
    it('non-zero only for a red verdict', () => {
        // red on installs: cpi 5 > yr 4, over 10 installs → Spend⁺ 50 vs 4×10 → 10 waste.
        expect(verdictFor(totals({ spendPlus: 50, installs: 10 }), TH).waste).toBe(10);
        // green/yellow campaigns waste nothing.
        expect(verdictFor(totals({ spendPlus: 20, installs: 10 }), TH).waste).toBe(0); // cpi 2 → yellow
        expect(verdictFor(totals({ spendPlus: 10, installs: 10 }), TH).waste).toBe(0); // cpi 1 → green
    });

    it('zero-result red spends its whole Spend⁺ as waste (nothing achieved)', () => {
        expect(verdictFor(totals({ spendPlus: 5 }), TH).waste).toBe(5); // > clicks.yr, 0 results
    });
});

describe('accountWaste (ADR-0014)', () => {
    it('bills one bar when nothing was installed', () => {
        expect(accountWaste(55, 0, TH, 10)).toBe(15); // bar 40; due to pause at 40, spent 55
    });
    it('bills the bar per install once the account bought some', () => {
        expect(accountWaste(102, 3, TH, 2)).toBe(78); // bar 8
    });
    it('floors at zero below the bar', () => {
        expect(accountWaste(5, 0, TH, 2)).toBe(0);
        expect(accountWaste(10, 5, TH, 2)).toBe(0);
    });
});

describe('problemAccount', () => {
    it('rule 1: money out, nothing tracked', () => {
        const p = problemAccount('a', totals({ spendPlus: 8, installs: 0 }), TH, 2); // 8 ≥ 2×4
        expect(p?.rule).toBe(1);
    });
    it('healthy account → null', () => {
        expect(problemAccount('a', totals({ spendPlus: 8, installs: 5, sales: 2 }), TH, 2)).toBeNull();
    });
});
