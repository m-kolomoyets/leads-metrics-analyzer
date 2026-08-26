import { cva } from 'class-variance-authority';

// A chip, not a pill: `rounded-sm`, because `rounded-full` is reserved for avatars. The Zone
// variants are the only coloured ones and they read from --zone-*, which is the same paint the
// charts use (ADR-0019/0020) — `success`/`warning`/`danger` were a second palette for one idea.
export const badgeVariants = cva(
    'h-5 gap-1 rounded-sm border border-transparent px-2 py-0.5 text-xs font-medium motion-safe:transition-colors motion-safe:duration-150 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap aria-invalid:border-destructive [&>svg]:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/90',
                secondary: 'bg-secondary text-secondary-foreground border-border [a]:hover:bg-muted',
                destructive: 'text-destructive border-destructive/40 [a]:hover:bg-destructive/10',
                green: 'text-zone-green border-zone-green/40 [a]:hover:bg-zone-green/10',
                yellow: 'text-zone-yellow border-zone-yellow/40 [a]:hover:bg-zone-yellow/10',
                red: 'text-zone-red border-zone-red/40 [a]:hover:bg-zone-red/10',
                neutral: 'text-zone-neutral border-zone-neutral/40 [a]:hover:bg-zone-neutral/10',
                outline: 'border-border text-foreground [a]:hover:bg-muted',
                ghost: 'hover:bg-muted hover:text-muted-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);
