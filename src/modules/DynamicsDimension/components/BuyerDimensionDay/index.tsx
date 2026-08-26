import type { RollupDimension } from '@/lib/auth/dimensionRollup';
import { useSuspenseQuery } from '@tanstack/react-query';
import { kyivClock } from '@/lib/utils/kyivDay';
import { dynamicsDimensionDayQueryOptions } from '@/services/dynamics/queries';
import { activeGeo } from '@/modules/Report/utils/activeGeo';
import { GeoTabs } from '@/components/report/GeoTabs';
import { RollupTable } from '@/components/report/RollupTable';
import { rollupRows } from '@/components/report/RollupTable/utils/rows';
import { SectionCard } from '@/components/report/SectionCard';
import { REPORT_TITLE } from '../../constants';
import { geosOf, rowsOfGeo } from '../../utils/frame';

// The frame's third level for a Designer or BDM (#10): one buyer's markets, and under them the one
// table their role holds a dimension for. No comparison panel, no chart, no accounts, no campaigns —
// all four are built on money and cost-per figures, which is precisely what these roles do not have.
//
// What replaces them is identity: whose day this is and when it was pushed. For a BDM deciding how to
// allocate a limited offer, that is the substance of the decision rather than metadata around it.

type BuyerDimensionDayProps = {
    dimension: RollupDimension;
    buyerId: string;
    reportDate: string;
    geo: string | undefined;
    onSelectGeo: (geo: string) => void;
};

function BuyerDimensionDay({ dimension, buyerId, reportDate, geo, onSelectGeo }: BuyerDimensionDayProps) {
    const { data: day } = useSuspenseQuery(dynamicsDimensionDayQueryOptions({ dimension, buyerId, reportDate }));

    const geos = geosOf(day.rows);
    // A stale geo in a shared link falls back to the first market rather than throwing — the same
    // call the detailed report and the trajectory page both make (spec story 28).
    const selected = activeGeo(geos, geo);

    // Said out loud rather than rendered as an empty table: a gap where the report was about to
    // appear reads as a page that failed, not as a buyer who has not pushed yet (SPEC §6.6).
    if (day.takenAt === null) {
        return <p className="text-muted-foreground text-sm">No reports for this period.</p>;
    }

    if (!selected) {
        return <p className="text-muted-foreground text-sm">This push froze no rows to report on.</p>;
    }

    const { rows, totals } = rollupRows(rowsOfGeo(day.rows, selected));

    return (
        <div className="flex flex-col gap-4">
            {/* No spend stamp on the tabs: there is no Spend⁺ in this branch to put on one. */}
            <GeoTabs geos={geos} active={selected} onSelect={onSelectGeo} />

            <SectionCard
                title={`${REPORT_TITLE[dimension]} · ${day.buyerNickname} · ${selected}`}
                // When the push landed — the other half of the decision, and the reason a BDM can
                // tell a live allocation from one nobody has reported on since morning.
                actions={
                    <span className="text-muted-foreground text-xs tabular-nums">
                        pushed {kyivClock(new Date(day.takenAt))}
                    </span>
                }
            >
                <RollupTable dimension={dimension} rows={rows} totals={totals} />
            </SectionCard>
        </div>
    );
}

export { BuyerDimensionDay };
