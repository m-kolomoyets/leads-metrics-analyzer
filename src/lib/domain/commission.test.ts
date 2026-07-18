import type { CommissionConfig } from './commission';
import { rateFor, unclaimedAccounts } from './commission';

const config: CommissionConfig = {
    defaultCommission: 0.07,
    sellers: [{ rate: 0.1, accountIds: ['acc-a', 'acc-b'] }],
};

describe('rateFor', () => {
    it('returns the seller rate for a claimed account', () => {
        expect(rateFor('acc-a', config)).toBe(0.1);
    });
    it('falls to the default for an unclaimed account', () => {
        expect(rateFor('acc-z', config)).toBe(0.07);
    });
});

describe('unclaimedAccounts', () => {
    it('lists unclaimed accounts deduped, drops empties', () => {
        expect(unclaimedAccounts(['acc-a', 'acc-z', 'acc-z', '', 'acc-y'], config)).toEqual(['acc-z', 'acc-y']);
    });
});
