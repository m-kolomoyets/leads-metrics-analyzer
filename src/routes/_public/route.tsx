import type { AuthenticatedState, UnauthenticatedState } from '@/services/auth/types';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { meQueryOptions } from '@/services/auth/queries';

export const Route = createFileRoute('/_public')({
    async beforeLoad({ context: { queryClient } }) {
        try {
            const me = await queryClient.ensureQueryData(meQueryOptions());

            if (me) {
                return { auth: { me, isAuthenticated: true } satisfies AuthenticatedState };
            }
        } catch {
            // Fall through to the unauthenticated state — public routes render either way.
        }

        return { auth: { me: null, isAuthenticated: false } satisfies UnauthenticatedState };
    },
    component: Outlet,
});
