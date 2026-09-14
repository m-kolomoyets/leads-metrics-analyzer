import type { MainNavbarProps } from './types';
import { Suspense } from 'react';
import { cn } from '@/lib/utils/cn';
import { NAVBAR_LINK_LIST, NAVBAR_SYSTEM_LINK_LIST } from './constants';
import { AttentionBadge } from './components/AttentionBadge';
import { NavbarBrand } from './components/NavbarBrand';
import { NavbarNavigation } from './components/NavbarNavigation';
import { NavbarNavigationFallback } from './components/NavbarNavigationFallback';
import { NavbarProfile } from './components/NavbarProfile';
import { NavbarProfileFallback } from './components/NavbarProfileFallback';

// Two bands under one rule each — who you are, where you can go — cut from the same `--surface` the
// page header below is, ruled with the same `--border` the tables are. The bar owns the top of every
// screen and never leaves it: the pages under it scroll a month of pushes or a long table, and
// navigation that scrolls away takes the reader's place in the app with it.
//
// Reading is downward, so the bar earns its height back: scrolling down folds the identity row —
// brand and account, neither of which you need mid-page — and leaves the tab row parked at the top;
// the first scroll up brings it back, because reaching for the account menu starts with a flick up.
// The row's height animates rather than its transform: `--navbar-height` is what the page header
// below sticks to, and a transform would leave that number lying about where the bar ends.
//
// FIXED, not sticky, and this is the whole reason the fold is stable. A sticky bar is still in flow,
// so folding it shortened the document by 44px mid-scroll; the browser's scroll anchoring then moved
// `scrollY` to compensate, that move arrived as a scroll event pointing the other way, the bar
// unfolded, and the two chased each other — the stutter. Out of flow, the fold changes no layout at
// all, and the height MainLayout reserves for the bar stays the same number all the way down.
function MainNavbar({ isCondensed = false, className, ...rest }: MainNavbarProps) {
    return (
        <header
            className={cn('bg-surface border-border fixed inset-x-0 top-0 z-30 flex flex-col border-b', className)}
            {...rest}
        >
            {/* `inert` and not just zero height: a folded row is still in the DOM, and a tab stop
                that scrolls to somewhere invisible is worse than one that is not there. */}
            <div
                inert={isCondensed}
                className={cn(
                    'border-border flex shrink-0 items-center gap-2 overflow-hidden px-3 motion-safe:transition-[height,opacity,border-width] motion-safe:duration-200 motion-safe:ease-out',
                    isCondensed ? 'h-0 border-b-0 opacity-0' : 'h-11 border-b opacity-100'
                )}
            >
                <NavbarBrand />
                <div className="ml-auto flex shrink-0 items-center gap-1">
                    <Suspense fallback={<NavbarProfileFallback />}>
                        <NavbarProfile />
                    </Suspense>
                </div>
            </div>

            {/* The tab row scrolls inside itself rather than wrapping to a second line: a bar that
                changes height between screens moves every page under it. */}
            <nav
                aria-label="Main"
                className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                <Suspense fallback={<NavbarNavigationFallback tabs={NAVBAR_LINK_LIST.length} />}>
                    <NavbarNavigation items={NAVBAR_LINK_LIST} />
                    <NavbarNavigation
                        items={NAVBAR_SYSTEM_LINK_LIST}
                        className="border-border ml-2 border-l pl-2 [&:empty]:hidden"
                    />
                    {/* The Attention Badge parks at the trailing end of the tab row — the row that
                        never folds — so "what needs me now" is in view however far the page scrolled. */}
                    <AttentionBadge />
                </Suspense>
            </nav>
        </header>
    );
}

export { MainNavbar };
