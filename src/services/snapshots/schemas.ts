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

// A Green→Yellow / Yellow→Red boundary pair, and a Geo's four of them (domain doc 05).
const thresholdPairSchema = z.object({ gy: z.number(), yr: z.number() });
export const geoThresholdsSchema = z.object({
    installs: thresholdPairSchema,
    regs: thresholdPairSchema,
    sales: thresholdPairSchema,
    clicks: thresholdPairSchema,
});

// One analyzed Geo pins one saved Preset version AND copies that version's resolved thresholds
// (ADR-0015): the pin is `set null` when a Preset is deleted, so a reference alone lets a buyer
// tidying up their Presets un-grade every Snapshot that used them. Nullable rather than required so a
// Geo whose preset carries no parseable thresholds still saves — its rows simply grade neutral.
const appliedGeoSchema = z.object({
    geo: geoSchema,
    presetVersionId: z.uuid(),
    thresholds: geoThresholdsSchema.nullable().default(null),
});

// The resolved shared settings, copied for the same reason: Review Multiplier, Waste Zones and the
// default Commission. Null when the creator's team has no saved shared-settings version. Exported
// because the read path parses the same jsonb back out of the column it was written to.
export const appliedSettingsSchema = z.object({
    reviewMultiplier: z.number(),
    defaultCommission: z.number(),
    wasteZones: thresholdPairSchema,
});

// The Frozen Geo Rollup — the header line exactly as the buyer saw it. `geoTotal` is why it exists:
// it counts Untagged Revenue, which never becomes a Fact and cannot be reconstructed (ADR-0003).
// Cost metrics are nullable: a zero denominator means "not shown", never 0 (domain doc 03).
const snapshotGeoSchema = z.object({
    geo: geoSchema,
    spendPlus: z.number(),
    geoTotal: z.number(),
    attributedRevenue: z.number(),
    // The Geo Total's funnel, untagged rows included. Defaulted to 0 rather than required so the
    // rollups written between #53 and #54 still parse — they carry the money but not the counts.
    linkClicks: z.number().int().default(0),
    installs: z.number().int().default(0),
    regs: z.number().int().default(0),
    sales: z.number().int().default(0),
    profit: z.number(),
    roi: z.number().nullable().default(null),
    cpc: z.number().nullable().default(null),
    cpi: z.number().nullable().default(null),
    cpr: z.number().nullable().default(null),
    cps: z.number().nullable().default(null),
    waste: z.number(),
});

// A Creative Split row: real FB Spend + Impressions for one ad name, below the Fact Grain.
const snapshotCreativeSchema = z.object({
    geo: geoSchema,
    campaign: z.string().trim().min(1),
    adName: z.string().trim().min(1),
    spend: z.number(),
    impressions: z.number().int(),
});

// A Campaign Model row: one Offer or OS value's funnel within a campaign. No Spend — Facebook never
// measures it, so the Offers/OS tables impute it at the Geo unit cost on read (ADR-0013).
export const MODEL_DIMENSIONS = ['offer', 'os'] as const;
export type ModelDimension = (typeof MODEL_DIMENSIONS)[number];
const snapshotCampaignModelSchema = z.object({
    campaign: z.string().trim().min(1),
    dimension: z.enum(MODEL_DIMENSIONS),
    key: z.string().trim().min(1),
    label: z.string().trim().min(1),
    revenue: z.number(),
    // Zero for every offer row: the Keitaro clicks report carries no Offer (domain doc 06).
    linkClicks: z.number().int(),
    installs: z.number().int(),
    regs: z.number().int(),
    sales: z.number().int(),
});

// Mirrors the `fact_attribution` Postgres enum. Underscored on the wire and in the DB; the compute
// layer spells the same value `campaign-lost` and the save planner maps at that one boundary.
export const FACT_ATTRIBUTIONS = ['full', 'campaign_lost'] as const;
export type FactAttribution = (typeof FACT_ATTRIBUTIONS)[number];

const snapshotFactSchema = z.object({
    // Stored, never inferred from the `—` display placeholder: the Problem Account detector skips
    // non-`full` facts on purpose, and that safeguard must not hang off a UI string (ADR-0015).
    attribution: z.enum(FACT_ATTRIBUTIONS).default('full'),
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
    settings: appliedSettingsSchema.nullable().default(null),
    geos: z.array(appliedGeoSchema).min(1, { error: 'A snapshot must pin at least one geo' }),
    facts: z.array(snapshotFactSchema).min(1, { error: 'A snapshot must carry at least one fact' }),
    // Everything a report needs beyond the Facts (ADR-0015). All three default to empty rather than
    // being required: a Geo with no untagged revenue and no creatives is a legitimate save, and the
    // read path already treats an absent rollup as `—` rather than as a rejection.
    geoRollups: z.array(snapshotGeoSchema).default([]),
    creatives: z.array(snapshotCreativeSchema).default([]),
    campaignModels: z.array(snapshotCampaignModelSchema).default([]),
    meta: z.unknown().optional(),
});

// The report-level `meta` jsonb. Only the muted campaigns matter to a reader: the excluded rows are
// already absent from the Facts, so their ids are the sole trace that the figures were filtered
// (spec story 33). Everything else in the column is ignored rather than rejected — `meta` is a
// free-form bag by design, and a report must not fail to open because it grew a field.
const snapshotMetaSchema = z.object({
    excludedCampaigns: z.array(z.string()).default([]),
});

// How many campaigns the buyer muted, out of a Snapshot's stored `meta`. Null on every Snapshot saved
// with nothing muted, and `unknown` on the wire, so this parses rather than casts.
export function mutedCampaignCount(meta: unknown): number {
    const parsed = snapshotMetaSchema.safeParse(meta);
    return parsed.success ? parsed.data.excludedCampaigns.length : 0;
}

export type SnapshotIdInput = z.infer<typeof snapshotIdInputSchema>;
export const snapshotIdInputSchema = z.object({
    id: z.uuid(),
});

// The replacement payload (ADR-0018): the id of the Snapshot being superseded plus exactly what a
// create takes. The correction is a full re-push, not a patch — a Snapshot is self-sufficient
// (ADR-0015), so a partial replacement would produce a report that half-agrees with itself.
export type ReplaceSnapshotInput = z.infer<typeof replaceSnapshotInputSchema>;
export const replaceSnapshotInputSchema = createSnapshotInputSchema.extend({
    id: z.uuid(),
});
