import type { DynamicsMetric, SeriesPoint } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';
import { hasZone, thresholdPairOf, zoneOfPoint } from '@/lib/domain/dynamics';
import { cn } from '@/lib/utils/cn';
import { ZONE_CARD_CLASS, ZONE_TEXT_CLASS } from '@/components/report/constants';
import { SectionCard } from '@/components/report/SectionCard';
import { cost } from '@/components/report/utils/format';
import { roiZone } from '@/components/report/utils/zones';
import { METRIC_FORMAT, METRIC_LABEL, metricValue } from '../utils/metrics';

// What the chart area shows when a buyer has pushed exactly once (SPEC §6.6). One push is not a
// trajectory — there is no interval, no slope and no second point — so the chart is hidden rather
// than drawn as a lone dot, and the day so far is shown at the size it deserves.
//
// The tiles are graded, which is the reason this is not just the comparison panel again: a first
// report with a red CPI is worth walking over for, and the colour says so before the number is read.

const TILE_METRICS: DynamicsMetric[] = ['spend', 'revenue', 'profit', 'roi', 'cpi', 'cpr', 'cps', 'cpc'];

// A tile's grade, from the only sources entitled to give one: the Snapshot's own frozen thresholds
// for a cost (ADR-0002), and the fixed reference ROI bands the Geo header already uses. Money is
// ungraded — there are no thresholds for income — except that a loss is a loss.
function zoneOfTile(point: SeriesPoint, metric: DynamicsMetric, value: number | null): Zone {
    if (hasZone(metric)) {
        return zoneOfPoint(point, metric);
    }
    if (metric === 'roi') {
        return roiZone(value);
    }
    if (metric === 'profit' && value !== null) {
        return value < 0 ? 'red' : 'neutral';
    }
    return 'neutral';
}

type MetricTilesProps = {
    // The only push of the day.
    point: SeriesPoint;
};

function MetricTiles({ point }: MetricTilesProps) {
    return (
        // The same tinted glass panel every analysis section wears (SectionCard): a bare bordered box
        // read as a hole in the page next to the tables under it.
        <SectionCard label="The day so far" className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs">
                first report today — one push is not yet a trajectory, so there is no chart to draw
            </p>

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TILE_METRICS.map((metric) => {
                    const value = metricValue(point.figures, metric);
                    const zone = zoneOfTile(point, metric, value);
                    const pair = hasZone(metric) ? thresholdPairOf(metric, point.thresholds) : null;

                    return (
                        <div
                            key={metric}
                            className={cn('flex flex-col gap-0.5 rounded-lg border p-3', ZONE_CARD_CLASS[zone])}
                        >
                            <dt className="text-muted-foreground text-[11px] tracking-widest uppercase">
                                {METRIC_LABEL[metric]}
                            </dt>
                            <dd className={cn('font-mono text-2xl font-bold', ZONE_TEXT_CLASS[zone])}>
                                {METRIC_FORMAT[metric].value(value)}
                            </dd>

                            {/* The plan beside the fact, from this push's own frozen copy — the same
                                reason the chart's tooltip carries it. */}
                            {pair !== null && (
                                <dd className="text-muted-foreground font-mono text-[10px]">
                                    green &lt; {cost(pair.gy)} · red &gt; {cost(pair.yr)}
                                </dd>
                            )}
                        </div>
                    );
                })}
            </dl>
        </SectionCard>
    );
}

export { MetricTiles };
