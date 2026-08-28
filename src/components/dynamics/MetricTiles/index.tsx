import type { DynamicsMetric, SeriesPoint } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';
import { hasZone, thresholdPairOf, zoneOfPoint } from '@/lib/domain/dynamics';
import { cn } from '@/lib/utils/cn';
import { Figure } from '@/components/Figure';
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
        // The same card every analysis section wears (SectionCard), so the tiles sit on the page the
        // way the tables under them do.
        <SectionCard label="The day so far" className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs">
                first report today — one push is not yet a trajectory, so there is no chart to draw
            </p>

            {/* Same sized tracks as the comparison panel: a tile holds a large figure and a
                threshold line under it, and neither may be cut to fit a column count somebody
                picked off the viewport. */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-3">
                {TILE_METRICS.map((metric) => {
                    const value = metricValue(point.figures, metric);
                    const zone = zoneOfTile(point, metric, value);
                    const pair = hasZone(metric) ? thresholdPairOf(metric, point.thresholds) : null;

                    return (
                        <div key={metric} className={cn('rounded-md border p-3', ZONE_CARD_CLASS[zone])}>
                            {/* One readout, the app's own (`Figure`): label, figure, and the plan
                                beside the fact from this push's own frozen copy — the same reason the
                                chart's tooltip carries it. An ungraded tile keeps `--foreground`:
                                `neutral` is the absence of a grade, not a grade to paint. */}
                            <Figure
                                label={METRIC_LABEL[metric]}
                                value={METRIC_FORMAT[metric].value(value)}
                                size="lg"
                                className={zone === 'neutral' ? undefined : ZONE_TEXT_CLASS[zone]}
                                meta={
                                    pair !== null ? (
                                        <>
                                            green &lt; {cost(pair.gy)} · red &gt; {cost(pair.yr)}
                                        </>
                                    ) : undefined
                                }
                            />
                        </div>
                    );
                })}
            </div>
        </SectionCard>
    );
}

export { MetricTiles };
