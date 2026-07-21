import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

// Reference colour keys → the static `pill-*` classes (index.css). Glyph chip + label + optional count.
type PillColor = 'blue' | 'violet' | 'red' | 'green' | 'yellow';

const PILL_CLASS: Record<PillColor, string> = {
    blue: 'pill-blue',
    violet: 'pill-violet',
    red: 'pill-red',
    green: 'pill-green',
    yellow: 'pill-yellow',
};

type PillProps = {
    color: PillColor;
    glyph: ReactNode;
    label: ReactNode;
    count?: number;
    className?: string;
};

// The reference's glass status pill: a glowing colour-gradient capsule with a solid glyph chip, a
// label, and an optional mono count that shines in the pill's colour.
function Pill({ color, glyph, label, count, className }: PillProps) {
    return (
        <span className={cn('pill', PILL_CLASS[color], className)}>
            <span className="pill-chip" aria-hidden="true">
                {glyph}
            </span>
            <span className="text-foreground text-sm font-semibold tracking-wide">{label}</span>
            {count !== undefined && <span className="pill-count font-mono text-xs">{count}</span>}
        </span>
    );
}

export { Pill };
export type { PillColor };
