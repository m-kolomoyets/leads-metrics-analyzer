import type { DynamicsMetric, SeriesPoint } from '@/lib/domain/dynamics';
import { METRIC_FORMAT, METRIC_LABEL } from '../utils/metrics';
import { sparklineRows } from './utils/rows';
import { Sparkline } from '../Sparkline';

// The strip under the chart (SPEC §6.6): ROI · Spend · Profit · CPI, four shapes read in one glance.
//
// It is a navigation control, not a decoration. The chart draws one metric well; the strip says which
// metric is worth drawing. A lead scans four lines, finds the one bending the wrong way, clicks it,
// and the chart below is already showing it with its zones and its thresholds.
//
// The strip always reads cumulatively, whatever the chart's mode toggle says: it is the day's shape,
// and the toggle is explicitly a chart control.

type SparklineStripProps = {
    // The selected Geo's trajectory, oldest first — `buildSeries` output, never the deltas.
    points: SeriesPoint[];
    // Which metrics the chart is currently drawing, so the strip can show where the reader is.
    selected: DynamicsMetric[];
    onSelect: (metric: DynamicsMetric) => void;
};

function SparklineStrip({ points, selected, onSelect }: SparklineStripProps) {
    return (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4" aria-label="Metric sparklines" role="group">
            {sparklineRows(points).map((row) => {
                return (
                    <Sparkline
                        key={row.metric}
                        label={METRIC_LABEL[row.metric]}
                        values={row.values}
                        trailing={METRIC_FORMAT[row.metric].value(row.current)}
                        tone={row.tone}
                        selected={selected.includes(row.metric)}
                        onSelect={() => {
                            onSelect(row.metric);
                        }}
                    />
                );
            })}
        </div>
    );
}

export { SparklineStrip };
