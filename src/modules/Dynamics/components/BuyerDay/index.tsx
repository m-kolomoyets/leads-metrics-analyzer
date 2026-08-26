import { useSuspenseQuery } from '@tanstack/react-query';
import { buildSeries } from '@/lib/domain/dynamics';
import { dynamicsDayQueryOptions } from '@/services/dynamics/queries';
import { activeGeo } from '@/modules/Report/utils/activeGeo';
import { ComparisonPanel } from '@/components/dynamics/ComparisonPanel';
import { TrajectoryChart } from '@/components/dynamics/TrajectoryChart';
import { GeoTabs } from '@/components/report/GeoTabs';
import { geoTabs } from '../../utils/frame';

// The frame's third level: the markets one buyer ran on one day. Split out from the page so that
// switching buyers suspends this alone — the team and buyer rows above are read from the roster and
// must not blink while a trajectory loads.
//
// The tables that hang under the chart arrive with their own issue.

type BuyerDayProps = {
    buyerId: string;
    reportDate: string;
    geo: string | undefined;
    onSelectGeo: (geo: string) => void;
};

function BuyerDay({ buyerId, reportDate, geo, onSelectGeo }: BuyerDayProps) {
    const { data: snapshots } = useSuspenseQuery(dynamicsDayQueryOptions({ buyerId, reportDate }));

    const tabs = geoTabs(snapshots);
    const geos = tabs.map((tab) => {
        return tab.geo;
    });
    // A stale geo in a shared link falls back to the first market rather than throwing — the same
    // call the detailed report makes, and the same reason (spec story 28).
    const selected = activeGeo(geos, geo);

    const spendByGeo: Record<string, number> = {};

    for (const tab of tabs) {
        spendByGeo[tab.geo] = tab.spendPlus;
    }

    if (!selected) {
        return <p className="text-muted-foreground text-sm">No market with spend was reported for this day.</p>;
    }

    // The selected market's trajectory: every active push that froze it, oldest first. The panel
    // reads the last two points of it; the chart reads all of them.
    const series = buildSeries(snapshots, selected);

    return (
        <div className="flex flex-col gap-4">
            <GeoTabs geos={geos} active={selected} spendByGeo={spendByGeo} onSelect={onSelectGeo} />
            <ComparisonPanel points={series} />
            <TrajectoryChart points={series} />
        </div>
    );
}

export { BuyerDay };
