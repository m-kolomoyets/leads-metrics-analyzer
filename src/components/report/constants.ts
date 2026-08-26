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

// A panel that reports a zone: the chrome surface, a hairline in the zone colour. No fill — a wash
// behind a whole panel says "this area is coloured", not "this figure is red".
export const ZONE_CARD_CLASS: Record<Zone, string> = {
    green: 'border-zone-green bg-surface',
    yellow: 'border-zone-yellow bg-surface',
    red: 'border-zone-red bg-surface',
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

// A status count: a small square-cornered chip on the chrome surface, the count itself in the zone
// colour. Replaces the gradient capsules — the number is the signal, the chip only bounds it.
export const ZONE_CHIP_CLASS: Record<Zone, string> = {
    green: 'border-border bg-surface text-zone-green',
    yellow: 'border-border bg-surface text-zone-yellow',
    red: 'border-border bg-surface text-zone-red',
    neutral: 'border-border bg-surface text-zone-neutral',
};

// Zone-tinted outline button (bucket "copy ids"), so the action reads in its bucket's colour while
// resting on the same chrome as every other button.
export const ZONE_BUTTON_CLASS: Record<Zone, string> = {
    green: 'border-border text-zone-green hover:bg-muted hover:text-zone-green',
    yellow: 'border-border text-zone-yellow hover:bg-muted hover:text-zone-yellow',
    red: 'border-border text-zone-red hover:bg-muted hover:text-zone-red',
    neutral: 'border-border text-muted-foreground hover:bg-muted',
};

// The sales tally is zone-independent, so it gets no colour of its own — it reads in the foreground
// and is distinguished by its column, not by a hue the system does not have.
export const SALES_TEXT_CLASS = 'text-foreground';

// Sales panel's counterpart to `ZONE_BUTTON_CLASS`, achromatic for the same reason.
export const SALES_BUTTON_CLASS = 'border-border text-foreground hover:bg-muted';

// Zone text colour for inline emphasis. The default way to report a zone.
export const ZONE_TEXT_CLASS: Record<Zone, string> = {
    green: 'text-zone-green',
    yellow: 'text-zone-yellow',
    red: 'text-zone-red',
    neutral: 'text-muted-foreground',
};
