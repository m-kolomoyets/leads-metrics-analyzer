import type { PresetView } from '@/services/presets/types';
import { describe, expect, it } from 'vitest';
import { presetForGeo } from './presetForGeo';

const THRESHOLDS = {
    installs: { gy: 2, yr: 4 },
    regs: { gy: 5, yr: 10 },
    sales: { gy: 30, yr: 60 },
    clicks: { gy: 0.2, yr: 0.5 },
    wasteZones: { gy: 10, yr: 20 },
};

function preset(overrides: Partial<PresetView>): PresetView {
    return {
        id: 'p',
        teamId: null,
        ownerUserId: 'u',
        geo: 'IN',
        name: 'IN',
        activeVersionId: 'v',
        thresholds: THRESHOLDS,
        access: 'edit',
        ...overrides,
    };
}

describe('presetForGeo', () => {
    it('returns the first preset for the geo with parseable thresholds', () => {
        const first = preset({ id: 'a' });
        const second = preset({ id: 'b' });
        expect(presetForGeo([first, second], 'IN')?.id).toBe('a');
    });

    it('skips presets whose active version thresholds did not parse', () => {
        const stale = preset({ id: 'a', thresholds: null });
        const good = preset({ id: 'b' });
        expect(presetForGeo([stale, good], 'IN')?.id).toBe('b');
    });

    it('ignores presets for other geos', () => {
        expect(presetForGeo([preset({ geo: 'KR' })], 'IN')).toBeUndefined();
    });

    it('returns undefined when the geo has no preset', () => {
        expect(presetForGeo([], 'IN')).toBeUndefined();
    });
});
