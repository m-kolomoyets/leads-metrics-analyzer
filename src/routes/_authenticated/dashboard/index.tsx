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
        // for two concrete dates.
        const resolved = resolveRange(deps, todayISO());

        // Started, deliberately NOT awaited: awaiting it would make every range change block the whole
        // navigation, and the page would freeze as a unit instead of showing a loader over the list
        // that is actually changing. The list's own Suspense boundary picks it up from here.
        void queryClient.prefetchQuery(reportQueryOptions(resolved));

        // The roster is awaited — it is range-independent, so it resolves once and the page renders
        // with its header and controls already in place.
        await queryClient.ensureQueryData(visibleUsersQueryOptions());
    },
    component: Dashboard,
});
