import type { NavbarLinkProps } from './types';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils/cn';

// A row of tabs, not a column of rows: the marker that ran down a sidebar row's leading edge now
// runs under the tab, because in a horizontal bar the shared edge is the bottom one — the same edge
// the bar's own hairline sits on, so the active tab reads as cut out of that line.
function NavbarLink({ activeProps, activeOptions, className, ...props }: NavbarLinkProps) {
    return (
        <Link
            activeOptions={{
                exact: true,
                // The pages carry their state in search params — a range, a dimension, a buyer — and
                // `includeSearch` defaults to true, which made a tab stop reading as active the moment
                // the reader touched a filter on the page it points at.
                includeSearch: false,
                ...activeOptions,
            }}
            activeProps={{
                // Where the reader IS, said in weight and a marker and no colour at all: the accent
                // is spent on the focus ring and nothing else in navigation (ADR-0019), so "where I
                // am" and "what I am pointing at" differ in weight, not in hue.
                className: 'text-foreground font-medium after:bg-foreground',
                ...activeProps,
            }}
            className={cn(
                'text-muted-foreground hover:text-foreground focus-visible:ring-ring relative flex h-9 shrink-0 items-center gap-2 rounded-t-sm px-3 text-sm whitespace-nowrap outline-none focus-visible:ring-2',
                'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full',
                '[&>svg]:size-4 [&>svg]:shrink-0',
                className
            )}
            {...props}
        />
    );
}

export { NavbarLink };
