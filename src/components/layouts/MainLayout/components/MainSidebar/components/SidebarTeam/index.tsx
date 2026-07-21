import { getRouteApi, Link } from '@tanstack/react-router';
import { ChartNoAxesCombinedIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/Sidebar';

const routeApi = getRouteApi('/_authenticated');

function SidebarTeam() {
    const teamName = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.teamName;
        },
    });

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    render={
                        <Link to="/dashboard">
                            <span className="flex aspect-square size-8 items-center justify-center rounded-lg border bg-sidebar">
                                <ChartNoAxesCombinedIcon className="size-5" aria-hidden={true} />
                            </span>
                            <span className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Adjoin</span>
                                {teamName ? (
                                    <span className="truncate text-xs text-muted-foreground">{teamName}</span>
                                ) : null}
                            </span>
                        </Link>
                    }
                />
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export { SidebarTeam };
