import type { DynamicsMetric, SeriesPoint } from '@/lib/domain/dynamics';
import { compareFigures } from '@/lib/domain/dynamics';
import { kyivClock } from '@/lib/utils/kyivDay';
import { cost, costSigned, DASH, pct, usd, usdSigned } from '@/components/report/utils/format';
import { TrendArrow } from '../TrendArrow';

// The comparison panel (SPEC §6.5): the two most recent pushes of the selected Geo, side by side —
// "what changed since last time", without reading the chart.
//
// Three stacked lines per metric: the figure now at full weight, what moved beneath it, and the
// figure before at half opacity. Every number comes from the dynamics domain module — this file
// formats and lays out, and computes nothing.

const METRIC_LABEL: Record<DynamicsMetric, string> = {
    spend: 'Spend',
    revenue: 'Revenue',
    profit: 'Profit',
    roi: 'ROI',
    cpi: 'CPI',
    cpr: 'CPR',
    cps: 'CPS',
    cpc: 'CPC',
};

// Money and costs read differently: a Profit carries its sign at rest, a Spend does not, and a
// cost-per is a bare two-decimal figure the way the report's tables already show it.
function money(value: number | null): string {
    return value === null ? DASH : usd(value);
}

function moneySigned(value: number | null): string {
    return value === null ? DASH : usdSigned(value);
}

type MetricFormat = {
    value: (value: number | null) => string;
    change: (value: number | null) => string;
};

const MONEY_FORMAT: MetricFormat = { value: money, change: moneySigned };
const COST_FORMAT: MetricFormat = { value: cost, change: costSigned };

const FORMAT: Record<DynamicsMetric, MetricFormat> = {
    spend: MONEY_FORMAT,
    revenue: MONEY_FORMAT,
    profit: { value: moneySigned, change: moneySigned },
    roi: { value: pct, change: pct },
    cpi: COST_FORMAT,
    cpr: COST_FORMAT,
    cps: COST_FORMAT,
    cpc: COST_FORMAT,
};

// The push's wall clock in Kyiv, or null when the stamp will not parse — a panel that cannot name
// the time it compares against still compares correctly.
function clockOf(takenAt: string): string | null {
    const instant = new Date(takenAt);

    return Number.isNaN(instant.getTime()) ? null : kyivClock(instant);
}

type ComparisonPanelProps = {
    // The selected Geo's trajectory, oldest first — `buildSeries` output. The panel reads its last
    // two points and ignores the rest; the chart is what draws the whole day.
    points: SeriesPoint[];
};

function ComparisonPanel({ points }: ComparisonPanelProps) {
    const current = points.at(-1) ?? null;
    const previous = points.at(-2) ?? null;

    // No push froze this market today. The block is replaced rather than rendered empty: a row of
    // em dashes reads as broken data, and there is no data at all.
    if (!current) {
        return <p className="text-muted-foreground text-sm">No reports for this period.</p>;
    }

    const rows = compareFigures(previous?.figures ?? null, current.figures);
    const previousClock = previous === null ? null : clockOf(previous.takenAt);

    return (
        <section className="border-border flex flex-col gap-3 rounded-lg border p-4" aria-label="Since the last push">
            <p className="text-muted-foreground text-xs">
                {previous === null
                    ? // One push so far: the day arrived in one piece, which is normal in the morning
                      // and is not a missing second half.
                      'first report today'
                    : `compared with ${previousClock ?? 'the previous push'}`}
            </p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 xl:grid-cols-8">
                {rows.map((row) => {
                    const format = FORMAT[row.metric];

                    return (
                        <div key={row.metric} className="flex flex-col gap-0.5">
                            <dt className="text-muted-foreground text-xs">{METRIC_LABEL[row.metric]}</dt>

                            {/* The figure now, carrying the weight — the number a buyer is looking for. */}
                            <dd className="font-mono text-lg leading-tight font-bold">{format.value(row.current)}</dd>

                            {previous !== null && (
                                <>
                                    <dd className="text-sm leading-tight">
                                        <TrendArrow
                                            metric={row.metric}
                                            change={row.change}
                                            label={format.change(row.change)}
                                        />
                                    </dd>

                                    {/* Where it came from: present, so the movement can be checked,
                                        but never competing with the figure above it. */}
                                    <dd className="font-mono text-xs leading-tight opacity-50">
                                        {format.value(row.previous)}
                                    </dd>
                                </>
                            )}
                        </div>
                    );
                })}
            </dl>
        </section>
    );
}

export { ComparisonPanel };
