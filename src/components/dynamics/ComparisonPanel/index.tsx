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

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 xl:grid-cols-8">
                {rows.map((row) => {
                    const format = METRIC_FORMAT[row.metric];

                    return (
                        <div key={row.metric} className="flex flex-col gap-0.5">
                            <dt className="text-muted-foreground text-xs">{METRIC_LABEL[row.metric]}</dt>

                            {/* The figure now, carrying the weight — the number a buyer is looking for. */}
                            <dd className="font-mono text-lg leading-tight font-semibold">
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
                                    <dd className="font-mono text-xs leading-tight opacity-50">
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
