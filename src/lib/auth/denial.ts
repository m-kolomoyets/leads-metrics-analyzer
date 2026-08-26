import type { Dimension, VisibilityScope } from './scope';

// The dimension-scope half of SPEC I8, as an explicit refusal. A role whose scope carries no dollar
// dimension (Designer, BDM — spec story 40) is not a viewer with no data; it is a viewer who may not
// ask. An empty array said the first thing while meaning the second, so every dollar read now throws
// this and the caller renders an access error instead of an empty feed.
//
// Row-scope denial is deliberately NOT here: an out-of-scope row reads as not-found, never as
// forbidden, so another team's activity is never disclosed by its absence (spec story 42).
//
// Pure — no DB, no HTTP — so it stays a tested seam alongside `scopeFor` (ADR-0005, ADR-0007).

export const DIMENSION_DENIED = 'This data is outside your access scope';

// True when the viewer's dimension scope does not reach the asked-for table.
export const deniesDimension = (scope: VisibilityScope, dimension: Dimension): boolean => {
    return !scope.dimensions.includes(dimension);
};

// The guard every dollar read opens with. Throws rather than returning a verdict: a caller that
// forgot to check would otherwise fall through to the query and read rows it may not see.
export const assertDimension = (scope: VisibilityScope, dimension: Dimension): void => {
    if (deniesDimension(scope, dimension)) {
        throw new Error(DIMENSION_DENIED);
    }
};
