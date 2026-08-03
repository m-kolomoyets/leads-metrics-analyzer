import type { Zone } from '@/lib/domain/types';

// Presentation-only bands shared by every surface that tints by ROI — the Geo header and the Report
// feed's Snapshot cards. Unlike the tunable cost thresholds these are fixed reference bands, which is
// why they live at the UI edge rather than in a preset.

// Loss → red, thin → yellow, healthy → green. Null (nothing spent, or no Frozen Geo Rollup) is
// neutral: ungraded, never "bad".
export function roiZone(roi: number | null): Zone {
    if (roi === null) {
        return 'neutral';
    }
    if (roi < -20) {
        return 'red';
    }
    return roi <= 30 ? 'yellow' : 'green';
}

// The glass-tint classes for a zone (index.css). Neutral keeps the plain blue tint.
export const ZONE_TINT_CLASS: Record<Zone, string> = {
    green: 'glass-tint tint-green',
    yellow: 'glass-tint tint-yellow',
    red: 'glass-tint tint-red',
    neutral: 'glass-tint tint-blue tint-s5',
};
