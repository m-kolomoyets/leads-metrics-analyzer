import { z } from 'zod';

// Zod input + payload validators for the presets API. Validated at the server-function boundary so
// handlers can trust the shape, and reused to parse jsonb read back from the immutable version rows
// (a version written by an older shape is caught rather than silently trusted).

const thresholdPairSchema = z.object({
    gy: z.number(),
    yr: z.number(),
});

export const presetThresholdsSchema = z.object({
    installs: thresholdPairSchema,
    regs: thresholdPairSchema,
    sales: thresholdPairSchema,
    clicks: thresholdPairSchema,
    wasteZones: thresholdPairSchema,
});

export const sharedSettingsPayloadSchema = z.object({
    reviewMultiplier: z.number(),
    defaultCommission: z.number(),
    sellers: z.array(
        z.object({
            rate: z.number(),
            accountIds: z.array(z.string().trim().min(1)),
        })
    ),
});

// Geo is an ISO-2 country code, upper-case (CONTEXT.md §Geo).
const geoSchema = z
    .string()
    .trim()
    .toUpperCase()
    .pipe(z.string().regex(/^[A-Z]{2}$/, { error: 'Geo must be a 2-letter country code' }));

const nameSchema = z.string().trim().min(1, { error: 'This field is required' });

export type CreatePresetInput = z.infer<typeof createPresetInputSchema>;
export const createPresetInputSchema = z.object({
    geo: geoSchema,
    name: nameSchema,
    thresholds: presetThresholdsSchema,
});

export type SavePresetVersionInput = z.infer<typeof savePresetVersionInputSchema>;
export const savePresetVersionInputSchema = z.object({
    presetId: z.uuid(),
    thresholds: presetThresholdsSchema,
});

export type RenamePresetInput = z.infer<typeof renamePresetInputSchema>;
export const renamePresetInputSchema = z.object({
    presetId: z.uuid(),
    name: nameSchema,
});

export type DeletePresetInput = z.infer<typeof deletePresetInputSchema>;
export const deletePresetInputSchema = z.object({
    presetId: z.uuid(),
});

// Which team's shared settings to read. Only a Head may target a team other than their own (or the
// global, teamless row via `null`); every other role's value is ignored server-side in favour of
// their own team. `teamId` absent → the viewer's default scope.
export const sharedSettingsScopeSchema = z.object({
    teamId: z.uuid().nullable().optional(),
});

export type SaveSharedSettingsInput = z.infer<typeof saveSharedSettingsInputSchema>;
export const saveSharedSettingsInputSchema = z.object({
    payload: sharedSettingsPayloadSchema,
    // Same rule as the scope above — only a Head may direct the write at another team / the global row.
    teamId: z.uuid().nullable().optional(),
});
