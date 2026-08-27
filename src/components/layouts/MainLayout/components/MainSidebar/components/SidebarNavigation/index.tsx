import type { SidebarNavigationProps } from './types';
import { getRouteApi } from '@tanstack/react-router';
import { hasPermissions } from '@/lib/utils/auth/permissions';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from '@/components/Sidebar';
import { useSidebarContext } from '@/components/Sidebar/context/SidebarContext';
import { SidebarNavigationLink } from './components/SidebarNavigationLink';

const routeApi = getRouteApi('/_authenticated');

// The rows themselves come from the caller: the main group in <SidebarContent>, the Admin row in
// <SidebarFooter>. Same permission filter either way — a role that cannot open a route never sees it.
function SidebarNavigation({ items, label, className }: SidebarNavigationProps) {
    const { setOpenMobile } = useSidebarContext();
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });

    const visible = items.filter((item) => {
        return !item.rolePermissionKey || hasPermissions(item.rolePermissionKey, role);
    });

    // Filtered rather than skipped per row so a group nobody may open renders nothing at all — an
    // empty <SidebarGroup> still takes its parent's gap, and the Admin group is empty for most roles.
    if (visible.length === 0) {
        return null;
    }

    return (
        <SidebarGroup className={className}>
            {/* Hidden when the rail is collapsed to icons — a tracked word has nothing to say at
                48px, and the primitive folds its own height away rather than leaving a gap. */}
            <SidebarGroupLabel>{label}</SidebarGroupLabel>

            <SidebarMenu>
                {visible.map((item) => {
                    return (
                        <SidebarMenuItem
                            key={item.label}
                            onClick={() => {
                                setOpenMobile(false);
                            }}
                        >
                            <SidebarNavigationLink tooltipText={item.label} {...item.linkProps}>
                                <item.Icon />
                                {item.label}
                            </SidebarNavigationLink>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export { SidebarNavigation };
