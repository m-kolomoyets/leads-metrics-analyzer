import type { CountryRollup } from './periodRollup';
import { fillWeights } from './mapFill';

// The map's fill modes (offers-and-home/15, PRD story 50): the zone is always the colour; a mode only
// says how strong the wash is. Profitability paints flat; profit size scales on |profit|; presence on
// Spend⁺ — each normalised across the painted markets, thin ones left out and untouched.

const row = (overrides: Partial<CountryRollup> & { geo: string }): CountryRollup => {
    return {
        spend: 1000,
        revenue: 1500,
        profit: 500,
        roi: 50,
        buyers: 1,
        zone: 'green',
        isThin: false,
        ...overrides,
    };
};

describe('fillWeights', () => {
    it('paints flat in profitability mode: no weights at all', () => {
        expect(
            fillWeights([row({ geo: 'KR', profit: 100 }), row({ geo: 'JP', profit: 9000 })], 'profitability')
        ).toEqual(new Map());
    });

    it('normalises |profit| min→0, max→1 across the painted markets', () => {
        const weights = fillWeights(
            [
                row({ geo: 'KR', profit: 100 }),
                row({ geo: 'JP', profit: -400, zone: 'red' }),
                row({ geo: 'SG', profit: 700 }),
            ],
            'profit-size'
        );

        expect(weights.get('KR')).toBe(0);
        expect(weights.get('JP')).toBeCloseTo(0.5);
        expect(weights.get('SG')).toBe(1);
    });

    it('normalises Spend⁺ in presence mode', () => {
        const weights = fillWeights([row({ geo: 'KR', spend: 200 }), row({ geo: 'JP', spend: 1200 })], 'presence');

        expect(weights.get('KR')).toBe(0);
        expect(weights.get('JP')).toBe(1);
    });

    it('paints a lone market, or equal markets, at full weight', () => {
        expect(fillWeights([row({ geo: 'KR' })], 'profit-size').get('KR')).toBe(1);

        const equal = fillWeights([row({ geo: 'KR', spend: 300 }), row({ geo: 'JP', spend: 300 })], 'presence');

        expect(equal.get('KR')).toBe(1);
        expect(equal.get('JP')).toBe(1);
    });

    it('leaves a thin market out of the scale and unweighted', () => {
        const weights = fillWeights(
            [
                row({ geo: 'KR', spend: 500 }),
                row({ geo: 'JP', spend: 1000 }),
                row({ geo: 'SG', spend: 90000, zone: 'neutral', isThin: true }),
            ],
            'presence'
        );

        expect(weights.has('SG')).toBe(false);
        expect(weights.get('JP')).toBe(1);
    });

    it('never touches the zone: the mode is opacity only', () => {
        const rows = [row({ geo: 'KR', zone: 'red', profit: -50 }), row({ geo: 'JP', profit: 5000 })];

        fillWeights(rows, 'profit-size');
        fillWeights(rows, 'presence');

        expect(
            rows.map((r) => {
                return r.zone;
            })
        ).toEqual(['red', 'green']);
    });
});
