import type { ActualFunnel } from './claim';
import { daysUntilDeadline } from './deadline';
import { latestPerBuyerDay } from './latestPush';

// The offer buyer rating (offers-and-home/11, PRD stories 38–45): who ran this offer in the period,
// and what they made of it. Pure — the server selects the frozen rows within the viewer's row-scope
// (ADR-0004), this file does the arithmetic. Spend is Allocated Spend at the Geo Unit Cost
// (ADR-0013): the offer's installs in a market × what an install cost in that market, an estimate the
// UI labels as one. ROI is weighted on the sums, never a mean of rows (story 41).

export const RATING_PERIODS = ['week', 'month', '90d', 'year'] as const;

export type RatingPeriod = (typeof RATING_PERIODS)[number];

// What the server read accepts: a rating period, or the open all-time window the Claim Gap's actual
// side sums over (offers-and-home/12). The UI's period switch offers the periods only.
export const RATING_WINDOWS = [...RATING_PERIODS, 'all'] as const;

export type RatingWindow = (typeof RATING_WINDOWS)[number];

// Rolling windows ending today (Kyiv — the caller's day, ADR-0017), today included.
const PERIOD_DAYS: Record<RatingPeriod, number> = { week: 7, month: 30, '90d': 90, year: 365 };

// A row older than this, by its last launch, is dimmed but kept in place (story 43).
export const RATING_DIM_AFTER_DAYS = 30;

// One Snapshot header in the period. `status` travels so the rule itself refuses a replaced push
// (ADR-0018), even though every read filters them upstream.
export type RatingSnapshotRow = {
    snapshotId: string;
    buyerUserId: string;
    buyerNickname: string;
    reportDate: string;
    takenAt: string;
    status: 'active' | 'replaced';
};

// The offer's Campaign Model row in one push, with the campaign's Geo resolved from that push's
// Facts — a campaign is one market (join warns otherwise), so the geo is a label, not a key.
export type RatingModelRow = {
    snapshotId: string;
    campaign: string;
    geo: string;
    revenue: number;
    installs: number;
    regs: number;
    sales: number;
};

// The Frozen Geo Rollup's costing half: the market's whole Spend⁺ over its whole installs.
export type RatingGeoRow = {
    snapshotId: string;
    geo: string;
    spendPlus: number;
    installs: number;
};

export type OfferRatingInput = {
    snapshots: RatingSnapshotRow[];
    models: RatingModelRow[];
    geos: RatingGeoRow[];
};

export type OfferRatingRow = {
    buyerUserId: string;
    nickname: string;
    // Allocated (estimated) Spend⁺.
    spend: number;
    revenue: number;
    profit: number;
    // Percent points, weighted; null when nothing was spent.
    roi: number | null;
    sales: number;
    installs: number;
    // The latest report date the buyer ran the offer, `YYYY-MM-DD`.
    lastLaunch: string;
    isDimmed: boolean;
};

const pad2 = (value: number): string => {
    return String(value).padStart(2, '0');
};

// `from`..`to` as `YYYY-MM-DD`, computed in UTC over the day string like every other date helper,
// so a viewer's own zone cannot shift the window.
export const ratingPeriodRange = (period: RatingPeriod, today: string): { from: string; to: string } => {
    const [year, month, day] = today.split('-').map(Number);
    const start = new Date(Date.UTC(year, month - 1, day - (PERIOD_DAYS[period] - 1)));

    return {
        from: `${start.getUTCFullYear()}-${pad2(start.getUTCMonth() + 1)}-${pad2(start.getUTCDate())}`,
        to: today,
    };
};

// The window's bounds; `from` is null for all time, so the server puts no lower bound on the read.
export const ratingWindowRange = (window: RatingWindow, today: string): { from: string | null; to: string } => {
    return window === 'all' ? { from: null, to: today } : ratingPeriodRange(window, today);
};

// The offer's Attributed funnel over the counted pushes, every visible buyer together — the actual
// side of the Claim Gap (offers-and-home/12). Same selection as the rating, so the two never
// disagree about which push is a day.
export const offerFunnel = (input: OfferRatingInput): ActualFunnel => {
    const counted = new Set(
        latestPerBuyerDay(input.snapshots).map((row) => {
            return row.snapshotId;
        })
    );
    const funnel: ActualFunnel = { installs: 0, regs: 0, sales: 0, revenue: 0 };

    for (const row of input.models) {
        if (!counted.has(row.snapshotId)) {
            continue;
        }

        funnel.installs += row.installs;
        funnel.regs += row.regs;
        funnel.sales += row.sales;
        funnel.revenue += row.revenue;
    }

    return funnel;
};

const geoKey = (snapshotId: string, geo: string): string => {
    return `${snapshotId}\u0000${geo}`;
};

type Bucket = Omit<OfferRatingRow, 'profit' | 'roi' | 'isDimmed'>;

export const offerRating = (input: OfferRatingInput, today: string): OfferRatingRow[] => {
    const counted = latestPerBuyerDay(input.snapshots);
    const byId = new Map(
        counted.map((row) => {
            return [row.snapshotId, row] as const;
        })
    );

    // Geo Unit Cost per push and market (ADR-0013). A market that bought no installs has no unit
    // cost; its money stays unallocated, so the offer's spend there reads 0 rather than infinite.
    const unitCost = new Map<string, number>();

    for (const row of input.geos) {
        if (byId.has(row.snapshotId) && row.installs > 0) {
            unitCost.set(geoKey(row.snapshotId, row.geo), row.spendPlus / row.installs);
        }
    }

    const buckets = new Map<string, Bucket>();

    for (const row of input.models) {
        const snapshot = byId.get(row.snapshotId);

        if (!snapshot) {
            continue;
        }

        const bucket = buckets.get(snapshot.buyerUserId) ?? {
            buyerUserId: snapshot.buyerUserId,
            nickname: snapshot.buyerNickname,
            spend: 0,
            revenue: 0,
            sales: 0,
            installs: 0,
            lastLaunch: snapshot.reportDate,
        };

        bucket.spend += row.installs * (unitCost.get(geoKey(row.snapshotId, row.geo)) ?? 0);
        bucket.revenue += row.revenue;
        bucket.sales += row.sales;
        bucket.installs += row.installs;

        if (snapshot.reportDate > bucket.lastLaunch) {
            bucket.lastLaunch = snapshot.reportDate;
        }

        buckets.set(snapshot.buyerUserId, bucket);
    }

    const rows = [...buckets.values()].map((bucket): OfferRatingRow => {
        const profit = bucket.revenue - bucket.spend;

        return {
            ...bucket,
            profit,
            roi: bucket.spend > 0 ? (profit / bucket.spend) * 100 : null,
            // `daysUntilDeadline` is plain calendar arithmetic: negative once the day is behind today.
            isDimmed: -daysUntilDeadline(bucket.lastLaunch, today) > RATING_DIM_AFTER_DAYS,
        };
    });

    // Volume leads, efficiency informs (story 40); a tie reads alphabetically so the order is stable.
    return rows.sort((a, b) => {
        return b.revenue - a.revenue || a.nickname.localeCompare(b.nickname);
    });
};
