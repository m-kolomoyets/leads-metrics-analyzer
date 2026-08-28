import type { NavbarNavigationProps } from './types';
import { getRouteApi } from '@tanstack/react-router';
import { hasPermissions } from '@/lib/utils/auth/permissions';
import { cn } from '@/lib/utils/cn';
import { NavbarLink } from './components/NavbarLink';

const routeApi = getRouteApi('/_authenticated');

// The tabs themselves come from the caller: the reports run first, Admin past the hairline. Same
// permission filter either way — a role that cannot open a route never sees it.
function NavbarNavigation({ items, className }: NavbarNavigationProps) {
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });

    const visible = items.filter((item) => {
        return !item.rolePermissionKey || hasPermissions(item.rolePermissionKey, role);
    });

    // Filtered rather than skipped per tab so a group nobody may open renders nothing at all — an
    // empty group still takes the row's gap and its leading hairline, and Admin is empty for most
    // roles.
    if (visible.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex items-center gap-1', className)}>
            {visible.map((item) => {
                return (
                    <NavbarLink key={item.label} {...item.linkProps}>
                        <item.Icon />
                        {item.label}
                    </NavbarLink>
                );
            })}
        </div>
    );
}

export { NavbarNavigation };
