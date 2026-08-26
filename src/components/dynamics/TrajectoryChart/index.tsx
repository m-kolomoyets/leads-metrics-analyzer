import type { CostMetric, SeriesPoint } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';
import type { ActivePoint, ChartMetric, IncomeMetric } from './types';
import type { PlotPoint, PlotSegment } from './utils/segments';
import { useId, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { COST_METRICS, deltasFor, zoneOfPoint } from '@/lib/domain/dynamics';
import { cn } from '@/lib/utils/cn';
import { kyivClock } from '@/lib/utils/kyivDay';
import { cost, DASH, usd, usdRound, usdSigned } from '@/components/report/utils/format';
import {
    CORRECTED_STROKE,
    COST_DASH,
    COST_LABEL,
    INCOME_LABEL,
    INCOME_STROKE,
    PLOT,
    PLOT_BOTTOM,
    PLOT_LEFT,
    PLOT_RIGHT,
    PLOT_TOP,
    ZONE_LABEL,
    ZONE_STROKE,
} from './constants';
import { boundsOf, scaleOf, ticksOf, xPositions } from './utils/geometry';
import { segmentsOf } from './utils/segments';
import { PointTooltip } from './components/PointTooltip';

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
// Colour is spoken for, so several cost lines are told apart by DASH. Income takes no zone — there
// are no thresholds for income — and a restated interval is grey, because it measures nothing.
//
// All the arithmetic lives in `utils/`; this file places and paints.

const INCOME_METRICS: IncomeMetric[] = ['revenue', 'profit'];

const TICKS = 4;

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
        dash: metric === 'revenue' || metric === 'profit' ? undefined : COST_DASH[metric],
        // Income draws in the neutral accent at every point; a cost line takes its colour per segment
        // from the zones at its ends.
        stroke: metric === 'revenue' || metric === 'profit' ? INCOME_STROKE : null,
        plot,
        segments: segmentsOf(plot, corrected),
    };
}

// A marker's screen-reader label reads the figure the way the surface around it does: a cost is a
// bare two-decimal number, income carries its currency, and a Profit carries its sign.
function spokenValue(metric: ChartMetric, value: number | null): string {
    if (value === null) {
        return 'not measured';
    }
    if (metric === 'revenue') {
        return usd(value);
    }
    if (metric === 'profit') {
        return usdSigned(value);
    }
    return cost(value);
}

function labelOf(metric: ChartMetric): string {
    return metric === 'revenue' || metric === 'profit' ? INCOME_LABEL[metric] : COST_LABEL[metric];
}

function clockOf(takenAt: string): string {
    const instant = new Date(takenAt);

    return Number.isNaN(instant.getTime()) ? DASH : kyivClock(instant);
}

type TrajectoryChartProps = {
    // One Geo's trajectory, oldest first — `buildSeries` output.
    points: SeriesPoint[];
};

function TrajectoryChart({ points }: TrajectoryChartProps) {
    // Gradients are referenced by id, and two charts on one page must not share them. `useId` returns
    // colon-wrapped ids, which are legal in an id attribute but awkward everywhere else — stripped
    // here so `url(#…)` never has to carry them.
    const uid = useId().replaceAll(/[^a-zA-Z0-9]/g, '');
    const [costMetrics, setCostMetrics] = useState<CostMetric[]>(['cpi']);
    const [income, setIncome] = useState<IncomeMetric>('revenue');
    const [active, setActive] = useState<ActivePoint | null>(null);

    if (points.length === 0) {
        return <p className="text-muted-foreground text-sm">No reports for this period.</p>;
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

    // `deltasFor` is indexed by point: entry i describes the interval ENDING at point i, which is the
    // segment drawn into it. A restated interval is the grey one.
    const corrected = deltasFor(points).map((delta) => {
        return delta.flags.corrected;
    });
    const xs = xPositions(
        points.map((point) => {
            return point.takenAt;
        }),
        PLOT_LEFT,
        PLOT_RIGHT
    );

    // One band for every cost line on the left, so two cost metrics are compared against each other
    // rather than each rescaled to look identical.
    const costBounds = boundsOf(
        costMetrics.flatMap((metric) => {
            return points.map((point) => {
                return point.figures[metric];
            });
        })
    );
    const incomeValues = points.map((point) => {
        return income === 'revenue' ? point.figures.revenue : point.figures.profit;
    });
    const incomeBounds = boundsOf(incomeValues);

    const costScale = costBounds === null ? null : scaleOf(costBounds, PLOT_BOTTOM, PLOT_TOP);
    const incomeScale = incomeBounds === null ? null : scaleOf(incomeBounds, PLOT_BOTTOM, PLOT_TOP);

    const neutralZones = points.map((): Zone => {
        return 'neutral';
    });

    const lines: SeriesLine[] = [
        ...costMetrics.map((metric) => {
            return lineOf(
                metric,
                points.map((point) => {
                    return point.figures[metric];
                }),
                points.map((point) => {
                    return zoneOfPoint(point, metric);
                }),
                xs,
                costScale,
                corrected
            );
        }),
        lineOf(income, incomeValues, neutralZones, xs, incomeScale, corrected),
    ];

    // Every push gets a label when there is room; past that the ladder thins out rather than
    // overprinting itself.
    const labelStep = Math.ceil(points.length / 8);

    const activeLine =
        active === null
            ? null
            : (lines.find((line) => {
                  return line.metric === active.metric;
              }) ?? null);
    const activePlot = active === null ? null : (activeLine?.plot[active.index] ?? null);

    return (
        <section className="border-border flex flex-col gap-3 rounded-lg border p-4" aria-label="Trajectory">
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
                            {COST_LABEL[metric]}
                        </label>
                    );
                })}

                <fieldset className="ml-auto flex items-center gap-3">
                    <legend className="sr-only">Right axis</legend>
                    {INCOME_METRICS.map((metric) => {
                        return (
                            <label key={metric} className="flex cursor-pointer items-center gap-1.5">
                                <input
                                    type="radio"
                                    name={`${uid}-income`}
                                    checked={income === metric}
                                    className="accent-primary"
                                    onChange={() => {
                                        setIncome(metric);
                                    }}
                                />
                                {INCOME_LABEL[metric]}
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
                    aria-label={`Trajectory of ${points[0].geo} across ${points.length} pushes`}
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
                        whichever income figure is on. */}
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

                    {incomeBounds !== null &&
                        ticksOf(incomeBounds, TICKS).map((value, index) => {
                            const y = PLOT_BOTTOM - ((PLOT_BOTTOM - PLOT_TOP) / (TICKS - 1)) * index;

                            return (
                                <text
                                    key={value}
                                    x={PLOT_RIGHT + 8}
                                    y={y + 4}
                                    className="fill-muted-foreground font-mono text-[10px]"
                                >
                                    {usdRound(value)}
                                </text>
                            );
                        })}

                    {points.map((point, index) => {
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

                                {line.plot.map((plotted) => {
                                    if (plotted.y === null) {
                                        return null;
                                    }

                                    const point = points[plotted.index];
                                    const fill = line.stroke ?? ZONE_STROKE[plotted.zone];
                                    const value =
                                        line.metric === 'revenue' ? point.figures.revenue : point.figures[line.metric];

                                    return (
                                        // The drill-in, and the most important interaction on the
                                        // page: at THIS Snapshot, never the latest one. Also the
                                        // keyboard path — every point is a focusable link.
                                        <Link
                                            key={point.snapshotId}
                                            to="/dashboard/report/$snapshotId"
                                            params={{ snapshotId: point.snapshotId }}
                                            search={{ geo: point.geo }}
                                            aria-label={`${labelOf(line.metric)} ${spokenValue(line.metric, value)} at ${clockOf(point.takenAt)}${line.stroke === null ? `, ${ZONE_LABEL[plotted.zone]}` : ''} — open this report`}
                                            onMouseEnter={() => {
                                                setActive({ index: plotted.index, metric: line.metric });
                                            }}
                                            onFocus={() => {
                                                setActive({ index: plotted.index, metric: line.metric });
                                            }}
                                            onBlur={() => {
                                                setActive(null);
                                            }}
                                        >
                                            {/* A hit target a pointer can actually find, and a
                                                marker small enough not to hide the line. */}
                                            <circle cx={plotted.x} cy={plotted.y} r="10" fill="transparent" />
                                            <circle
                                                cx={plotted.x}
                                                cy={plotted.y}
                                                r="4.5"
                                                strokeWidth="1.5"
                                                style={{ fill, stroke: 'var(--background)' }}
                                            />
                                            {/* Only the push that did the correcting is badged, and
                                                the badge does not cascade forward (ADR-0018). */}
                                            {point.replacedAt !== null && (
                                                <circle
                                                    cx={plotted.x + 7}
                                                    cy={plotted.y - 7}
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
                            point={points[active.index]}
                            previous={points[active.index - 1] ?? null}
                            metric={active.metric}
                            position={active.index + 1}
                            total={points.length}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

export { TrajectoryChart };
