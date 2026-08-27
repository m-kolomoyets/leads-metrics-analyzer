import type { DynamicsBuyerHistory, DynamicsDimensionBuyerHistory, DynamicsHistoryDay } from './types';

// The month read's shaping half, kept clear of the DB so the "latest push wins" rule is testable on
// its own (ADR-0005). One row per active Snapshot in the range goes in; one entry per buyer, holding
// only the days they actually pushed, comes out.

// One active Snapshot in the range, reduced to what a dot needs. `profit` and `spendPlus` are null
// when the push froze no Frozen Geo Rollup at all — a push with no total, which the grid paints
// differently from a day with no push.
export type HistoryPushRow = {
    createdByUserId: string;
    reportDate: string;
    takenAt: Date;
    profit: number | null;
    spendPlus: number | null;
};

// Snapshots are cumulative — each push restates the day so far — so the latest one IS the day's
// total and nothing is summed across pushes (SPEC §3.1, ADR-0017). The key is the buyer AND the day,
// which is the only difference from the roster's `latestPerUser`. Ties on `taken_at` are broken by
// arrival order, which is the order the query returned.
const latestPerBuyerDay = (rows: HistoryPushRow[]): Map<string, Map<string, HistoryPushRow>> => {
    const byBuyer = new Map<string, Map<string, HistoryPushRow>>();

    for (const row of rows) {
        let days = byBuyer.get(row.createdByUserId);

        if (!days) {
            days = new Map<string, HistoryPushRow>();
            byBuyer.set(row.createdByUserId, days);
        }

        const current = days.get(row.reportDate);

        if (!current || row.takenAt.getTime() >= current.takenAt.getTime()) {
            days.set(row.reportDate, row);
        }
    }

    return byBuyer;
};

// Ascending by date, so the grid can walk its own month against the array without sorting again.
const byDate = (a: { reportDate: string }, b: { reportDate: string }): number => {
    return a.reportDate.localeCompare(b.reportDate);
};

export const toHistory = (buyerIds: string[], rows: HistoryPushRow[]): DynamicsBuyerHistory[] => {
    const byBuyer = latestPerBuyerDay(rows);

    return buyerIds.map((buyerId): DynamicsBuyerHistory => {
        const days = [...(byBuyer.get(buyerId)?.values() ?? [])]
            .map((row): DynamicsHistoryDay => {
                return {
                    reportDate: row.reportDate,
                    profit: row.profit,
                    // A push that froze no rollup has no denominator either; zero is the honest
                    // reading here, and the null profit beside it is what stops the day being graded.
                    spendPlus: row.spendPlus ?? 0,
                };
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
