import type { MainLayoutProps } from './types';
import { Outlet } from '@tanstack/react-router';
import { cn } from '@/lib/utils/cn';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { MainNavbar } from './components/MainNavbar';

// The bar owns the top of the app; the page owns everything under it. `--navbar-height` is declared
// here rather than inside the bar because the page's own sticky header reads it to park directly
// beneath — two sticky bands that know one number between them.
//
// The number is not constant: scrolling down folds the bar's identity row away, so the header has to
// come up with it. `--navbar-height` is a registered property (`@property`, see `styles/index.css`),
// which is what makes it animate — an unregistered custom property flips between values and the
// header would jump the 2.75rem in one frame while the bar above it slides.
function MainLayout({ className, ...rest }: MainLayoutProps) {
    const scrollDirection = useScrollDirection();
    const isCondensed = scrollDirection === 'down';

    return (
        <div
            className={cn(
                'navbar-height-transition flex min-h-svh flex-col',
                isCondensed ? '[--navbar-height:2.5rem]' : '[--navbar-height:5.25rem]',
                className
            )}
            {...rest}
        >
            <MainNavbar isCondensed={isCondensed} />
            {/* The bar is fixed, so the page reserves its space here instead — at its FULL height,
                which never changes. Reserving the live `--navbar-height` would put the fold back
                into the layout and bring the scroll-anchoring fight back with it; the folded bar
                simply lets the page scroll up under where its identity row was. */}
            <div aria-hidden={true} className="h-[5.25rem] shrink-0" />
            {/* `min-w-0`: a flex column will not shrink below its widest child, so one wide table used
                to push the whole page sideways instead of scrolling inside its own container. */}
            <main className="flex min-w-0 flex-1 flex-col gap-4 p-6">
                <Outlet />
            </main>
        </div>
    );
}

export { MainLayout };
