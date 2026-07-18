import type { Ruleset } from '@/lib/domain';
import type { GeoThresholds } from '@/lib/domain/types';
import type { PresetView, SharedSettingsView } from '@/services/presets/types';

// The default commission / review multiplier when a team has no saved shared-settings version yet.
// 0 % keeps Spend⁺ = Spend (no phantom cost); multiplier 1 disables Problem-Account escalation.
const DEFAULT_COMMISSION = 0;
const DEFAULT_REVIEW_MULTIPLIER = 1;

// Bridge the persistence shapes (read-only, ADR-0002) to the pure compute `Ruleset` (ADR-0010).
// Presets supply per-Geo thresholds (dropping `wasteZones` — a slice-4 concern the verdict engine
// ignores); shared settings supply commission + review multiplier. First active preset per Geo wins.
export function toRuleset(presets: PresetView[], shared: SharedSettingsView | null): Ruleset {
    const thresholds: Record<string, GeoThresholds> = {};
    for (const preset of presets) {
        if (!preset.thresholds || thresholds[preset.geo]) {
            continue;
        }
        thresholds[preset.geo] = {
            installs: preset.thresholds.installs,
            regs: preset.thresholds.regs,
            sales: preset.thresholds.sales,
            clicks: preset.thresholds.clicks,
        };
    }

    const payload = shared?.payload;
    return {
        thresholds,
        commission: {
            defaultCommission: payload?.defaultCommission ?? DEFAULT_COMMISSION,
            sellers: payload?.sellers ?? [],
        },
        reviewMultiplier: payload?.reviewMultiplier ?? DEFAULT_REVIEW_MULTIPLIER,
    };
}
