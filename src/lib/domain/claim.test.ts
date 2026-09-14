import { actualRates, claimGap, claimGapTone, claimRates, hasClaim } from './claim';

// Advertiser Claim rates (offers-and-home/07): promised installs / regs / sales against the fixed
// Payout. Every rate is `null` — never 0 — when an input is missing or its denominator is zero.
describe('claimRates', () => {
    it('computes I2R, R2S, I2S and claimed EPC from a full claim', () => {
        expect(claimRates({ installs: 100, regs: 30, sales: 6 }, 27)).toEqual({
            i2r: 30,
            r2s: 20,
            i2s: 6,
            epc: 1.62,
        });
    });

    it('nulls the rates that depend on a missing input', () => {
        expect(claimRates({ installs: 100, regs: null, sales: 6 }, 27)).toEqual({
            i2r: null,
            r2s: null,
            i2s: 6,
            epc: 1.62,
        });
        expect(claimRates({ installs: null, regs: 30, sales: 6 }, 27)).toEqual({
            i2r: null,
            r2s: 20,
            i2s: null,
            epc: null,
        });
        expect(claimRates({ installs: 100, regs: 30, sales: null }, 27)).toEqual({
            i2r: 30,
            r2s: null,
            i2s: null,
            epc: null,
        });
    });

    it('nulls EPC while the Payout is fx_pending', () => {
        expect(claimRates({ installs: 100, regs: 30, sales: 6 }, null)).toEqual({
            i2r: 30,
            r2s: 20,
            i2s: 6,
            epc: null,
        });
    });

    it('nulls a rate whose denominator is zero', () => {
        expect(claimRates({ installs: 0, regs: 0, sales: 0 }, 27)).toEqual({
            i2r: null,
            r2s: null,
            i2s: null,
            epc: null,
        });
    });
});

describe('hasClaim', () => {
    it('is true once any figure is entered', () => {
        expect(hasClaim({ installs: null, regs: null, sales: 4 })).toBe(true);
        expect(hasClaim({ installs: 0, regs: null, sales: null })).toBe(true);
    });

    it('is false when nothing is entered', () => {
        expect(hasClaim({ installs: null, regs: null, sales: null })).toBe(false);
    });
});

// Claim Gap (offers-and-home/12): for each rate, actual ÷ claimed. A row needs both sides; the
// block needs at least one row. Actual EPC is revenue ÷ installs — the money made, not the Payout.
describe('actualRates', () => {
    it('reads the funnel the same way the claim does, with EPC on revenue', () => {
        expect(actualRates({ installs: 200, regs: 50, sales: 10, revenue: 300 })).toEqual({
            i2r: 25,
            r2s: 20,
            i2s: 5,
            epc: 1.5,
        });
    });

    it('nulls every rate over a zero denominator', () => {
        expect(actualRates({ installs: 0, regs: 0, sales: 0, revenue: 0 })).toEqual({
            i2r: null,
            r2s: null,
            i2s: null,
            epc: null,
        });
        expect(actualRates({ installs: 10, regs: 0, sales: 0, revenue: 0 })).toEqual({
            i2r: 0,
            r2s: null,
            i2s: 0,
            epc: 0,
        });
    });
});

describe('claimGap', () => {
    const claimed = { i2r: 30, r2s: 20, i2s: 6, epc: 1.62 };

    it('builds one row per rate with gap = actual ÷ claimed', () => {
        expect(claimGap(claimed, { i2r: 15, r2s: 25, i2s: 6, epc: 2.43 })).toEqual([
            { metric: 'i2r', claimed: 30, actual: 15, gap: 0.5, tone: 'red' },
            { metric: 'r2s', claimed: 20, actual: 25, gap: 1.25, tone: 'green' },
            { metric: 'i2s', claimed: 6, actual: 6, gap: 1, tone: 'neutral' },
            { metric: 'epc', claimed: 1.62, actual: 2.43, gap: 1.5, tone: 'green' },
        ]);
    });

    it('drops a row when either side is missing', () => {
        expect(claimGap({ ...claimed, r2s: null }, { i2r: 15, r2s: 25, i2s: null, epc: 2.43 })).toEqual([
            { metric: 'i2r', claimed: 30, actual: 15, gap: 0.5, tone: 'red' },
            { metric: 'epc', claimed: 1.62, actual: 2.43, gap: 1.5, tone: 'green' },
        ]);
    });

    it('drops a row when the claimed rate is zero — nothing to measure against', () => {
        expect(claimGap({ ...claimed, i2r: 0 }, { i2r: 15, r2s: null, i2s: null, epc: null })).toEqual([]);
    });

    it('returns no rows — no block — when nothing lines up', () => {
        expect(claimGap({ i2r: null, r2s: null, i2s: null, epc: null }, { i2r: 15, r2s: 25, i2s: 6, epc: 2 })).toEqual(
            []
        );
    });

    it('colours the gap: < 0.8 red, > 1.2 green, the edges neutral', () => {
        expect(claimGapTone(0.79)).toBe('red');
        expect(claimGapTone(0.8)).toBe('neutral');
        expect(claimGapTone(1.2)).toBe('neutral');
        expect(claimGapTone(1.21)).toBe('green');
    });
});
