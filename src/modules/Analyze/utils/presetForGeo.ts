import type { PresetView } from '@/services/presets/types';

// The preset a Geo's grading actually runs against — the same "first active preset per Geo wins"
// rule `toRuleset` applies (a version with parseable thresholds). Returned so the inline editor
// (S3) mutates the very preset that fed the verdicts, keeping edit and grading in lock-step.
export function presetForGeo(presets: PresetView[], geo: string): PresetView | undefined {
    return presets.find((preset) => {
        return preset.geo === geo && preset.thresholds !== null;
    });
}
