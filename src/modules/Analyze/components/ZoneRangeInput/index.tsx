import type { ChangeEvent } from 'react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';

// The whole band as ONE control: ● < [8] ● ≤ [14] < ●. The two bounds are not two settings that
// happen to sit near each other — they are the single line the reader draws through a metric, and
// two separate boxes with loose words between them made the eye assemble that line every time.
// Inside one wrapper the row reads left to right as the sentence it always was.
//
// The zone is a DOT, not its name. Five rows of "зел / жовт / черв" is the same three words written
// fifteen times, and the words were only ever standing in for a colour the app already speaks in
// colour everywhere else. The dot says it in one glyph, the comparison sign beside it keeps the
// direction, and the name survives as the dot's hover title and in each field's accessible name.

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

type Zone = keyof typeof DOT_CLASS;

type ZoneSignProps = {
    zone: Zone;
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
        <span aria-hidden={true} className={cn('text-xs', SIGN_CLASS[zone])}>
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

type ZoneRangeInputProps = {
    idPrefix: string;
    // Draft strings, so a half-typed or empty bound survives without collapsing to NaN.
    green: string;
    yellow: string;
    // The zone names, kept for the dots' hover titles now that the dots carry the colour.
    greenLabel: string;
    yellowLabel: string;
    redLabel: string;
    // The dots are decoration for a screen reader — it cannot act on a colour — so each field still
    // needs a name of its own.
    greenAriaLabel: string;
    yellowAriaLabel: string;
    disabled: boolean;
    onChange: (bound: 'gy' | 'yr', value: string) => void;
    // Fired when a field is done being typed into. The bounds clamp against each other HERE and not
    // on every keystroke: "15" passes through "1", and a clamp on that "1" would rewrite the field
    // to its neighbour mid-word and turn the next keystroke into a number nobody asked for.
    onCommit?: (bound: 'gy' | 'yr') => void;
    className?: string;
};

const FIELD_CLASS = 'h-full w-14 border-0 px-0 text-sm tabular-nums outline-none';

function ZoneRangeInput({
    idPrefix,
    green,
    yellow,
    greenLabel,
    yellowLabel,
    redLabel,
    greenAriaLabel,
    yellowAriaLabel,
    disabled,
    onChange,
    onCommit,
    className,
}: ZoneRangeInputProps) {
    function handleGreenChange(event: ChangeEvent<HTMLInputElement>) {
        onChange('gy', event.target.value);
    }

    function handleYellowChange(event: ChangeEvent<HTMLInputElement>) {
        onChange('yr', event.target.value);
    }

    function handleGreenBlur() {
        onCommit?.('gy');
    }

    function handleYellowBlur() {
        onCommit?.('yr');
    }

    return (
        // The wrapper is what the reader reads as the control, so it takes the focus ring and the
        // fields inside give theirs up.
        <div
            className={cn(
                'border-input focus-ring-within flex h-8 w-fit items-center gap-2 rounded-md border px-2.5 motion-safe:transition-colors motion-safe:duration-150',
                disabled && 'pointer-events-none opacity-50',
                className
            )}
        >
            <ZoneSign zone="green" label={greenLabel} sign="<" />
            <Input
                id={`${idPrefix}-gy`}
                type="number"
                inputMode="decimal"
                aria-label={greenAriaLabel}
                disabled={disabled}
                value={green}
                onChange={handleGreenChange}
                onBlur={handleGreenBlur}
                className={FIELD_CLASS}
            />
            {/* Extra air after this one: it is the only sign the reader passes THROUGH — green's is
                read left of a number, red's right of one, but the yellow bound closes one band and
                opens the next, and at the row's even spacing it clung to the field ahead of it. */}
            <ZoneSign zone="yellow" label={yellowLabel} sign="≤" className="mr-1" />
            <Input
                id={`${idPrefix}-yr`}
                type="number"
                inputMode="decimal"
                aria-label={yellowAriaLabel}
                disabled={disabled}
                value={yellow}
                onChange={handleYellowChange}
                onBlur={handleYellowBlur}
                className={FIELD_CLASS}
            />
            <ZoneSign zone="red" label={redLabel} sign="<" signFirst={true} />
        </div>
    );
}

export { ZoneRangeInput };
