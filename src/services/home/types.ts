import type { PeriodRollupInput, PeriodSnapshotRow } from '@/lib/domain/periodRollup';

// What the map read hands back: frozen rows within the viewer's row-scope, plus the day the server
// judged the window on. Selection only — every sum, zone and threshold is `countryRollup`'s
// (ADR-0004). Each push also names its buyer, so the country panel (slice 14) has a nickname to
// print without a read of its own.
export type HomeSnapshotRow = PeriodSnapshotRow & {
    buyerNickname: string;
};

export type HomeGeoView = Omit<PeriodRollupInput, 'snapshots'> & {
    today: string;
    snapshots: HomeSnapshotRow[];
};
