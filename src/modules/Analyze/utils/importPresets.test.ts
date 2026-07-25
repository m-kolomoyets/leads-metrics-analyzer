import { describe, expect, it } from 'vitest';
import { importedPresetsForGeo, importedSharedFor, importedSharedFrom, parseImportPresetsFile } from './importPresets';

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
    it('trims the name and keeps the four coerced pairs', () => {
        const file = parseImportPresetsFile(FILE)!;
        const [preset] = importedPresetsForGeo(file, 'IN');
        expect(preset.name).toBe('Тест');
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

    it('parses a geo whose file has no shared block', () => {
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
        expect(importedPresetsForGeo(noShared, 'IN')[0].thresholds.clicks).toEqual({ gy: 1, yr: 2 });
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
        expect(importedSharedFrom(file)).toEqual({
            reviewMultiplier: 2,
            defaultCommission: 7,
            wasteZones: { gy: 7, yr: 15 },
        });
    });

    it('lifts the waste band on its own when the file carries no other tunable', () => {
        const file = parseImportPresetsFile(FILE)!;
        expect(importedSharedFrom(file)).toEqual({
            reviewMultiplier: 1,
            defaultCommission: 0,
            wasteZones: { gy: 7, yr: 15 },
        });
    });

    it('returns null when the file carries no shared block at all', () => {
        const file = parseImportPresetsFile(JSON.stringify({ geoPresets: {} }))!;
        expect(importedSharedFrom(file)).toBeNull();
    });

    it('defaults the absent tunable (multiplier 1, commission 0)', () => {
        const file = parseImportPresetsFile(JSON.stringify({ geoPresets: {}, shared: { reviewMult: 3 } }))!;
        expect(importedSharedFrom(file)).toEqual({
            reviewMultiplier: 3,
            defaultCommission: 0,
            wasteZones: { gy: 0, yr: 0 },
        });
    });
});

describe('importedSharedFor', () => {
    const withPresetBand = JSON.stringify({
        geoPresets: {
            IN: [
                {
                    name: 'X',
                    installs: { gy: 1, yr: 2 },
                    regs: { gy: 1, yr: 2 },
                    sales: { gy: 1, yr: 2 },
                    clicks: { gy: 1, yr: 2 },
                    wasteZones: { gy: '3', yr: '9' },
                },
            ],
        },
        shared: { wasteZones: { gy: 7, yr: 15 }, reviewMult: 2, commission: '7' },
    });

    it('lets the picked preset waste band win over the shared block', () => {
        const file = parseImportPresetsFile(withPresetBand)!;
        const [preset] = importedPresetsForGeo(file, 'IN');
        expect(importedSharedFor(file, preset)).toEqual({
            reviewMultiplier: 2,
            defaultCommission: 7,
            wasteZones: { gy: 3, yr: 9 },
        });
    });

    it('seeds a preset-level band even with no shared block, defaulting the other tunables', () => {
        const file = parseImportPresetsFile(
            JSON.stringify({
                geoPresets: {
                    IN: [
                        {
                            name: 'X',
                            installs: { gy: 1, yr: 2 },
                            regs: { gy: 1, yr: 2 },
                            sales: { gy: 1, yr: 2 },
                            clicks: { gy: 1, yr: 2 },
                            wasteZones: { gy: 3, yr: 9 },
                        },
                    ],
                },
            })
        )!;
        const [preset] = importedPresetsForGeo(file, 'IN');
        expect(importedSharedFor(file, preset)).toEqual({
            reviewMultiplier: 1,
            defaultCommission: 0,
            wasteZones: { gy: 3, yr: 9 },
        });
    });

    it('falls back to the shared block when the preset carries no band', () => {
        const file = parseImportPresetsFile(FILE)!;
        const [preset] = importedPresetsForGeo(file, 'IN');
        expect(importedSharedFor(file, preset)?.wasteZones).toEqual({ gy: 7, yr: 15 });
    });
});
