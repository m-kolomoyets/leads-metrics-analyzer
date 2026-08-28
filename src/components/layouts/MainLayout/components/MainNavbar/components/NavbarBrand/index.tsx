import { getRouteApi, Link } from '@tanstack/react-router';
import { ChartNoAxesCombinedIcon } from 'lucide-react';

const routeApi = getRouteApi('/_authenticated');

// A mark, not a card: the boxed tile a stock bar puts the logo in is a second surface inside chrome,
// and the app has exactly two (ADR-0021). The team rides beside the name past a hairline rather than
// under it — a bar has width to spend and no height to.
function NavbarBrand() {
    const teamName = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.teamName;
        },
    });

    return (
        <Link
            to="/dashboard"
            className="hover:bg-hover focus-visible:ring-ring flex h-9 min-w-0 shrink-0 items-center gap-2.5 rounded-md px-2 outline-none focus-visible:ring-2"
        >
            <ChartNoAxesCombinedIcon aria-hidden={true} className="size-4 shrink-0" />
            <span className="truncate text-sm font-semibold tracking-widest uppercase">Adjoin</span>
            {teamName ? (
                <span className="border-border text-muted-foreground hidden truncate border-l pl-2.5 text-xs sm:inline">
                    {teamName}
                </span>
            ) : null}
        </Link>
    );
}

export { NavbarBrand };
