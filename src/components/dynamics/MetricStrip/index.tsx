import type { DynamicsMetric, SeriesPoint } from '@/lib/domain/dynamics';
import { MetricCard } from '@/components/charts/MetricCard';
import { stripCards } from '../utils/chartProps';

// The strip under the trajectory (SPEC §6.6): ROI · Spend · Profit · CPI, four readings taken in one
// glance — a label, a figure and the day's shape beside it.
//
// It is a navigation control, not a decoration. The chart draws one metric well; the strip says which
// metric is worth drawing. A lead scans four shapes, finds the one bending the wrong way, clicks it,
// and the chart above is already showing it with its zones and its thresholds.
//
// The strip always reads cumulatively, whatever the chart's mode toggle says: it is the day's shape,
// and the toggle is explicitly a chart control.
//
// CPI is the only card that can be wrong, so it is the only one wearing the zone gradient and the
// dotted grid; the other three draw in the accent, because a graded money figure would be a verdict
// nobody wrote (ADR-0019). Selection is chrome — a ring and a lifted surface — for the same reason.

type MetricStripProps = {
    // The selected Geo's trajectory, oldest first — `buildSeries` output, never the deltas.
    points: SeriesPoint[];
    // Which metrics the chart is currently drawing, so the strip can show where the reader is.
    selected: DynamicsMetric[];
    onSelect: (metric: DynamicsMetric) => void;
};

function MetricStrip({ points, selected, onSelect }: MetricStripProps) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Metric strip" role="group">
            {stripCards(points).map((card) => {
                return (
                    <MetricCard
                        key={card.metric}
                        domain={card.domain}
                        label={card.label}
                        selected={selected.includes(card.metric)}
                        tones={card.tones}
                        value={card.value}
                        values={card.values}
                        valueTone={card.valueTone}
                        onSelect={() => {
                            onSelect(card.metric);
                        }}
                    />
                );
            })}
        </div>
    );
}

export { MetricStrip };
