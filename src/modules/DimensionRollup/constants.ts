import type { RollupDimension } from '@/lib/auth/dimensionRollup';

// The page heading per dimension — a Designer reads creatives, a BDM offers.
export const DIMENSION_TITLE: Record<RollupDimension, string> = {
    creative: 'Creative performance',
    offer: 'Offer performance',
};
