import { cva } from 'class-variance-authority';

export const cardVariants = cva('text-card-foreground flex flex-col rounded-2xl border', {
    variants: {
        variant: {
            // Glass surface over the animated background (default).
            glass: 'surface-glass border-border-soft backdrop-blur-md',
            // Solid, blur-free surface for dense/legibility-critical contexts (tables, popovers).
            flat: 'bg-card border-border shadow-sm',
        },
    },
    defaultVariants: {
        variant: 'glass',
    },
});
