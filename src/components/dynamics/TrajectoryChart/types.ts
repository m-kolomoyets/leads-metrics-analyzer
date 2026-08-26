import type { CostMetric } from '@/lib/domain/dynamics';

// The right axis's figure. Revenue is the default — it is the number a buyer quotes — and Profit is
// one click away for the person judging rather than reporting. Spend and ROI joined them so the
// sparkline strip can actually switch the chart to what it is showing: a strip that offers ROI and a
// chart that cannot draw it would be a control that lies.
//
// None of the four carries a zone. There are no thresholds for money and none for ROI on this page,
// so all four draw in the neutral accent (SPEC §6.6).
export type FigureMetric = 'revenue' | 'profit' | 'spend' | 'roi';

// Every line the chart can draw: the four cost-per metrics on the left axis, and whichever figure the
// toggle put on the right. Both are deliberately one union — a tooltip is opened on a point of a
// line, and which line it was is the only thing that differs.
export type ChartMetric = CostMetric | FigureMetric;

// The point a tooltip is open on: which push, and which of its lines was pointed at.
export type ActivePoint = {
    index: number;
    metric: ChartMetric;
};
