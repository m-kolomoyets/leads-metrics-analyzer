import type { RollupDimension } from '@/lib/auth/dimensionRollup';

// What the one table under the frame is called. The buyer's nickname is appended at render: a
// creative or an offer is judged together with WHO ran it, so the identity belongs in the heading
// rather than in a caption beside it (#10).
export const REPORT_TITLE: Record<RollupDimension, string> = {
    creative: 'Creative report',
    offer: 'Offer report',
};

// The page heading. Same day-stamped shape as the trajectory page, so the two frames read as one
// product rather than two.
export const PAGE_TITLE: Record<RollupDimension, string> = {
    creative: 'Creatives',
    offer: 'Offers',
};
