import type { DynamicsDimensionRow } from '@/services/dynamics/types';

// The dollar-free frame's arithmetic (#10). The frame is still Team → Buyer → Geo — the shape never
// changes between roles — but its third level cannot be built the way the trajectory page builds it:
// `geoTabs` filters on Spend⁺ > 0 and sorts by it, and neither figure exists for a Designer or BDM.
//
// So the ranking is the one these roles judge on: Sales, then reach. And there is no filter at all —
// a market with no sale yet is still a market the buyer ran, and hiding it would leave a creative or
// an offer with nowhere to appear.

type Counts = Pick<DynamicsDimensionRow, 'linkClicks' | 'installs' | 'regs' | 'sales'>;

// One row of the table under the geo tabs: the dimension key and its counts. The geo is dropped —
// the selected tab already says which market these are.
export type DimensionTableRow = Counts & {
    key: string;
};

// The markets the geo row offers, best first. Ranked on a market's whole funnel, not on its leading
// row, so a geo carrying many small offers is not outranked by one holding a single big one.
export function geosOf(rows: DynamicsDimensionRow[]): string[] {
    const totals = new Map<string, Counts>();

    for (const row of rows) {
        const current = totals.get(row.geo) ?? { linkClicks: 0, installs: 0, regs: 0, sales: 0 };

        totals.set(row.geo, {
            linkClicks: current.linkClicks + row.linkClicks,
            installs: current.installs + row.installs,
            regs: current.regs + row.regs,
            sales: current.sales + row.sales,
        });
    }

    return [...totals.entries()]
        .sort(([aGeo, a], [bGeo, b]) => {
            return b.sales - a.sales || b.installs - a.installs || aGeo.localeCompare(bGeo);
        })
        .map(([geo]) => {
            return geo;
        });
}

// One market's rows, in the order the server returned them — the table sorts them itself.
export function rowsOfGeo(rows: DynamicsDimensionRow[], geo: string): DimensionTableRow[] {
    return rows
        .filter((row) => {
            return row.geo === geo;
        })
        .map(({ key, linkClicks, installs, regs, sales }): DimensionTableRow => {
            return { key, linkClicks, installs, regs, sales };
        });
}
