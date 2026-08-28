import type { DynamicsBuyerHistory, DynamicsDimensionBuyerHistory, DynamicsHistoryDay, RosterGeoProfit } from './types';

// The month read's shaping half, kept clear of the DB so the "latest push wins" rule is testable on
// its own (ADR-0005). One row per Frozen Geo Rollup in the range goes in; one entry per buyer,
// holding only the days they actually pushed, comes out.

// One market of one active Snapshot in the range. `geo` is null when the push froze no rollup at all
// — a push with no total, which the calendar paints differently from a day with no push — and the
// figures are null with it.
export type HistoryPushRow = {
    snapshotId: string;
    createdByUserId: string;
    reportDate: string;
    takenAt: Date;
    geo: string | null;
    profit: number | null;
    spendPlus: number | null;
};

type PushGroup = {
    snapshotId: string;
    takenAt: Date;
    rollups: HistoryPushRow[];
};

// The day's markets, biggest mover first: a cell has room for two or three flags, and the ones worth
// keeping are the ones carrying the day — in either direction. A market that lost $4,000 explains a
// red day exactly as much as one that made $4,000 explains a green one.
const byWeight = (a: RosterGeoProfit, b: RosterGeoProfit): number => {
    return Math.abs(b.profit) - Math.abs(a.profit);
};

// Rows arrive one per rollup, so the push has to be reassembled before its recency can be judged.
const groupPushes = (rows: HistoryPushRow[]): Map<string, PushGroup> => {
    const pushes = new Map<string, PushGroup>();

    for (const row of rows) {
        const push = pushes.get(row.snapshotId);

        if (push) {
            push.rollups.push(row);
            continue;
        }

        pushes.set(row.snapshotId, { snapshotId: row.snapshotId, takenAt: row.takenAt, rollups: [row] });
    }

    return pushes;
};

// Snapshots are cumulative — each push restates the day so far — so the latest one IS the day's
// total and nothing is summed across pushes (SPEC §3.1, ADR-0017). The key is the buyer AND the day.
// Ties on `taken_at` are broken by snapshot id, so two pushes stamped the same second resolve to the
// same one on every read rather than flipping between refreshes.
const latestPerBuyerDay = (rows: HistoryPushRow[]): Map<string, Map<string, PushGroup>> => {
    const byBuyer = new Map<string, Map<string, PushGroup>>();

    for (const push of groupPushes(rows).values()) {
        const [row] = push.rollups;
        let days = byBuyer.get(row.createdByUserId);

        if (!days) {
            days = new Map<string, PushGroup>();
            byBuyer.set(row.createdByUserId, days);
        }

        const current = days.get(row.reportDate);
        const newer =
            !current ||
            push.takenAt.getTime() > current.takenAt.getTime() ||
            (push.takenAt.getTime() === current.takenAt.getTime() && push.snapshotId > current.snapshotId);

        if (newer) {
            days.set(row.reportDate, push);
        }
    }

    return byBuyer;
};

// One push's markets, added up into the day it reports.
const toDay = (reportDate: string, push: PushGroup): DynamicsHistoryDay => {
    const geos = push.rollups.flatMap((row): RosterGeoProfit[] => {
        return row.geo === null ? [] : [{ geo: row.geo, profit: row.profit ?? 0 }];
    });

    return {
        reportDate,
        // Null, not zero, when the push froze no rollup: there is no total to grade, and the null is
        // what stops the day being graded at all.
        profit:
            geos.length === 0
                ? null
                : geos.reduce((total, geo) => {
                      return total + geo.profit;
                  }, 0),
        spendPlus: push.rollups.reduce((total, row) => {
            return total + (row.spendPlus ?? 0);
        }, 0),
        geos: geos.sort(byWeight),
    };
};

// Ascending by date, so the calendar can walk its own month against the array without sorting again.
const byDate = (a: { reportDate: string }, b: { reportDate: string }): number => {
    return a.reportDate.localeCompare(b.reportDate);
};

export const toHistory = (buyerIds: string[], rows: HistoryPushRow[]): DynamicsBuyerHistory[] => {
    const byBuyer = latestPerBuyerDay(rows);

    return buyerIds.map((buyerId): DynamicsBuyerHistory => {
        const days = [...(byBuyer.get(buyerId)?.entries() ?? [])]
            .map(([reportDate, push]) => {
                return toDay(reportDate, push);
            })
            .sort(byDate);

        return { buyerId, days };
    });
};

// The dollar-free month (#10). Same "latest push wins" rule — which is invisible here, since a day
// either was reported or was not — and not one figure carried across.
export const toDimensionHistory = (
    buyerIds: string[],
    rows: Pick<HistoryPushRow, 'createdByUserId' | 'reportDate'>[]
): DynamicsDimensionBuyerHistory[] => {
    const byBuyer = new Map<string, Set<string>>();

    for (const row of rows) {
        const dates = byBuyer.get(row.createdByUserId) ?? new Set<string>();

        dates.add(row.reportDate);
        byBuyer.set(row.createdByUserId, dates);
    }

    return buyerIds.map((buyerId): DynamicsDimensionBuyerHistory => {
        return { buyerId, reportedDates: [...(byBuyer.get(buyerId) ?? [])].sort() };
    });
};
