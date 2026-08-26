import type { CardProps } from './types';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils/cn';

// One card, no variants. A card is an inline surface by definition — a hairline border and a step in
// background lightness, never a shadow (ADR-0021) — so `glass` and `flat` were two names for a
// decision the system no longer lets a caller make.
function Card({ className, render, ...props }: CardProps) {
    return useRender({
        defaultTagName: 'div',
        props: mergeProps<'div'>(
            {
                className: cn('bg-card text-card-foreground border-border flex flex-col rounded-lg border', className),
            },
            props
        ),
        render,
        state: {
            slot: 'card',
        },
    });
}

export { Card };
