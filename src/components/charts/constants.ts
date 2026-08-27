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

// The ring under that point. Wider than the point at rest and wider still at the top of its breath,
// so the mark reads as "this one" without the point itself ever moving.
export const ACTIVE_RING_RADIUS = 9;

// What a restated interval is drawn at. A clamped remainder is not a measurement, so the stroke
// across it is weakened rather than removed: the shape of the day stays readable, and the reader can
// still see that the two pushes either side of it are joined.
export const FADED_OPACITY = 0.55;

// The restatement badge's ring and the flag lane's rules. Chrome ABOUT a push, never a verdict on
// it, so it stays off the zone palette (ADR-0019) — a badge in green would read as praise.
export const CHROME_STROKE = 'var(--muted-foreground)';

// The ring a restated push wears, drawn around a point that is otherwise unmarked: only the push
// that did the correcting is badged, and the badge does not cascade onto the pushes after it.
export const BADGE_RADIUS = 8;

// The lane the edge-case glyphs hang in, beneath the time axis. It is given its own strip of the
// card's height rather than being laid over the plot: the flags describe the INTERVAL, and printing
// them on the line would make them look like properties of the figure.
export const FLAG_LANE_HEIGHT = 18;
export const FLAG_GLYPH_SIZE = 11;
