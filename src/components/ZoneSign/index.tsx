import { cn } from '@/lib/utils/cn';

// A zone said in one glyph: a coloured dot and the comparison sign that belongs to it. Shared,
// because the band is written in two places now — the editors, where the bounds are fields, and the
// report, where they are frozen numbers — and a band that reads one way while being set and another
// way while being read is two vocabularies for one idea.

const DOT_CLASS = {
    green: 'bg-zone-green',
    // The rail's own yellow, not the generic warning tone: the same band named twice in two colours
    // reads as two different things.
    yellow: 'bg-zone-yellow',
    red: 'bg-zone-red',
} as const;

// The sign carries the same colour as the dot it belongs to: at this size a muted "<" beside a
// coloured dot read as a stray piece of punctuation rather than part of the mark.
const SIGN_CLASS = {
    green: 'text-zone-green',
    yellow: 'text-zone-yellow',
    red: 'text-zone-red',
} as const;

type BandZone = keyof typeof DOT_CLASS;

type ZoneSignProps = {
    zone: BandZone;
    // The zone's name in the reader's language. Not drawn — it is the hover title, for the reader who
    // has to check which colour they are looking at.
    label: string;
    sign: string;
    // Which side the comparison falls on, following how the bound is said: "green < 8" puts the sign
    // after the zone, "8 < red" puts it before.
    signFirst?: boolean;
    className?: string;
};

// A dot and its comparison as one object, so the pair never wraps apart.
function ZoneSign({ zone, label, sign, signFirst = false, className }: ZoneSignProps) {
    const dot = <span aria-hidden={true} className={cn('size-3 shrink-0 rounded-full', DOT_CLASS[zone])} />;
    const comparison = (
        <span aria-hidden={true} className={cn('text-sm', SIGN_CLASS[zone])}>
            {sign}
        </span>
    );

    return (
        <span className={cn('flex items-center gap-1 select-none', className)} title={label}>
            {signFirst ? comparison : dot}
            {signFirst ? dot : comparison}
        </span>
    );
}

export { ZoneSign };
export type { BandZone };
