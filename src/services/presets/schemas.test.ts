import { createPresetInputSchema } from './schemas';

// The create-preset validator carries the only non-trivial input rule: Geo is normalized to an
// upper-case ISO-2 code and anything else is rejected. Thresholds are structurally validated by Zod
// itself, so we only pin the Geo behavior here.

const thresholds = {
    installs: { gy: 1, yr: 2 },
    regs: { gy: 1, yr: 2 },
    sales: { gy: 1, yr: 2 },
    clicks: { gy: 1, yr: 2 },
    wasteZones: { gy: 10, yr: 20 },
};

describe('createPresetInputSchema', () => {
    it('normalizes a lower-case geo to upper-case', () => {
        const parsed = createPresetInputSchema.parse({ geo: 'kr', name: 'Olympus', thresholds });

        expect(parsed.geo).toBe('KR');
    });

    it('rejects a geo that is not two letters', () => {
        expect(createPresetInputSchema.safeParse({ geo: 'KOR', name: 'x', thresholds }).success).toBe(false);
        expect(createPresetInputSchema.safeParse({ geo: 'K1', name: 'x', thresholds }).success).toBe(false);
    });

    it('rejects an empty name', () => {
        expect(createPresetInputSchema.safeParse({ geo: 'KR', name: '  ', thresholds }).success).toBe(false);
    });
});
