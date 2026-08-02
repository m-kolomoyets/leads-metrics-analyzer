import type { DimensionRollupView } from '@/services/snapshots/types';

// The rollup branch's derive step (spec 0002 S6). Deliberately does NOT reuse `aggregate.metricsFor`:
// that shape carries Spend⁺ / Revenue / ROI, and a dollar-barred viewer must have no code path that
// could render one (ADR-0009). Counts in, funnel rates out.

// One rendered rollup row: the dimension key, its summed funnel counts, and the rates between the
// stages. A rate with a zero denominator is `null` — "not shown", never 0 (doc 03 convention).
export type RollupRow = {
    key: string;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
    click2inst: number | null;
    inst2reg: number | null;
    reg2dep: number | null;
    inst2sale: number | null;
};

type Counts = Pick<RollupRow, 'linkClicks' | 'installs' | 'regs' | 'sales'>;

function ratePct(numerator: number, denominator: number): number | null {
    if (denominator === 0) {
        return null;
    }
    return (numerator / denominator) * 100;
}

function rowFor(key: string, counts: Counts): RollupRow {
    const { linkClicks, installs, regs, sales } = counts;
    return {
        key,
        linkClicks,
        installs,
        regs,
        sales,
        click2inst: ratePct(installs, linkClicks),
        inst2reg: ratePct(regs, installs),
        reg2dep: ratePct(sales, regs),
        inst2sale: ratePct(sales, installs),
    };
}

// Rows ordered by what a Designer/BDM judges on: Sales first, Installs as the tie-break (a creative
// with reach but no sales still outranks a dead one), key last so the order is stable across reads.
function byImpact(a: Counts, b: Counts, aKey: string, bKey: string): number {
    return b.sales - a.sales || b.installs - a.installs || aKey.localeCompare(bKey);
}

// Sorted rows plus the summed footer. The footer's rates are re-derived from the summed counts, not
// averaged — the same arithmetic the dollar tables use for their totals row.
export function rollupRows(views: DimensionRollupView[]): { rows: RollupRow[]; totals: RollupRow } {
    const rows = [...views]
        .sort((a, b) => {
            return byImpact(a, b, a.key, b.key);
        })
        .map((view) => {
            return rowFor(view.key, view);
        });

    const totals = views.reduce<Counts>(
        (acc, view) => {
            return {
                linkClicks: acc.linkClicks + view.linkClicks,
                installs: acc.installs + view.installs,
                regs: acc.regs + view.regs,
                sales: acc.sales + view.sales,
            };
        },
        { linkClicks: 0, installs: 0, regs: 0, sales: 0 }
    );

    return { rows, totals: rowFor('', totals) };
}
