import type { ChartTone } from '@/components/charts/types';
import type { DynamicsMetric, SeriesPoint } from '@/lib/domain/dynamics';
import { hasZone, zoneOfPoint } from '@/lib/domain/dynamics';
import { paddedDomain } from '@/components/charts/utils/ticks';
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
