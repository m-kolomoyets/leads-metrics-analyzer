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
        // Three layouts and no others: 4-up, 2x2, stacked. The count is chosen by the STRIP's own
        // width (`@container`), never the viewport's, and never by letting the cards find their own
        // wrap points — free wrapping is what produces 3+1, a row of three beside an orphan, which
        // reads as a layout that broke rather than one that adapted.
        //
        // The 4-up threshold is deliberately late (92rem): a card is a figure at reading size next
        // to a 160px plot, and the widest of them — a six-figure profit — needs about 22rem to say
        // so. Below that, two cards to a row, each half the row minus the gap.
        //
        // `min-w-fit` stays under all three as the floor: a card is never squeezed below the width
        // its own content needs, so nothing is ever clipped or broken across lines.
        <div className="@container/strip flex flex-wrap gap-3" aria-label="Metric strip" role="group">
            {stripCards(points).map((card) => {
                return (
                    <MetricCard
                        key={card.metric}
                        className="min-w-fit grow basis-full @md/strip:basis-[calc(50%-0.375rem)] @min-[92rem]/strip:basis-[calc(25%-0.5625rem)]"
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
