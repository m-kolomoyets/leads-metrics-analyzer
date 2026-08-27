import type { DynamicsSnapshot } from '@/lib/domain/dynamics';
import type { FrozenGeoRollup } from '@/lib/domain/snapshot';
import type { GeoThresholds } from '@/lib/domain/types';

// The lab's day. Authored at the SOURCE grain — frozen Snapshots — and never as ready-made chart
// points, so `buildSeries`, `deltasFor` and `zoneOfPoint` do the same work here that they do on the
// real Dynamics page. A fixture that skipped them would let a chart look right while the domain
// underneath it was wrong, which is the one thing a comparison route must not permit.

const GEO = 'KR';

// One buyer's ruleset, frozen into every push of the day (ADR-0002). Chosen so the CPI arc below
// crosses BOTH thresholds: the zone gradient is the whole point of the CPI card, and a fixture whose
// cost never leaves green would draw a flat green line and prove nothing.
const THRESHOLDS: GeoThresholds = {
    installs: { gy: 1.6, yr: 2.4 },
    regs: { gy: 12, yr: 18 },
    sales: { gy: 30, yr: 45 },
    clicks: { gy: 0.4, yr: 0.65 },
};

// Cumulative bases per push, oldest first: hour, Spend⁺, Geo-Total revenue, then the funnel.
// The shape is deliberate — CPI opens green, climbs through yellow into red around 17:00 as the
// market saturates, then cools back to yellow as late installs land. Every column is monotonically
// non-decreasing, because a cumulative figure that goes backwards means a Facebook restatement and
// this day contains none.
const PUSHES: [
    hour: number,
    spendPlus: number,
    revenue: number,
    clicks: number,
    installs: number,
    regs: number,
    sales: number,
][] = [
    [9, 23.04, 96, 78, 18, 8, 2],
    [10, 54.94, 288, 174, 41, 19, 6],
    [11, 94.47, 480, 281, 67, 30, 10],
    [12, 144.4, 720, 396, 95, 43, 15],
    [13, 195.88, 912, 492, 118, 54, 19],
    [14, 254.37, 1104, 578, 139, 63, 23],
    [15, 319.8, 1248, 648, 156, 71, 26],
    [16, 385.32, 1392, 702, 169, 77, 29],
    [17, 443.22, 1488, 739, 178, 81, 31],
    [18, 490.2, 1632, 789, 190, 87, 34],
    [19, 522.08, 1824, 863, 208, 95, 38],
    [20, 545.16, 2064, 958, 231, 106, 43],
    [21, 564.62, 2352, 1073, 259, 119, 49],
    [22, 575.24, 2688, 1209, 292, 134, 56],
];

// The rollup fields the trajectory never reads — it derives every cost from the bases (see
// `buildSeries`) — but which the type requires. Kept obviously inert rather than plausibly wrong.
function rollupOf(
    spendPlus: number,
    revenue: number,
    clicks: number,
    installs: number,
    regs: number,
    sales: number
): FrozenGeoRollup {
    return {
        geo: GEO,
        spendPlus,
        geoTotal: revenue,
        attributedRevenue: revenue,
        linkClicks: clicks,
        installs,
        regs,
        sales,
        profit: revenue - spendPlus,
        roi: null,
        cpc: null,
        cpi: null,
        cpr: null,
        cps: null,
        waste: 0,
    };
}

// A fixed calendar day, written out rather than computed from `now`: the lab must render the same
// pixels on every reload, or a side-by-side comparison is comparing two different days.
const DAY = '2026-08-27';

const SNAPSHOTS: DynamicsSnapshot[] = PUSHES.map(([hour, spendPlus, revenue, clicks, installs, regs, sales], index) => {
    return {
        id: `lab-${String(index).padStart(2, '0')}`,
        takenAt: `${DAY}T${String(hour).padStart(2, '0')}:00:00Z`,
        geoRollups: [rollupOf(spendPlus, revenue, clicks, installs, regs, sales)],
        thresholds: { [GEO]: THRESHOLDS },
        replacedAt: null,
    };
});

export { GEO as LAB_GEO, SNAPSHOTS as LAB_SNAPSHOTS };
