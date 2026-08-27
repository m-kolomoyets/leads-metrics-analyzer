import type { SidebarUserCardProps } from './types';
import { getRouteApi } from '@tanstack/react-router';
import { ROLES_CONFIG } from '@/lib/utils/auth/permissions';
import { cn } from '@/lib/utils/cn';
import { SidebarAvatar } from './components/SidebarAvatar';

const routeApi = getRouteApi('/_authenticated');

function SidebarUserCard({ className }: SidebarUserCardProps) {
    const me = routeApi.useRouteContext({
        select(context) {
            return context.auth.me;
        },
    });
    const roleLabel = ROLES_CONFIG[me.role].label;

    return (
        <div className={cn('flex min-w-0 items-center gap-2.5 py-1.5 text-left', className)}>
            <SidebarAvatar name={me.email} />
            {/* The role is a label, so it is set like every other label on the page: 12px, muted,
                tracked. The address above it is the identity and takes the weight. */}
            <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium">{me.email}</span>
                <span className="text-muted-foreground truncate text-xs tracking-wide uppercase">{roleLabel}</span>
            </div>
        </div>
    );
}

export { SidebarUserCard };
