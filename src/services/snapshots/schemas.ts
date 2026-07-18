import { z } from 'zod';

// Zod input validators for the Snapshots API. Validated at the server-function boundary so handlers
// can trust the shape before a Snapshot is frozen. A Snapshot is built only from ALREADY-SAVED ruleset
// versions (spec story 35) — the schema requires version UUIDs, and the handler asserts they exist.

// The traffic-light grade — mirrors the `fact_zone` Postgres enum (src/lib/db/schema.ts).
export const FACT_ZONES = ['green', 'yellow', 'red', 'neutral'] as const;
export type FactZone = (typeof FACT_ZONES)[number];
const factZoneSchema = z.enum(FACT_ZONES);

// Geo is an ISO-2 country code, upper-case (CONTEXT.md §Geo) — same rule as presets.
const geoSchema = z
    .string()
    .trim()
    .toUpperCase()
    .pipe(z.string().regex(/^[A-Z]{2}$/, { error: 'Geo must be a 2-letter country code' }));

// A report date as a plain calendar date (YYYY-MM-DD), matching the `date` column.
const reportDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Report date must be YYYY-MM-DD' });

// One analyzed Geo pins one saved Preset version. Geos are unique per Applied Ruleset.
const appliedGeoSchema = z.object({
    geo: geoSchema,
    presetVersionId: z.uuid(),
});

const snapshotFactSchema = z.object({
    campaign: z.string().trim().min(1),
    creative: z.string().trim().min(1),
    reportDate: reportDateSchema,
    geo: geoSchema,
    account: z.string().trim().min(1),
    offer: z.string().trim().min(1),
    os: z.string().trim().min(1).nullable().default(null),
    spend: z.number(),
    spendPlus: z.number(),
    revenue: z.number(),
    linkClicks: z.number().int(),
    installs: z.number().int(),
    regs: z.number().int(),
    sales: z.number().int(),
    verdict: factZoneSchema,
    zone: factZoneSchema,
});

export type CreateSnapshotInput = z.infer<typeof createSnapshotInputSchema>;
export const createSnapshotInputSchema = z.object({
    reportDate: reportDateSchema,
    // The pinned ruleset: the Shared-settings version in force (null for a teamless creator) plus one
    // Preset version per analyzed Geo. Both must reference already-saved versions.
    sharedSettingsVersionId: z.uuid().nullable().default(null),
    geos: z.array(appliedGeoSchema).min(1, { error: 'A snapshot must pin at least one geo' }),
    facts: z.array(snapshotFactSchema).min(1, { error: 'A snapshot must carry at least one fact' }),
    meta: z.unknown().optional(),
});

export type SnapshotIdInput = z.infer<typeof snapshotIdInputSchema>;
export const snapshotIdInputSchema = z.object({
    id: z.uuid(),
});
