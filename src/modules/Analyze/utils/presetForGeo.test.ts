import type { PresetView } from '@/services/presets/types';
import { describe, expect, it } from 'vitest';
import { presetForGeo, presetsForGeo } from './presetForGeo';

const THRESHOLDS = {
    installs: { gy: 2, yr: 4 },
    regs: { gy: 5, yr: 10 },
    sales: { gy: 30, yr: 60 },
    clicks: { gy: 0.2, yr: 0.5 },
};

function preset(overrides: Partial<PresetView>): PresetView {
    return {
        id: 'p',
        teamId: null,
        ownerUserId: 'u',
        ownerEmail: 'u@x.io',
        teamName: null,
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

    it('returns the selected preset when it names one in the geo', () => {
        const first = preset({ id: 'a' });
        const second = preset({ id: 'b' });
        expect(presetForGeo([first, second], 'IN', 'b')?.id).toBe('b');
    });

    it('honours the selection even when its thresholds did not parse', () => {
        const first = preset({ id: 'a' });
        const selected = preset({ id: 'b', thresholds: null });
        expect(presetForGeo([first, selected], 'IN', 'b')?.id).toBe('b');
    });

    it('falls back to first-active when the selection names no preset in the geo', () => {
        const first = preset({ id: 'a' });
        expect(presetForGeo([first], 'IN', 'ghost')?.id).toBe('a');
    });
});

describe('presetsForGeo', () => {
    it('returns every preset for the geo in list order', () => {
        const a = preset({ id: 'a' });
        const b = preset({ id: 'b' });
        const other = preset({ id: 'c', geo: 'KR' });
        const ids = presetsForGeo([a, other, b], 'IN').map((p) => {
            return p.id;
        });
        expect(ids).toEqual(['a', 'b']);
    });

    it('returns an empty list when the geo has none', () => {
        expect(presetsForGeo([preset({ geo: 'KR' })], 'IN')).toEqual([]);
    });
});
