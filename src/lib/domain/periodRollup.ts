import type { PushHeader } from './latestPush';
import type { Zone } from './types';
import { latestPerBuyerDay } from './latestPush';
import { roiZone } from './roiZone';

// The Home map's period rollup (offers-and-home/13, PRD stories 46–49): what each market made over
// a period, read from the Frozen Geo Rollup. Pure — the server selects the frozen `snapshot_geo`
// rows within the viewer's row-scope (ADR-0004), this file does the arithmetic. The basis is the Geo
// Total (revenue INCLUDING untagged, ADR-0003) because the question is "is this market making
// money", not "which campaign do I stop". ROI is weighted on the sums, never a mean of days.

export type PeriodSnapshotRow = PushHeader & {
    snapshotId: string;
};

// The Frozen Geo Rollup's money half, per push and market.
export type PeriodGeoRow = {
    snapshotId: string;
    geo: string;
    spendPlus: number;
    geoTotal: number;
};

export type PeriodRollupInput = {
    snapshots: PeriodSnapshotRow[];
    geos: PeriodGeoRow[];
};

export type CountryRollup = {
    geo: string;
    // Spend⁺ (CONTEXT.md): the cost basis of profit and ROI, commission included.
    spend: number;
    revenue: number;
    profit: number;
    // Percent points on the sums; null when nothing was spent.
    roi: number | null;
    // Distinct buyers with a counted push in the market.
    buyers: number;
    // The zone the map PAINTS: neutral for a thin market, else `roiZone(roi)`.
    zone: Zone;
    // Revenue under the threshold — a verdict on a market this small is noise, so it reads grey
    // whatever it spent (PRD story 48).
    isThin: boolean;
};

export const THIN_REVENUE_USD = 500;

type Bucket = {
    spend: number;
    revenue: number;
    buyers: Set<string>;
};

export const countryRollup = (input: PeriodRollupInput): CountryRollup[] => {
    const counted = new Map(
        latestPerBuyerDay(input.snapshots).map((row) => {
            return [row.snapshotId, row] as const;
        })
    );
    const buckets = new Map<string, Bucket>();

    for (const row of input.geos) {
        const snapshot = counted.get(row.snapshotId);

        if (!snapshot) {
            continue;
        }

        const bucket = buckets.get(row.geo) ?? { spend: 0, revenue: 0, buyers: new Set<string>() };

        bucket.spend += row.spendPlus;
        bucket.revenue += row.geoTotal;
        bucket.buyers.add(snapshot.buyerUserId);
        buckets.set(row.geo, bucket);
    }

    return [...buckets.entries()]
        .map(([geo, bucket]): CountryRollup => {
            const profit = bucket.revenue - bucket.spend;
            const roi = bucket.spend > 0 ? (profit / bucket.spend) * 100 : null;
            const isThin = bucket.revenue < THIN_REVENUE_USD;

            return {
                geo,
                spend: bucket.spend,
                revenue: bucket.revenue,
                profit,
                roi,
                buyers: bucket.buyers.size,
                zone: isThin ? 'neutral' : roiZone(roi),
                isThin,
            };
        })
        .sort((a, b) => {
            return a.geo.localeCompare(b.geo);
        });
};
