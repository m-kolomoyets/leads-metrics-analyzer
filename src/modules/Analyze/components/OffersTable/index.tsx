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

type OffersTableProps = {
    title: string;
    firstCol: string;
    rows: ModelRow[];
    // Spend⁺ of the geo's campaigns that bought nothing (allocate.ts). Rendered as its own row so
    // the footer equals the Geo Total's Spend⁺ — zero-action campaigns are still real cost.
    unallocated: Totals;
    thresholds: GeoThresholds;
    locale: Locale;
};

// Column groups (doc: user block spec). A `border-l` on the first column of each block draws the
// divider across head, body and foot. Funnel counts | money | cost-per | conversion rates.
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

// A signed dollar Profit: +$120.00 / −$45.00, green when non-negative.
function profitText(value: number): string {
    return `${value >= 0 ? '+' : '−'}$${Math.abs(value).toFixed(2)}`;
}

// The metric cells shared by a data row and the totals footer. `spendPlus` is displayed as the
// Spend column (commission-inclusive by design — see CONTEXT.md), so Profit = Rev − Spend reads true.
// `plain` (footer totals) drops every tint — success/danger, zone and muted greys — so the sums/avg
// render in the default foreground (white), per request.
function MetricCells({ m, thresholds, plain }: { m: Metrics; thresholds: GeoThresholds; plain?: boolean }) {
    const dim = plain ? undefined : 'text-muted-foreground';
    return (
        <>
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
            <td className={cn('p-2 font-mono', BLOCK_START, dim)}>{ratioPct(m.inst2reg)}</td>
            <td className={cn('p-2 font-mono', dim)}>{ratioPct(m.reg2dep)}</td>
            <td className={cn('p-2 font-mono', dim)}>{ratioPct(m.inst2sale)}</td>
        </>
    );
}

// Offers analytical table: the full metric family on allocated (estimated) Spend⁺, organised into
// four column blocks. Offer identity leads with its ID in the accent colour (reference parity), then
// the parsed name. No copy button, no CPC (offers have no click source). The footer rolls every row
// up via metricsFor(Σ totals): counts/money summed, EPC/ROI/cost/conversion re-derived — so the
// footer obeys the same Spend⁺ arithmetic as the cells above it. It is hidden for a single offer,
// where the total would just repeat that one row (CONTEXT.md, Total / avg footer).
function OffersTable({ title, firstCol, rows, unallocated, thresholds, locale }: OffersTableProps) {
    // Sub-cent leftovers are float noise, not a real bucket — only show a genuine spend.
    const hasUnallocated = unallocated.spendPlus >= 0.01;
    // One offer → the footer would restate that row verbatim. Only roll up when there is something
    // to roll up. The unallocated row is not an offer and never earns the footer on its own.
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

    // Block-start columns (Inst=1, EPC ends block1 → Rev, CPI, I2R start blocks 2/3/4).
    const headCols: Array<{ label: string; start?: boolean }> = [
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
        { label: 'I2R', start: true },
        { label: 'R2S' },
        { label: 'I2S' },
    ];

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs">
                    <thead>
                        <tr className="text-muted-foreground border-b">
                            <th className="p-2 text-left font-normal whitespace-nowrap">{firstCol}</th>
                            {headCols.map((col) => {
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
                                    <td className="max-w-80 truncate p-2 text-left" title={`${row.key} ${row.label}`}>
                                        <span className="text-primary font-mono font-bold">{row.key}</span>
                                        {row.label && <span className="text-muted-foreground"> {row.label}</span>}
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

export { OffersTable };
