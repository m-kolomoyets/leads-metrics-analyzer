import type { CostMetric } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';

// The chart's fixed drawing space. The SVG scales to its container through the viewBox, so every
// coordinate in the component is in these units and the container's aspect ratio matches them —
// which is what lets the HTML tooltip be positioned as a plain percentage of the same box.
export const PLOT = {
    width: 720,
    height: 300,
    top: 16,
    right: 60,
    bottom: 34,
    left: 56,
};

export const PLOT_LEFT = PLOT.left;
export const PLOT_RIGHT = PLOT.width - PLOT.right;
export const PLOT_TOP = PLOT.top;
export const PLOT_BOTTOM = PLOT.height - PLOT.bottom;

// Cost lines are told apart by DASH, never by colour: colour is spoken for by the zone, and two
// meanings on one channel is one meaning lost. CPI — the default line — is the solid one.
export const COST_DASH: Record<CostMetric, string | undefined> = {
    cpi: undefined,
    cpr: '8 4',
    cps: '2 4',
    cpc: '12 4 2 4',
};

export const COST_LABEL: Record<CostMetric, string> = {
    cpi: 'CPI',
    cpr: 'CPR',
    cps: 'CPS',
    cpc: 'CPC',
};

// The zone palette, straight off the theme tokens so the chart follows a theme switch. `var()` is
// unusable in an SVG presentation attribute, so every one of these is set through `style`.
export const ZONE_STROKE: Record<Zone, string> = {
    green: 'var(--success)',
    yellow: 'var(--warning)',
    red: 'var(--danger)',
    neutral: 'var(--neutral)',
};

export const ZONE_LABEL: Record<Zone, string> = {
    green: 'green',
    yellow: 'yellow',
    red: 'red',
    neutral: 'ungraded',
};

export const INCOME_LABEL = {
    revenue: 'Revenue',
    profit: 'Profit',
};

// A restated interval measures nothing, so it is painted as data rather than as a verdict.
export const CORRECTED_STROKE = 'var(--muted-foreground)';

// Revenue and Profit take no zone — there are no thresholds for income — and draw in the neutral
// accent so their plainness reads as deliberate rather than as a missing grade.
export const INCOME_STROKE = 'var(--accent-solid)';
