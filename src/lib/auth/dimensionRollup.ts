import type { Dimension, Viewer } from './scope';
import { assertDimension } from './denial';
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

// What a dollar viewer is told when they reach a read that only exists for the dimension-scoped
// roles. Separate from `DIMENSION_DENIED`: nothing is out of their scope — they simply hold the whole
// Snapshot and must read it through the fact path instead.
export const ROLLUP_ONLY = 'This read is for dimension-scoped viewers only';

// The guard the per-buyer dimension reads open with, and the whole of SPEC I8 for them in one call.
// Two refusals, deliberately distinct: a viewer who still holds a dollar dimension is on the wrong
// path entirely, while a Designer asking for offers (or a BDM for creatives) is asking for a table
// outside their scope — and is told so, rather than handed an empty array.
export const assertRollupRead = (viewer: Viewer, dimension: RollupDimension): RollupDimension => {
    if (rollupDimensionFor(viewer) === null) {
        throw new Error(ROLLUP_ONLY);
    }

    assertDimension(scopeFor(viewer), dimension);

    return dimension;
};
