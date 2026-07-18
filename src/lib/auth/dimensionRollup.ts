import type { Dimension, Viewer } from './scope';
import { scopeFor } from './scope';

// The T7 (#9) dimension-scoping seam. Designer and BDM are barred from the dollar tables and instead
// read one company-wide roll-up keyed by their single non-dollar dimension. This function is driven
// PURELY by `scopeFor(viewer).dimensions` (ADR-0007) — the gate is the dimension set, never an ad hoc
// role check — so adding a dimension-restricted role is a `scopeFor` edit, nothing more.

// The tables that expose per-row dollar figures. A viewer holding ANY of these reads whole facts via
// the Snapshot path and gets no restricted roll-up here.
const DOLLAR_DIMENSIONS: Dimension[] = ['campaign', 'account', 'geo'];

// The non-dollar dimensions a restricted viewer may roll up by.
export type RollupDimension = 'creative' | 'offer';

const ROLLUP_DIMENSIONS: RollupDimension[] = ['creative', 'offer'];

// The single dimension a dollar-barred viewer (Designer → creative, BDM → offer) rolls up by, or
// `null` for any viewer that still holds a dollar dimension (head/team_lead/buyer). Returns the FIRST
// roll-up dimension the scope carries, so a future single-dimension role needs only a `scopeFor` row.
export const rollupDimensionFor = (viewer: Viewer): RollupDimension | null => {
    const { dimensions } = scopeFor(viewer);

    if (
        dimensions.some((dimension) => {
            return DOLLAR_DIMENSIONS.includes(dimension);
        })
    ) {
        return null;
    }

    return (
        ROLLUP_DIMENSIONS.find((dimension) => {
            return dimensions.includes(dimension);
        }) ?? null
    );
};
