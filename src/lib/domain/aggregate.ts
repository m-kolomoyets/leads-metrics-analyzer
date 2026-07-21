import type { Totals } from './types';

// 3 · Metrics & ROI (doc 03). Every derived number, from summed Totals. One cost basis — Spend⁺ —
// and one ROI definition at every level. Any metric with a zero denominator is null, never 0.

// Spend⁺ = Spend × (1 + commission). The numerator of every cost metric; raw Spend is display-only.
export function spendPlus(spend: number, commission: number): number {
    return spend * (1 + commission);
}

// Cost-per / ratio: null when the denominator is zero (metric "not shown", not zero).
function ratio(numerator: number, denominator: number): number | null {
    if (denominator === 0) {
        return null;
    }
    return numerator / denominator;
}

export type Metrics = Totals & {
    cpc: number | null; // Spend⁺ ÷ Link Clicks
    cpi: number | null; // Spend⁺ ÷ Installs (sheet: UniqCost)
    cpr: number | null; // Spend⁺ ÷ Registrations (sheet: ConversionCost)
    cps: number | null; // Spend⁺ ÷ Sales (sheet: DepCost)
    epc: number | null; // Revenue ÷ Installs (per install, despite the name)
    profit: number; // Revenue − Spend⁺
    roi: number | null; // (Revenue − Spend⁺) ÷ Spend⁺ × 100
    click2inst: number | null; // Installs ÷ Link Clicks × 100
    inst2reg: number | null; // Registrations ÷ Installs × 100
    reg2dep: number | null; // Sales ÷ Registrations × 100
    inst2sale: number | null; // Sales ÷ Installs × 100 (cross-stage, skips Registration; UI: I2S)
};

const ZERO: Totals = {
    spend: 0,
    spendPlus: 0,
    revenue: 0,
    linkClicks: 0,
    installs: 0,
    regs: 0,
    sales: 0,
};

// Sum a set of Totals (or Total-bearing rows) into one. Spend⁺ is summed per-row, not re-derived —
// commission varies per Account, so a total rate over total spend would be wrong.
export function sumTotals(rows: Iterable<Totals>): Totals {
    const acc: Totals = { ...ZERO };
    for (const r of rows) {
        acc.spend += r.spend;
        acc.spendPlus += r.spendPlus;
        acc.revenue += r.revenue;
        acc.linkClicks += r.linkClicks;
        acc.installs += r.installs;
        acc.regs += r.regs;
        acc.sales += r.sales;
    }
    return acc;
}

// Derive every metric from summed Totals. Commission is already baked into the summed Spend⁺.
export function metricsFor(totals: Totals): Metrics {
    const { spendPlus: sp, revenue, linkClicks, installs, regs, sales } = totals;
    return {
        ...totals,
        cpc: ratio(sp, linkClicks),
        cpi: ratio(sp, installs),
        cpr: ratio(sp, regs),
        cps: ratio(sp, sales),
        epc: ratio(revenue, installs),
        profit: revenue - sp,
        roi: sp === 0 ? null : ((revenue - sp) / sp) * 100,
        click2inst: linkClicks === 0 ? null : (installs / linkClicks) * 100,
        inst2reg: installs === 0 ? null : (regs / installs) * 100,
        reg2dep: regs === 0 ? null : (sales / regs) * 100,
        inst2sale: installs === 0 ? null : (sales / installs) * 100,
    };
}
