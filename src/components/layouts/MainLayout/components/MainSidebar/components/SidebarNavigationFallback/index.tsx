import type { SidebarNavigationFallbackProps } from './types';
import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuSkeleton } from '@/components/Sidebar';

// `rows` matches the list the real group will render, so the skeleton does not jump on resolve — the
// footer's Admin group is one row, the main group is the length of its own list.
function SidebarNavigationFallback({ rows = 7, className }: SidebarNavigationFallbackProps) {
    return (
        <SidebarGroup className={className}>
            <SidebarMenu>
                {Array.from({ length: rows }).map((_, index) => {
                    return (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuSkeleton showIcon={true} />
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export { SidebarNavigationFallback };
