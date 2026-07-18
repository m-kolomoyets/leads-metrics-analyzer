import type { PresetView } from '@/services/presets/types';

// Every preset for a Geo, in list order. A Geo may carry several (#30 disambiguation); the analyzer
// surfaces them so the owner can pick which one drives grading rather than silently taking the first.
export function presetsForGeo(presets: PresetView[], geo: string): PresetView[] {
    return presets.filter((preset) => {
        return preset.geo === geo;
    });
}

// The preset a Geo's grading actually runs against. `selectedId` lets the owner disambiguate among
// several presets for the Geo; when absent (or it names no preset here) the rule falls back to the
// same "first active preset per Geo wins" `toRuleset` applies (a version with parseable thresholds).
// Returned so the inline editor mutates the very preset that fed the verdicts, keeping edit and
// grading in lock-step.
export function presetForGeo(presets: PresetView[], geo: string, selectedId?: string): PresetView | undefined {
    const inGeo = presetsForGeo(presets, geo);

    if (selectedId) {
        const chosen = inGeo.find((preset) => {
            return preset.id === selectedId;
        });
        if (chosen) {
            return chosen;
        }
    }

    return inGeo.find((preset) => {
        return preset.thresholds !== null;
    });
}
