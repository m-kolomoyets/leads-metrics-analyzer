import type {
    DynamicsBuyerHistory,
    DynamicsDimensionBuyerHistory,
    DynamicsHistoryDay,
    RosterGeoProfit,
} from '@/services/dynamics/types';

// The month read, flattened from per-buyer to per-DAY: the picker grades the team's day, not one
// person's. Pure, so the summing rule is testable on its own (ADR-0005).
//
// Summing across buyers is safe where summing across pushes is not: each buyer's day already arrived
// as their LATEST push and nothing else (ADR-0017), so what is added here is one figure per person,
// never the same day counted twice. Two buyers in the same market are two buys — their Spend⁺ and
// their profit both belong in the total.
//
// A day the team collectively lost money on is red however many of them were green, which is the
// point: the picker answers "which days is the team worth opening", and one buyer's good afternoon
// does not make a bad day worth opening first.

// One market, as the whole team ran it: two buyers in India is one line of India, and the day's
// biggest mover is the biggest across everybody rather than the biggest on one person's card.
const mergeGeos = (into: RosterGeoProfit[], from: RosterGeoProfit[]): RosterGeoProfit[] => {
    const byGeo = new Map<string, number>();

    for (const entry of [...into, ...from]) {
        byGeo.set(entry.geo, (byGeo.get(entry.geo) ?? 0) + entry.profit);
    }

    return [...byGeo.entries()]
        .map(([geo, profit]): RosterGeoProfit => {
            return { geo, profit };
        })
        .sort((a, b) => {
            return Math.abs(b.profit) - Math.abs(a.profit);
        });
};

export const teamHistory = (histories: DynamicsBuyerHistory[]): DynamicsHistoryDay[] => {
    const byDate = new Map<string, DynamicsHistoryDay>();

    for (const history of histories) {
        for (const day of history.days) {
            const current = byDate.get(day.reportDate);

            if (!current) {
                byDate.set(day.reportDate, { ...day });
                continue;
            }

            byDate.set(day.reportDate, {
                reportDate: day.reportDate,
                // Null only while EVERY push of the day froze no rollup: one buyer with no total does
                // not erase the totals of the people beside them, and a null that survives is what
                // keeps the day ungraded rather than being read as a day that broke even.
                profit:
                    current.profit === null && day.profit === null ? null : (current.profit ?? 0) + (day.profit ?? 0),
                spendPlus: current.spendPlus + day.spendPlus,
                geos: mergeGeos(current.geos, day.geos),
            });
        }
    }

    return [...byDate.values()];
};

// The dollar-free month (#10). A day is reported when ANYBODY reported it — there is no figure to
// add up, so the union of the dates is the whole aggregate.
export const teamDimensionHistory = (histories: DynamicsDimensionBuyerHistory[]): string[] => {
    const dates = new Set<string>();

    for (const history of histories) {
        for (const date of history.reportedDates) {
            dates.add(date);
        }
    }

    return [...dates];
};
