import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

// One readout: what it is, what it is, and what that is worth knowing beside it. Every headline
// figure in the app is one of these, so the three-line hierarchy is declared once rather than
// re-typed per card.
//
//   label   13px, dim, uppercase — what this is
//   value   the figure, 22px max, tabular — and its unit DEMOTED beside it, not baked into it.
//           "$1,204.55 spend" reads as one 22px shout; the dollars are the figure, the word is not.
//   meta    the change, the plan, the share — 13px, dim, under.
//
// Colour is the caller's, through `className`, and belongs on a figure only where that figure is a
// Zone judgement (ADR-0019). An ungraded fact — Spend, Revenue, a count — stays `--foreground`: a
// green revenue says "good" about a number that has no opinion attached to it.

type FigureProps = {
    label: ReactNode;
    value: string;
    // Currency, "%", "per install" — anything that qualifies the figure rather than being it.
    unit?: string;
    // Small is a tile in a grid of eight; large is the one figure a card exists to report.
    size?: 'md' | 'lg';
    // The line under: a delta, a threshold pair, a share. Wears its own colour.
    meta?: ReactNode;
    className?: string;
};

function Figure({ label, value, unit, size = 'md', meta, className }: FigureProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs tracking-widest uppercase">{label}</span>
            <span className="flex items-baseline gap-1.5">
                <span className={cn('font-semibold tabular-nums', size === 'lg' ? 'text-xl' : 'text-base', className)}>
                    {value}
                </span>
                {unit && <span className="text-muted-foreground text-xs">{unit}</span>}
            </span>
            {meta && <span className="text-muted-foreground text-xs tabular-nums">{meta}</span>}
        </div>
    );
}

export { Figure };
