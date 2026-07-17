import type { QueryClient } from '@tanstack/react-query';
import type { AuthContext } from '@/services/auth/types';
import { routeTree } from '@/routeTree.gen';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { queryClient } from '@/lib/@queryClient';
import { ErrorComponent } from '@/components/ErrorComponent';
import { NotFound } from '@/components/NotFound';
import { Loader } from '@/components/ui/Loader';

export type RouterContext = { queryClient: QueryClient; auth: AuthContext };

// TanStack Start (SPA mode, ADR-0008) imports this factory (by the exact name `getRouter`) to build
// both the client and prerender routers — so it must be a function, not a module-level singleton.
export function getRouter() {
    return createTanStackRouter({
        routeTree,
        context: {
            queryClient,
            auth: { isAuthenticated: false, me: null },
        },
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 0,
        scrollRestoration: true,
        defaultPendingMs: 100,
        defaultPendingMinMs: 500,
        defaultNotFoundComponent: NotFound,
        defaultErrorComponent: ErrorComponent,
        defaultPendingComponent() {
            return <Loader className="size-16 m-auto" />;
        },
    });
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
