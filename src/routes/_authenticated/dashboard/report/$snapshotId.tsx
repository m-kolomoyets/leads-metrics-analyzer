import { createFileRoute, notFound } from '@tanstack/react-router';
import { checkIsRouteAllowed } from '@/lib/utils/auth/permissions';
import { SNAPSHOT_NOT_FOUND } from '@/services/snapshots/constants';
import { snapshotBundleQueryOptions } from '@/services/snapshots/queries';
import { Report } from '@/modules/Report';
import { reportSearchSchema } from '@/modules/Report/schemas';

export const Route = createFileRoute('/_authenticated/dashboard/report/$snapshotId')({
    validateSearch: reportSearchSchema,
    // Dollar roles only: a Designer's or BDM's dimension scope carries no campaign dimension, so the
    // Report surfaces are not theirs (spec story 40). The server gate is `scopeFor`, not this list.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('report.view', auth.me.role);
    },
    async loader({ context: { queryClient }, params }) {
        // A Snapshot outside the viewer's scope comes back as not-found from the server, and reads as
        // not-found here too — never forbidden, so another team's activity is not disclosed by its
        // absence (spec story 42). Only that verdict is translated: a network or server failure stays
        // an error, or a broken backend would read as "this report does not exist".
        try {
            await queryClient.ensureQueryData(snapshotBundleQueryOptions(params.snapshotId));
        } catch (error) {
            if (error instanceof Error && error.message.includes(SNAPSHOT_NOT_FOUND)) {
                throw notFound();
            }
            throw error;
        }
    },
    component: Report,
});
