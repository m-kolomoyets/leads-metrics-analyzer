import type { Locale } from '@/components/report/utils/i18n';
import type { Metrics } from '@/lib/domain/aggregate';
import type { CreativeRow } from '@/lib/domain/creatives';
import type { MetricTrend } from '@/lib/domain/dynamics';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import { trendBetween } from '@/lib/domain/dynamics';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { RowTrend } from '@/components/dynamics/RowTrend';
import { ZONE_ACCENT_CLASS, ZONE_TEXT_CLASS } from '@/components/report/constants';
import { cost, ctrPct, flagEmoji, int, pct, usd, usdSigned } from '@/components/report/utils/format';
import { ui, verdictWhy } from '@/components/report/utils/i18n';
import { rollUpRows, showsFooter } from '@/components/report/utils/rollup';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

type CreativeTableProps = {
    rows: CreativeRow[];
    thresholds: GeoThresholds;
    locale: Locale;
    geo: string;
    // The same table one Snapshot earlier, when the page has one to compare against (Dynamics, #09).
    // Absent on the detailed report, which shows one Snapshot and has nothing to compare to.
    previous?: CreativeRow[];
};

// Column groups. A `border-l` on the first column of each block draws the divider across head, body
// and foot. Funnel counts (Clicks…EPC) | money | cost-per | impression rates.
const BLOCK_START = 'border-l';

// Block-start columns: Rev, CPI and CTR open blocks 2/3/4 (block 1 runs Clicks…EPC).
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
    { label: 'CTR', start: true },
    { label: 'CPM' },
];

// A zone-graded cost cell (CPI/CPR/CPS) on the creative's Spend⁺ (real) + allocated funnel.
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
        return (
            <TableCell isNumeric className={className}>
                —
            </TableCell>
        );
    }
    const zone = plain ? undefined : ZONE_TEXT_CLASS[zoneFor(value, pair)];
    return (
        <TableCell isNumeric className={cn(zone, className)}>
            {cost(value)}
            <RowTrend metric="cpi" trend={trend ?? null} />
        </TableCell>
    );
}

// The metric cells shared by a data row and the totals footer. Counts/money come off the allocated
// funnel; CTR/CPM are computed against REAL impressions, so they arrive as props rather than being
// derived from Metrics. `plain` (footer) drops every tint so the sums/avg render in the default
// foreground.
function MetricCells({
    m,
    ctr,
    cpm,
    thresholds,
    plain,
    trend,
}: {
    m: Metrics;
    ctr: number | null;
    cpm: number | null;
    thresholds: GeoThresholds;
    plain?: boolean;
    // What this row moved by since the previous Snapshot, or null when it has no predecessor.
    // Undefined on the detailed report, where the arrows do not exist at all (#09).
    trend?: MetricTrend | null;
}) {
    const dim = plain ? undefined : 'text-muted-foreground';
    return (
        <>
            <TableCell isNumeric>{int(m.linkClicks)}</TableCell>
            <TableCell isNumeric>{int(m.installs)}</TableCell>
            <TableCell isNumeric>{int(m.regs)}</TableCell>
            <TableCell isNumeric>{int(m.sales)}</TableCell>
            <TableCell isNumeric className={dim}>
                {cost(m.epc)}
            </TableCell>
            <TableCell isNumeric className={cn(BLOCK_START, !plain && m.revenue > 0 && ZONE_TEXT_CLASS.green)}>
                {usd(m.revenue)}
                <RowTrend metric="revenue" trend={trend ?? null} />
            </TableCell>
            <TableCell isNumeric className={dim}>
                {usd(m.spendPlus)}
                <RowTrend metric="spend" trend={trend ?? null} />
            </TableCell>
            <TableCell
                isNumeric
                className={cn('font-medium', !plain && (m.profit >= 0 ? ZONE_TEXT_CLASS.green : ZONE_TEXT_CLASS.red))}
            >
                {usdSigned(m.profit)}
                <RowTrend metric="profit" trend={trend ?? null} />
            </TableCell>
            <TableCell
                isNumeric
                className={cn(
                    'font-medium',
                    !plain && m.roi !== null && (m.roi >= 0 ? ZONE_TEXT_CLASS.green : ZONE_TEXT_CLASS.red)
                )}
            >
                {pct(m.roi)}
                <RowTrend metric="roi" trend={trend ?? null} />
            </TableCell>
            <CostCell value={m.cpi} pair={thresholds.installs} className={BLOCK_START} plain={plain} trend={trend} />
            <CostCell value={m.cpr} pair={thresholds.regs} plain={plain} />
            <CostCell value={m.cps} pair={thresholds.sales} plain={plain} />
            <TableCell isNumeric className={cn(BLOCK_START, dim)}>
                {ctrPct(ctr)}
            </TableCell>
            <TableCell isNumeric className={dim}>
                {cpm === null ? '—' : usd(cpm)}
            </TableCell>
        </>
    );
}

// #35 · Per-Geo Creative analysis table. One row per creative, verdict-zone striped on the left.
// Impressions are real per creative; every money figure is Spend⁺ (commission-inclusive), the funnel
// allocated. The footer rolls every row up via metricsFor(Σ totals) — counts/money summed,
// EPC/ROI/cost-per re-derived, CTR/CPM re-derived on Σ real impressions — so it obeys the same
// Spend⁺ arithmetic as the cells above it. Hidden for a single row, where the total would repeat it.
function CreativeTable({ rows, thresholds, locale, geo, previous }: CreativeTableProps) {
    if (rows.length === 0) {
        return null;
    }

    const showFooter = showsFooter(rows);
    const totals = rollUpRows(rows);
    const impressions = rows.reduce((sum, row) => {
        return sum + row.impressions;
    }, 0);

    // The previous Snapshot's rows, by creative key. A creative first launched in this push has no
    // predecessor and therefore no arrow.
    const previousRows = new Map<string, Metrics>();
    for (const row of previous ?? []) {
        previousRows.set(row.key, row.metrics);
    }
    // The footer's own movement, against the previous Snapshot rolled up by the very same rule.
    const totalsTrend = previous ? trendBetween(rollUpRows(previous), totals) : null;

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                {ui('creatives', locale)} · {geo}
            </h3>
            <Table density="compact" className="text-xs">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1.5 p-0" />
                        <TableHead>{ui('creative', locale)}</TableHead>
                        {HEAD_COLS.map((col) => {
                            return (
                                <TableHead key={col.label} isNumeric className={cn(col.start && BLOCK_START)}>
                                    {col.label}
                                </TableHead>
                            );
                        })}
                        <TableHead>{ui('why', locale)}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow key={row.key}>
                                <TableCell className={cn('p-0', ZONE_ACCENT_CLASS[row.verdict.verdict])} />
                                <TableCell>
                                    <span>{flagEmoji(row.cc)}</span> <span className="font-medium">{row.key}</span>
                                </TableCell>
                                <MetricCells
                                    m={row.metrics}
                                    ctr={row.ctr}
                                    cpm={row.cpm}
                                    thresholds={thresholds}
                                    trend={trendBetween(previousRows.get(row.key) ?? null, row.metrics)}
                                />
                                <TableCell className="text-muted-foreground text-xs whitespace-normal">
                                    {verdictWhy(row.verdict, locale)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                {showFooter && (
                    <TableFooter>
                        <TableRow className="font-medium">
                            <TableCell className="p-0" />
                            <TableCell className="text-muted-foreground">{ui('totalAvg', locale)}</TableCell>
                            <MetricCells
                                m={totals}
                                ctr={impressions > 0 ? (totals.linkClicks / impressions) * 100 : null}
                                cpm={impressions > 0 ? (totals.spendPlus / impressions) * 1000 : null}
                                thresholds={thresholds}
                                plain
                                trend={totalsTrend}
                            />
                            <TableCell />
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
            <p className="text-muted-foreground text-xs">{ui('creativeEstimate', locale)}</p>
        </div>
    );
}

export { CreativeTable };
