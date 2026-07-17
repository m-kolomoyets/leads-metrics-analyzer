import type { AuthenticatedState } from '@/services/auth/types';
import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { meQueryOptions } from '@/services/auth/queries';
import { MainLayout } from '@/components/layouts/MainLayout';

export const Route = createFileRoute('/_authenticated')({
    async beforeLoad({ context: { queryClient }, location }) {
        const unauthRedirectOptions = {
            to: '/login',
            search: { redirect: location.href },
            replace: true,
        } as const;

        try {
            const me = await queryClient.ensureQueryData(meQueryOptions());

            if (!me) {
                throw redirect(unauthRedirectOptions);
            }

            return { auth: { isAuthenticated: true, me } satisfies AuthenticatedState };
        } catch (error) {
            if (isRedirect(error)) {
                throw error;
            }

            throw redirect(unauthRedirectOptions);
        }
    },
    component: MainLayout,
});
