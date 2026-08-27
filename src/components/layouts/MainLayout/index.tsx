import type { MainLayoutProps } from './types';
import { Outlet } from '@tanstack/react-router';
import { getCookieByName } from '@/lib/utils/getCookieByName';
import { SidebarInset, SidebarProvider } from '@/components/Sidebar';
import { SIDEBAR_COOKIE_NAME } from '@/components/Sidebar/constants';
import { MainSidebar } from './components/MainSidebar';

// Collapsed to the icon rail by default. The pages under it are wide — a month grid, a trajectory, a
// report table — and the nav is four rows a reader learns in a day; the cookie is what remembers a
// reader who wants it open, so only an explicit `true` expands it.
function MainLayout(props: MainLayoutProps) {
    return (
        <SidebarProvider defaultOpen={getCookieByName(SIDEBAR_COOKIE_NAME) === 'true'} {...props}>
            <MainSidebar />
            <SidebarInset>
                {/* `min-w-0`: a flex column will not shrink below its widest child, so one wide table used
                    to push the whole page sideways instead of scrolling inside its own container. */}
                <div className="flex min-w-0 flex-1 flex-col gap-4 p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export { MainLayout };
