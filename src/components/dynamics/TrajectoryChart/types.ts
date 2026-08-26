import type { CostMetric } from '@/lib/domain/dynamics';

// Every line the chart can draw: the four cost-per metrics on the left axis, and whichever income
// figure the toggle put on the right. Income is deliberately part of the same union — a tooltip is
// opened on a point of a line, and which line it was is the only thing that differs.
export type ChartMetric = CostMetric | 'revenue' | 'profit';

// Which income figure the right axis is showing. Revenue is the default: it is the figure a buyer
// quotes, and Profit is one click away for the person who is judging rather than reporting.
export type IncomeMetric = 'revenue' | 'profit';

// The point a tooltip is open on: which push, and which of its lines was pointed at.
export type ActivePoint = {
    index: number;
    metric: ChartMetric;
};
