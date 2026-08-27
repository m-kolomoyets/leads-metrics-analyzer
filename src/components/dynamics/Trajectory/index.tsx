import type { CostMetric, SeriesPoint } from '@/lib/domain/dynamics';
import type { DynamicsMode, FigureMetric } from '../types';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TrajectoryCard } from '@/components/charts/TrajectoryCard';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/Accordion';
import { trajectoryProps } from '../utils/chartProps';
import { toggleCostMetric } from '../utils/costSelection';
import { METRIC_FORMAT, METRIC_LABEL, metricValue } from '../utils/metrics';
import { MetricControls } from '../MetricControls';
import { PointTooltip } from '../PointTooltip';

// The day's Trajectory (SPEC §6.6), drawn by the whole-day chart card. Everything on screen here is
// worked out by `trajectoryProps` before the card is handed it — the rows, the graded series, both
// tick arrays and both domains — so this component arranges and does not compute (ADR-0025).
//
// The zone mechanic is the point. A cost line is graded against THAT Snapshot's own frozen
// thresholds (ADR-0002/0015), so a buyer editing a preset at noon never repaints the morning, and a
// line cooling red → amber → green says "this buyer is fixing it" with no numbers read at all.
// Colour is therefore spoken for, and several cost lines are told apart by DASH; the right axis
// takes no grade, because there are no thresholds for money or ROI.
//
// The mode toggle changes what the points ARE, not how they are drawn: the builder hands back the
// same shape holding intervals instead of totals, and the tooltip's wording follows it.

type TrajectoryProps = {
    // One Geo's trajectory, oldest first — `buildSeries` output. Always the cumulative Series: the
    // mode is applied inside the builder, so the strip beside it keeps reading the day as it happened.
    points: SeriesPoint[];
    mode: DynamicsMode;
    // Which lines to draw, owned by the caller. The Metric strip is a sibling of this chart rather
    // than a part of it, and two controls pointing at one selection means the selection cannot live
    // inside either of them.
    costMetrics: CostMetric[];
    figure: FigureMetric;
    onCostMetricsChange: (metrics: CostMetric[]) => void;
    onFigureChange: (metric: FigureMetric) => void;
};

function Trajectory({ points, mode, costMetrics, figure, onCostMetricsChange, onFigureChange }: TrajectoryProps) {
    const navigate = useNavigate();
    // Folded away by default: the chart is the deepest read on the page and the tables under it are
    // the everyday one, so it opens on request rather than pushing them below the fold every time.
    const [open, setOpen] = useState<unknown[]>([]);

    const props = trajectoryProps({ points, mode, costMetrics, figure });
    const plotted = props.points;

    function toggleCost(metric: CostMetric) {
        onCostMetricsChange(toggleCostMetric(costMetrics, metric));
    }

    // At THIS Snapshot, never the latest: a lead who sees CPI spike at 15:00 and is handed the 17:00
    // report has been shown exactly the wrong thing.
    function openReport(index: number) {
        const point = plotted[index];

        if (point === undefined) {
            return;
        }

        void navigate({
            to: '/dashboard/report/$snapshotId',
            params: { snapshotId: point.snapshotId },
            search: { geo: point.geo, from: 'dynamics' },
        });
    }

    // The caller decides what an empty day looks like (`BuyerDay` shows tiles or a note); this is the
    // chart refusing to index into a series it was handed by mistake, not a second empty state.
    if (points.length === 0) {
        return null;
    }

    // What the plot says, said in words for a reader who cannot see it. It names both axes because
    // which metric is on which side is the one thing a description of this chart cannot leave out.
    const description = `${mode === 'delta' ? 'Between-report' : 'Cumulative'} trajectory of ${points[0].geo} across ${plotted.length} pushes. Left axis: ${costMetrics
        .map((metric) => {
            return METRIC_LABEL[metric];
        })
        .join(', ')}. Right axis: ${METRIC_LABEL[figure]}.`;

    // The metric the keyboard reads out as it walks: the first cost line, which is the one the marker
    // and the tooltip lead with too. Announcing all four would turn one arrow press into a paragraph.
    const spoken = costMetrics[0] ?? figure;

    // Where the keyboard is, said the way the surface says it: a cost is a bare two-decimal number,
    // money carries its currency, ROI its percent sign. The clock is the row's own label, so the
    // spoken reading and the time axis can never drift apart.
    function describePoint(index: number) {
        const point = plotted[index];

        if (point === undefined) {
            return '';
        }

        const value = metricValue(point.figures, spoken);
        const reading = value === null ? 'not measured' : METRIC_FORMAT[spoken].value(value);

        return `${METRIC_LABEL[spoken]} ${reading} at ${props.rows[index]?.label ?? ''}, push ${index + 1} of ${plotted.length}`;
    }

    return (
        <Accordion
            value={open}
            onValueChange={(next) => {
                setOpen(next);
            }}
        >
            <AccordionItem value="trajectory">
                <AccordionHeader>
                    <AccordionTrigger className="text-sm font-semibold tracking-widest uppercase">
                        Trajectory
                    </AccordionTrigger>
                </AccordionHeader>

                <AccordionPanel>
                    <div className="flex flex-col gap-3 pt-3">
                        <MetricControls
                            costMetrics={costMetrics}
                            figure={figure}
                            onToggleCost={toggleCost}
                            onSelectFigure={onFigureChange}
                        />

                        {/* The card brings its own panel; here it is already inside one, and two
                            nested surfaces read as a box in a box. */}
                        <TrajectoryCard
                            className="border-0 bg-transparent p-0"
                            costDomain={props.costDomain}
                            costTick={METRIC_FORMAT[costMetrics[0] ?? 'cpi'].axis}
                            costTicks={props.costTicks}
                            describePoint={describePoint}
                            description={description}
                            figureDomain={props.figureDomain}
                            figureTick={METRIC_FORMAT[figure].axis}
                            figureTicks={props.figureTicks}
                            // The description says what the plot draws; this says what the keys do,
                            // because a reader who has just tabbed onto a chart has no other way to
                            // find out that it walks.
                            label={`${description} Arrow keys walk the pushes, Enter opens that push's report.`}
                            renderTooltip={(index) => {
                                const point = plotted[index];

                                if (point === undefined) {
                                    return null;
                                }

                                return (
                                    <PointTooltip
                                        metric={costMetrics[0] ?? figure}
                                        mode={mode}
                                        point={point}
                                        position={index + 1}
                                        previous={plotted[index - 1] ?? null}
                                        total={plotted.length}
                                    />
                                );
                            }}
                            rows={props.rows}
                            series={props.series}
                            onSelectPoint={openReport}
                        />
                    </div>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

export { Trajectory };
