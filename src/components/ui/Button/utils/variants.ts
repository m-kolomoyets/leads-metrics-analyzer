import { cva } from 'class-variance-authority';

// Radius by scale, not by taste: a control is `md`, and the small sizes drop to `sm` so the corner
// stays proportional to a 24px box. Hover on the three quiet variants is `--hover`, a translucent
// grey wash — `--muted` is an alias of `--surface`, so a secondary button hovering onto it changed
// nothing at all. Focus is not declared here — it is the one base-layer
// `:focus-visible` rule in src/styles/index.css, and `outline-none` would suppress it.
export const buttonVariants = cva(
    `aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-sm font-medium active:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap motion-safe:transition-[background-color,border-color,color] motion-safe:duration-150 select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                outline:
                    'border-border-strong bg-surface hover:bg-hover hover:text-foreground aria-expanded:bg-hover aria-expanded:text-foreground',
                secondary: 'bg-secondary text-secondary-foreground border-border hover:bg-hover aria-expanded:bg-hover',
                ghost: 'hover:bg-hover hover:text-foreground aria-expanded:bg-hover aria-expanded:text-foreground',
                destructive: 'text-destructive border-destructive/40 hover:bg-destructive/10',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                xs: `h-6 gap-1 rounded-sm px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3`,
                sm: `h-7 gap-1 rounded-sm px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5`,
                lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
                icon: 'size-8',
                'icon-xs': `size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3`,
                'icon-sm': 'size-7 rounded-sm',
                'icon-lg': 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
