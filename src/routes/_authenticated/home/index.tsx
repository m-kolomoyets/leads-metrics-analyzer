import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { kyivDay } from '@/lib/utils/kyivDay';
import { homeGeoQueryOptions } from '@/services/home/queries';
import { Home } from '@/modules/Home';
import { homeSearchSchema } from '@/modules/Home/schemas';
import { resolvePeriod } from '@/modules/Home/utils/period';

export const Route = createFileRoute('/_authenticated/home/')({
    // The period lives in the URL so a view is shareable and survives a reload, the feed's way.
    validateSearch: homeSearchSchema,
    loaderDeps({ search }) {
        return { range: search.range, from: search.from, to: search.to };
    },
    // Every role but Designer (story 58); the server still scopes every read on its own.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('home.view', auth.me.role);
    },
    loader({ context: { queryClient }, deps }) {
        // Warmed, NOT awaited: an awaited read would block every period change behind a route-level
        // pending state; the page keeps the map it has and reloads underneath instead.
        void queryClient.prefetchQuery(homeGeoQueryOptions(resolvePeriod(deps, kyivDay())));
    },
    component: Home,
});
