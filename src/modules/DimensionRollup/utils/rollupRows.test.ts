import type { DimensionRollupView } from '@/services/snapshots/types';
import { describe, expect, it } from 'vitest';
import { rollupRows } from './rollupRows';

const view = (key: string, counts: Partial<Omit<DimensionRollupView, 'dimension' | 'key'>>): DimensionRollupView => {
    return {
        dimension: 'creative',
        key,
        linkClicks: 0,
        installs: 0,
        regs: 0,
        sales: 0,
        ...counts,
    };
};

describe('rollupRows', () => {
    it('derives funnel conversion rates from the counts', () => {
        const { rows } = rollupRows([view('cr-1', { linkClicks: 400, installs: 100, regs: 50, sales: 10 })]);

        expect(rows[0]).toMatchObject({
            key: 'cr-1',
            click2inst: 25,
            inst2reg: 50,
            reg2dep: 20,
            inst2sale: 10,
        });
    });

    it('reports a rate with a zero denominator as null, never zero', () => {
        const { rows } = rollupRows([view('cr-1', {})]);

        expect(rows[0]).toMatchObject({
            click2inst: null,
            inst2reg: null,
            reg2dep: null,
            inst2sale: null,
        });
    });

    it('orders by sales, then installs, then key', () => {
        const { rows } = rollupRows([
            view('b', { installs: 10, sales: 1 }),
            view('a', { installs: 10, sales: 1 }),
            view('c', { installs: 99, sales: 0 }),
            view('d', { installs: 5, sales: 4 }),
        ]);

        expect(
            rows.map((row) => {
                return row.key;
            })
        ).toEqual(['d', 'a', 'b', 'c']);
    });

    it('sums every row into the totals footer and re-derives its rates', () => {
        const { totals } = rollupRows([
            view('a', { linkClicks: 100, installs: 50, regs: 20, sales: 5 }),
            view('b', { linkClicks: 100, installs: 50, regs: 30, sales: 5 }),
        ]);

        expect(totals).toEqual({
            key: '',
            linkClicks: 200,
            installs: 100,
            regs: 50,
            sales: 10,
            click2inst: 50,
            inst2reg: 50,
            reg2dep: 20,
            inst2sale: 10,
        });
    });

    it('holds no dollar field on any row', () => {
        const { rows, totals } = rollupRows([view('a', { installs: 1 })]);

        for (const row of [...rows, totals]) {
            expect(Object.keys(row)).not.toContain('spend');
            expect(Object.keys(row)).not.toContain('spendPlus');
            expect(Object.keys(row)).not.toContain('revenue');
        }
    });
});
