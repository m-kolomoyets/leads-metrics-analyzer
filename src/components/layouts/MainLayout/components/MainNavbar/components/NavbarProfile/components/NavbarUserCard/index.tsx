import type { NavbarUserCardProps } from './types';
import { getRouteApi } from '@tanstack/react-router';
import { ROLES_CONFIG } from '@/lib/utils/auth/permissions';
import { cn } from '@/lib/utils/cn';
import { NavbarAvatar } from './components/NavbarAvatar';

const routeApi = getRouteApi('/_authenticated');

function NavbarUserCard({ className, withDetails = true }: NavbarUserCardProps) {
    const me = routeApi.useRouteContext({
        select(context) {
            return context.auth.me;
        },
    });
    const roleLabel = ROLES_CONFIG[me.role].label;

    return (
        <div className={cn('flex min-w-0 items-center gap-2.5 text-left', className)}>
            <NavbarAvatar name={me.email} />
            {/* The role is a label, so it is set like every other label on the page: 12px, muted,
                tracked. The address above it is the identity and takes the weight. */}
            {withDetails ? (
                <div className="grid min-w-0 flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">{me.email}</span>
                    <span className="text-muted-foreground truncate text-xs tracking-wide uppercase">{roleLabel}</span>
                </div>
            ) : (
                <span className="hidden max-w-40 truncate text-sm font-medium lg:inline">{me.email}</span>
            )}
        </div>
    );
}

export { NavbarUserCard };
