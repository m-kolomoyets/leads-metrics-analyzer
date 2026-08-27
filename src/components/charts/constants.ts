import type { ChartTone } from './types';

// Zone → the token that paints it. Recharts writes these into SVG `stroke`/`stop-color` attributes,
// where `var()` resolves exactly as it does in CSS — so the charts read the same single palette
// source every other surface does (ADR-0020) instead of carrying a second copy of the zone colours.
export const TONE_STROKE: Record<ChartTone, string> = {
    green: 'var(--zone-green)',
    yellow: 'var(--zone-yellow)',
    red: 'var(--zone-red)',
    neutral: 'var(--zone-neutral)',
};

// What an UNGRADED line is drawn in: the accent, not a grade. Money and ROI have no thresholds
// anywhere (SPEC §6.6), so painting them from the zone triad would be a verdict nobody wrote —
// they take the one colour the app reserves for "this is a line, and it means nothing about good or
// bad" (ADR-0019). Its halo follows the stroke, so an ungraded line glows blue.
export const UNGRADED_STROKE = 'var(--accent)';

// Monotone, everywhere, and never `natural` or `basis`. A monotone cubic cannot rise above the
// highest point it joins, so the curve invents no peak the day never had — and a zone gradient stop
// therefore always sits at a moment the cost really reached (ADR-0024).
export const CURVE = 'monotone';

// The template's stroke is heavy: the line IS the chart, and the grid behind it is a whisper.
export const STROKE_WIDTH = { big: 5, small: 4 };

// How much wider than its line the blurred halo behind it is drawn.
export const HALO_SPREAD = 6;

// The point marking the push a tooltip is open on, and the ring that breathes under it. No other
// push is marked: the line is the shape, and a dot at every push competes with it.
export const ACTIVE_POINT_RADIUS = 5;
