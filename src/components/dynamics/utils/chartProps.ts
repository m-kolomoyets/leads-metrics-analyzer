import type { TrajectoryRow } from '@/components/charts/TrajectoryCard';
import type { ChartFlag, ChartMark, ChartSeries, ChartTone } from '@/components/charts/types';
import type { CostMetric, DynamicsMetric, SeriesPoint } from '@/lib/domain/dynamics';
import type { DynamicsMode, FigureMetric } from '../types';
import { COST_METRICS, deltaPointsFor, deltasFor, hasZone, zoneOfPoint } from '@/lib/domain/dynamics';
import { kyivClock } from '@/lib/utils/kyivDay';
import { extentOf, niceTicks, paddedDomain } from '@/components/charts/utils/ticks';
import { DASH } from '@/components/report/utils/format';
import { COST_DASH, DELTA_FLAGS, FLAG_GLYPH, FLAG_HINT, FLAG_LABEL, FLAG_STROKE } from '../constants';
import { METRIC_FORMAT, METRIC_LABEL, metricValue } from './metrics';

// The one seam between the Dynamics domain and the charts that draw it (spec #64). Everything the
// chart surfaces render comes out of here, and nothing is worked out during a render: the primitives
// in `components/charts` take numbers and grades and know nothing about a campaign (ADR-0025), so
// deciding that a CPI is graded against its Snapshot's frozen thresholds and that money is not is
// this module's job, and the only place it can be got wrong without a reader noticing.
//
// It is born with what the Metric strip needs and grows with the surfaces that follow.

// The four the strip shows, in reading order: the verdict, what it cost, what it made, and the one
// cost-per that drives all three. Four is the count the spec fixes; a fifth would stop being a glance.
export const STRIP_METRICS: DynamicsMetric[] = ['roi', 'spend', 'profit', 'cpi'];

export type StripCard = {
    metric: DynamicsMetric;
    label: string;
    // The trailing figure, already read in the metric's own units — the number printed on the card.
    value: string;
    // The whole day, oldest first. Nulls included, because an unmeasurable interval is a gap and not
    // a value of zero, and a line that dips to the floor there would say something the day did not.
    values: (number | null)[];
    // Per-push grades, parallel to `values`. ABSENT, not a row of neutrals, when the metric has no
    // thresholds to be graded against: ROI, Spend and Profit can never be wrong, and a card that
    // carried grey verdicts would be withholding a colour rather than having none to give (ADR-0019).
    tones?: ChartTone[];
    // The range the plot draws over — wider than the data, so the stroke stands inside its panel
    // instead of hanging over both edges.
    domain: [number, number];
};

export function stripCards(points: SeriesPoint[]): StripCard[] {
    const current = points.at(-1) ?? null;

    return STRIP_METRICS.map((metric): StripCard => {
        const values = points.map((point) => {
            return metricValue(point.figures, metric);
        });

        return {
            metric,
            label: METRIC_LABEL[metric],
            value: METRIC_FORMAT[metric].value(current === null ? null : metricValue(current.figures, metric)),
            values,
            tones: hasZone(metric)
                ? points.map((point): ChartTone => {
                      return zoneOfPoint(point, metric);
                  })
                : undefined,
            domain: paddedDomain(values),
        };
    });
}

// How many rules the plot is ruled with. Both scales are asked for the same number, because the
// horizontal grid is drawn once from the left one: a right scale free to pick its own count would
// print its figures BETWEEN the rules, and a reader would have to work out which rule each belonged
// to before they could read either.
const AXIS_ROWS = 5;

// One axis: the round figures it prints and the range it draws over, taken from the series that hang
// on it. The domain is the ticks' own ends rather than the data's, so the topmost and bottommost
// figures sit ON the plot's edges instead of somewhere inside them.
function axisOf(
    rows: TrajectoryRow[],
    keys: readonly string[],
    count: number
): { ticks: number[]; domain: [number, number] } {
    const [min, max] = extentOf(rows, keys);

    // Nothing measurable on this axis at all — a day where every cost was unmeasurable, or a figure
    // that is null throughout. A range is still needed for the plot to have a height.
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return { ticks: [], domain: [0, 1] };
    }

    // A flat series has no span to divide, and an axis of one repeated figure is not a scale. It is
    // given a magnitude to be read against — the value's own, or 1 when the value is 0 — so the line
    // lands on the bottom rule with room drawn above it.
    const top = max > min ? max : min + (Math.abs(min) || 1);
    const ticks = niceTicks(min, top, count);

    return { ticks, domain: [ticks[0] ?? min, ticks.at(-1) ?? top] };
}

// The clock the time axis reads, in the same zone every other stamp on the page is printed in.
function clockOf(takenAt: string): string {
    const instant = new Date(takenAt);

    return Number.isNaN(instant.getTime()) ? DASH : kyivClock(instant);
}

export type TrajectoryInput = {
    // One Geo's trajectory, oldest first — `buildSeries` output, always cumulative.
    points: SeriesPoint[];
    mode: DynamicsMode;
    // The cost lines on the left axis, and the single figure on the right.
    costMetrics: CostMetric[];
    figure: FigureMetric;
};

export type TrajectoryProps = {
    // The pushes the chart actually draws — the mode applied. The tooltip is opened on one of these,
    // so the transform lives here rather than in the card: a card reading totals while the plot drew
    // intervals is the exact confusion the toggle was added to remove.
    points: SeriesPoint[];
    rows: TrajectoryRow[];
    series: ChartSeries[];
    costTicks: number[];
    figureTicks: number[];
    costDomain: [number, number];
    figureDomain: [number, number];
    // What happened to each push beyond its figures, parallel to `rows`.
    marks: ChartMark[];
    // The key under the plot, holding ONLY the flags the day actually raised: a permanent key for
    // three edge cases that occur on maybe one day in ten trains the reader to ignore the lane.
    flagLegend: ChartFlag[];
};

// The three edge cases, per push (SPEC §4.3). `deltasFor` is indexed by point: entry i describes the
// interval ENDING at point i, which is the stroke drawn into it.
//
// The flags are raised in delta mode only — in cumulative mode they describe intervals the chart is
// not drawing — but a restatement fades its interval in EITHER mode, because a clamped remainder is
// not a measurement whichever question the toggle is asking.
function marksOf(points: SeriesPoint[], mode: DynamicsMode): ChartMark[] {
    return deltasFor(points).map((delta): ChartMark => {
        return {
            flags:
                mode === 'delta'
                    ? DELTA_FLAGS.filter((flag) => {
                          return delta.flags[flag];
                      })
                    : [],
            faded: delta.flags.corrected,
            // The push that did the correcting wears the badge, and the badge does not cascade onto
            // the pushes after it (ADR-0018).
            badge: delta.to.replacedAt !== null,
        };
    });
}

// Everything the whole-day card draws, worked out once. The card takes this and renders it; nothing
// on it is computed during a render, so a wrong axis or a misplaced grade is caught by a test rather
// than by a reader (spec #64).
export function trajectoryProps({ points, mode, costMetrics, figure }: TrajectoryInput): TrajectoryProps {
    // The only difference the toggle makes: `deltaPointsFor` hands back the same shape holding
    // intervals instead of totals, and everything below reads it without caring which it got.
    const plotted: SeriesPoint[] = mode === 'delta' ? deltaPointsFor(points) : points;
    // Drawn in a fixed order so two cost lines never swap dashes when a checkbox is cleared.
    const costs = COST_METRICS.filter((metric) => {
        return costMetrics.includes(metric);
    });
    const drawn: DynamicsMetric[] = [...costs, figure];

    const rows: TrajectoryRow[] = plotted.map((point, index) => {
        const row: TrajectoryRow = { index, label: clockOf(point.takenAt) };

        for (const metric of drawn) {
            row[metric] = metricValue(point.figures, metric);
        }

        return row;
    });

    const series: ChartSeries[] = costs.map((metric): ChartSeries => {
        return {
            dataKey: metric,
            label: METRIC_LABEL[metric],
            // Graded against each Snapshot's OWN frozen thresholds (ADR-0002/0015), so a preset
            // edited at noon never repaints the morning.
            tones: plotted.map((point): ChartTone => {
                return zoneOfPoint(point, metric);
            }),
            dash: COST_DASH[metric],
            axis: 'cost',
        };
    });

    // The right axis carries no grade: there are no thresholds for money or for ROI, so a graded
    // Revenue would be a verdict nobody wrote (ADR-0019). It draws in the accent instead.
    series.push({ dataKey: figure, label: METRIC_LABEL[figure], axis: 'figure' });

    const cost = axisOf(rows, costs, AXIS_ROWS);
    // Asked for the row count the cost axis settled on, so both land on the same rules.
    const figures = axisOf(rows, [figure], cost.ticks.length || AXIS_ROWS);

    const marks = marksOf(points, mode);
    // Read off the lane rather than off the mode, so the key can never list a flag the plot did not
    // draw.
    const raised = new Set(
        marks.flatMap((mark) => {
            return mark.flags;
        })
    );

    return {
        points: plotted,
        rows,
        series,
        marks,
        flagLegend: DELTA_FLAGS.filter((flag) => {
            return raised.has(flag);
        }).map((flag): ChartFlag => {
            return {
                key: flag,
                glyph: FLAG_GLYPH[flag],
                color: FLAG_STROKE[flag],
                label: FLAG_LABEL[flag],
                hint: FLAG_HINT[flag],
            };
        }),
        costTicks: cost.ticks,
        figureTicks: figures.ticks,
        costDomain: cost.domain,
        figureDomain: figures.domain,
    };
}
