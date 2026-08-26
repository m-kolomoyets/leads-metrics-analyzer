import type { MeData } from '@/services/auth/types';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { rollupDimensionFor } from '@/lib/auth/dimensionRollup';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { presetsQueryOptions, sharedSettingsQueryOptions } from '@/services/presets/queries';
import { dimensionRollupQueryOptions } from '@/services/snapshots/queries';
import { Analyze } from '@/modules/Analyze';
import { DimensionRollup } from '@/modules/DimensionRollup';
import { LOCALES } from '@/components/report/utils/i18n';

// The two bits of Analyze view state worth a URL: which market is on screen and which language it
// reads in. `.catch()` per repo convention — a stale geo falls back to the first market (`activeGeo`
// makes the same call once the files are parsed) rather than throwing the page away. The triage
// toggles stay out: they are sets of per-account keys, far too big for a query string.
const searchSchema = z.object({
    geo: z.string().optional().catch(undefined),
    locale: z.enum(LOCALES).catch('uk').default('uk'),
});

// One route, two component trees (ADR-0009). The fork is a `scopeFor` read via `rollupDimensionFor` —
// never a role-string compare — so the rule that hides dollar columns server-side also picks the view.
const isRollupViewer = (me: MeData) => {
    return rollupDimensionFor({ id: me.id, role: me.role, teamId: me.teamId }) !== null;
};

function AnalyzeRoute() {
    const me = Route.useRouteContext({
        select(context) {
            return context.auth.me;
        },
    });

    if (isRollupViewer(me)) {
        return <DimensionRollup />;
    }

    return <Analyze />;
}

export const Route = createFileRoute('/_authenticated/analyze/')({
    validateSearch: searchSchema,
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('analyze.view', auth.me.role);
    },
    loader({ context: { queryClient, auth } }) {
        // The rollup branch uploads nothing and owns no ruleset: it preloads only its server roll-up.
        // Presets/shared settings stay unfetched for it — those reads are dollar-role territory.
        if (isRollupViewer(auth.me)) {
            return queryClient.ensureQueryData(dimensionRollupQueryOptions());
        }

        // Presets + shared settings are read-only here (ADR-0002); preload so the analyzer's
        // ruleset is ready without a suspense waterfall on first render.
        return Promise.all([
            queryClient.ensureQueryData(presetsQueryOptions()),
            queryClient.ensureQueryData(sharedSettingsQueryOptions()),
        ]);
    },
    component: AnalyzeRoute,
});
