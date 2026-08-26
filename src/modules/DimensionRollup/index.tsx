import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { LayersIcon } from 'lucide-react';
import { rollupDimensionFor } from '@/lib/auth/dimensionRollup';
import { dimensionRollupQueryOptions } from '@/services/snapshots/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { RollupTable } from '@/components/report/RollupTable';
import { DIMENSION_LABEL } from '@/components/report/RollupTable/constants';
import { rollupRows } from '@/components/report/RollupTable/utils/rows';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/Empty';
import { DIMENSION_TITLE } from './constants';

const routeApi = getRouteApi('/_authenticated');

// The dollar-free branch of `/analyze` (spec 0002 S6, ADR-0009). A Designer/BDM uploads nothing and
// computes nothing: they read every saved Snapshot's facts, summed company-wide by their one
// dimension, and no Spend / Revenue / ROI reaches this tree — the server never selects those columns
// for them (`getDimensionRollupFn`) and `DimensionRollupView` has no field to hold one.
function DimensionRollup() {
    const me = routeApi.useRouteContext({
        select(context) {
            return context.auth.me;
        },
    });
    const { data } = useSuspenseQuery(dimensionRollupQueryOptions());
    // The same seam that chose this component names its axis — never a role compare (ADR-0007).
    const dimension = rollupDimensionFor({ id: me.id, role: me.role, teamId: me.teamId });

    if (dimension === null) {
        return null;
    }

    const { rows, totals } = rollupRows(data);

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">{DIMENSION_TITLE[dimension]}</h1>
            </MainLayoutHeader>

            {rows.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <LayersIcon />
                        </EmptyMedia>
                        <EmptyTitle>Nothing analyzed yet</EmptyTitle>
                        <EmptyDescription>
                            This roll-up sums saved Snapshots. Once a buyer saves one, its{' '}
                            {DIMENSION_LABEL[dimension].toLowerCase()} totals appear here.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <section className="glass-tint tint-blue tint-s5 rounded-lg p-4">
                    <h3 className="text-muted-foreground mb-3 text-[13px] font-normal tracking-widest uppercase">
                        {DIMENSION_TITLE[dimension]} · all snapshots
                    </h3>
                    <RollupTable dimension={dimension} rows={rows} totals={totals} />
                </section>
            )}
        </>
    );
}

export { DimensionRollup };
