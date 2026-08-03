import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { reportQueryOptions, visibleUsersQueryOptions } from '@/services/reports/queries';
import { Archive } from '@/modules/Archive';
import { archiveSearchSchema } from '@/modules/Dashboard/schemas';
import { resolveRange, todayISO } from '@/modules/Dashboard/utils/range';

export const Route = createFileRoute('/_authenticated/dashboard/archive')({
    // Same param shape as the feed, defaulted to a week instead of a day: the archive is a lookup
    // surface, so it opens on a window wide enough to answer a question (spec story 26).
    validateSearch: archiveSearchSchema,
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
        // for two concrete dates — the same two the feed would ask for, so the two pages share a
        // cache entry when they share a range.
        const resolved = resolveRange(deps, todayISO());

        // Started, deliberately NOT awaited: awaiting it would make every range change block the whole
        // navigation, and the page would freeze as a unit instead of showing a loader over the day
        // list that is actually changing. The list's own Suspense boundary picks it up from here.
        void queryClient.prefetchQuery(reportQueryOptions(resolved));

        await queryClient.ensureQueryData(visibleUsersQueryOptions());
    },
    component: Archive,
});
