import type { MainSidebarProps } from './types';
import { Suspense } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/Sidebar';
import {
    SIDEBAR_FOOTER_NAVIGATION_LINK_LIST,
    SIDEBAR_NAVIGATION_LINK_LIST,
} from './components/SidebarNavigation/constants';
import { SidebarNavigation } from './components/SidebarNavigation';
import { SidebarNavigationFallback } from './components/SidebarNavigationFallback';
import { SidebarProfile } from './components/SidebarProfile';
import { SidebarProfileFallback } from './components/SidebarProfileFallback';
import { SidebarTeam } from './components/SidebarTeam';

// Three bands under one rule each — mark, work, account — rather than one soft column of rows. The
// hairline is the same `--border` the tables and cards are ruled with, so the sidebar is built out of
// the app's own parts instead of a chrome vocabulary of its own (`docs/design-system.md`).
function MainSidebar(props: MainSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="border-border gap-0 border-b p-2">
                <SidebarTeam />
            </SidebarHeader>
            <SidebarContent className="py-1">
                <Suspense fallback={<SidebarNavigationFallback rows={SIDEBAR_NAVIGATION_LINK_LIST.length} />}>
                    <SidebarNavigation items={SIDEBAR_NAVIGATION_LINK_LIST} label="Reports" />
                </Suspense>
            </SidebarContent>
            <SidebarFooter className="border-border gap-0 border-t p-2">
                {/* Admin sits here rather than in the group above: it is a different job from reading
                    reports, and most roles cannot open it at all. Headed, like the group above it —
                    an unheaded row above the account card reads as part of the account. */}
                <Suspense fallback={<SidebarNavigationFallback rows={1} className="p-0" />}>
                    <SidebarNavigation
                        items={SIDEBAR_FOOTER_NAVIGATION_LINK_LIST}
                        label="System"
                        className="p-0 pb-1"
                    />
                </Suspense>
                <Suspense fallback={<SidebarProfileFallback />}>
                    <SidebarProfile />
                </Suspense>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

export { MainSidebar };
