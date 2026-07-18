import type { PresetView, SharedSettingsView } from '@/services/presets/types';
import { describe, expect, it } from 'vitest';
import { toRuleset } from './toRuleset';

function preset(geo: string, thresholds: PresetView['thresholds']): PresetView {
    return {
        id: `p-${geo}`,
        teamId: null,
        ownerUserId: 'u',
        geo,
        name: geo,
        activeVersionId: 'v',
        thresholds,
        access: 'read',
    };
}

const IN_THRESHOLDS = {
    installs: { gy: 2, yr: 4 },
    regs: { gy: 5, yr: 10 },
    sales: { gy: 30, yr: 60 },
    clicks: { gy: 0.2, yr: 0.5 },
    wasteZones: { gy: 10, yr: 20 },
};

describe('toRuleset', () => {
    it('maps active preset thresholds per geo, dropping wasteZones', () => {
        const ruleset = toRuleset([preset('IN', IN_THRESHOLDS)], null);
        expect(ruleset.thresholds.IN).toEqual({
            installs: { gy: 2, yr: 4 },
            regs: { gy: 5, yr: 10 },
            sales: { gy: 30, yr: 60 },
            clicks: { gy: 0.2, yr: 0.5 },
        });
    });

    it('skips presets with no active version thresholds', () => {
        const ruleset = toRuleset([preset('KR', null)], null);
        expect(ruleset.thresholds.KR).toBeUndefined();
    });

    it('keeps the first active preset when a geo has several', () => {
        const second = { ...IN_THRESHOLDS, installs: { gy: 99, yr: 100 } };
        const ruleset = toRuleset([preset('IN', IN_THRESHOLDS), preset('IN', second)], null);
        expect(ruleset.thresholds.IN.installs).toEqual({ gy: 2, yr: 4 });
    });

    it('takes commission and review multiplier from shared settings', () => {
        const shared: SharedSettingsView = {
            id: 's',
            teamId: 't',
            activeVersionId: 'v',
            payload: {
                reviewMultiplier: 3,
                defaultCommission: 0.06,
                sellers: [{ rate: 0.1, accountIds: ['acc-1'] }],
            },
        };
        const ruleset = toRuleset([], shared);
        expect(ruleset.commission).toEqual({
            defaultCommission: 0.06,
            sellers: [{ rate: 0.1, accountIds: ['acc-1'] }],
        });
        expect(ruleset.reviewMultiplier).toBe(3);
    });

    it('defaults commission to 0 and multiplier to 1 with no shared settings', () => {
        const ruleset = toRuleset([], null);
        expect(ruleset.commission).toEqual({ defaultCommission: 0, sellers: [] });
        expect(ruleset.reviewMultiplier).toBe(1);
    });
});
