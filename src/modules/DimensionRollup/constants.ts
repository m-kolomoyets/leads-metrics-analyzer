import type { RollupDimension } from '@/lib/auth/dimensionRollup';

// What the viewer's single dimension is called in the table's first column.
export const DIMENSION_LABEL: Record<RollupDimension, string> = {
    creative: 'Creative',
    offer: 'Offer',
};

// The page heading per dimension — a Designer reads creatives, a BDM offers.
export const DIMENSION_TITLE: Record<RollupDimension, string> = {
    creative: 'Creative performance',
    offer: 'Offer performance',
};

// The funnel stages, in order (CONTEXT.md §Funnel). Money columns do not exist in this branch.
export const STAGE_COLUMNS = ['Clicks', 'Inst', 'Reg', 'Sale'];

// The stage-to-stage conversion rates, aligned with the analyzer's short labels.
export const RATE_COLUMNS = ['C2I', 'I2R', 'R2S', 'I2S'];
