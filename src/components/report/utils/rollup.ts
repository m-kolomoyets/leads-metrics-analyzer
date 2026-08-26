import type { Metrics } from '@/lib/domain/aggregate';
import type { Totals } from '@/lib/domain/types';
import { metricsFor, sumTotals } from '@/lib/domain/aggregate';

// The footer rule the Offers, OS and Creative tables share, written once so it can be tested without
// a DOM (ADR-0005) and so the three tables cannot drift apart on it.
//
// The rule itself is CONTEXT.md's roll-up rule: counts and money SUM, and every derived metric is
// re-derived from those sums — never averaged across the rows. A summary CPI is therefore total
// Spend⁺ ÷ total installs, which weights a 2000-install row like the 2000-install row it is; the mean
// of the rows' own CPIs would weight it like a 2-install one and answer a question nobody asked.

// One row as the roll-up reads it: the table's identity plus the Totals its metrics were built from.
type RolledRow = { metrics: Totals };

// Sub-cent leftovers are float noise, not a real bucket — only a genuine spend earns a row, and the
// footer folds the unallocated bucket in exactly when the table renders it, so the footer's Spend⁺
// always equals what the Spend column above it adds up to.
export function hasUnallocatedSpend(unallocated: Totals): boolean {
    return unallocated.spendPlus >= 0.01;
}

// Whether the table earns a roll-up footer at all. One data row → the footer would restate that row
// verbatim, which is noise dressed as a total (CONTEXT.md, Total / avg footer). The unallocated row
// is not a data row and never earns the footer on its own.
export function showsFooter(rows: readonly RolledRow[]): boolean {
    return rows.length > 1;
}

// The footer's figures. `unallocated` is omitted by tables that have no such bucket (creatives).
export function rollUpRows(rows: readonly RolledRow[], unallocated?: Totals): Metrics {
    return metricsFor(
        sumTotals([
            ...rows.map((row) => {
                return row.metrics;
            }),
            ...(unallocated && hasUnallocatedSpend(unallocated) ? [unallocated] : []),
        ])
    );
}
