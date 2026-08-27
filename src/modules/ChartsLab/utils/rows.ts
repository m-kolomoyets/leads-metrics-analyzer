import type { TrajectoryRow } from '@/components/charts/TrajectoryCard';
import type { ChartSeries, ChartTone } from '@/components/charts/types';
import type { CostMetric, SeriesPoint } from '@/lib/domain/dynamics';
import { COST_METRICS, zoneOfPoint } from '@/lib/domain/dynamics';
import { COST_DASH } from '@/components/dynamics/TrajectoryChart/constants';
import { METRIC_LABEL } from '@/components/dynamics/utils/metrics';

// The lab's adapter: domain points in, chart-shaped props out. It lives here rather than in
// `components/charts` because that is the whole point of the new namespace — the primitives take
// numbers and grades, and knowing that a `cpi` is graded against a Snapshot's frozen thresholds is
// this page's job, not theirs.

// The clock the axis reads. The stamps are UTC in the fixture and the label is the hour, which is all
// a day-shaped axis needs.
function labelOf(point: SeriesPoint): string {
    return point.takenAt.slice(11, 16);
}

export function trajectoryRows(points: SeriesPoint[]): TrajectoryRow[] {
    return points.map((point, index) => {
        return {
            // Carried on the row so the tooltip can find its way back to the SeriesPoint. Recharts
            // hands the row object to the tooltip and nothing else — without this the tooltip would
            // have to match on the label, and two pushes in the same minute share one.
            index,
            label: labelOf(point),
            cpi: point.figures.cpi,
            cpr: point.figures.cpr,
            cps: point.figures.cps,
            cpc: point.figures.cpc,
            revenue: point.figures.revenue,
        };
    });
}

function tonesFor(points: SeriesPoint[], metric: CostMetric): ChartTone[] {
    return points.map((point) => {
        return zoneOfPoint(point, metric);
    });
}

// One series per selected cost metric, plus the right-axis figure. The cost lines carry grades and
// therefore gradients; the figure carries none, because there are no thresholds for money.
export function trajectorySeries(points: SeriesPoint[], selected: CostMetric[]): ChartSeries[] {
    const costs: ChartSeries[] = COST_METRICS.filter((metric) => {
        return selected.includes(metric);
    }).map((metric) => {
        return {
            dataKey: metric,
            label: METRIC_LABEL[metric],
            tones: tonesFor(points, metric),
            dash: COST_DASH[metric],
            axis: 'cost',
        };
    });

    return [...costs, { dataKey: 'revenue', label: METRIC_LABEL.revenue, axis: 'figure' }];
}
