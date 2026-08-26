import type { Zone } from '@/lib/domain/types';

// The zone palette every dynamics view draws with, straight off the theme tokens so a theme switch
// carries. `var()` is unusable in an SVG presentation attribute, so each of these is set through
// `style` rather than as a `stroke=` attribute.
export const ZONE_STROKE: Record<Zone, string> = {
    green: 'var(--zone-green)',
    yellow: 'var(--zone-yellow)',
    red: 'var(--zone-red)',
    neutral: 'var(--zone-neutral)',
};

export const ZONE_LABEL: Record<Zone, string> = {
    green: 'green',
    yellow: 'yellow',
    red: 'red',
    neutral: 'ungraded',
};
