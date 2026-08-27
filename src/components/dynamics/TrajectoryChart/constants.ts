import type { DeltaFlags } from '@/lib/domain/dynamics';

// Which of the three edge cases a point carries.
export type DeltaFlag = keyof DeltaFlags;

// How tall the plot stands. The library sizes itself to this box, so the number is plain CSS pixels
// rather than the viewBox units the hand-drawn version carried.
export const CHART_HEIGHT = 320;

// The restatement badge's ring, and the flag glyph's colour: a restatement is chrome about the push,
// never the verdict on it, so it stays off the zone palette. The segment itself keeps its zone colours
// and is faded instead.
const CORRECTED_STROKE = 'var(--muted-foreground)';

// The three delta-mode edge cases (SPEC §4.3), each with its own treatment rather than a shrug. They
// are drawn in a lane of their own beneath the plot: the flags describe the INTERVAL, and hanging
// them off the line would make them look like properties of the figure instead.
export const FLAG_GLYPH: Record<DeltaFlag, string> = {
    firstOfDay: '\u25B8',
    corrected: '\u25C6',
    spendWithoutConversions: '\u25B2',
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
