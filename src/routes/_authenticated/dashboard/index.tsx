import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { reportQueryOptions, visibleUsersQueryOptions } from '@/services/reports/queries';
import { Dashboard } from '@/modules/Dashboard';
import { reportSearchSchema } from '@/modules/Dashboard/schemas';
import { resolveRange, todayISO } from '@/modules/Dashboard/utils/range';

export const Route = createFileRoute('/_authenticated/dashboard/')({
    // The range lives in the URL so a view is shareable and survives a reload (spec story 20).
    validateSearch: reportSearchSchema,
    loaderDeps({ search }) {
        return { range: search.range, from: search.from, to: search.to };
    },
    // Dollar roles only: a Designer's or BDM's dimension scope carries no campaign dimension, so the
    // Report surfaces are not theirs (spec story 40). The server gate is `scopeFor`, not this list.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('report.view', auth.me.role);
    },
    async loader({ context: { queryClient }, deps }) {
        // Tokens are viewer-local, so the window is resolved here and the server is only ever asked
        // for two concrete dates. Preloaded so the module's useSuspenseQuery resolves from cache.
        const resolved = resolveRange(deps, todayISO());

        await Promise.all([
            queryClient.ensureQueryData(visibleUsersQueryOptions()),
            queryClient.ensureQueryData(reportQueryOptions(resolved)),
        ]);
    },
    component: Dashboard,
});
