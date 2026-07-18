import type { Zone } from '@/lib/domain/types';

// Static class lookups (code-style: no dynamic `bg-${x}`). The reference's traffic-light glass, mapped
// to Tailwind tokens — a tinted card per zone plus a solid accent bar.

// The three action buckets rendered per Account, in reference order (red → yellow → green).
export const BUCKET_ZONES = ['red', 'yellow', 'green'] as const;

export type BucketZone = (typeof BUCKET_ZONES)[number];

// Glyphs mirror the reference bucket pills.
export const ZONE_GLYPH: Record<BucketZone, string> = {
    red: '✕',
    yellow: '❚❚',
    green: '↑',
};

// Tinted glass card per zone (border + faint fill), for bucket panels and account frames.
export const ZONE_CARD_CLASS: Record<Zone, string> = {
    green: 'border-green-500/30 bg-green-500/5',
    yellow: 'border-yellow-500/30 bg-yellow-500/5',
    red: 'border-red-500/30 bg-red-500/5',
    neutral: 'border-border bg-muted/20',
};

// Solid zone accent (bucket pill background, row rail).
export const ZONE_ACCENT_CLASS: Record<Zone, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    neutral: 'bg-muted-foreground',
};

// Zone text colour for inline emphasis.
export const ZONE_TEXT_CLASS: Record<Zone, string> = {
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    neutral: 'text-muted-foreground',
};
