import type { CostMetric, SeriesPoint } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';
import type { DynamicsMode } from '../types';
import type { DeltaFlag } from './constants';
import type { ActivePoint, ChartMetric, FigureMetric } from './types';
import type { PlotPoint, PlotSegment } from './utils/segments';
import { useId, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { COST_METRICS, deltaPointsFor, deltasFor, hasZone, zoneOfPoint } from '@/lib/domain/dynamics';
import { cn } from '@/lib/utils/cn';
import { kyivClock } from '@/lib/utils/kyivDay';
import { SectionCard } from '@/components/report/SectionCard';
import { cost, DASH } from '@/components/report/utils/format';
import {
    CORRECTED_STROKE,
    COST_DASH,
    FIGURE_STROKE,
    FLAG_GLYPH,
    FLAG_HINT,
    FLAG_LABEL,
    FLAG_STROKE,
    PLOT,
    PLOT_BOTTOM,
    PLOT_LEFT,
    PLOT_RIGHT,
    PLOT_TOP,
    ZONE_LABEL,
    ZONE_STROKE,
} from './constants';
import { boundsOf, scaleOf, ticksOf, xPositions } from '../utils/geometry';
import { METRIC_FORMAT, METRIC_LABEL, metricValue } from '../utils/metrics';
import { segmentsOf } from './utils/segments';
import { PointTooltip } from './components/PointTooltip';
import { SparklineStrip } from '../SparklineStrip';

// The trajectory chart (SPEC §6.6), hand-rolled in SVG: the repo carries no charting dependency, and
// the one visual that matters here — a per-segment gradient between two zone colours — is custom
// paint in every library anyway.
//
// The zone mechanic is the entire point. A marker is filled with the zone its value falls into,
// graded against THAT Snapshot's own frozen thresholds (ADR-0002/0015), so a buyer editing a preset
// at noon never repaints the morning. A segment between two points of one zone is a solid stroke; a
// segment across zones is a real gradient, so a line cooling red → amber → green says "this buyer is
// fixing it" with no numbers read at all.
//
// Colour is spoken for, so several cost lines are told apart by DASH. The right axis takes no zone —
// there are no thresholds for money or ROI — and a restated interval is grey, because it measures
// nothing.
//
// The mode toggle changes what the points ARE, not how they are drawn: `deltaPointsFor` hands back
// the same shape holding intervals instead of totals, so everything below is written once. Delta mode
// adds one thing of its own — a lane of edge-case flags, because a gap in the line with no
// explanation is the failure this chart exists to avoid.
//
// All the arithmetic lives in `utils/` and in the domain; this file places and paints.

const FIGURE_METRICS: FigureMetric[] = ['revenue', 'profit', 'spend', 'roi'];

const FLAGS: DeltaFlag[] = ['firstOfDay', 'corrected', 'spendWithoutConversions'];

const TICKS = 4;

// The flag lane sits between the plot floor and the time ladder.
const FLAG_Y = PLOT_BOTTOM + 13;

type SeriesLine = {
    metric: ChartMetric;
    dash: string | undefined;
    stroke: string | null;
    plot: PlotPoint[];
    segments: PlotSegment[];
};

// A line's points, placed. `scale` is null when the axis has no measurable value at all, in which
// case every point is a gap rather than a row of zeroes.
function lineOf(
    metric: ChartMetric,
    values: (number | null)[],
    zones: Zone[],
    xs: number[],
    scale: ((value: number) => number) | null,
    corrected: boolean[]
): SeriesLine {
    const plot = values.map((value, index): PlotPoint => {
        return {
            index,
            x: xs[index],
            y: value === null || scale === null ? null : scale(value),
            zone: zones[index],
        };
    });

    return {
        metric,
        dash: hasZone(metric) ? COST_DASH[metric] : undefined,
        // The right axis draws in the neutral accent at every point; a cost line takes its colour per
        // segment from the zones at its ends.
        stroke: hasZone(metric) ? null : FIGURE_STROKE,
        plot,
        segments: segmentsOf(plot, corrected),
    };
}

// A marker's screen-reader label reads the figure the way the surface around it does: a cost is a
// bare two-decimal number, money carries its currency, ROI its percent sign.
function spokenValue(metric: ChartMetric, value: number | null): string {
    return value === null ? 'not measured' : METRIC_FORMAT[metric].value(value);
}

function clockOf(takenAt: string): string {
    const instant = new Date(takenAt);

    return Number.isNaN(instant.getTime()) ? DASH : kyivClock(instant);
}

type TrajectoryChartProps = {
    // One Geo's trajectory, oldest first — `buildSeries` output. Always the cumulative Series: the
    // mode toggle is applied here, so the sparklines beside it keep reading the day as it happened.
    points: SeriesPoint[];
    mode: DynamicsMode;
};

function TrajectoryChart({ points, mode }: TrajectoryChartProps) {
    // Gradients are referenced by id, and two charts on one page must not share them. `useId` returns
    // colon-wrapped ids, which are legal in an id attribute but awkward everywhere else — stripped
    // here so `url(#…)` never has to carry them.
    const uid = useId().replaceAll(/[^a-zA-Z0-9]/g, '');
    const [costMetrics, setCostMetrics] = useState<CostMetric[]>(['cpi']);
    const [figure, setFigure] = useState<FigureMetric>('revenue');
    const [active, setActive] = useState<ActivePoint | null>(null);

    // The caller decides what an empty day looks like (`BuyerDay` shows tiles or a note); this is the
    // chart refusing to index into a series it was handed by mistake, not a second empty state.
    if (points.length === 0) {
        return null;
    }

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

    // `deltasFor` is indexed by point: entry i describes the interval ENDING at point i, which is the
    // segment drawn into it. A restated interval is the grey one, in either mode.
    const deltas = deltasFor(points);
    const corrected = deltas.map((delta) => {
        return delta.flags.corrected;
    });
    // The only difference the toggle makes. Everything below reads `plotted` and does not care which
    // question it is answering.
    const plotted = mode === 'delta' ? deltaPointsFor(points) : points;

    const xs = xPositions(
        plotted.map((point) => {
            return point.takenAt;
        }),
        PLOT_LEFT,
        PLOT_RIGHT
    );

    // One band for every cost line on the left, so two cost metrics are compared against each other
    // rather than each rescaled to look identical.
    const costBounds = boundsOf(
        costMetrics.flatMap((metric) => {
            return plotted.map((point) => {
                return point.figures[metric];
            });
        })
    );
    const figureValues = plotted.map((point) => {
        return metricValue(point.figures, figure);
    });
    const figureBounds = boundsOf(figureValues);

    const costScale = costBounds === null ? null : scaleOf(costBounds, PLOT_BOTTOM, PLOT_TOP);
    const figureScale = figureBounds === null ? null : scaleOf(figureBounds, PLOT_BOTTOM, PLOT_TOP);

    const neutralZones = plotted.map((): Zone => {
        return 'neutral';
    });

    const lines: SeriesLine[] = [
        ...costMetrics.map((metric) => {
            return lineOf(
                metric,
                plotted.map((point) => {
                    return point.figures[metric];
                }),
                plotted.map((point) => {
                    return zoneOfPoint(point, metric);
                }),
                xs,
                costScale,
                corrected
            );
        }),
        lineOf(figure, figureValues, neutralZones, xs, figureScale, corrected),
    ];

    // Every push gets a label when there is room; past that the ladder thins out rather than
    // overprinting itself.
    const labelStep = Math.ceil(plotted.length / 8);

    const activeLine =
        active === null
            ? null
            : (lines.find((line) => {
                  return line.metric === active.metric;
              }) ?? null);
    const activePlot = active === null ? null : (activeLine?.plot[active.index] ?? null);

    // Only the flags that actually happened get a legend entry: a permanent key for three edge cases
    // that occur on maybe one day in ten would train the reader to ignore the lane.
    const presentFlags =
        mode === 'delta'
            ? FLAGS.filter((flag) => {
                  return deltas.some((delta) => {
                      return delta.flags[flag];
                  });
              })
            : [];

    return (
        <SectionCard label="Trajectory" className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {COST_METRICS.map((metric) => {
                    return (
                        <label key={metric} className="flex cursor-pointer items-center gap-1.5">
                            <input
                                type="checkbox"
                                checked={costMetrics.includes(metric)}
                                className="accent-primary"
                                onChange={() => {
                                    toggleCost(metric);
                                }}
                            />
                            {/* The dash pattern, shown rather than described: it is the only thing
                                telling two cost lines apart once both are on. */}
                            <svg width="26" height="8" aria-hidden={true} className="shrink-0">
                                <line
                                    x1="1"
                                    y1="4"
                                    x2="25"
                                    y2="4"
                                    strokeWidth="2"
                                    strokeDasharray={COST_DASH[metric]}
                                    style={{ stroke: 'currentcolor' }}
                                />
                            </svg>
                            {METRIC_LABEL[metric]}
                        </label>
                    );
                })}

                <fieldset className="ml-auto flex items-center gap-3">
                    <legend className="sr-only">Right axis</legend>
                    {FIGURE_METRICS.map((metric) => {
                        return (
                            <label key={metric} className="flex cursor-pointer items-center gap-1.5">
                                <input
                                    type="radio"
                                    name={`${uid}-figure`}
                                    checked={figure === metric}
                                    className="accent-primary"
                                    onChange={() => {
                                        setFigure(metric);
                                    }}
                                />
                                {METRIC_LABEL[metric]}
                            </label>
                        );
                    })}
                </fieldset>
            </div>

            {/* The container's aspect ratio matches the viewBox, so the tooltip below can be placed
                as a plain percentage of the same box with no coordinate conversion. */}
            <div
                className="relative w-full"
                style={{ aspectRatio: `${PLOT.width} / ${PLOT.height}` }}
                onMouseLeave={() => {
                    setActive(null);
                }}
            >
                <svg
                    viewBox={`0 0 ${PLOT.width} ${PLOT.height}`}
                    className="absolute inset-0 h-full w-full overflow-visible"
                    // `group`, never `img`: an `img` role hides its subtree, and the subtree is the
                    // point-by-point drill-in a screen-reader user navigates.
                    role="group"
                    aria-label={`${mode === 'delta' ? 'Between-report' : 'Cumulative'} trajectory of ${plotted[0].geo} across ${plotted.length} pushes`}
                >
                    <defs>
                        {lines.flatMap((line) => {
                            return line.segments
                                .filter((segment) => {
                                    return !segment.corrected && segment.fromZone !== segment.toZone;
                                })
                                .map((segment) => {
                                    return (
                                        // A real gradient, not an approximation: the stroke IS the
                                        // story of a cost cooling from red to green.
                                        <linearGradient
                                            key={`${line.metric}-${segment.index}`}
                                            id={`${uid}-${line.metric}-${segment.index}`}
                                            gradientUnits="userSpaceOnUse"
                                            x1={segment.x1}
                                            y1={segment.y1}
                                            x2={segment.x2}
                                            y2={segment.y2}
                                        >
                                            <stop offset="0%" style={{ stopColor: ZONE_STROKE[segment.fromZone] }} />
                                            <stop offset="100%" style={{ stopColor: ZONE_STROKE[segment.toZone] }} />
                                        </linearGradient>
                                    );
                                });
                        })}
                    </defs>

                    {/* Gridlines and the two axes' ladders. The left one reads costs, the right one
                        whichever figure the toggle put on it. */}
                    {Array.from({ length: TICKS }, (_unused, index) => {
                        const y = PLOT_TOP + ((PLOT_BOTTOM - PLOT_TOP) / (TICKS - 1)) * index;

                        return (
                            <line
                                key={y}
                                x1={PLOT_LEFT}
                                y1={y}
                                x2={PLOT_RIGHT}
                                y2={y}
                                strokeWidth="1"
                                style={{ stroke: 'var(--border)' }}
                            />
                        );
                    })}

                    {costBounds !== null &&
                        ticksOf(costBounds, TICKS).map((value, index) => {
                            const y = PLOT_BOTTOM - ((PLOT_BOTTOM - PLOT_TOP) / (TICKS - 1)) * index;

                            return (
                                <text
                                    key={value}
                                    x={PLOT_LEFT - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-muted-foreground font-mono text-[10px]"
                                >
                                    {cost(value)}
                                </text>
                            );
                        })}

                    {figureBounds !== null &&
                        ticksOf(figureBounds, TICKS).map((value, index) => {
                            const y = PLOT_BOTTOM - ((PLOT_BOTTOM - PLOT_TOP) / (TICKS - 1)) * index;

                            return (
                                <text
                                    key={value}
                                    x={PLOT_RIGHT + 8}
                                    y={y + 4}
                                    className="fill-muted-foreground font-mono text-[10px]"
                                >
                                    {METRIC_FORMAT[figure].axis(value)}
                                </text>
                            );
                        })}

                    {plotted.map((point, index) => {
                        if (index % labelStep !== 0) {
                            return null;
                        }

                        return (
                            <text
                                key={point.snapshotId}
                                x={xs[index]}
                                y={PLOT.height - 12}
                                textAnchor="middle"
                                className="fill-muted-foreground font-mono text-[10px]"
                            >
                                {clockOf(point.takenAt)}
                            </text>
                        );
                    })}

                    {/* The edge-case lane. Each of the three reads differently on purpose: a first
                        report is not a defect, a restatement is not the buyer's doing, and spend that
                        bought nothing is the one worth walking over for. */}
                    {mode === 'delta' &&
                        deltas.flatMap((delta, index) => {
                            // Every flag a push carries, not just the first: a first report that spent
                            // without installing is both, and dropping one of the two would hide the
                            // half worth walking over for.
                            const flags = FLAGS.filter((candidate) => {
                                return delta.flags[candidate];
                            });

                            return flags.map((flag, position) => {
                                return (
                                    <g
                                        key={`${delta.to.snapshotId}-${flag}`}
                                        role="img"
                                        aria-label={`${FLAG_LABEL[flag]}. ${FLAG_HINT[flag]}`}
                                    >
                                        <title>{`${FLAG_LABEL[flag]} — ${FLAG_HINT[flag]}`}</title>
                                        <text
                                            // Side by side, centred on the push as a group, so two
                                            // flags never print on top of each other.
                                            x={xs[index] + (position - (flags.length - 1) / 2) * 9}
                                            y={FLAG_Y}
                                            textAnchor="middle"
                                            className="text-[9px]"
                                            style={{ fill: FLAG_STROKE[flag] }}
                                        >
                                            {FLAG_GLYPH[flag]}
                                        </text>
                                    </g>
                                );
                            });
                        })}

                    {lines.map((line) => {
                        return (
                            <g key={line.metric}>
                                {line.segments.map((segment) => {
                                    const gradient =
                                        !segment.corrected && segment.fromZone !== segment.toZone
                                            ? `url(#${uid}-${line.metric}-${segment.index})`
                                            : null;
                                    // A restated interval is grey wherever it is: it is not a cost
                                    // anybody paid, so it carries no verdict colour.
                                    const stroke = segment.corrected
                                        ? CORRECTED_STROKE
                                        : (gradient ?? line.stroke ?? ZONE_STROKE[segment.fromZone]);

                                    return (
                                        <line
                                            key={segment.index}
                                            x1={segment.x1}
                                            y1={segment.y1}
                                            x2={segment.x2}
                                            y2={segment.y2}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeDasharray={line.dash}
                                            style={{ stroke }}
                                        >
                                            {segment.corrected && (
                                                <title>
                                                    The data behind this interval was restated, so it measures nothing.
                                                </title>
                                            )}
                                        </line>
                                    );
                                })}

                                {line.plot.map((one) => {
                                    if (one.y === null) {
                                        return null;
                                    }

                                    const point = plotted[one.index];
                                    const fill = line.stroke ?? ZONE_STROKE[one.zone];
                                    const value = metricValue(point.figures, line.metric);

                                    return (
                                        // The drill-in, and the most important interaction on the
                                        // page: at THIS Snapshot, never the latest one. Also the
                                        // keyboard path — every point is a focusable link.
                                        <Link
                                            key={point.snapshotId}
                                            to="/dashboard/report/$snapshotId"
                                            params={{ snapshotId: point.snapshotId }}
                                            search={{ geo: point.geo }}
                                            aria-label={`${METRIC_LABEL[line.metric]} ${spokenValue(line.metric, value)} at ${clockOf(point.takenAt)}${line.stroke === null ? `, ${ZONE_LABEL[one.zone]}` : ''} — open this report`}
                                            onMouseEnter={() => {
                                                setActive({ index: one.index, metric: line.metric });
                                            }}
                                            onFocus={() => {
                                                setActive({ index: one.index, metric: line.metric });
                                            }}
                                            onBlur={() => {
                                                setActive(null);
                                            }}
                                        >
                                            {/* A hit target a pointer can actually find, and a
                                                marker small enough not to hide the line. */}
                                            <circle cx={one.x} cy={one.y} r="10" fill="transparent" />
                                            <circle
                                                cx={one.x}
                                                cy={one.y}
                                                r="4.5"
                                                strokeWidth="1.5"
                                                style={{ fill, stroke: 'var(--background)' }}
                                            />
                                            {/* Only the push that did the correcting is badged, and
                                                the badge does not cascade forward (ADR-0018). */}
                                            {point.replacedAt !== null && (
                                                <circle
                                                    cx={one.x + 7}
                                                    cy={one.y - 7}
                                                    r="3"
                                                    strokeWidth="1"
                                                    style={{ fill: 'var(--background)', stroke: CORRECTED_STROKE }}
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </g>
                        );
                    })}
                </svg>

                {active !== null && activePlot !== null && activePlot.y !== null && (
                    <div
                        className={cn(
                            'pointer-events-auto absolute z-10',
                            // Flipped away from whichever frame the point sits against, so a tooltip
                            // is never drawn off the top of the chart.
                            activePlot.y < PLOT.height / 2 ? 'translate-y-2' : '-translate-y-full',
                            activePlot.x > PLOT.width / 2 ? '-translate-x-full' : ''
                        )}
                        style={{
                            left: `${(activePlot.x / PLOT.width) * 100}%`,
                            top: `${(activePlot.y / PLOT.height) * 100}%`,
                        }}
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

            {presentFlags.length > 0 && (
                <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                    {presentFlags.map((flag) => {
                        return (
                            <li key={flag} className="flex items-center gap-1.5" title={FLAG_HINT[flag]}>
                                <span aria-hidden={true} style={{ color: FLAG_STROKE[flag] }}>
                                    {FLAG_GLYPH[flag]}
                                </span>
                                {FLAG_LABEL[flag]}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* The strip reads the day as it happened whatever the toggle says — it is the map, and
                the chart above it is the territory. */}
            <SparklineStrip points={points} selected={[...costMetrics, figure]} onSelect={selectFromStrip} />
        </SectionCard>
    );
}

export { TrajectoryChart };
