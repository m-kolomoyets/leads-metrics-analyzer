import type { SeriesPoint } from '@/lib/domain/dynamics';
import { compareFigures } from '@/lib/domain/dynamics';
import { kyivClock } from '@/lib/utils/kyivDay';
import { SectionCard } from '@/components/report/SectionCard';
import { METRIC_FORMAT, METRIC_LABEL } from '../utils/metrics';
import { TrendArrow } from '../TrendArrow';

// The comparison panel (SPEC §6.5): the two most recent pushes of the selected Geo, side by side —
// "what changed since last time", without reading the chart.
//
// Three stacked lines per metric: the figure now at full weight, what moved beneath it, and the
// figure before at half opacity. Every number comes from the dynamics domain module and every label
// and format from the shared metric table, so a CPI cannot read one way here and another on the
// chart — this file lays out, and computes nothing.

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
        <SectionCard label="Since the last push" className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs">
                {previous === null
                    ? // One push so far: the day arrived in one piece, which is normal in the morning
                      // and is not a missing second half.
                      'first report today'
                    : `compared with ${previousClock ?? 'the previous push'}`}
            </p>

            {/* One card, divided inside it — not eight cards. The eight readings are a single
                statement ("what changed since the last push"), and eight hairline borders would
                argue with the section cards under them for the same attention (ADR-0021). What
                separates one metric from the next is the same device the report's tables use: a
                hairline, drawn here as a one-pixel gap over the border colour, so it appears
                BETWEEN cells and never along the panel's own edges — which is what a `border-l`
                cannot promise once the row can wrap.

                Wrapping flex, not columns: a money amount is never broken, so every cell is as wide
                as its own longest line, grows into the leftover, and the row breaks when the next
                metric would not fit. Every row is filled by the growing (no cell may be `shrink`),
                which is also what keeps the divider colour behind them from showing through as a
                block at the end of a short last row. */}
            <dl className="bg-border flex flex-wrap gap-px">
                {rows.map((row) => {
                    const format = METRIC_FORMAT[row.metric];

                    return (
                        <div
                            key={row.metric}
                            className="bg-surface flex grow flex-col gap-0.5 px-4 py-2 whitespace-nowrap first:pl-0 last:pr-0"
                        >
                            <dt className="text-muted-foreground text-xs">{METRIC_LABEL[row.metric]}</dt>

                            {/* The figure now, carrying the weight — the number a buyer is looking for. */}
                            <dd className="text-base leading-tight font-semibold tabular-nums">
                                {format.value(row.current)}
                            </dd>

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
                                    <dd className="text-muted-foreground text-xs leading-tight tabular-nums">
                                        {format.value(row.previous)}
                                    </dd>
                                </>
                            )}
                        </div>
                    );
                })}
            </dl>
        </SectionCard>
    );
}

export { ComparisonPanel };
