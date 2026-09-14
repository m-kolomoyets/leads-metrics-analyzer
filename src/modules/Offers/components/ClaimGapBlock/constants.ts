import type { ClaimGapMetric, ClaimGapTone } from '@/lib/domain/claim';

export const CLAIM_GAP_METRIC_LABELS: Record<ClaimGapMetric, string> = {
    i2r: 'I2R',
    r2s: 'R2S',
    i2s: 'I2S',
    epc: 'EPC',
};

// Below the promise reads red, above it green, the band between neutral — the thresholds live in
// `domain/claim`, this only paints them.
export const CLAIM_GAP_TONE_CLASS: Record<ClaimGapTone, string> = {
    red: 'text-zone-red',
    green: 'text-zone-green',
    neutral: 'text-foreground',
};
