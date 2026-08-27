import type { CostMetric } from '@/lib/domain/dynamics';
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

// Cost lines are told apart by DASH, never by colour: colour is spoken for by the zone, and two
// meanings on one channel is one meaning lost. CPI — the default line — is the solid one.
// Canvas takes a dash array, and so does SVG's `stroke-dasharray` once joined — one shape, so the
// legend swatch and the line it describes can never drift apart.
export const COST_DASH: Record<CostMetric, number[]> = {
    cpi: [],
    cpr: [8, 4],
    cps: [2, 4],
    cpc: [12, 4, 2, 4],
};
