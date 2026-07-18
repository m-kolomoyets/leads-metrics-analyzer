import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { presetsQueryOptions } from '@/services/presets/queries';
import { Presets } from '@/modules/Presets';

export const Route = createFileRoute('/_authenticated/presets/')({
    // Dollar roles only; the server row-scope narrows which presets each one gets back.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('presets.manage', auth.me.role);
    },
    async loader({ context: { queryClient } }) {
        // Preload so the module's useSuspenseQuery resolves from cache (repo convention).
        await queryClient.ensureQueryData(presetsQueryOptions());
    },
    component: Presets,
});
