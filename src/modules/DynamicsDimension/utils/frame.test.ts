import type { DynamicsDimensionRow } from '@/services/dynamics/types';
import { describe, expect, it } from 'vitest';
import { geosOf, rowsOfGeo } from './frame';

// The dollar-free frame's third level (#10). Same Team → Buyer → Geo shape as the trajectory page,
// with the one difference that matters: there is no Spend⁺ to order markets by or to filter them on,
// so the row is ordered by what these roles actually judge — Sales, then reach.

const row = (over: Partial<DynamicsDimensionRow> & { geo: string; key: string }): DynamicsDimensionRow => {
    return { linkClicks: 0, installs: 0, regs: 0, sales: 0, ...over };
};

describe('geosOf', () => {
    it('orders markets by sales, then installs, then code', () => {
        const rows = [
            row({ geo: 'PL', key: 'a', sales: 1, installs: 90 }),
            row({ geo: 'KR', key: 'b', sales: 5, installs: 10 }),
            row({ geo: 'DE', key: 'c', installs: 40 }),
            row({ geo: 'AT', key: 'd', installs: 40 }),
        ];

        expect(geosOf(rows)).toEqual(['KR', 'PL', 'AT', 'DE']);
    });

    it('sums a market across its rows before ranking it', () => {
        const rows = [
            row({ geo: 'PL', key: 'a', sales: 3 }),
            row({ geo: 'PL', key: 'b', sales: 3 }),
            row({ geo: 'KR', key: 'c', sales: 5 }),
        ];

        expect(geosOf(rows)).toEqual(['PL', 'KR']);
    });

    it('keeps a market that reported no sale at all — there is no spend gate here', () => {
        expect(geosOf([row({ geo: 'PL', key: 'a' })])).toEqual(['PL']);
    });

    it('has no markets when nothing was pushed', () => {
        expect(geosOf([])).toEqual([]);
    });
});

describe('rowsOfGeo', () => {
    it('narrows to one market and drops the geo column the tabs already carry', () => {
        const rows = [
            row({ geo: 'PL', key: 'a', sales: 2 }),
            row({ geo: 'KR', key: 'b', sales: 9 }),
            row({ geo: 'PL', key: 'c', sales: 1 }),
        ];

        expect(rowsOfGeo(rows, 'PL')).toEqual([
            { key: 'a', linkClicks: 0, installs: 0, regs: 0, sales: 2 },
            { key: 'c', linkClicks: 0, installs: 0, regs: 0, sales: 1 },
        ]);
    });
});
