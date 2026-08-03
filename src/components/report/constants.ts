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
    green: 'border-success/30 bg-success/5',
    yellow: 'border-warning/30 bg-warning/5',
    red: 'border-danger/30 bg-danger/5',
    neutral: 'border-border bg-muted/20',
};

// Solid zone accent (bucket pill background, row rail).
export const ZONE_ACCENT_CLASS: Record<Zone, string> = {
    green: 'bg-success',
    yellow: 'bg-warning',
    red: 'bg-danger',
    neutral: 'bg-neutral',
};

// Zone-tinted outline button (bucket "copy ids"), so the action reads in its bucket's colour.
export const ZONE_BUTTON_CLASS: Record<Zone, string> = {
    green: 'border-success/40 bg-success/10 text-success hover:bg-success/20 hover:text-success dark:bg-success/10 dark:border-success/40 dark:hover:bg-success/20',
    yellow: 'border-warning/40 bg-warning/10 text-warning hover:bg-warning/20 hover:text-warning dark:bg-warning/10 dark:border-warning/40 dark:hover:bg-warning/20',
    red: 'border-danger/40 bg-danger/10 text-danger hover:bg-danger/20 hover:text-danger dark:bg-danger/10 dark:border-danger/40 dark:hover:bg-danger/20',
    neutral: 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50',
};

// Violet counterpart to `ZONE_TEXT_CLASS` for the sales tally (dots, summary column).
export const SALES_TEXT_CLASS = 'text-violet-400';

// Sales panel's violet counterpart to `ZONE_BUTTON_CLASS` (sales is zone-independent).
export const SALES_BUTTON_CLASS =
    'border-violet-500/40 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 hover:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/40 dark:hover:bg-violet-500/20';

// Zone text colour for inline emphasis.
export const ZONE_TEXT_CLASS: Record<Zone, string> = {
    green: 'text-success',
    yellow: 'text-warning',
    red: 'text-danger',
    neutral: 'text-muted-foreground',
};
