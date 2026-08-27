import type { CostMetric } from '@/lib/domain/dynamics';
import { COST_METRICS } from '@/lib/domain/dynamics';

// The one rule the left axis has: any combination of the four cost metrics, and never none of them.
// A cleared axis is not a smaller reading, it is a chart with nothing on the side the zones are
// drawn against — so the last lit toggle refuses to go out rather than leaving the reader hunting
// for the one that brings the day back.
export function toggleCostMetric(current: CostMetric[], metric: CostMetric): CostMetric[] {
    if (current.includes(metric)) {
        if (current.length <= 1) {
            return current;
        }

        return current.filter((one) => {
            return one !== metric;
        });
    }

    // Filtered out of the canonical order rather than appended: each metric's dash is fixed to it,
    // and drawing in click order would shuffle the plot under a reader who only added a line.
    return COST_METRICS.filter((one) => {
        return one === metric || current.includes(one);
    });
}
