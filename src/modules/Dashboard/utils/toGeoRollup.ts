import type { GeoRollup } from '@/lib/domain';
import type { Totals } from '@/lib/domain/types';
import type { ReportGeoView } from '@/services/reports/types';
import { metricsFor } from '@/lib/domain/aggregate';

// Lifts a Frozen Geo Rollup back into the domain's `GeoRollup` so the feed renders each Geo row
// through the same `GeoStat` the buyer saw — one component, one format, no second implementation of
// the market header (spec story 29).
//
// The allocation comes back empty on purpose: the Offers and OS tables are allocations over Campaign
// Models, which this read deliberately does not fetch. `GeoStat` never touches them; they belong to
// the detailed report, one click away.
const EMPTY_TOTALS: Totals = {
    spend: 0,
    spendPlus: 0,
    revenue: 0,
    linkClicks: 0,
    installs: 0,
    regs: 0,
    sales: 0,
};

export function toGeoRollup(geo: ReportGeoView): GeoRollup {
    // Raw Spend is display-only and was never frozen — only Spend⁺, the basis of every cost metric,
    // was. `GeoStat` reads Spend⁺, so nothing here shows the zero.
    const totals: Totals = {
        spend: 0,
        spendPlus: geo.spendPlus,
        revenue: geo.geoTotal,
        linkClicks: geo.linkClicks,
        installs: geo.installs,
        regs: geo.regs,
        sales: geo.sales,
    };

    return {
        geo: geo.geo,
        metrics: metricsFor(totals),
        attributed: metricsFor({ ...totals, revenue: geo.attributedRevenue }),
        allocation: { offers: [], os: [], unallocated: { ...EMPTY_TOTALS } },
        // Non-null by construction: a row exists here only because the Snapshot froze one, and its
        // presence is exactly what tells `GeoStat` the Geo Total is real rather than an Attributed sum.
        total: { revenue: geo.geoTotal, profit: geo.profit, roi: geo.roi, waste: geo.waste },
    };
}
