import { useSuspenseQuery } from '@tanstack/react-query';
import { dynamicsDayQueryOptions } from '@/services/dynamics/queries';
import { activeGeo } from '@/modules/Report/utils/activeGeo';
import { GeoTabs } from '@/components/report/GeoTabs';
import { geoTabs } from '../../utils/frame';

// The frame's third level: the markets one buyer ran on one day. Split out from the page so that
// switching buyers suspends this alone — the team and buyer rows above are read from the roster and
// must not blink while a trajectory loads.
//
// The blocks that hang under the geo row — the comparison panel, the chart and the tables — arrive
// with their own issues; this slice is the frame plus the geo level itself.

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

    return <GeoTabs geos={geos} active={selected} spendByGeo={spendByGeo} onSelect={onSelectGeo} />;
}

export { BuyerDay };
