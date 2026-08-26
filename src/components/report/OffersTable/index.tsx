import type { Locale } from '@/components/report/utils/i18n';
import type { Metrics } from '@/lib/domain/aggregate';
import type { ModelRow } from '@/lib/domain/allocate';
import type { MetricTrend } from '@/lib/domain/dynamics';
import type { GeoThresholds, ThresholdPair, Totals } from '@/lib/domain/types';
import { metricsFor } from '@/lib/domain/aggregate';
import { trendBetween } from '@/lib/domain/dynamics';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { RowTrend } from '@/components/dynamics/RowTrend';
import { ZONE_TEXT_CLASS } from '@/components/report/constants';
import { cost, int, pct, ratioPct, usd, usdSigned } from '@/components/report/utils/format';
import { ui } from '@/components/report/utils/i18n';
import { hasUnallocatedSpend, rollUpRows, showsFooter } from '@/components/report/utils/rollup';

type OffersTableProps = {
    title: string;
    firstCol: string;
    rows: ModelRow[];
    // Spend⁺ of the geo's campaigns that bought nothing (allocate.ts). Rendered as its own row so
    // the footer equals the Geo Total's Spend⁺ — zero-action campaigns are still real cost.
    unallocated: Totals;
    thresholds: GeoThresholds;
    locale: Locale;
    // The same table one Snapshot earlier, when the page has one to compare against (Dynamics, #09).
    // Passed as this table's own inputs rather than as pre-computed arrows, so the roll-up the footer
    // arrow moves against is the very expression the footer itself sums. Absent on the detailed
    // report, which shows one Snapshot and has nothing to compare to.
    previous?: OffersPrevious;
};

// The previous Snapshot's Offers table, in the shape this one is built from.
type OffersPrevious = { rows: ModelRow[]; unallocated: Totals };

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
    trend,
}: {
    value: number | null;
    pair: ThresholdPair;
    className?: string;
    plain?: boolean;
    // CPI alone carries an arrow; CPR and CPS pass none (SPEC §6.7).
    trend?: MetricTrend | null;
}) {
    if (value === null) {
        return <td className={cn('p-2 font-mono', className)}>—</td>;
    }
    const zone = plain ? undefined : ZONE_TEXT_CLASS[zoneFor(value, pair)];
    return (
        <td className={cn('p-2 font-mono', zone, className)}>
            {cost(value)}
            <RowTrend metric="cpi" trend={trend ?? null} />
        </td>
    );
}

// The metric cells shared by a data row and the totals footer. `spendPlus` is displayed as the
// Spend column (commission-inclusive by design — see CONTEXT.md), so Profit = Rev − Spend reads true.
// `plain` (footer totals) drops every tint — success/danger, zone and muted greys — so the sums/avg
// render in the default foreground (white), per request.
function MetricCells({
    m,
    thresholds,
    plain,
    trend,
}: {
    m: Metrics;
    thresholds: GeoThresholds;
    plain?: boolean;
    // What this row moved by since the previous Snapshot, or null when it has no predecessor.
    // Undefined on the detailed report, where the arrows do not exist at all (#09).
    trend?: MetricTrend | null;
}) {
    const dim = plain ? undefined : 'text-muted-foreground';
    return (
        <>
            <td className="p-2 font-mono">{int(m.installs)}</td>
            <td className="p-2 font-mono">{int(m.regs)}</td>
            <td className="p-2 font-mono">{int(m.sales)}</td>
            <td className={cn('p-2 font-mono', dim)}>{cost(m.epc)}</td>
            <td className={cn('p-2 font-mono', BLOCK_START, !plain && m.revenue > 0 && 'text-success')}>
                {usd(m.revenue)}
                <RowTrend metric="revenue" trend={trend ?? null} />
            </td>
            <td className={cn('p-2 font-mono', dim)}>
                {usd(m.spendPlus)}
                <RowTrend metric="spend" trend={trend ?? null} />
            </td>
            <td
                className={cn(
                    'p-2 font-mono font-semibold',
                    !plain && (m.profit >= 0 ? 'text-success' : 'text-danger')
                )}
            >
                {usdSigned(m.profit)}
                <RowTrend metric="profit" trend={trend ?? null} />
            </td>
            <td
                className={cn(
                    'p-2 font-mono font-semibold',
                    !plain && m.roi !== null && (m.roi >= 0 ? 'text-success' : 'text-danger')
                )}
            >
                {pct(m.roi)}
                <RowTrend metric="roi" trend={trend ?? null} />
            </td>
            <CostCell value={m.cpi} pair={thresholds.installs} className={BLOCK_START} plain={plain} trend={trend} />
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
function OffersTable({ title, firstCol, rows, unallocated, thresholds, locale, previous }: OffersTableProps) {
    const hasUnallocated = hasUnallocatedSpend(unallocated);
    const showFooter = showsFooter(rows);
    const unallocatedMetrics = metricsFor(unallocated);
    const totals = rollUpRows(rows, unallocated);

    // The previous Snapshot's rows, by offer id. An offer that only appeared in this push has no
    // predecessor and therefore no arrow — a new offer has not "risen", it has arrived.
    const previousRows = new Map<string, Metrics>();
    for (const row of previous?.rows ?? []) {
        previousRows.set(row.key, row.metrics);
    }
    // The footer's own movement, measured against the previous Snapshot rolled up by the very same
    // rule — so the arrow beside a total can never contradict the totals it sits on.
    const totalsTrend = previous ? trendBetween(rollUpRows(previous.rows, previous.unallocated), totals) : null;

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
                                        <span className="text-primary font-mono font-semibold">{row.key}</span>
                                        {row.label && <span className="text-muted-foreground"> {row.label}</span>}
                                    </td>
                                    <MetricCells
                                        m={row.metrics}
                                        thresholds={thresholds}
                                        trend={trendBetween(previousRows.get(row.key) ?? null, row.metrics)}
                                    />
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
                                <MetricCells m={totals} thresholds={thresholds} plain trend={totalsTrend} />
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
