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
                {/* A mark, not a card: the boxed tile a stock sidebar puts the logo in is a second
                    surface inside chrome, and the app has exactly two (ADR-0021). The icon sits at
                    the same 16px every nav row below it does, so the whole column has one measure. */}
                <SidebarMenuButton
                    className="h-10 gap-2.5"
                    render={
                        <Link to="/dashboard">
                            <ChartNoAxesCombinedIcon aria-hidden={true} />
                            <span className="grid flex-1 text-left leading-tight">
                                <span className="truncate text-sm font-semibold tracking-widest uppercase">Adjoin</span>
                                {teamName ? (
                                    <span className="text-muted-foreground truncate text-xs">{teamName}</span>
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
