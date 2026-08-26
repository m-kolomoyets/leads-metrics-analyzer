import type { MetricTrend, TrendMetric } from '@/lib/domain/dynamics';
import { METRIC_FORMAT } from '../utils/metrics';
import { TrendArrow } from '../TrendArrow';

// The arrow a table cell wears (SPEC §6.7): one row's movement in one metric, against the previous
// Snapshot. It renders nothing at all when there is no previous push, when the row is new, or when
// the metric did not move — silence is the honest answer to "what changed", and an arrow that points
// nowhere is not.
//
// Everything it knows comes from elsewhere: the movement from the dynamics domain, the format from
// the shared metric table, the colour from the shared meaning map via `TrendArrow`. So a CPI arrow in
// the Offers table cannot disagree with the same CPI arrow in the comparison panel above it.

type RowTrendProps = {
    metric: TrendMetric;
    // The whole row's movement, or null when there is nothing to compare the row against.
    trend: MetricTrend | null;
};

function RowTrend({ metric, trend }: RowTrendProps) {
    const change = trend === null ? null : trend[metric];

    return (
        <TrendArrow
            metric={metric}
            change={change}
            label={METRIC_FORMAT[metric].change(change)}
            hideLabel={true}
            className="ml-1 align-middle text-[10px]"
        />
    );
}

export { RowTrend };
