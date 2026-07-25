import type { PresetThresholds, ThresholdPair } from '@/services/presets/types';
import { z } from 'zod';

// Parses the legacy prototype's exported presets file (references/presets.json) so a preset can be
// imported into the create form and saved to the DB. That file stores threshold values as strings, so
// they are coerced into the typed `PresetThresholds` the create form and server expect. `wasteZones`
// are ours-global (SharedSettingsPayload), so they never enter a preset: the file's shared block — or
// the picked preset's own band, which wins — seeds the shared-settings editor instead.

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
    // Some exports carry a band per preset. We hold one team-global band, so it does not become part
    // of the imported thresholds — it seeds the shared-settings editor (`importedSharedFor`).
    wasteZones: pairSchema.optional(),
});

const importPresetsFileSchema = z.object({
    geoPresets: z.record(z.string(), z.array(filePresetSchema)),
    // The prototype's team-global block: waste zones plus the two shared tunables.
    // `reviewMult`/`commission` are numeric strings in the export, so coerce.
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
    wasteZones: ThresholdPair;
};

// A preset lifted from the file, ready to prefill the create form: a display name plus the four
// typed threshold pairs, and the waste band the file put on this preset (shared-settings-bound, so
// kept beside the thresholds rather than in them).
export type ImportedPreset = {
    name: string;
    thresholds: PresetThresholds;
    wasteZones?: ThresholdPair;
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

// Every preset the file holds for one Geo, each carrying its own waste band when the file gives one.
export function importedPresetsForGeo(file: ImportPresetsFile, geo: string): ImportedPreset[] {
    return (file.geoPresets[geo] ?? []).map((preset) => {
        return {
            name: preset.name.trim(),
            thresholds: {
                installs: preset.installs,
                regs: preset.regs,
                sales: preset.sales,
                clicks: preset.clicks,
            },
            wasteZones: preset.wasteZones,
        };
    });
}

// The shared tunables the file carries, or null when it has none. Absent values fall back to the
// no-op defaults (multiplier 1, commission 0, no waste band) so the seeded draft is always complete.
export function importedSharedFrom(file: ImportPresetsFile): ImportedShared | null {
    const shared = file.shared;
    if (
        !shared ||
        (shared.reviewMult === undefined && shared.commission === undefined && shared.wasteZones === undefined)
    ) {
        return null;
    }

    return {
        reviewMultiplier: shared.reviewMult ?? 1,
        wasteZones: shared.wasteZones ?? EMPTY_PAIR,
        // Commission stays a percent through the persistence + editor layers (human-facing, matches the
        // prototype export); `toRuleset` converts percent → fraction at the domain boundary.
        defaultCommission: shared.commission ?? 0,
    };
}

// The shared tunables to seed once the owner has picked which preset to import: the file's shared
// block, with the picked preset's own waste band winning when it carries one. A preset-level band is
// reason enough to seed on its own — importing a preset must never leave its waste zones behind just
// because the file has no shared block.
export function importedSharedFor(file: ImportPresetsFile, preset: ImportedPreset): ImportedShared | null {
    const base = importedSharedFrom(file);
    if (!preset.wasteZones) {
        return base;
    }

    return {
        reviewMultiplier: base?.reviewMultiplier ?? 1,
        defaultCommission: base?.defaultCommission ?? 0,
        wasteZones: preset.wasteZones,
    };
}
