import { claimRates, hasClaim } from './claim';

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
