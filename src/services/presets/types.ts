import type { PresetAccess } from '@/lib/auth/presetAccess';

// Domain payload shapes stored as jsonb in the immutable version tables (domain doc 05). Kept out of
// schema.ts so that file stays self-contained across the drizzle-kit/client boundary; the service
// layer validates against these shapes with Zod (schemas.ts) on read and write.

// A Green→Yellow / Yellow→Red boundary pair (domain: Threshold Pair).
export type ThresholdPair = {
    gy: number;
    yr: number;
};

// A preset version's frozen thresholds for one Geo: the four metric pairs plus its Waste Zones
// (% of spend). What `preset_version.thresholds` carries.
export type PresetThresholds = {
    installs: ThresholdPair;
    regs: ThresholdPair;
    sales: ThresholdPair;
    clicks: ThresholdPair;
    wasteZones: ThresholdPair;
};

// One Seller's commission rate and the Account IDs it covers (domain doc 05 §Sellers).
export type SellerRule = {
    rate: number;
    accountIds: string[];
};

// Team-global tunables. What `shared_settings_version.payload` carries.
export type SharedSettingsPayload = {
    reviewMultiplier: number;
    defaultCommission: number;
    sellers: SellerRule[];
};

// A preset as returned to the client: identity + its active version's thresholds + the viewer's
// verdict, so the UI can show read-only vs editable without a second round-trip.
export type PresetView = {
    id: string;
    teamId: string | null;
    ownerUserId: string;
    // The creator's email and the owning team's name, resolved for the management table. A preset
    // whose owner/team row is gone reads null (owner is `set null`? no — email always present; team
    // is nullable for a teamless creator).
    ownerEmail: string;
    teamName: string | null;
    geo: string;
    name: string;
    activeVersionId: string | null;
    thresholds: PresetThresholds | null;
    access: PresetAccess;
};

export type SharedSettingsView = {
    id: string;
    // Null for the global row a teamless Head owns; a team's UUID otherwise.
    teamId: string | null;
    activeVersionId: string | null;
    payload: SharedSettingsPayload | null;
};
