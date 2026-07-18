import { createFileRoute } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { presetsQueryOptions, sharedSettingsQueryOptions } from '@/services/presets/queries';
import { Analyze } from '@/modules/Analyze';

export const Route = createFileRoute('/_authenticated/analyze/')({
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('analyze.view', auth.me.role);
    },
    loader({ context: { queryClient } }) {
        // Presets + shared settings are read-only here (ADR-0002); preload so the analyzer's
        // ruleset is ready without a suspense waterfall on first render.
        return Promise.all([
            queryClient.ensureQueryData(presetsQueryOptions()),
            queryClient.ensureQueryData(sharedSettingsQueryOptions()),
        ]);
    },
    component: Analyze,
});
