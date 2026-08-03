import type { Locale } from '@/components/report/utils/i18n';
import type { Metrics } from '@/lib/domain/aggregate';
import type { CreativeRow } from '@/lib/domain/creatives';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import { metricsFor, sumTotals } from '@/lib/domain/aggregate';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { ZONE_ACCENT_CLASS, ZONE_TEXT_CLASS } from '@/components/report/constants';
import { cost, ctrPct, flagEmoji, int, pct, usd, usdSigned } from '@/components/report/utils/format';
import { ui, verdictWhy } from '@/components/report/utils/i18n';

type CreativeTableProps = {
    rows: CreativeRow[];
    thresholds: GeoThresholds;
    locale: Locale;
    geo: string;
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
}: {
    m: Metrics;
    ctr: number | null;
    cpm: number | null;
    thresholds: GeoThresholds;
    plain?: boolean;
}) {
    const dim = plain ? undefined : 'text-muted-foreground';
    return (
        <>
            <td className="p-2 font-mono">{int(m.linkClicks)}</td>
            <td className="p-2 font-mono">{int(m.installs)}</td>
            <td className="p-2 font-mono">{int(m.regs)}</td>
            <td className="p-2 font-mono">{int(m.sales)}</td>
            <td className={cn('p-2 font-mono', dim)}>{cost(m.epc)}</td>
            <td className={cn('p-2 font-mono', BLOCK_START, !plain && m.revenue > 0 && 'text-success')}>
                {usd(m.revenue)}
            </td>
            <td className={cn('p-2 font-mono', dim)}>{usd(m.spendPlus)}</td>
            <td className={cn('p-2 font-mono font-bold', !plain && (m.profit >= 0 ? 'text-success' : 'text-danger'))}>
                {usdSigned(m.profit)}
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
            <td className={cn('p-2 font-mono', BLOCK_START, dim)}>{ctrPct(ctr)}</td>
            <td className={cn('p-2 font-mono', dim)}>{cpm === null ? '—' : usd(cpm)}</td>
        </>
    );
}

// #35 · Per-Geo Creative analysis table. One row per creative, verdict-zone striped on the left.
// Impressions are real per creative; every money figure is Spend⁺ (commission-inclusive), the funnel
// allocated. The footer rolls every row up via metricsFor(Σ totals) — counts/money summed,
// EPC/ROI/cost-per re-derived, CTR/CPM re-derived on Σ real impressions — so it obeys the same
// Spend⁺ arithmetic as the cells above it. Hidden for a single row, where the total would repeat it.
function CreativeTable({ rows, thresholds, locale, geo }: CreativeTableProps) {
    if (rows.length === 0) {
        return null;
    }

    const showFooter = rows.length > 1;
    const totals = metricsFor(
        sumTotals(
            rows.map((row) => {
                return row.metrics;
            })
        )
    );
    const impressions = rows.reduce((sum, row) => {
        return sum + row.impressions;
    }, 0);

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">
                {ui('creatives', locale)} · {geo}
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs">
                    <thead>
                        <tr className="text-muted-foreground border-b">
                            <th className="w-1.5 p-0" />
                            <th className="p-2 text-left font-normal whitespace-nowrap">{ui('creative', locale)}</th>
                            {HEAD_COLS.map((col) => {
                                return (
                                    <th key={col.label} className={cn('p-2 font-normal', col.start && BLOCK_START)}>
                                        {col.label}
                                    </th>
                                );
                            })}
                            <th className="p-2 text-left font-normal whitespace-nowrap">{ui('why', locale)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            return (
                                <tr key={row.key} className="border-b">
                                    <td className={cn('p-0', ZONE_ACCENT_CLASS[row.verdict.verdict])} />
                                    <td className="p-2 text-left whitespace-nowrap">
                                        <span className="text-base">{flagEmoji(row.cc)}</span>{' '}
                                        <span className="font-mono font-semibold">{row.key}</span>
                                    </td>
                                    <MetricCells m={row.metrics} ctr={row.ctr} cpm={row.cpm} thresholds={thresholds} />
                                    <td className="text-muted-foreground p-2 text-left text-[11px]">
                                        {verdictWhy(row.verdict, locale)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    {showFooter && (
                        <tfoot>
                            <tr className="border-t-2 font-semibold">
                                <td className="p-0" />
                                <td className="text-muted-foreground p-2 text-left whitespace-nowrap">
                                    {ui('totalAvg', locale)}
                                </td>
                                <MetricCells
                                    m={totals}
                                    ctr={impressions > 0 ? (totals.linkClicks / impressions) * 100 : null}
                                    cpm={impressions > 0 ? (totals.spendPlus / impressions) * 1000 : null}
                                    thresholds={thresholds}
                                    plain
                                />
                                <td className="p-2" />
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            <p className="text-muted-foreground text-[10px]">{ui('creativeEstimate', locale)}</p>
        </div>
    );
}

export { CreativeTable };
