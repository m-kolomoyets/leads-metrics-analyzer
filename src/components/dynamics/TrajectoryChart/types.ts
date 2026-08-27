import type { ChartMetric } from '../types';

// The point a tooltip is open on: which push, and which of its lines was pointed at.
export type ActivePoint = {
    index: number;
    metric: ChartMetric;
};
