import type { DeepPartial, TimeChartOptions } from 'lightweight-charts';
import type { CostMetric, SeriesPoint } from '@/lib/domain/dynamics';
import type { ChartPalette, DynamicsMode } from '../types';
import type { ZoneSeriesApi } from '../ZoneSeries/types';
import type { DeltaFlag } from './constants';
import type { ActivePoint, ChartMetric, FigureMetric } from './types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { COST_METRICS, deltaPointsFor, deltasFor, hasZone, zoneOfPoint } from '@/lib/domain/dynamics';
import { cn } from '@/lib/utils/cn';
import { kyivClock } from '@/lib/utils/kyivDay';
import { SectionCard } from '@/components/report/SectionCard';
import { DASH } from '@/components/report/utils/format';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/Accordion';
import { CHART_HEIGHT, COST_DASH, FLAG_GLYPH, FLAG_HINT, FLAG_LABEL, FLAG_STROKE } from './constants';
import { chartOptionsFor } from '../utils/chartOptions';
import { METRIC_FORMAT, METRIC_LABEL, metricValue } from '../utils/metrics';
import { flagsFor, seriesDataFor, timesOf } from './utils/series';
import { useChartInstance } from '../hooks/useChartInstance';
import { useChartPalette } from '../hooks/useChartPalette';
import { MetricControls } from './components/MetricControls';
import { PointTooltip } from './components/PointTooltip';
import { SparklineStrip } from '../SparklineStrip';
import { ZoneSeries } from '../ZoneSeries';

// The trajectory chart (SPEC §6.6), drawn by Lightweight Charts with ONE part of the painting kept:
// the zone-graded stroke, which is a custom series of ours (`ZoneSeries`). The library owns the
// scales, the crosshair, the time axis and the panning; we own the only thing it cannot express — a
// segment that starts red and ends green.
//
// The zone mechanic is the entire point. A marker is filled with the zone its value falls into,
// graded against THAT Snapshot's own frozen thresholds (ADR-0002/0015), so a buyer editing a preset
// at noon never repaints the morning. A segment across zones is a real gradient, so a line cooling
// red → amber → green says "this buyer is fixing it" with no numbers read at all.
//
// Colour is spoken for, so several cost lines are told apart by DASH. The right axis takes no zone —
// there are no thresholds for money or ROI — and a restated interval is faded, because it is a weaker
// claim rather than no claim.
//
// The mode toggle changes what the points ARE, not how they are drawn: `deltaPointsFor` hands back
// the same shape holding intervals instead of totals. Delta mode adds one thing of its own — a lane
// of edge-case flags, because a gap in the line with no explanation is the failure this chart exists
// to avoid.
//
// Canvas has no DOM, so the drill-in that WAS a row of focusable links is rebuilt here: the plot is a
// single focusable widget, arrow keys walk the pushes, Enter opens the report of the one in hand, and
// a live region says what is in hand. Everything a pointer can do here, a keyboard can do.

const FLAGS: DeltaFlag[] = ['firstOfDay', 'corrected', 'spendWithoutConversions'];

// How far the tooltip's anchor is kept from either edge — roughly half its own width, so the card
// stays inside the plot instead of being clipped by the panel around it.
const TOOLTIP_INSET = 180;

// Where the tooltip is pinned, in the plot's own pixels. `x` is the card's anchor, pulled back from
// the edges so it cannot be clipped; `pointX` is the push itself, which is where the pulse belongs.
type ActiveAt = ActivePoint & { x: number; pointX: number; y: number };

function clockOf(takenAt: string): string {
    const instant = new Date(takenAt);

    return Number.isNaN(instant.getTime()) ? DASH : kyivClock(instant);
}

// A marker's spoken label reads the figure the way the surface around it does: a cost is a bare
// two-decimal number, money carries its currency, ROI its percent sign.
function spokenValue(metric: ChartMetric, value: number | null): string {
    return value === null ? 'not measured' : METRIC_FORMAT[metric].value(value);
}

type TrajectoryChartProps = {
    // One Geo's trajectory, oldest first — `buildSeries` output. Always the cumulative Series: the
    // mode toggle is applied here, so the sparklines beside it keep reading the day as it happened.
    points: SeriesPoint[];
    mode: DynamicsMode;
};

// The system's options, with only what makes this chart itself laid over them: the horizontal
// crosshair line and the vertical grid are suppressed because neither answers a question a lead has —
// the figure is in the card, and "which push is this" is the vertical line's job (ADR-0020).
function trajectoryOptionsFor(palette: ChartPalette): DeepPartial<TimeChartOptions> {
    const base = chartOptionsFor(palette);

    return {
        ...base,
        grid: { ...base.grid, vertLines: { visible: false } },
        crosshair: {
            ...base.crosshair,
            // No label on the axis: the tooltip already names the push, in words rather than a timestamp.
            vertLine: { ...base.crosshair?.vertLine, labelVisible: false },
            horzLine: { visible: false, labelVisible: false },
        },
        // Both scales carry a metric, and neither carries a border: the card's own edge is the rule.
        leftPriceScale: { ...base.leftPriceScale, visible: true, borderVisible: false },
        rightPriceScale: { ...base.rightPriceScale, visible: true, borderVisible: false },
        timeScale: { ...base.timeScale, timeVisible: true, secondsVisible: false, borderVisible: false },
    };
}

function TrajectoryChart({ points, mode }: TrajectoryChartProps) {
    const navigate = useNavigate();
    const palette = useChartPalette();
    const [costMetrics, setCostMetrics] = useState<CostMetric[]>(['cpi']);
    const [figure, setFigure] = useState<FigureMetric>('revenue');
    const [active, setActive] = useState<ActiveAt | null>(null);
    // Which push the keyboard has in hand. Separate from `active`: a pointer leaving the plot closes
    // the tooltip, and it must not also throw away where the keyboard was.
    const [focused, setFocused] = useState(0);
    // True while the pointer is ON the card. The chart keeps reporting crosshair moves along the
    // card's own edge, which walked the tooltip onto a neighbouring push and back under the cursor —
    // so while the card is being read (or its button aimed at) it holds still.
    const [pinned, setPinned] = useState(false);
    // The panel's state is held here, not left to the primitive, because the chart must not be
    // created inside a collapsed panel: the library sizes itself to its container at creation, and a
    // container of zero height gives a canvas that stays empty after the panel opens.
    const [open, setOpen] = useState<unknown[]>([]);
    const isOpen = open.length > 0;
    // Held in a ref, not in state: the series are the chart's objects rather than React's, and
    // re-rendering when one is created would put the effect that created it straight back on the queue.
    const seriesRef = useRef(new Map<ChartMetric, ZoneSeriesApi>());

    const { containerRef, chart } = useChartInstance(trajectoryOptionsFor(palette), isOpen);

    // `deltasFor` is indexed by point: entry i describes the interval ENDING at point i, which is the
    // segment drawn into it. A restated interval is the faded one, in either mode.
    const corrected = deltasFor(points).map((delta) => {
        return delta.flags.corrected;
    });
    // The only difference the toggle makes. Everything below reads `plotted` and does not care which
    // question it is answering.
    const plotted = mode === 'delta' ? deltaPointsFor(points) : points;
    const times = timesOf(plotted);
    const flags = flagsFor(points, mode);
    const drawn: ChartMetric[] = [...costMetrics, figure];
    // Serialised rather than passed by identity: `plotted` is rebuilt every render, and depending on
    // it would tear the chart down and rebuild it on every unrelated state change.
    const dataKey = `${mode}:${drawn.join(',')}:${plotted
        .map((point) => {
            return point.snapshotId;
        })
        .join(',')}`;

    function toggleCost(metric: CostMetric) {
        setCostMetrics((current) => {
            return current.includes(metric)
                ? current.filter((one) => {
                      return one !== metric;
                  })
                : COST_METRICS.filter((one) => {
                      return one === metric || current.includes(one);
                  });
        });
    }

    // A sparkline is a jump, not an addition: it answers "show me THAT one", so a cost click replaces
    // the cost selection rather than piling a second dashed line onto it.
    function selectFromStrip(metric: ChartMetric) {
        setActive(null);

        if (hasZone(metric)) {
            setCostMetrics([metric]);
            return;
        }

        setFigure(metric);
    }

    // Where a push sits on screen right now, asked of the chart rather than remembered: the plot pans
    // and rescales, and a coordinate cached across either would pin the tooltip to empty space.
    function locate(index: number, metric: ChartMetric): ActiveAt | null {
        const series = seriesRef.current.get(metric);
        const point = plotted[index];

        if (chart === null || series === undefined || point === undefined) {
            return null;
        }

        const value = metricValue(point.figures, metric);
        const x = chart.timeScale().timeToCoordinate(times[index]);
        const y = value === null ? null : series.priceToCoordinate(value);

        if (x === null || y === null || y === undefined) {
            return null;
        }

        // Both coordinates are the PANE's, and the overlay sits on the container — which also holds
        // the price scale down its left edge. Without that offset every marker and card lands one
        // axis-width to the left of the push it belongs to.
        const paneLeft = chart.priceScale('left').width();
        const pointX = x + paneLeft;
        const paneRight = containerRef.current?.clientWidth ?? 0;
        // The panel that holds the plot clips what leaves it, so the card's anchor is pulled back
        // inside: on the first or last push it would otherwise hang half off the edge and be cut.
        const inset = Math.min(TOOLTIP_INSET, paneRight / 2);

        return {
            index,
            metric,
            x: Math.min(Math.max(pointX, inset), Math.max(paneRight - inset, inset)),
            pointX,
            y,
        };
    }

    function openReport(index: number) {
        const point = plotted[index];

        if (point === undefined) {
            return;
        }

        void navigate({
            to: '/dashboard/report/$snapshotId',
            params: { snapshotId: point.snapshotId },
            search: { geo: point.geo },
        });
    }

    function moveTo(index: number) {
        setFocused(index);
        setActive(locate(index, drawn[0]));
    }

    // The keyboard path across a canvas: arrows walk the day, Home and End jump to its ends, Enter
    // opens the report of the push in hand, Escape puts the tooltip away.
    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        const last = plotted.length - 1;

        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            moveTo(Math.min(last, Math.max(0, focused + (event.key === 'ArrowRight' ? 1 : -1))));
            return;
        }

        if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            moveTo(event.key === 'Home' ? 0 : last);
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            openReport(focused);
            return;
        }

        if (event.key === 'Escape') {
            setActive(null);
        }
    }

    // Theme tokens resolve to real colours only in the browser, and they change under the app's own
    // light/dark switch — so the chrome is re-applied whenever the palette does.
    useEffect(
        function applyPalette() {
            chart?.applyOptions(trajectoryOptionsFor(palette));
        },
        [chart, palette]
    );

    useEffect(
        function drawSeries() {
            if (chart === null) {
                return;
            }

            // A metric that left the selection takes its line with it: leaving it behind would keep a
            // dashed CPR on screen after its checkbox was cleared.
            for (const [metric, series] of seriesRef.current) {
                if (!drawn.includes(metric)) {
                    chart.removeSeries(series);
                    seriesRef.current.delete(metric);
                }
            }

            drawn.forEach((metric, position) => {
                const graded = hasZone(metric);
                const series =
                    seriesRef.current.get(metric) ??
                    chart.addCustomSeries(new ZoneSeries(), {
                        priceScaleId: graded ? 'left' : 'right',
                        priceLineVisible: false,
                        lastValueVisible: false,
                    });

                seriesRef.current.set(metric, series);

                series.applyOptions({
                    zoneColors: palette.zone,
                    // The right axis draws in the neutral accent at every point; a cost line takes its
                    // colour per segment from the zones at its ends.
                    flatColor: graded ? null : palette.accent,
                    dash: graded ? COST_DASH[metric] : [],
                    // The wash belongs to the money line and to it alone: it is the one flat-coloured
                    // stroke here, and three dashed cost lines each carrying a fill would be mud.
                    areaOpacity: graded ? 0 : 0.14,
                    width: 2,
                    points: 'all',
                    pointRadius: 4.5,
                    pointRing: palette.background,
                    chromeColor: palette.muted,
                    guideColor: palette.guide,
                    // Off until the crosshair goes away — see `markActivePoint`. One line draws it in
                    // any case: two would double its opacity at the same x and read as a solid rule.
                    showGuide: false,
                    priceFormat: {
                        type: 'custom',
                        formatter(value: number) {
                            return METRIC_FORMAT[metric].axis(value);
                        },
                    },
                });

                series.setData(
                    seriesDataFor({
                        points: plotted,
                        times,
                        metric,
                        mode,
                        // Only the first line carries the lane: three metrics each printing the same
                        // glyph under the same push would read as three different problems.
                        withFlags: position === 0,
                        corrected,
                        flags,
                    })
                );
            });

            chart.timeScale().fitContent();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- `dataKey` stands in for the data.
        [chart, dataKey, palette]
    );

    useEffect(
        function markActivePoint() {
            for (const [metric, series] of seriesRef.current) {
                series.applyOptions({
                    activeIndex: active?.index ?? null,
                    // The series' own guide stands in for the crosshair exactly when the crosshair is
                    // gone: the pointer has left the canvas for the card, or the card was opened from
                    // the keyboard. Drawing both at once would print two vertical lines a few pixels
                    // apart.
                    showGuide: metric === drawn[0] && pinned,
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- `dataKey` carries the drawn metrics.
        [active?.index, dataKey, pinned]
    );

    // Hover: the crosshair already knows which push it is over, so the tooltip follows it rather than
    // hit-testing the canvas a second time.
    useEffect(
        function followCrosshair() {
            if (chart === null) {
                return;
            }

            function handleMove(param: { logical?: number; point?: { x: number; y: number } }) {
                // A pointer that left the canvas is not necessarily leaving the chart — it may be on
                // its way to the card's own button. Closing here would snatch it away mid-reach, so
                // the tooltip is dismissed by the plot box's `mouseleave` instead.
                if (param.logical === undefined || param.point === undefined) {
                    return;
                }

                if (pinned) {
                    return;
                }

                setActive(locate(Math.round(param.logical), drawn[0]));
            }

            chart.subscribeCrosshairMove(handleMove);

            return function stopFollowing() {
                chart.unsubscribeCrosshairMove(handleMove);
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- re-subscribed when the data changes.
        [chart, dataKey, pinned]
    );

    // Click: the same drill-in the keyboard's Enter performs, at THIS Snapshot and never the latest.
    useEffect(
        function openOnClick() {
            if (chart === null) {
                return;
            }

            function handleClick(param: { logical?: number }) {
                if (param.logical === undefined) {
                    return;
                }

                openReport(Math.round(param.logical));
            }

            chart.subscribeClick(handleClick);

            return function stopClicks() {
                chart.unsubscribeClick(handleClick);
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- re-subscribed when the data changes.
        [chart, dataKey]
    );

    // The caller decides what an empty day looks like (`BuyerDay` shows tiles or a note); this is the
    // chart refusing to index into a series it was handed by mistake, not a second empty state.
    if (points.length === 0) {
        return null;
    }

    // Only the flags that actually happened get a legend entry: a permanent key for three edge cases
    // that occur on maybe one day in ten would train the reader to ignore the lane.
    const presentFlags =
        mode === 'delta'
            ? FLAGS.filter((flag) => {
                  return flags.some((lane) => {
                      return lane.includes(FLAG_GLYPH[flag]);
                  });
              })
            : [];

    // The ring takes the colour of the point it marks: a red push pulsing in the accent blue would
    // say the opposite of what the marker under it says.
    function colorOfActive(): string {
        const point = active === null ? undefined : plotted[active.index];

        if (active === null || point === undefined || !hasZone(active.metric)) {
            return palette.accent;
        }

        return palette.zone[zoneOfPoint(point, active.metric)];
    }

    const activeColor = colorOfActive();

    const focusedPoint = plotted[focused] ?? plotted[0];
    const focusedValue = metricValue(focusedPoint.figures, drawn[0]);

    return (
        <SectionCard label="Trajectory" className="flex flex-col gap-3">
            {/* Folded away by default (`defaultValue` left empty): the chart is the deepest read on the
                page and the tables under it are the everyday one, so it opens on request rather than
                pushing them below the fold every time. The strip below stays out of the panel — it is
                the day at a glance, and hiding it would leave a collapsed card saying nothing. */}
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
                                onSelectFigure={setFigure}
                            />

                            {/* The plot is one focusable widget rather than a canvas nobody can reach:
                                `application` tells a screen reader the arrow keys belong to it, and the
                                live region below says what they landed on. */}
                            <div
                                className="relative w-full"
                                style={{ height: CHART_HEIGHT }}
                                onMouseLeave={() => {
                                    setPinned(false);
                                    setActive(null);
                                }}
                            >
                                <div ref={containerRef} className="h-full w-full" aria-hidden={true} />

                                {/* The keyboard's handle on a canvas: a real button laid over the plot,
                                    transparent to the pointer so panning and the crosshair still reach
                                    the chart, but in the tab order and carrying the arrow keys. */}
                                <button
                                    type="button"
                                    aria-label={`${mode === 'delta' ? 'Between-report' : 'Cumulative'} trajectory of ${plotted[0].geo} across ${plotted.length} pushes. Arrow keys walk the pushes, Enter opens a report.`}
                                    className="pointer-events-none absolute inset-0 rounded-lg"
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        moveTo(focused);
                                    }}
                                    onBlur={() => {
                                        setActive(null);
                                    }}
                                />

                                {/* The pulse rides the DOM rather than the canvas: animating it in the
                                    renderer would mean repainting every series on every frame, while a
                                    positioned ring costs one compositor layer and honours reduced
                                    motion for free. The canvas halo underneath stays put, so the point
                                    still reads as active when the animation is off. */}
                                {active !== null && (
                                    <span
                                        aria-hidden={true}
                                        className="motion-safe:animate-ping pointer-events-none absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 [animation-duration:1.6s]"
                                        style={{
                                            left: active.pointX,
                                            top: active.y,
                                            background: activeColor,
                                        }}
                                    />
                                )}

                                {active !== null && (
                                    <div
                                        onMouseEnter={() => {
                                            setPinned(true);
                                        }}
                                        onMouseLeave={() => {
                                            setPinned(false);
                                        }}
                                        className={cn(
                                            // Fades in on arrival, and SLIDES between pushes rather
                                            // than teleporting: at this size a jump reads as a
                                            // flicker, and the eye loses which point it belongs to.
                                            'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:transition-[left] absolute z-10 -translate-x-1/2 motion-safe:duration-150 motion-safe:ease-out',
                                            // Pinned to the plot edge FURTHEST from the point rather
                                            // than hung off the point itself: the card is taller than
                                            // the gap above a high push, and the panel clips whatever
                                            // leaves it, so anchoring to the point cut the card in half.
                                            active.y < CHART_HEIGHT / 2 ? 'bottom-1' : 'top-1'
                                        )}
                                        style={{ left: active.x }}
                                    >
                                        <PointTooltip
                                            point={plotted[active.index]}
                                            previous={plotted[active.index - 1] ?? null}
                                            metric={active.metric}
                                            mode={mode}
                                            position={active.index + 1}
                                            total={plotted.length}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* What the keyboard has in hand, said out loud. Without it the arrow keys
                                would move a highlight a screen-reader user cannot see. */}
                            <p className="sr-only" aria-live="polite">
                                {`${METRIC_LABEL[drawn[0]]} ${spokenValue(drawn[0], focusedValue)} at ${clockOf(focusedPoint.takenAt)}, push ${focused + 1} of ${plotted.length}`}
                            </p>

                            {presentFlags.length > 0 && (
                                <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                    {presentFlags.map((flag) => {
                                        return (
                                            <li
                                                key={flag}
                                                className="flex items-center gap-1.5"
                                                title={FLAG_HINT[flag]}
                                            >
                                                <span aria-hidden={true} style={{ color: FLAG_STROKE[flag] }}>
                                                    {FLAG_GLYPH[flag]}
                                                </span>
                                                {FLAG_LABEL[flag]}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            {/* The strip reads the day as it happened whatever the toggle says — it is the map, and
                the chart above it is the territory. */}
            <SparklineStrip points={points} selected={[...costMetrics, figure]} onSelect={selectFromStrip} />
        </SectionCard>
    );
}

export { TrajectoryChart };
