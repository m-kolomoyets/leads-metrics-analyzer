import type { Metrics } from '@/lib/domain/aggregate';
import type { ModelRow } from '@/lib/domain/allocate';
import type { GeoThresholds, ThresholdPair, Totals } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { metricsFor, sumTotals } from '@/lib/domain/aggregate';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { ZONE_TEXT_CLASS } from '../../constants';
import { cost, pct, ratioPct, usd } from '../../utils/format';
import { ui } from '../../utils/i18n';

type OsTableProps = {
    title: string;
    firstCol: string;
    rows: ModelRow[];
    // Spend⁺ of the geo's campaigns that bought nothing (allocate.ts). Same remainder the Offers
    // table renders — OS Installs sum to the Geo's too, so the footer reconciles to the Geo Total.
    unallocated: Totals;
    thresholds: GeoThresholds;
    locale: Locale;
};

// Column groups. A `border-l` on the first column of each block draws the divider across head, body
// and foot. Funnel counts (Clicks…EPC) | money | cost-per | conversion rates.
const BLOCK_START = 'border-l';

// A zone-graded cost cell (CPI/CPR/CPS) on ALLOCATED (estimated) Spend⁺: em dash when the
// denominator was zero, else the cost tinted by its band.
function CostCell({
    value,
    pair,
    className,
    plain,
}: {
    value: number | null;
    pair: ThresholdPair;
    className?: string;
    plain?: boolean;
}) {
    if (value === null) {
        return <td className={cn('p-2 font-mono', className)}>—</td>;
    }
    const zone = plain ? undefined : ZONE_TEXT_CLASS[zoneFor(value, pair)];
    return <td className={cn('p-2 font-mono', zone, className)}>{cost(value)}</td>;
}

// A signed dollar Profit: +$120.00 / −$45.00.
function profitText(value: number): string {
    return `${value >= 0 ? '+' : '−'}$${Math.abs(value).toFixed(2)}`;
}

// The metric cells shared by a data row and the totals footer. `spendPlus` is displayed as the
// Spend column (commission-inclusive by design — see CONTEXT.md), so Profit = Rev − Spend reads true.
// `plain` (footer totals, unallocated row) drops every tint so the sums/avg render in the default
// foreground.
function MetricCells({ m, thresholds, plain }: { m: Metrics; thresholds: GeoThresholds; plain?: boolean }) {
    const dim = plain ? undefined : 'text-muted-foreground';
    return (
        <>
            <td className="p-2 font-mono">{m.linkClicks}</td>
            <td className="p-2 font-mono">{m.installs}</td>
            <td className="p-2 font-mono">{m.regs}</td>
            <td className="p-2 font-mono">{m.sales}</td>
            <td className={cn('p-2 font-mono', dim)}>{cost(m.epc)}</td>
            <td className={cn('p-2 font-mono', BLOCK_START, !plain && m.revenue > 0 && 'text-success')}>
                {usd(m.revenue)}
            </td>
            <td className={cn('p-2 font-mono', dim)}>{usd(m.spendPlus)}</td>
            <td className={cn('p-2 font-mono font-bold', !plain && (m.profit >= 0 ? 'text-success' : 'text-danger'))}>
                {profitText(m.profit)}
            </td>
            <td
                className={cn(
                    'p-2 font-mono font-bold',
                    !plain && m.roi !== null && (m.roi >= 0 ? 'text-success' : 'text-danger')
                )}
            >
                {pct(m.roi)}
            </td>
            <CostCell value={m.cpi} pair={thresholds.installs} className={BLOCK_START} plain={plain} />
            <CostCell value={m.cpr} pair={thresholds.regs} plain={plain} />
            <CostCell value={m.cps} pair={thresholds.sales} plain={plain} />
            <td className={cn('p-2 font-mono', BLOCK_START, dim)}>{ratioPct(m.click2inst)}</td>
            <td className={cn('p-2 font-mono', dim)}>{ratioPct(m.inst2reg)}</td>
            <td className={cn('p-2 font-mono', dim)}>{ratioPct(m.reg2dep)}</td>
            <td className={cn('p-2 font-mono', dim)}>{ratioPct(m.inst2sale)}</td>
        </>
    );
}

// Block-start columns: Rev, CPI and C2I open blocks 2/3/4 (block 1 runs Clicks…EPC).
const HEAD_COLS: Array<{ label: string; start?: boolean }> = [
    { label: 'Clicks' },
    { label: 'Inst' },
    { label: 'Reg' },
    { label: 'Sale' },
    { label: 'EPC' },
    { label: 'Rev', start: true },
    { label: 'Spend' },
    { label: 'Profit' },
    { label: 'ROI' },
    { label: 'CPI', start: true },
    { label: 'CPR' },
    { label: 'CPS' },
    { label: 'C2I', start: true },
    { label: 'I2R' },
    { label: 'R2S' },
    { label: 'I2S' },
];

// OS analytical table: the same metric family as OffersTable on allocated (estimated) Spend⁺, plus
// the Clicks column OS rows carry — offers have no click source. The footer rolls
// every row up via metricsFor(Σ totals): counts/money summed, EPC/ROI/cost/conversion re-derived,
// so it obeys the same Spend⁺ arithmetic as the cells above it. Hidden for a single OS row, where
// the total would just repeat that row (CONTEXT.md, Total / avg footer).
function OsTable({ title, firstCol, rows, unallocated, thresholds, locale }: OsTableProps) {
    // Sub-cent leftovers are float noise, not a real bucket — only show a genuine spend.
    const hasUnallocated = unallocated.spendPlus >= 0.01;
    const showFooter = rows.length > 1;
    const unallocatedMetrics = metricsFor(unallocated);
    const totals = metricsFor(
        sumTotals([
            ...rows.map((row) => {
                return row.metrics;
            }),
            ...(hasUnallocated ? [unallocated] : []),
        ])
    );

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs">
                    <thead>
                        <tr className="text-muted-foreground border-b">
                            <th className="p-2 text-left font-normal whitespace-nowrap">{firstCol}</th>
                            {HEAD_COLS.map((col) => {
                                return (
                                    <th key={col.label} className={cn('p-2 font-normal', col.start && BLOCK_START)}>
                                        {col.label}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            return (
                                <tr key={row.key} className="border-b">
                                    <td
                                        className="max-w-80 truncate p-2 text-left font-mono"
                                        title={row.label || row.key}
                                    >
                                        {row.label || row.key}
                                    </td>
                                    <MetricCells m={row.metrics} thresholds={thresholds} />
                                </tr>
                            );
                        })}
                        {hasUnallocated && (
                            <tr className="border-b">
                                <td className="text-muted-foreground max-w-80 truncate p-2 text-left">
                                    {ui('unallocatedRow', locale)}
                                </td>
                                <MetricCells m={unallocatedMetrics} thresholds={thresholds} plain />
                            </tr>
                        )}
                    </tbody>
                    {showFooter && (
                        <tfoot>
                            <tr className="border-t-2 font-semibold">
                                <td className="text-muted-foreground p-2 text-left whitespace-nowrap">
                                    {ui('totalAvg', locale)}
                                </td>
                                <MetricCells m={totals} thresholds={thresholds} plain />
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            <p className="text-muted-foreground text-[10px]">{ui('allocEstimate', locale)}</p>
        </div>
    );
}

export { OsTable };
