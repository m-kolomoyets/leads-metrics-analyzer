import type { PresetThresholds } from '@/services/presets/types';
import { z } from 'zod';

// Parses the legacy prototype's exported presets file (references/presets.json) so a preset can be
// imported into the create form and saved to the DB. That file stores threshold values as strings
// and carries `wasteZones` only on the shared block (not per preset) — both are reconciled here into
// the typed `PresetThresholds` the create form and server expect.

// A green→yellow / yellow→red pair; the file writes each bound as a numeric string, so coerce.
const pairSchema = z.object({
    gy: z.coerce.number(),
    yr: z.coerce.number(),
});

const filePresetSchema = z.object({
    name: z.string(),
    installs: pairSchema,
    regs: pairSchema,
    sales: pairSchema,
    clicks: pairSchema,
    // Per-preset waste zones are absent in the prototype export; the shared block supplies them.
    wasteZones: pairSchema.optional(),
});

const importPresetsFileSchema = z.object({
    geoPresets: z.record(z.string(), z.array(filePresetSchema)),
    // The prototype's team-global block: waste zones (per-preset back-fill above) plus the two shared
    // tunables. `reviewMult`/`commission` are numeric strings in the export, so coerce.
    shared: z
        .object({
            wasteZones: pairSchema,
            reviewMult: z.coerce.number(),
            commission: z.coerce.number(),
        })
        .partial()
        .optional(),
});

export type ImportPresetsFile = z.infer<typeof importPresetsFileSchema>;

// The shared tunables lifted from an import file, mapped onto our shared-settings names. Sellers are
// not part of the prototype export, so they are left untouched by an import.
export type ImportedShared = {
    reviewMultiplier: number;
    defaultCommission: number;
};

// A preset lifted from the file, ready to prefill the create form: a display name plus the full
// typed thresholds (waste zones back-filled from the shared block, then 0).
export type ImportedPreset = {
    name: string;
    thresholds: PresetThresholds;
};

const EMPTY_PAIR = { gy: 0, yr: 0 };

// Parses raw file text into the typed file, or null if it is not the expected shape.
export function parseImportPresetsFile(text: string): ImportPresetsFile | null {
    let json: unknown;
    try {
        json = JSON.parse(text);
    } catch {
        return null;
    }

    const parsed = importPresetsFileSchema.safeParse(json);

    return parsed.success ? parsed.data : null;
}

// Every preset the file holds for one Geo, back-filling each with the shared waste zones.
export function importedPresetsForGeo(file: ImportPresetsFile, geo: string): ImportedPreset[] {
    const sharedWaste = file.shared?.wasteZones ?? EMPTY_PAIR;

    return (file.geoPresets[geo] ?? []).map((preset) => {
        return {
            name: preset.name.trim(),
            thresholds: {
                installs: preset.installs,
                regs: preset.regs,
                sales: preset.sales,
                clicks: preset.clicks,
                wasteZones: preset.wasteZones ?? sharedWaste,
            },
        };
    });
}

// The shared tunables the file carries, or null when it has neither. Absent values fall back to the
// no-op defaults (multiplier 1, commission 0) so the seeded draft is always complete.
export function importedSharedFrom(file: ImportPresetsFile): ImportedShared | null {
    const shared = file.shared;
    if (!shared || (shared.reviewMult === undefined && shared.commission === undefined)) {
        return null;
    }

    return {
        reviewMultiplier: shared.reviewMult ?? 1,
        defaultCommission: shared.commission ?? 0,
    };
}
