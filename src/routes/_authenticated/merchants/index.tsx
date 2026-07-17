import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { Merchants } from '@/modules/Merchants';

export const Route = createFileRoute('/_authenticated/merchants/')({
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('merchants.view', auth.me.role);
    },
    component: Merchants,
});
