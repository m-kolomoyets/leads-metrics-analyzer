import { cn } from '@/lib/utils/cn';
import { cost } from '@/components/report/utils/format';
import { meterScale } from './utils/scale';

// The plan, drawn instead of spelled. "green < 8.00 · red > 14.00" makes the reader hold three
// numbers in their head and do the comparison themselves; a rail with the two lines on it and the
// push's own mark between them answers "how bad is this" before a single figure is read.
//
// The gradient is the same story the chart's line tells — green cooling through amber into red — so
// the tooltip and the trajectory speak one language.

type ThresholdMeterProps = {
    // The push's figure in this metric, or null when it could not be measured.
    value: number | null;
    // This Snapshot's own frozen thresholds (ADR-0002), never the reader's live preset.
    greenBelow: number;
    redAbove: number;
    className?: string;
};

function ThresholdMeter({ value, greenBelow, redAbove, className }: ThresholdMeterProps) {
    const scale = meterScale(value, greenBelow, redAbove);
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
                one over it is what actually happened. */}
            <div className="relative h-5 font-mono text-[11px]">
                {value !== null && (
                    <span
                        aria-hidden={true}
                        className={cn(
                            'bg-foreground text-background absolute rounded-sm px-1.5 py-px font-semibold',
                            shiftOf(scale.value)
                        )}
                        style={{ left: `${scale.value}%` }}
                    >
                        {cost(value)}
                        {scale.clamped ? '+' : ''}
                    </span>
                )}
            </div>

            <div className="relative h-2 w-full rounded-full" style={{ background: gradient }}>
                {/* The two lines themselves, notched into the rail: the gradient says which way the
                    verdict goes, the notches say exactly where it changes. */}
                <span
                    aria-hidden={true}
                    className="bg-popover/70 absolute inset-y-0 w-px"
                    style={{ left: `${scale.green}%` }}
                />
                <span
                    aria-hidden={true}
                    className="bg-popover/70 absolute inset-y-0 w-px"
                    style={{ left: `${scale.red}%` }}
                />

                {/* The mark and the pill above it are one object: the pill names the figure, the mark
                    plants it on the rail, and a stem joins them so the eye never has to guess which
                    number belongs to which position. */}
                {value !== null && (
                    <span
                        aria-hidden={true}
                        className={cn(
                            'bg-foreground ring-popover absolute -top-1 h-4 w-[3px] rounded-full ring-2',
                            scale.value > 98 ? '-translate-x-full' : '-translate-x-1/2'
                        )}
                        style={{ left: `${scale.value}%` }}
                    />
                )}
            </div>

            {/* The thresholds printed WHERE they are rather than listed underneath: the position is
                the information, and a number beside its own notch needs no "green <" to explain it. */}
            <div className="text-muted-foreground relative h-4 pt-0.5 font-mono text-[10px]">
                <span
                    aria-hidden={true}
                    className={cn('text-success absolute', shiftOf(scale.green))}
                    style={{ left: `${scale.green}%` }}
                >
                    {cost(greenBelow)}
                </span>
                <span
                    aria-hidden={true}
                    className={cn('text-danger absolute', shiftOf(scale.red))}
                    style={{ left: `${scale.red}%` }}
                >
                    {cost(redAbove)}
                </span>
            </div>

            {/* The rail is a picture; this is the same reading for anyone who cannot see it. */}
            <p className="sr-only">
                {value === null ? 'Not measured' : `Now ${cost(value)}`}. Green below {cost(greenBelow)}, red above{' '}
                {cost(redAbove)}.
            </p>
        </div>
    );
}

export { ThresholdMeter };
