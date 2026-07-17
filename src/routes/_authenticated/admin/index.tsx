import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { teamsQueryOptions, usersQueryOptions } from '@/services/admin/queries';
import { Admin } from '@/modules/Admin';

export const Route = createFileRoute('/_authenticated/admin/')({
    // Head-only. Mirrors the server-side `requireHead` gate; a non-Head navigating here 404s.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('admin.view', auth.me.role);
    },
    async loader({ context: { queryClient } }) {
        // Preload so the module's useSuspenseQuery resolves from cache — awaited so the first render
        // never suspends without a boundary (repo convention: loader ensureQueryData → useSuspenseQuery).
        await Promise.all([
            queryClient.ensureQueryData(usersQueryOptions()),
            queryClient.ensureQueryData(teamsQueryOptions()),
        ]);
    },
    component: Admin,
});
