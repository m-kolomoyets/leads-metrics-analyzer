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

function MainSidebar(props: MainSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTeam />
            </SidebarHeader>
            <SidebarContent>
                <Suspense fallback={<SidebarNavigationFallback rows={SIDEBAR_NAVIGATION_LINK_LIST.length} />}>
                    <SidebarNavigation items={SIDEBAR_NAVIGATION_LINK_LIST} />
                </Suspense>
            </SidebarContent>
            <SidebarFooter>
                {/* Admin sits here rather than in the group above: it is a different job from reading
                    reports, and most roles cannot open it at all. */}
                <Suspense fallback={<SidebarNavigationFallback rows={1} className="p-0" />}>
                    <SidebarNavigation items={SIDEBAR_FOOTER_NAVIGATION_LINK_LIST} className="p-0" />
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
