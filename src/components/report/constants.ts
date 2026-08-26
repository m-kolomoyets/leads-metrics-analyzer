import type { Zone } from '@/lib/domain/types';

// Static class lookups (code-style: no dynamic `bg-${x}`). Zone is the only place the app spends
// colour (ADR-0019), so these four maps are the whole vocabulary for reporting a judgement: text,
// a solid rail, a hairline-bordered panel and a square chip.

// The three action buckets rendered per Account, in reference order (red → yellow → green).
export const BUCKET_ZONES = ['red', 'yellow', 'green'] as const;

export type BucketZone = (typeof BUCKET_ZONES)[number];

// Glyphs mirror the reference bucket pills.
export const ZONE_GLYPH: Record<BucketZone, string> = {
    red: '✕',
    yellow: '❚❚',
    green: '↑',
};

// A panel that reports a zone: the chrome surface, a hairline in the zone colour, and a glow of the
// same colour bled around it (see `@utility glow-zone-*`). No fill — a wash behind a whole panel
// says "this area is coloured", not "this figure is red"; the glow carries the same weight from
// outside without tinting a single figure. Neutral keeps the plain hairline, so the graded panels
// are the ones that catch the eye.
export const ZONE_CARD_CLASS: Record<Zone, string> = {
    green: 'border-zone-green glow-zone-green bg-surface',
    yellow: 'border-zone-yellow glow-zone-yellow bg-surface',
    red: 'border-zone-red glow-zone-red bg-surface',
    neutral: 'border-border bg-surface',
};

// Solid zone fill, for the 6px row rail on the creative table and the bucket markers — the only
// places a zone is painted rather than written.
export const ZONE_ACCENT_CLASS: Record<Zone, string> = {
    green: 'bg-zone-green',
    yellow: 'bg-zone-yellow',
    red: 'bg-zone-red',
    neutral: 'bg-zone-neutral',
};

// A status count: a small chip wearing its own purpose — hairline and glyph in the zone colour, the
// fill a 10% wash of the same. A neutral border read as chrome and left the bucket chips looking
// interchangeable; the chip now says which bucket it belongs to before the label is read.
export const ZONE_CHIP_CLASS: Record<Zone, string> = {
    green: 'border-zone-green bg-zone-green/10 text-zone-green',
    yellow: 'border-zone-yellow bg-zone-yellow/10 text-zone-yellow',
    red: 'border-zone-red bg-zone-red/10 text-zone-red',
    neutral: 'border-border bg-hover text-zone-neutral',
};

// The sales chip's counterpart: violet, the one hue outside the Zone scale (see `--sales`).
export const SALES_CHIP_CLASS = 'border-sales bg-sales/10 text-sales';

// The sales panel's frame — violet hairline over a barely-there wash, so the block reads as its own
// kind of thing beside the three zone buckets rather than as a fourth, uncoloured one.
export const SALES_CARD_CLASS = 'border-sales glow-sales bg-sales-tint';

// The same frame at table scale. A wash that reads as "barely there" behind a 200px block is a
// coloured page behind a full campaign table, and every figure in it then sits on violet — so the
// fill drops to a trace and the hairline carries the identity on its own.
export const SALES_PANEL_CLASS = 'border-sales/50 glow-sales bg-sales/[0.03]';

// A bucket panel: the same hairline as `ZONE_CARD_CLASS`, over a trace of its own zone. Used where
// the panel IS the bucket — the three id blocks under an Account, which sit beside the violet sales
// block and read as one row of four purposes. A section that merely *reports* a zone (the Geo hero's
// ROI and waste panels) keeps the plain surface: it is one figure's verdict, not a container's.
export const ZONE_PANEL_CLASS: Record<Zone, string> = {
    green: 'border-zone-green glow-zone-green bg-zone-green/8',
    yellow: 'border-zone-yellow glow-zone-yellow bg-zone-yellow/8',
    red: 'border-zone-red glow-zone-red bg-zone-red/8',
    neutral: 'border-border bg-hover',
};

// Zone-tinted outline button (bucket "copy ids"), so the action reads in its bucket's colour while
// resting on the same chrome as every other button.
export const ZONE_BUTTON_CLASS: Record<Zone, string> = {
    green: 'border-border text-zone-green hover:bg-hover hover:text-zone-green',
    yellow: 'border-border text-zone-yellow hover:bg-hover hover:text-zone-yellow',
    red: 'border-border text-zone-red hover:bg-hover hover:text-zone-red',
    neutral: 'border-border text-muted-foreground hover:bg-hover',
};

// The sales tally is not a judgement, so it may not borrow a Zone colour — but it is not chrome
// either. Violet is its own, reserved for it, and used nowhere else in the app.
export const SALES_TEXT_CLASS = 'text-sales';

// Sales panel's counterpart to `ZONE_BUTTON_CLASS`.
export const SALES_BUTTON_CLASS = 'border-border text-sales hover:bg-hover hover:text-sales';

// Zone text colour for inline emphasis. The default way to report a zone.
export const ZONE_TEXT_CLASS: Record<Zone, string> = {
    green: 'text-zone-green',
    yellow: 'text-zone-yellow',
    red: 'text-zone-red',
    neutral: 'text-muted-foreground',
};
