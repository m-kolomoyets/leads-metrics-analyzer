import type { CostMetric } from '@/lib/domain/dynamics';

// How the chart reads a day. Shared across the Dynamics component family because the toggle that
// sets it lives in the page header while the only thing it affects is the chart (SPEC §6.4/§6.6).
//
// `cumulative` is the honest picture of the day: a Snapshot covers 00:00 to its own push time, so a
// bad morning keeps dragging on it. `delta` answers a different and equally true question — what is
// this buyer buying right now. Both numbers are correct; they answer different questions, and the
// toggle is what lets a lead ask the second one.
export type DynamicsMode = 'cumulative' | 'delta';

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
