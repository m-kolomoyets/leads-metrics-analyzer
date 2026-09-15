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

// One market inside a buyer's rating row (offers-and-home/16): the row a rating entry expands into,
// graded like the panel's rows so the two agree market for market.
export type BuyerGeoRollup = Money & {
    geo: string;
};

// A buyer over the whole period (PRD stories 55–56); for a buyer viewer their one row IS "my stats"
// (story 57), since row-scope hands them nobody else's pushes.
export type BuyerRating = Money & {
    // 1-based position under the sort asked for.
    rank: number;
    buyerUserId: string;
    // Markets that moved money — a frozen row with neither spend nor revenue is a market they did
    // not really run.
    activeGeos: number;
    // Best profit first.
    geos: BuyerGeoRollup[];
};

// Profit leads by default; weighted ROI is the other reading of the same rows (story 55).
export const RATING_SORTS = ['profit', 'roi'] as const;

export type RatingSort = (typeof RATING_SORTS)[number];

type GeoBucket = {
    spend: number;
    revenue: number;
};

type SortRule = (a: BuyerRating, b: BuyerRating) => number;

const byProfit: SortRule = (a, b) => {
    return b.profit - a.profit;
};

// Unknown ROI (nothing spent) sorts last; ties fall back to profit so the order is total.
const byRoi: SortRule = (a, b) => {
    if (a.roi === null || b.roi === null) {
        return Number(a.roi === null) - Number(b.roi === null);
    }

    return b.roi - a.roi || byProfit(a, b);
};

const SORT_RULES: Record<RatingSort, SortRule> = { profit: byProfit, roi: byRoi };

export const buyerRating = (input: PeriodRollupInput, sort: RatingSort): BuyerRating[] => {
    const counted = countedPushes(input.snapshots);
    const buckets = new Map<string, Map<string, GeoBucket>>();

    for (const row of input.geos) {
        const snapshot = counted.get(row.snapshotId);

        if (!snapshot) {
            continue;
        }

        const markets = buckets.get(snapshot.buyerUserId) ?? new Map<string, GeoBucket>();
        const market = markets.get(row.geo) ?? { spend: 0, revenue: 0 };

        market.spend += row.spendPlus;
        market.revenue += row.geoTotal;
        markets.set(row.geo, market);
        buckets.set(snapshot.buyerUserId, markets);
    }

    const unranked = [...buckets.entries()].map(([buyerUserId, markets]): Omit<BuyerRating, 'rank'> => {
        const geos = [...markets.entries()]
            .map(([geo, market]): BuyerGeoRollup => {
                return { geo, ...grade(market.spend, market.revenue) };
            })
            .sort((a, b) => {
                return b.profit - a.profit;
            });
        const spend = geos.reduce((sum, row) => {
            return sum + row.spend;
        }, 0);
        const revenue = geos.reduce((sum, row) => {
            return sum + row.revenue;
        }, 0);
        const activeGeos = geos.filter((row) => {
            return row.spend > 0 || row.revenue > 0;
        }).length;

        return { buyerUserId, ...grade(spend, revenue), activeGeos, geos };
    });

    return unranked
        .map((row): BuyerRating => {
            return { rank: 0, ...row };
        })
        .sort(SORT_RULES[sort])
        .map((row, index) => {
            return { ...row, rank: index + 1 };
        });
};
