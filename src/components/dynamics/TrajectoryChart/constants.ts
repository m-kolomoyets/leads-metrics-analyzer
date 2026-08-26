import type { CostMetric, DeltaFlags } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';

// Which of the three edge cases a point carries.
export type DeltaFlag = keyof DeltaFlags;

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

// A restated interval measures nothing, so it is painted as data rather than as a verdict.
export const CORRECTED_STROKE = 'var(--muted-foreground)';

// The right axis takes no zone — there are no thresholds for money and none for ROI — and its line
// draws in the neutral accent so its plainness reads as deliberate rather than as a missing grade.
export const FIGURE_STROKE = 'var(--accent-solid)';

// The three delta-mode edge cases (SPEC §4.3), each with its own treatment rather than a shrug. They
// are drawn in a lane of their own beneath the plot: the flags describe the INTERVAL, and hanging
// them off the line would make them look like properties of the figure instead.
export const FLAG_GLYPH: Record<DeltaFlag, string> = {
    firstOfDay: '\u25B8',
    corrected: '\u25C6',
    spendWithoutConversions: '\u25B2',
};

export const FLAG_STROKE: Record<DeltaFlag, string> = {
    firstOfDay: 'var(--accent-solid)',
    corrected: CORRECTED_STROKE,
    spendWithoutConversions: 'var(--warning)',
};

export const FLAG_LABEL: Record<DeltaFlag, string> = {
    firstOfDay: 'First report today',
    corrected: 'Restated by Facebook',
    spendWithoutConversions: 'Spend without installs',
};

export const FLAG_HINT: Record<DeltaFlag, string> = {
    firstOfDay: 'Nothing came before it, so this interval is the whole day so far rather than a step.',
    corrected: 'A figure went backwards, so the interval is a clamped remainder and measures nothing.',
    spendWithoutConversions: 'Money moved and nothing installed, so every cost-per here is unmeasurable.',
};
