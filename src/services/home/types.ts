import type { PeriodRollupInput } from '@/lib/domain/periodRollup';

// What the map read hands back: frozen rows within the viewer's row-scope, plus the day the server
// judged the window on. Selection only — every sum, zone and threshold is `countryRollup`'s
// (ADR-0004).
export type HomeGeoView = PeriodRollupInput & {
    today: string;
};
