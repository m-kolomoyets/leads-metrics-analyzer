import type { CostMetric, DeltaFlags } from '@/lib/domain/dynamics';
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

// Which of the three edge cases an interval carries (SPEC §4.3). They live here rather than beside
// either chart because both drawings of the Trajectory name the same three cases, and two copies of
// a glyph table is one copy that can drift.
export type DeltaFlag = keyof DeltaFlags;

// Canonical order: the day starts, Facebook restates, money goes out for nothing. Both the lane and
// the legend read it, so a push carrying two flags prints them in the same order the key lists them.
export const DELTA_FLAGS: DeltaFlag[] = ['firstOfDay', 'corrected', 'spendWithoutConversions'];

// The restatement badge's ring, and the restated flag's glyph: a restatement is chrome about the
// push, never the verdict on it, so it stays off the zone palette. The interval itself keeps its
// zone colours and is faded instead.
const CORRECTED_STROKE = 'var(--muted-foreground)';

export const FLAG_GLYPH: Record<DeltaFlag, string> = {
    firstOfDay: '▸',
    corrected: '◆',
    spendWithoutConversions: '▲',
};

export const FLAG_STROKE: Record<DeltaFlag, string> = {
    firstOfDay: 'var(--accent)',
    corrected: CORRECTED_STROKE,
    spendWithoutConversions: 'var(--zone-yellow)',
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
