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
        <div className={cn('flex items-center gap-2 py-1.5 text-left text-sm', className)}>
            <SidebarAvatar name={me.email} />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{me.email}</span>
                <span className="truncate text-xs mb-1 text-muted-foreground">{roleLabel}</span>
            </div>
        </div>
    );
}

export { SidebarUserCard };
