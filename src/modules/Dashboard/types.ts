import type { ThresholdPair } from '@/lib/domain/types';
import type { ReportGeoView, ReportRosterUser } from '@/services/reports/types';

// The Report as a view (ADR-0016): nothing here is stored, it is what a date range makes of the
// Snapshots a viewer can see. `buildReport` is the only producer of these shapes.

// The quick tokens plus the explicit window. A token means the last N calendar days ENDING TODAY,
// inclusive, resolved against the viewer's local calendar day.
export const RANGE_TOKENS = ['1d', '3d', '7d', '30d', 'custom'] as const;

export type RangeToken = (typeof RANGE_TOKENS)[number];

// The range as it lives in the URL. `from`/`to` are meaningful only for `custom`.
export type ReportRange = {
    range: RangeToken;
    from?: string;
    to?: string;
};

// A resolved window — two calendar dates, both inclusive. What the server is ever asked for.
export type ResolvedRange = {
    from: string;
    to: string;
};

// Feed groups user → snapshot → geo and keeps the latest Snapshot per (user × report date); archive
// groups date → user → snapshot and keeps every version.
export type ReportMode = 'feed' | 'archive';

// A Snapshot card's headline: money SUMMED across its Geos, with ROI and waste-% re-derived from
// those sums. Deliberately no cost-per line — each Geo has its own Threshold Pairs, so a blended CPI
// has nothing to grade it against, and unique counts do not sum across Geos (domain gotchas).
export type ReportHeadline = {
    spendPlus: number;
    geoTotal: number;
    profit: number;
    roi: number | null;
    waste: number;
    // Waste as a share of Spend⁺. Zero-denominator reads 0, matching the Geo header.
    wastePct: number;
};

export type ReportCard = {
    snapshotId: string;
    reportDate: string;
    takenAt: string;
    wasteZones: ThresholdPair | null;
    geos: ReportGeoView[];
    // Null for a Snapshot pushed before ADR-0015: it froze no Geo Rollup, so it has no figures to sum
    // and the card reads `—` rather than showing an Attributed sum under the Geo Total's name.
    headline: ReportHeadline | null;
};

// One person in the feed. `cards` empty means they pushed nothing in the range — they still appear,
// dimmed, headed by their last-ever push (spec story 4).
export type ReportUserGroup = {
    user: ReportRosterUser;
    cards: ReportCard[];
};

// One day of data in the archive. Only users who actually reported that day appear under it.
export type ReportDateGroup = {
    reportDate: string;
    users: ReportUserGroup[];
};

export type ReportView =
    | ({ mode: 'feed'; users: ReportUserGroup[] } & ResolvedRange)
    | ({ mode: 'archive'; dates: ReportDateGroup[] } & ResolvedRange);
