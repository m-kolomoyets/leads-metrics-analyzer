import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { Home } from '@/modules/Home';

export const Route = createFileRoute('/_authenticated/home/')({
    // Every role but Designer (story 58); the server still scopes every read on its own.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('home.view', auth.me.role);
    },
    component: Home,
});
