import type { Zone } from '@/lib/domain/types';

// How the chart reads a day. Shared across the Dynamics component family because the toggle that
// sets it lives in the page header while the only thing it affects is the chart (SPEC §6.4/§6.6).
//
// `cumulative` is the honest picture of the day: a Snapshot covers 00:00 to its own push time, so a
// bad morning keeps dragging on it. `delta` answers a different and equally true question — what is
// this buyer buying right now. Both numbers are correct; they answer different questions, and the
// toggle is what lets a lead ask the second one.
export type DynamicsMode = 'cumulative' | 'delta';

// The whole appearance surface Lightweight Charts exposes, resolved from CSS tokens. It is deliberately
// wider than any one chart needs: anything left off it falls back to the library's own defaults, which
// are a different design system showing through in the middle of ours (ADR-0020).
//
// Colour is spent on Zone alone (ADR-0019), so the chrome here is achromatic and the accent appears
// only where a metric is ungraded.
export type ChartPalette = {
    zone: Record<Zone, string>;
    accent: string;
    // The page behind the canvas. Used to punch a ring out of a point, never painted as a background —
    // the chart is transparent so the card it sits in shows through.
    background: string;
    // The floating surface, worn by the crosshair's own labels so they read like a tooltip.
    surface: string;
    muted: string;
    border: string;
    text: string;
    // The crosshair and the series' own guide: a translucent white on a dark theme, the same wash in
    // ink on a light one. Deliberately not a token — it has to be see-through, and the theme's colours
    // are opaque.
    guide: string;
    // Canvas text has no cascade to inherit from, so the DOM's font is handed over explicitly. Without
    // it the axis labels render in the library's system stack beside numbers set in Inter.
    fontFamily: string;
    fontSize: number;
};
