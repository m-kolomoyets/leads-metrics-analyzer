import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { offerCardsQueryOptions, unlistedOffersQueryOptions } from '@/services/offers/queries';
import { Offers } from '@/modules/Offers';
import { offersSearchSchema } from '@/modules/Offers/schemas';

export const Route = createFileRoute('/_authenticated/offers/')({
    // Search and filters live in the URL so a sliced view is shareable and survives a reload
    // (offers-and-home/05), like the feed's range.
    validateSearch: offersSearchSchema,
    // Every role but Designer; per-card visibility is `offerAccess`'s call on the server.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('offers.view', auth.me.role);
    },
    async loader({ context: { queryClient } }) {
        // Preload both reads so the module's useSuspenseQuery resolves from cache (repo convention).
        // The filters are the client's, so neither read depends on the search.
        await Promise.all([
            queryClient.ensureQueryData(offerCardsQueryOptions()),
            queryClient.ensureQueryData(unlistedOffersQueryOptions()),
        ]);
    },
    component: Offers,
});
