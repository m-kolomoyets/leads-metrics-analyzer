import type { MetricTone } from '@/lib/domain/dynamics';
import { cn } from '@/lib/utils/cn';
import { sparklineShape } from './utils/path';

// One mini chart from the strip (SPEC §6.6): the shape of a metric's day, about 40px tall, with no
// axes, no ticks and no markers — and the trailing figure printed beside it, because the shape says
// which way and the number says how far.
//
// It is a button, not a picture. Clicking it switches the main chart to this metric, which is the
// whole reason a lead scans the strip first: find the line that looks wrong, then go read it.

const VIEW = { width: 160, height: 40 };

// Colour follows meaning, and stops where meaning stops (see `sparklineTone`). Neutral is the accent,
// not grey: an ungraded metric is not a broken one.
const TONE_STROKE: Record<MetricTone, string> = {
    good: 'var(--success)',
    bad: 'var(--danger)',
    neutral: 'var(--accent-solid)',
};

const TONE_TEXT_CLASS: Record<MetricTone, string> = {
    good: 'text-success',
    bad: 'text-danger',
    neutral: 'text-foreground',
};

type SparklineProps = {
    label: string;
    // The metric across the whole day, oldest first. Nulls are gaps, never zeroes.
    values: (number | null)[];
    // The trailing figure, already formatted in the metric's own units.
    trailing: string;
    tone: MetricTone;
    // Whether the main chart is currently drawing this metric.
    selected: boolean;
    onSelect: () => void;
};

function Sparkline({ label, values, trailing, tone, selected, onSelect }: SparklineProps) {
    const { d, last } = sparklineShape(values, VIEW.width, VIEW.height);
    const stroke = TONE_STROKE[tone];

    return (
        <button
            type="button"
            aria-pressed={selected}
            className={cn(
                'flex flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors',
                selected ? 'border-primary bg-secondary/40' : 'border-border hover:border-primary/50'
            )}
            onClick={onSelect}
        >
            <span className="flex items-baseline justify-between gap-2">
                <span className="text-muted-foreground text-[11px] tracking-widest uppercase">{label}</span>
                <span className={cn('font-mono text-sm font-bold', TONE_TEXT_CLASS[tone])}>{trailing}</span>
            </span>

            {/* The stroke keeps its width while the box stretches, so a wide strip does not draw a
                fat line and a narrow one a hairline. */}
            <svg
                viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
                preserveAspectRatio="none"
                className="h-10 w-full"
                aria-hidden={true}
            >
                {d === null ? (
                    // Nothing was measurable all day. A flat line across the middle would be a claim
                    // that the metric held steady, which is not what happened.
                    <line
                        x1="2"
                        y1={VIEW.height / 2}
                        x2={VIEW.width - 2}
                        y2={VIEW.height / 2}
                        strokeWidth="1"
                        strokeDasharray="3 4"
                        vectorEffect="non-scaling-stroke"
                        style={{ stroke: 'var(--border)' }}
                    />
                ) : (
                    <path
                        d={d}
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        style={{ stroke }}
                    />
                )}

                {/* Where the day ended, marked so the eye lands there rather than on the line's
                    loudest bend. A vertical tick rather than a dot: the box stretches horizontally
                    only, and a dot would arrive on screen as an ellipse. */}
                {last !== null && (
                    <line
                        x1={last.x}
                        y1={last.y - 4}
                        x2={last.x}
                        y2={last.y + 4}
                        strokeWidth="2"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        style={{ stroke }}
                    />
                )}
            </svg>
        </button>
    );
}

export { Sparkline };
