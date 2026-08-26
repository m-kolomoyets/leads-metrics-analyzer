import type { MeData } from '@/services/auth/types';
import { createFileRoute } from '@tanstack/react-router';
import { rollupDimensionFor } from '@/lib/auth/dimensionRollup';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { kyivDay } from '@/lib/utils/kyivDay';
import {
    dynamicsDayQueryOptions,
    dynamicsDimensionDayQueryOptions,
    dynamicsDimensionRosterQueryOptions,
    dynamicsRosterQueryOptions,
} from '@/services/dynamics/queries';
import { Dynamics } from '@/modules/Dynamics';
import { dynamicsSearchSchema } from '@/modules/Dynamics/schemas';
import { DynamicsDimension } from '@/modules/DynamicsDimension';

// One route, two component trees (ADR-0009), exactly as `/analyze` already forks. The fork is a
// `scopeFor` read via `rollupDimensionFor` — never a role-string compare — so the rule that keeps
// dollar columns from these viewers server-side also picks which page they get.
const rollupFor = (me: MeData) => {
    return rollupDimensionFor({ id: me.id, role: me.role, teamId: me.teamId });
};

function DynamicsRoute() {
    const me = Route.useRouteContext({
        select(context) {
            return context.auth.me;
        },
    });
    const dimension = rollupFor(me);

    if (dimension !== null) {
        return <DynamicsDimension dimension={dimension} />;
    }

    return <Dynamics />;
}

export const Route = createFileRoute('/_authenticated/dashboard/dynamics')({
    // Buyer, geo and day live in the URL so a view is shareable and survives a reload (spec story 20).
    validateSearch: dynamicsSearchSchema,
    loaderDeps({ search }) {
        return { buyer: search.buyer, day: search.day };
    },
    // All five roles may open the route; which of the two frames they get is `scopeFor`'s decision,
    // and each read refuses on its own besides.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('dynamics.view', auth.me.role);
    },
    async loader({ context: { queryClient, auth }, deps }) {
        // "Today" is a Kyiv question and it is answered viewer-side (ADR-0017); the server only ever
        // sees a concrete date.
        const reportDate = deps.day ?? kyivDay();
        const dimension = rollupFor(auth.me);

        // The dollar-free branch preloads its own two reads and none of the trajectory's: a Designer
        // or BDM would be refused by both, and warming a cache with a denial is worse than not
        // warming it at all.
        if (dimension !== null) {
            if (deps.buyer) {
                void queryClient.prefetchQuery(
                    dynamicsDimensionDayQueryOptions({ dimension, buyerId: deps.buyer, reportDate })
                );
            }

            await queryClient.ensureQueryData(dynamicsDimensionRosterQueryOptions({ reportDate }));

            return;
        }

        // Started, deliberately NOT awaited: which buyer the page opens on is decided from the roster,
        // so a link that names one only warms the cache. Its own Suspense boundary picks it up.
        if (deps.buyer) {
            void queryClient.prefetchQuery(dynamicsDayQueryOptions({ buyerId: deps.buyer, reportDate }));
        }

        // The tab row is the page: it is awaited, so the frame paints with its buyers already in it.
        await queryClient.ensureQueryData(dynamicsRosterQueryOptions({ reportDate }));
    },
    component: DynamicsRoute,
});
