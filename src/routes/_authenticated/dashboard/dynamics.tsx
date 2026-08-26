import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { kyivDay } from '@/lib/utils/kyivDay';
import { dynamicsDayQueryOptions, dynamicsRosterQueryOptions } from '@/services/dynamics/queries';
import { Dynamics } from '@/modules/Dynamics';
import { dynamicsSearchSchema } from '@/modules/Dynamics/schemas';

export const Route = createFileRoute('/_authenticated/dashboard/dynamics')({
    // Buyer, geo and day live in the URL so a view is shareable and survives a reload (spec story 20).
    validateSearch: dynamicsSearchSchema,
    loaderDeps({ search }) {
        return { buyer: search.buyer, day: search.day };
    },
    // Dollar roles only: a Designer's or BDM's dimension scope carries no campaign dimension, so the
    // trajectory is not theirs (spec story 40) — their own frames land with their own issue. The
    // server gate is `scopeFor`, not this list.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('report.view', auth.me.role);
    },
    async loader({ context: { queryClient }, deps }) {
        // "Today" is a Kyiv question and it is answered viewer-side (ADR-0017); the server only ever
        // sees a concrete date.
        const reportDate = deps.day ?? kyivDay();

        // Started, deliberately NOT awaited: which buyer the page opens on is decided from the roster,
        // so a link that names one only warms the cache. Its own Suspense boundary picks it up.
        if (deps.buyer) {
            void queryClient.prefetchQuery(dynamicsDayQueryOptions({ buyerId: deps.buyer, reportDate }));
        }

        // The tab row is the page: it is awaited, so the frame paints with its buyers already in it.
        await queryClient.ensureQueryData(dynamicsRosterQueryOptions({ reportDate }));
    },
    component: Dynamics,
});
