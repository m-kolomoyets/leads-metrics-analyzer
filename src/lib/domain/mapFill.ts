import type { CountryRollup } from './periodRollup';

// The Home map's fill modes (offers-and-home/15, PRD story 50). Colour is always the zone; a mode
// decides only how strong the wash is, so the legend never changes meaning. Profitability paints
// every market flat. Profit size scales on |profit|, presence on Spend⁺ — each normalised min→0,
// max→1 across the PAINTED markets, so the darkest wash is the period's biggest and the faintest its
// smallest. A thin market is grey whatever it did and stays out of the scale (PRD story 48); a lone
// market, or a field with nothing to rank, paints at full weight.

export const MAP_FILL_MODES = ['profitability', 'profit-size', 'presence'] as const;

export type MapFillMode = (typeof MAP_FILL_MODES)[number];

const MEASURE: Record<Exclude<MapFillMode, 'profitability'>, (row: CountryRollup) => number> = {
    'profit-size': (row) => {
        return Math.abs(row.profit);
    },
    presence: (row) => {
        return row.spend;
    },
};

// Weight 0–1 per painted geo; absent means "paint flat".
export const fillWeights = (rows: CountryRollup[], mode: MapFillMode): Map<string, number> => {
    const weights = new Map<string, number>();

    if (mode === 'profitability') {
        return weights;
    }

    const measure = MEASURE[mode];
    const painted = rows.filter((row) => {
        return !row.isThin;
    });
    const values = painted.map(measure);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min;

    painted.forEach((row, index) => {
        weights.set(row.geo, span === 0 ? 1 : (values[index] - min) / span);
    });

    return weights;
};
