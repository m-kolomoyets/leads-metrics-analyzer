import type { Zone } from './types';

// ROI zones for the Home map and the offer / buyer ratings (offers-and-home PRD). Hard-coded, not a
// Ruleset input: the three bands are one app-wide reading of ROI, not a per-Geo threshold a buyer
// tunes. Both edges land in yellow.
const ROI_ZONE_RED_BELOW = -20;
const ROI_ZONE_GREEN_ABOVE = 30;

// `roi` is a percentage (Spend⁺-based, like every other ROI in the app). Unknown ROI — no spend, no
// rows — is neutral rather than a colour the reader might act on.
export function roiZone(roi: number | null): Zone {
    if (roi === null || !Number.isFinite(roi)) {
        return 'neutral';
    }

    if (roi < ROI_ZONE_RED_BELOW) {
        return 'red';
    }

    if (roi > ROI_ZONE_GREEN_ABOVE) {
        return 'green';
    }

    return 'yellow';
}
