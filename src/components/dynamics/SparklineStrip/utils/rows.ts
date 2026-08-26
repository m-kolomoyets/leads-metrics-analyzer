import type { DynamicsMetric, MetricTone, SeriesPoint } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';
import { compareFigures, hasZone, toneOf, zoneOfPoint } from '@/lib/domain/dynamics';
import { metricValue } from '../../utils/metrics';

// The strip's arithmetic (SPEC §6.6): four series, their trailing figures, and the colour each one
// earns. Pure, so the colour rule — the one thing on the strip that can be wrong in a way nobody
// notices — is checkable without a DOM (ADR-0005).

// The four the strip shows, in reading order: the verdict, what it cost, what it made, and the one
// cost-per that drives all three. Four is the count the spec fixes; a fifth would stop being a glance.
export const SPARKLINE_METRICS: DynamicsMetric[] = ['roi', 'spend', 'profit', 'cpi'];

// Colour follows meaning, exactly as the comparison panel's arrows do — and stops where meaning
// stops. ROI and Profit are `up-good` in the map, but neither has a threshold line to fall either
// side of, and a green ROI on a strip beside a zone-graded CPI would claim a verdict nobody wrote.
// So only the graded metrics take a tone; the rest draw in the neutral accent, and their plainness is
// the statement.
export function sparklineTone(metric: DynamicsMetric, change: number | null): MetricTone {
    return hasZone(metric) ? toneOf(metric, change) : 'neutral';
}

export type SparklineRow = {
    metric: DynamicsMetric;
    // The whole day's figures for this metric, oldest first — nulls included, because a gap is a fact.
    values: (number | null)[];
    // The trailing figure: the number printed beside the line.
    current: number | null;
    // What it moved by since the previous push, or null when either side was unmeasurable.
    change: number | null;
    // The zone each push earned, parallel to `values`. Only the graded metrics carry one — for the
    // rest every entry is `neutral`, for the same reason `sparklineTone` withholds a tone from them.
    zones: Zone[];
    tone: MetricTone;
};

export function sparklineRows(points: SeriesPoint[]): SparklineRow[] {
    const current = points.at(-1) ?? null;
    const previous = points.at(-2) ?? null;
    // The same call the comparison panel makes, so a green line and a green arrow can never disagree
    // about the same movement.
    const changes = current === null ? [] : compareFigures(previous?.figures ?? null, current.figures);

    return SPARKLINE_METRICS.map((metric): SparklineRow => {
        const change =
            changes.find((row) => {
                return row.metric === metric;
            })?.change ?? null;

        return {
            metric,
            values: points.map((point) => {
                return metricValue(point.figures, metric);
            }),
            zones: points.map((point) => {
                return hasZone(metric) ? zoneOfPoint(point, metric) : 'neutral';
            }),
            current: current === null ? null : metricValue(current.figures, metric),
            change,
            tone: sparklineTone(metric, change),
        };
    });
}
