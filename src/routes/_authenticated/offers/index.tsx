import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { Offers } from '@/modules/Offers';

export const Route = createFileRoute('/_authenticated/offers/')({
    // Every role but Designer; per-card visibility is `offerAccess`'s call on the server.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('offers.view', auth.me.role);
    },
    component: Offers,
});
