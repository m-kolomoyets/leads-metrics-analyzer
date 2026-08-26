import type { DynamicsMetric } from '@/lib/domain/dynamics';
import { toneOf } from '@/lib/domain/dynamics';
import { cn } from '@/lib/utils/cn';

// The one place the page turns a movement into an arrow and a colour (SPEC §6.5). The rule it exists
// to keep: **the arrow follows arithmetic, the colour follows meaning.** A CPI that fell renders a
// green ▼ — it got cheaper; an ROI that fell renders a red ▼. The verdict comes from the domain's
// meaning map, so this component, the table arrows (#09) and the sparklines can never disagree.

const TONE_CLASS = {
    good: 'text-emerald-400',
    bad: 'text-red-400',
    neutral: 'text-muted-foreground',
} as const;

// Read out loud beside the figure, because an arrow and a colour are the same signal to a reader who
// gets neither.
const TONE_LABEL = {
    good: 'better',
    bad: 'worse',
    neutral: 'no verdict',
} as const;

// Purely arithmetic: which way the number moved. Nothing about whether that is good.
function arrowOf(change: number | null): string | null {
    if (change === null || change === 0) {
        return null;
    }

    return change > 0 ? '▲' : '▼';
}

type TrendArrowProps = {
    metric: DynamicsMetric;
    // The movement in the metric's own units; null when either side was unmeasurable.
    change: number | null;
    // The already-formatted movement, in the caller's units — this component never formats numbers.
    label: string;
    className?: string;
};

function TrendArrow({ metric, change, label, className }: TrendArrowProps) {
    const tone = toneOf(metric, change);
    const arrow = arrowOf(change);

    return (
        <span className={cn('inline-flex items-center gap-1 font-mono', TONE_CLASS[tone], className)}>
            {arrow && <span aria-hidden={true}>{arrow}</span>}
            {label}
            {arrow && <span className="sr-only">{TONE_LABEL[tone]}</span>}
        </span>
    );
}

export { TrendArrow };
