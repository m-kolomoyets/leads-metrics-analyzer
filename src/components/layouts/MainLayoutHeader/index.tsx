import type { MainLayoutHeaderActionsProps, MainLayoutHeaderProps, MainLayoutHeaderTitleProps } from './types';
import { cn } from '@/lib/utils/cn';
import { SidebarTrigger } from '@/components/Sidebar';
import { Separator } from '@/components/ui/Separator';

// The page's one bar, and the sidebar's opposite number: same height as the sidebar's own header
// band, same `--border` hairline under it, same `--surface` it is cut from. The two together frame
// the page on two sides in one material rather than each inventing its own chrome.
//
// It STICKS. Every page under it scrolls something long — a month of pushes, a feed, a table — and a
// title that scrolls away takes the reader's place in the app with it.
//
// Three slots, always in this order: the rail toggle, the title, the actions. Pages used to hand-roll
// that with a `flex-1` spacer and a title size each, which is how one page ended up at 20px and the
// next at 17px; here the layout is the component's and a page only says what goes in it.
function MainLayoutHeader({ children, className, ...rest }: MainLayoutHeaderProps) {
    return (
        <header
            className={cn(
                'bg-surface border-border sticky top-0 z-20 -mx-6 -mt-6 flex h-12 items-center gap-3 border-b px-6',
                className
            )}
            {...rest}
        >
            <div className="flex shrink-0 items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
            </div>
            {children}
        </header>
    );
}

// The page's name, at the size the rest of the system calls a heading — 17px/600, not a size a page
// picks for itself. Anything qualifying it (a date, a buyer) rides beside it in `--muted-foreground`,
// because "Dynamics" is the place and "27 Aug" is which one, and they are not the same claim.
function MainLayoutHeaderTitle({ children, meta, className, ...rest }: MainLayoutHeaderTitleProps) {
    return (
        <div className="flex min-w-0 items-baseline gap-2">
            <h1 className={cn('truncate text-lg leading-none font-semibold', className)} {...rest}>
                {children}
            </h1>
            {meta !== undefined && <span className="text-muted-foreground truncate text-sm tabular-nums">{meta}</span>}
        </div>
    );
}

// Everything the page can DO from up here, pushed to the trailing edge. `ml-auto` rather than a
// spacer element: a spacer is a thing in the markup that means nothing, and four pages had one each.
function MainLayoutHeaderActions({ children, className, ...rest }: MainLayoutHeaderActionsProps) {
    return (
        <div className={cn('ml-auto flex shrink-0 items-center gap-1.5', className)} {...rest}>
            {children}
        </div>
    );
}

export { MainLayoutHeader, MainLayoutHeaderActions, MainLayoutHeaderTitle };
