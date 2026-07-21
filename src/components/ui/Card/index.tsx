import type { CardProps } from './types';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils/cn';
import { cardVariants } from './utils/variants';

function Card({ className, variant = 'glass', render, ...props }: CardProps) {
    return useRender({
        defaultTagName: 'div',
        props: mergeProps<'div'>(
            {
                className: cn(cardVariants({ variant }), className),
            },
            props
        ),
        render,
        state: {
            slot: 'card',
            variant,
        },
    });
}

export { Card, cardVariants };
