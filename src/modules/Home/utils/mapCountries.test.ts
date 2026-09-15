import type { CountryRollup } from '@/lib/domain/periodRollup';
import { toMapCountries } from './mapCountries';

// The map adapter: a rollup row becomes a tone and formatted strings, nothing the primitive would
// have to interpret.

const row = (overrides: Partial<CountryRollup>): CountryRollup => {
    return {
        geo: 'KR',
        spend: 1000,
        revenue: 1500,
        profit: 500,
        roi: 50,
        buyers: 2,
        zone: 'green',
        isThin: false,
        ...overrides,
    };
};

const nameOf = (geo: string) => {
    return `Name of ${geo}`;
};

describe('toMapCountries', () => {
    it('hands the zone over as the tone and formats every figure', () => {
        expect(toMapCountries([row({})], nameOf)).toEqual([
            {
                code: 'KR',
                tone: 'green',
                tooltip: {
                    title: 'Name of KR',
                    rows: [
                        { label: 'Spend⁺', value: '$1,000.00' },
                        { label: 'Revenue', value: '$1,500.00' },
                        { label: 'Profit', value: '+$500.00' },
                        { label: 'ROI', value: '+50%', tone: 'green' },
                        { label: 'Buyers', value: '2' },
                    ],
                },
            },
        ]);
    });

    it('hands a fill mode weight over and leaves an unranked market flat', () => {
        const [kr, jp] = toMapCountries([row({ geo: 'KR' }), row({ geo: 'JP' })], nameOf, new Map([['KR', 0.4]]));

        expect(kr.fillWeight).toBe(0.4);
        expect(jp.fillWeight).toBeUndefined();
    });

    it('says why a thin market is grey', () => {
        const [country] = toMapCountries([row({ revenue: 300, roi: -70, zone: 'neutral', isThin: true })], nameOf);

        expect(country.tone).toBe('neutral');
        expect(country.tooltip.rows.at(-1)).toEqual({ label: 'Data', value: 'too little (< $500)' });
    });
});
