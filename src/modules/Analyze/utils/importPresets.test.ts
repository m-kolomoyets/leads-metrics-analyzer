import { describe, expect, it } from 'vitest';
import { importedPresetsForGeo, importedSharedFrom, parseImportPresetsFile } from './importPresets';

const FILE = JSON.stringify({
    geoPresets: {
        IN: [
            {
                name: 'Тест ',
                installs: { gy: '1', yr: '2' },
                regs: { gy: '2', yr: '4' },
                sales: { gy: '15', yr: '40' },
                clicks: { gy: '0.7', yr: '1' },
            },
        ],
        KR: [
            {
                name: 'A',
                installs: { gy: '10', yr: '14' },
                regs: { gy: '14', yr: '25' },
                sales: { gy: '100', yr: '250' },
                clicks: { gy: '4', yr: '6' },
            },
            {
                name: 'B',
                installs: { gy: '1', yr: '2' },
                regs: { gy: '1', yr: '2' },
                sales: { gy: '1', yr: '2' },
                clicks: { gy: '1', yr: '2' },
            },
        ],
    },
    shared: { wasteZones: { gy: 7, yr: 15 } },
});

describe('parseImportPresetsFile', () => {
    it('coerces string threshold bounds to numbers', () => {
        const file = parseImportPresetsFile(FILE);
        expect(file?.geoPresets.IN[0].installs).toEqual({ gy: 1, yr: 2 });
        expect(file?.geoPresets.IN[0].clicks.gy).toBe(0.7);
    });

    it('returns null for non-JSON', () => {
        expect(parseImportPresetsFile('not json')).toBeNull();
    });

    it('returns null when the shape is wrong', () => {
        expect(parseImportPresetsFile(JSON.stringify({ geoPresets: 'nope' }))).toBeNull();
    });
});

describe('importedPresetsForGeo', () => {
    it('trims the name and back-fills waste zones from the shared block', () => {
        const file = parseImportPresetsFile(FILE)!;
        const [preset] = importedPresetsForGeo(file, 'IN');
        expect(preset.name).toBe('Тест');
        expect(preset.thresholds.wasteZones).toEqual({ gy: 7, yr: 15 });
        expect(preset.thresholds.sales).toEqual({ gy: 15, yr: 40 });
    });

    it('returns every preset the geo carries', () => {
        const file = parseImportPresetsFile(FILE)!;
        const names = importedPresetsForGeo(file, 'KR').map((p) => {
            return p.name;
        });
        expect(names).toEqual(['A', 'B']);
    });

    it('returns an empty list for a geo absent from the file', () => {
        const file = parseImportPresetsFile(FILE)!;
        expect(importedPresetsForGeo(file, 'US')).toEqual([]);
    });

    it('falls back to zero waste zones when the shared block has none', () => {
        const noShared = parseImportPresetsFile(
            JSON.stringify({
                geoPresets: {
                    IN: [
                        {
                            name: 'X',
                            installs: { gy: 1, yr: 2 },
                            regs: { gy: 1, yr: 2 },
                            sales: { gy: 1, yr: 2 },
                            clicks: { gy: 1, yr: 2 },
                        },
                    ],
                },
            })
        )!;
        expect(importedPresetsForGeo(noShared, 'IN')[0].thresholds.wasteZones).toEqual({ gy: 0, yr: 0 });
    });
});

describe('importedSharedFrom', () => {
    it('coerces reviewMult / commission (numeric string) onto the shared-settings names', () => {
        const file = parseImportPresetsFile(
            JSON.stringify({
                geoPresets: {},
                shared: { wasteZones: { gy: 7, yr: 15 }, reviewMult: 2, commission: '7' },
            })
        )!;
        expect(importedSharedFrom(file)).toEqual({ reviewMultiplier: 2, defaultCommission: 7 });
    });

    it('returns null when the file carries neither tunable', () => {
        const file = parseImportPresetsFile(FILE)!;
        expect(importedSharedFrom(file)).toBeNull();
    });

    it('defaults the absent tunable (multiplier 1, commission 0)', () => {
        const file = parseImportPresetsFile(JSON.stringify({ geoPresets: {}, shared: { reviewMult: 3 } }))!;
        expect(importedSharedFrom(file)).toEqual({ reviewMultiplier: 3, defaultCommission: 0 });
    });
});
