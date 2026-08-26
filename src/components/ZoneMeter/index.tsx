import { cn } from '@/lib/utils/cn';
import { cost } from '@/components/report/utils/format';
import { meterScale } from './utils/scale';
import { useSettledMax } from './hooks/useSettledMax';

// The plan, drawn instead of spelled. "green < 8.00 · red > 14.00" makes the reader hold three
// numbers in their head and do the comparison themselves; a rail with the two lines on it and the
// figure's own mark between them answers "how bad is this" before a single number is read.
//
// The gradient is the same story the trajectory chart's line tells — green cooling through amber
// into red — so every place in the app that reports a band speaks one language. Shared rather than
// per-view for exactly that reason: the tooltip's cost-per meter and the report's waste-share meter
// are the same picture of the same idea, and drew it two different ways before.
//
// The threshold EDITORS draw the same rail with no figure on it (`value={null}`, `labels="none"`):
// the number fields stay the only thing you can edit and the rail is their mirror, never a second
// control. A draggable rail beside a number field is two truths for one value, and the moment they
// disagree the reader has to guess which one the server got.

type ZoneMeterProps = {
    // The figure in the metric's own units, or null when it could not be measured — and null again
    // in the editors, where there is no figure yet, only the plan being drawn.
    value: number | null;
    // This Snapshot's own frozen thresholds (ADR-0002), never the reader's live preset.
    greenBelow: number;
    redAbove: number;
    // A rail with a real end: percent bands pass 100. Omitted → open-ended, end derived from the
    // thresholds themselves so the zones stay legible with no data behind them.
    max?: number;
    // How a number on this rail reads. Defaults to money, since most of them are; the waste meter
    // passes a percent formatter. The rail itself is unitless — only this decides what it says.
    format?: (value: number) => string;
    // `none` drops the two threshold numbers under their notches. The editors set it: the input
    // fields already show 8 and 14, and printing them again six pixels below is the same number
    // twice — the notch's POSITION is what the rail was added to say.
    labels?: 'values' | 'none';
    // Draw the two thresholds as HANDLES — the same object the tooltip plants a figure with —
    // instead of the hairlines a report rail uses. A report has a figure riding on it and the lines
    // are backdrop; an editor rail has nothing BUT the lines, and a 1px scratch is too quiet to be
    // the only thing on it. Grabbing the value-indicator shape is deliberate: it is already the
    // app's word for "this exact spot on the rail".
    boundMarks?: boolean;
    // The draft cannot be drawn — a field is empty, unparseable, or green ran past red. A muted
    // flat rail says "no map yet" honestly; drawing the gradient backwards would render an
    // impossible plan as if it were a real one.
    invalid?: boolean;
    className?: string;
};

function ZoneMeter({
    value,
    greenBelow,
    redAbove,
    max,
    format = cost,
    labels = 'values',
    boundMarks = false,
    invalid = false,
    className,
}: ZoneMeterProps) {
    const settledMax = useSettledMax(meterScale(value, greenBelow, redAbove, max).max);
    const scale = meterScale(value, greenBelow, redAbove, settledMax);
    // Green PAST red would run the gradient backwards. Green landing exactly ON red is a different
    // thing — a band with no yellow in it, which the editors clamp to and someone can mean — so only
    // the crossing counts as a broken draft.
    const isBroken = invalid || greenBelow > redAbove;
    // The colour turns AT the lines, with a short blend either side: a hard edge would claim a cost a
    // cent under the line is a different kind of thing from one a cent over it.
    const gradient = `linear-gradient(90deg,
        var(--zone-green) 0%,
        var(--zone-green) ${Math.max(scale.green - 6, 0)}%,
        var(--zone-yellow) ${Math.min(scale.green + 4, 100)}%,
        var(--zone-yellow) ${Math.max(scale.red - 6, 0)}%,
        var(--zone-red) ${Math.min(scale.red + 4, 100)}%,
        var(--zone-red) 100%)`;

    // A label sitting exactly over its notch would hang off the rail at either end, so the ones near
    // the edges are pushed inwards instead of centred.
    function shiftOf(position: number): string {
        if (position < 12) {
            return 'translate-x-0';
        }

        if (position > 88) {
            return '-translate-x-full';
        }

        return '-translate-x-1/2';
    }

    return (
        <div className={cn('flex flex-col', className)}>
            {/* The figure rides ABOVE its own mark: the numbers under the rail are the plan, and the
                one over it is what actually happened. The row is held even with no figure so a rail
                that gains one — or an editor row beside one that has none — never shifts the page. */}
            {value !== null && (
                <div className="relative h-5 text-xs tabular-nums">
                    {!isBroken && (
                        <span
                            aria-hidden={true}
                            className={cn(
                                'bg-foreground text-background absolute rounded-sm px-1.5 py-px font-medium transition-[left] duration-150 ease-out',
                                shiftOf(scale.value)
                            )}
                            style={{ left: `${scale.value}%` }}
                        >
                            {format(value)}
                            {scale.clamped ? '+' : ''}
                        </span>
                    )}
                </div>
            )}

            {/* Handles stand a few pixels proud of the rail. With no figure above them there is no
                chip row to stand into, so the rail keeps that air itself rather than clipping them
                against whatever sits above it. */}
            {value === null && boundMarks && <div className="h-1.5" />}

            <div
                className={cn('relative h-2 w-full rounded-full', isBroken && 'bg-muted')}
                style={isBroken ? undefined : { background: gradient }}
            >
                {!isBroken && (
                    <>
                        {/* The two lines themselves, notched into the rail: the gradient says which way
                            the verdict goes, the notches say exactly where it changes. */}
                        <span
                            aria-hidden={true}
                            className={cn(
                                'absolute transition-[left] duration-150 ease-out',
                                boundMarks
                                    ? 'bg-foreground ring-popover -top-1 h-4 w-[3px] rounded-full ring-2'
                                    : 'bg-popover/70 inset-y-0 w-px',
                                boundMarks && (scale.green > 98 ? '-translate-x-full' : '-translate-x-1/2')
                            )}
                            style={{ left: `${scale.green}%` }}
                        />
                        <span
                            aria-hidden={true}
                            className={cn(
                                'absolute transition-[left] duration-150 ease-out',
                                boundMarks
                                    ? 'bg-foreground ring-popover -top-1 h-4 w-[3px] rounded-full ring-2'
                                    : 'bg-popover/70 inset-y-0 w-px',
                                boundMarks && (scale.red > 98 ? '-translate-x-full' : '-translate-x-1/2')
                            )}
                            style={{ left: `${scale.red}%` }}
                        />

                        {/* The mark and the chip above it are one object: the chip names the figure, the
                            mark plants it on the rail, and a stem joins them so the eye never has to
                            guess which number belongs to which position. */}
                        {value !== null && (
                            <span
                                aria-hidden={true}
                                className={cn(
                                    'bg-foreground ring-popover absolute -top-1 h-4 w-[3px] rounded-full ring-2 transition-[left] duration-150 ease-out',
                                    scale.value > 98 ? '-translate-x-full' : '-translate-x-1/2'
                                )}
                                style={{ left: `${scale.value}%` }}
                            />
                        )}
                    </>
                )}
            </div>

            {/* The thresholds printed WHERE they are rather than listed underneath: the position is
                the information, and a number beside its own notch needs no "green <" to explain it. */}
            {labels === 'values' && (
                <div className="text-muted-foreground relative h-4 pt-0.5 text-xs tabular-nums">
                    {!isBroken && (
                        <>
                            <span
                                aria-hidden={true}
                                className={cn(
                                    'text-zone-green absolute transition-[left] duration-150 ease-out',
                                    shiftOf(scale.green)
                                )}
                                style={{ left: `${scale.green}%` }}
                            >
                                {format(greenBelow)}
                            </span>
                            <span
                                aria-hidden={true}
                                className={cn(
                                    'text-zone-red absolute transition-[left] duration-150 ease-out',
                                    shiftOf(scale.red)
                                )}
                                style={{ left: `${scale.red}%` }}
                            >
                                {format(redAbove)}
                            </span>
                        </>
                    )}
                </div>
            )}

            {/* The rail is a picture; this is the same reading for anyone who cannot see it. In the
                editors the fields carry that reading already, so the rail goes silent there instead
                of narrating every keystroke twice. */}
            {labels === 'values' && (
                <p className="sr-only">
                    {isBroken ? (
                        'Zones not set'
                    ) : (
                        <>
                            {value === null ? 'Not measured' : `Now ${format(value)}`}. Green below {format(greenBelow)}
                            , red above {format(redAbove)}.
                        </>
                    )}
                </p>
            )}
        </div>
    );
}

export { ZoneMeter };
