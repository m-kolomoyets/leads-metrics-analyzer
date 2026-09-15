import type { WorldMapCountry } from '@/components/charts/WorldMap/types';
import type { CountryRollup } from '@/lib/domain/periodRollup';
import { THIN_REVENUE_USD } from '@/lib/domain/periodRollup';
import { int, pct, usd, usdRound, usdSigned } from '@/components/report/utils/format';

// The adapter between the period rollup and the map primitive (ADR-0025): the domain rules — which
// zone paints, what "too little data" means — are decided here and handed over as a tone and
// formatted strings, so the map never learns what a Geo Total is.

// `weights` is a fill mode's ranking (`fillWeights`); a geo it does not name paints flat.
export const toMapCountries = (
    rows: CountryRollup[],
    nameOf: (geo: string) => string,
    weights: Map<string, number> = new Map()
): WorldMapCountry[] => {
    return rows.map((row): WorldMapCountry => {
        return {
            code: row.geo,
            // Neutral for a thin market whatever its ROI (PRD story 48) — the rollup already folded
            // that into `zone`, and the ROI row below says why in words.
            tone: row.zone,
            fillWeight: weights.get(row.geo),
            tooltip: {
                title: nameOf(row.geo),
                rows: [
                    { label: 'Spend⁺', value: usd(row.spend) },
                    { label: 'Revenue', value: usd(row.revenue) },
                    { label: 'Profit', value: usdSigned(row.profit) },
                    { label: 'ROI', value: pct(row.roi), tone: row.zone },
                    { label: 'Buyers', value: int(row.buyers) },
                    ...(row.isThin ? [{ label: 'Data', value: `too little (< ${usdRound(THIN_REVENUE_USD)})` }] : []),
                ],
            },
        };
    });
};
