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

// One buyer's share of a market over the period (offers-and-home/14): the country panel's row.
// Same selection and basis as `CountryRollup`, so the rows of a market sum to its figures.
export type CountryBuyerRollup = {
    buyerUserId: string;
    spend: number;
    revenue: number;
    profit: number;
    roi: number | null;
    // The latest report date the buyer had a counted row in this market.
    lastReportDate: string;
    zone: Zone;
    isThin: boolean;
};

type Bucket = {
    spend: number;
    revenue: number;
    buyers: Set<string>;
};

type Money = Pick<CountryRollup, 'spend' | 'revenue' | 'profit' | 'roi' | 'zone' | 'isThin'>;

// Profit, ROI and the painted zone, from the sums. ROI is weighted on the sums, never a mean of days.
const grade = (spend: number, revenue: number): Money => {
    const profit = revenue - spend;
    const roi = spend > 0 ? (profit / spend) * 100 : null;
    const isThin = revenue < THIN_REVENUE_USD;

    return { spend, revenue, profit, roi, zone: isThin ? 'neutral' : roiZone(roi), isThin };
};

// The pushes that count, by id: each buyer's latest active push per report date.
const countedPushes = (snapshots: PeriodSnapshotRow[]): Map<string, PeriodSnapshotRow> => {
    return new Map(
        latestPerBuyerDay(snapshots).map((row) => {
            return [row.snapshotId, row] as const;
        })
    );
};

export const countryRollup = (input: PeriodRollupInput): CountryRollup[] => {
    const counted = countedPushes(input.snapshots);
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
            return { geo, ...grade(bucket.spend, bucket.revenue), buyers: bucket.buyers.size };
        })
        .sort((a, b) => {
            return a.geo.localeCompare(b.geo);
        });
};

type BuyerBucket = {
    spend: number;
    revenue: number;
    lastReportDate: string;
};

// One market, split by buyer (PRD story 50). Sorted by profit, best first, so the panel reads as a
// ranking; a buyer with no counted row in the market has no row.
export const countryBuyers = (input: PeriodRollupInput, geo: string): CountryBuyerRollup[] => {
    const counted = countedPushes(input.snapshots);
    const buckets = new Map<string, BuyerBucket>();

    for (const row of input.geos) {
        const snapshot = counted.get(row.snapshotId);

        if (!snapshot || row.geo !== geo) {
            continue;
        }

        const bucket = buckets.get(snapshot.buyerUserId) ?? { spend: 0, revenue: 0, lastReportDate: '' };

        bucket.spend += row.spendPlus;
        bucket.revenue += row.geoTotal;
        bucket.lastReportDate =
            snapshot.reportDate > bucket.lastReportDate ? snapshot.reportDate : bucket.lastReportDate;
        buckets.set(snapshot.buyerUserId, bucket);
    }

    return [...buckets.entries()]
        .map(([buyerUserId, bucket]): CountryBuyerRollup => {
            return { buyerUserId, ...grade(bucket.spend, bucket.revenue), lastReportDate: bucket.lastReportDate };
        })
        .sort((a, b) => {
            return b.profit - a.profit;
        });
};
