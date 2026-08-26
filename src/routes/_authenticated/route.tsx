import type { AuthenticatedState } from '@/services/auth/types';
import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { meQueryOptions } from '@/services/auth/queries';
import { AnalyzeDraftProvider } from '@/modules/Analyze/context/AnalyzeDraftContext';
import { MainLayout } from '@/components/layouts/MainLayout';

// The Analyze draft is held here, one level above every authenticated page, so walking to the
// Dashboard and back keeps the upload on screen. Inside the Analyze route it would unmount with it.
function AuthenticatedLayout() {
    const userId = Route.useRouteContext({
        select(context) {
            return context.auth.me.id;
        },
    });

    return (
        <AnalyzeDraftProvider userId={userId}>
            <MainLayout />
        </AnalyzeDraftProvider>
    );
}

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
    component: AuthenticatedLayout,
});
