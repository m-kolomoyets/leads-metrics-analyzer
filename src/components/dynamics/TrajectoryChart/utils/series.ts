import type { UTCTimestamp } from 'lightweight-charts';
import type { SeriesPoint } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';
import type { DynamicsMode } from '../../types';
import type { ZonePoint } from '../../ZoneSeries/types';
import type { ChartMetric } from '../types';
import { deltasFor, hasZone, zoneOfPoint } from '@/lib/domain/dynamics';
import { FLAG_GLYPH } from '../constants';
import { metricValue } from '../../utils/metrics';

// Snapshots → what the chart library eats. Pure, so the two rules that make the chart honest — an
// unmeasurable push is whitespace, and a restated interval is faded rather than silent — are checkable
// without a canvas (ADR-0005).

// The x axis is a clock, and the library demands strictly ascending times. Two pushes inside the same
// second would collide and be rejected, so a colliding stamp is nudged one second on: at a scale where
// the ticks are minutes, a second of drift is invisible, and dropping the push would not be.
export function timesOf(points: SeriesPoint[]): UTCTimestamp[] {
    const times: UTCTimestamp[] = [];
    let previous = 0;

    for (const point of points) {
        const parsed = Math.floor(new Date(point.takenAt).getTime() / 1000);
        const seconds = Number.isNaN(parsed) ? previous + 1 : parsed;
        const time = seconds > previous ? seconds : previous + 1;

        times.push(time as UTCTimestamp);
        previous = time;
    }

    return times;
}

type SeriesDataInput = {
    points: SeriesPoint[];
    times: UTCTimestamp[];
    metric: ChartMetric;
    mode: DynamicsMode;
    // Only one line carries the edge-case lane: three metrics each printing the same glyph under the
    // same push would read as three different problems.
    withFlags: boolean;
    // Indexed by point: entry i describes the interval ENDING at i, which is the stroke drawn into it.
    corrected: boolean[];
    flags: readonly (readonly string[])[];
};

// One line's data. A push the metric could not be measured at is emitted as whitespace — a break in
// the line — because interpolating across it would invent a cost nobody paid.
export function seriesDataFor({
    points,
    times,
    metric,
    withFlags,
    corrected,
    flags,
}: SeriesDataInput): (ZonePoint | { time: UTCTimestamp })[] {
    return points.map((point, index) => {
        const time = times[index];
        const value = metricValue(point.figures, metric);
        const lane = withFlags ? flags[index] : [];

        if (value === null || !Number.isFinite(value)) {
            return { time };
        }

        return {
            time,
            value,
            // Money and ROI take no zone: there are no thresholds for them, and a green Revenue would
            // be a verdict nobody wrote.
            zone: (hasZone(metric) ? zoneOfPoint(point, metric) : 'neutral') satisfies Zone,
            faded: corrected[index] === true,
            badge: point.replacedAt !== null,
            flags: lane,
        };
    });
}

// The glyph lane per push, in delta mode only: in cumulative mode the flags describe intervals that
// are not what the chart is drawing.
export function flagsFor(points: SeriesPoint[], mode: DynamicsMode): string[][] {
    if (mode !== 'delta') {
        return points.map(() => {
            return [];
        });
    }

    return deltasFor(points).map((delta) => {
        return Object.entries(delta.flags)
            .filter(([, raised]) => {
                return raised;
            })
            .map(([flag]) => {
                return FLAG_GLYPH[flag as keyof typeof FLAG_GLYPH];
            });
    });
}
