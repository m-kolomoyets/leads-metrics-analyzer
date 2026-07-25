import type { Fact, GeoThresholds } from './types';
import { accountsFor } from './accounts';

const TH: GeoThresholds = {
    installs: { gy: 2, yr: 4 },
    regs: { gy: 5, yr: 10 },
    sales: { gy: 30, yr: 60 },
    clicks: { gy: 0.2, yr: 0.5 },
};

// A campaign-grain Fact; only the fields under test carry values.
function fact(over: Partial<Fact>): Fact {
    return {
        attribution: 'full',
        campaign: 'c',
        creative: 'ad',
        reportDate: '2026-07-01',
        geo: 'IN',
        account: 'acc',
        offer: 'o',
        os: null,
        spend: 0,
        spendPlus: 0,
        revenue: 0,
        linkClicks: 0,
        installs: 0,
        regs: 0,
        sales: 0,
        verdict: 'neutral',
        zone: 'neutral',
        ...over,
    };
}

describe('accountsFor', () => {
    it('groups campaigns under their account and sums same-campaign facts', () => {
        const [a] = accountsFor(
            [
                fact({ account: 'A', campaign: 'c1', spend: 10, spendPlus: 10, installs: 5 }),
                fact({ account: 'A', campaign: 'c1', spend: 5, spendPlus: 5, installs: 3 }),
            ],
            TH,
            2
        );
        expect(a.account).toBe('A');
        expect(a.campaigns).toHaveLength(1);
        expect(a.campaigns[0].metrics.installs).toBe(8);
        expect(a.metrics.spendPlus).toBe(15);
    });

    it('buckets each campaign by its verdict zone and tallies counts', () => {
        const accounts = accountsFor(
            [
                fact({ campaign: 'g', spendPlus: 2, installs: 2 }), // cpi 1 → green
                fact({ campaign: 'r', spendPlus: 50, installs: 5 }), // cpi 10 → red
            ],
            TH,
            2
        );
        const a = accounts[0];
        expect(a.counts.green).toBe(1);
        expect(a.counts.red).toBe(1);
    });

    it('flags a Problem Account (rule 1: spend out, zero installs)', () => {
        const [a] = accountsFor([fact({ spendPlus: 100, installs: 0 })], TH, 2);
        expect(a.problem?.rule).toBe(1);
    });

    it('collects sales campaigns separately', () => {
        const [a] = accountsFor(
            [
                fact({ campaign: 'sale', spendPlus: 40, sales: 1, installs: 2 }),
                fact({ campaign: 'nosale', spendPlus: 4, installs: 2 }),
            ],
            TH,
            2
        );
        expect(
            a.salesCampaigns.map((c) => {
                return c.campaign;
            })
        ).toEqual(['sale']);
    });

    it('tallies a sales campaign under counts.sales instead of its verdict zone', () => {
        const [a] = accountsFor(
            [
                fact({ campaign: 'sale', spendPlus: 2, installs: 2, sales: 1 }), // cpi 1 → green
                fact({ campaign: 'nosale', spendPlus: 2, installs: 2 }), // cpi 1 → green
            ],
            TH,
            2
        );
        expect(a.counts.sales).toBe(1);
        expect(a.counts.green).toBe(1);
    });

    it('sorts accounts by Spend⁺ desc and drops zero-spend accounts', () => {
        const accounts = accountsFor(
            [
                fact({ account: 'small', spend: 1, spendPlus: 1, installs: 1 }),
                fact({ account: 'big', spend: 100, spendPlus: 100, installs: 1 }),
                fact({ account: 'empty', spend: 0 }),
            ],
            TH,
            2
        );
        expect(
            accounts.map((a) => {
                return a.account;
            })
        ).toEqual(['big', 'small']);
    });

    it('drops excluded campaigns from metrics, counts and problem but keeps them listed', () => {
        const [a] = accountsFor(
            [
                fact({ campaign: 'keep', spend: 2, spendPlus: 2, installs: 2 }), // cpi 1 → green
                fact({ campaign: 'mute', spend: 50, spendPlus: 50, installs: 0 }), // rule-1 problem
            ],
            TH,
            2,
            new Set(['mute'])
        );
        expect(a.campaigns).toHaveLength(2);
        expect(
            a.campaigns.find((c) => {
                return c.campaign === 'mute';
            })?.excluded
        ).toBe(true);
        expect(a.metrics.spendPlus).toBe(2);
        expect(a.counts.green).toBe(1);
        expect(a.problem).toBeNull();
    });

    it('keeps a fully-excluded account visible with zeroed roll-up metrics', () => {
        const [a] = accountsFor(
            [fact({ campaign: 'mute', spend: 50, spendPlus: 50, installs: 2 })],
            TH,
            2,
            new Set(['mute'])
        );
        expect(a.campaigns).toHaveLength(1);
        expect(a.metrics.spendPlus).toBe(0);
        expect(a.counts.green + a.counts.yellow + a.counts.red + a.counts.neutral).toBe(0);
        expect(a.problem).toBeNull();
    });

    // Waste grain (ADR-0014). TH.installs.yr = 4, so reviewMultiplier 2 → bar 8.
    it('sums the red campaigns Waste when the account is not a Problem Account', () => {
        // cpi 6 → red campaign, but under the bar of 8, so no rule fires.
        const [a] = accountsFor([fact({ spendPlus: 30, installs: 5 })], TH, 2);
        expect(a.problem).toBeNull();
        expect(a.wasteGrain).toBe('campaign');
        expect(a.waste).toBe(10); // 30 − 4×5
    });

    it('measures a rule-1 Problem Account at account grain, billing a single bar', () => {
        // reviewMultiplier 10 → bar 40: the account was due to pause at 40 and spent 55.
        const [a] = accountsFor([fact({ spendPlus: 55, installs: 0 })], TH, 10);
        expect(a.problem?.rule).toBe(1);
        expect(a.wasteGrain).toBe('account');
        expect(a.waste).toBe(15); // 55 − 40, NOT the campaign rule's whole 55
    });

    it('bills a Problem Account for spend by campaigns that graded green on their own', () => {
        const [a] = accountsFor(
            [
                fact({ campaign: 'fine', spendPlus: 2, installs: 2 }), // cpi 1 → green
                fact({ campaign: 'bad', spendPlus: 100, installs: 1 }), // cpi 100 → red
            ],
            TH,
            2
        );
        expect(a.problem?.rule).toBe(2);
        expect(a.wasteGrain).toBe('account');
        expect(a.waste).toBe(78); // 102 − 8×3, over the WHOLE account
        // Campaign rows keep their own Waste — the account figure is not their sum.
        expect(
            a.campaigns.reduce((sum, c) => {
                return sum + c.verdict.waste;
            }, 0)
        ).toBe(96);
    });

    it('keeps the account figure even when it is lower than the sum of its campaigns', () => {
        // Zero-result campaign wastes its whole Spend⁺; the account bills only spend past the bar.
        const [a] = accountsFor([fact({ spendPlus: 55, installs: 0 })], TH, 10);
        expect(a.campaigns[0].verdict.waste).toBe(55);
        expect(a.waste).toBe(15);
    });

    it('reports more waste than the campaign sum when the campaign was graded on a later stage', () => {
        // cpi 20, cpr 20 → the campaign is judged on regs (Waste 100 − 10×5), the account on the
        // install bar (100 − 8×5) — so the account grain catches money the campaign grain missed.
        const [a] = accountsFor([fact({ spendPlus: 100, installs: 5, regs: 5 })], TH, 2);
        expect(a.problem?.rule).toBe(2);
        expect(a.campaigns[0].verdict.waste).toBe(50);
        expect(a.waste).toBe(60);
    });

    it('wastes nothing when a rule-2 account with no installs spent under the bar', () => {
        // Rule 1 declines (spend < bar) but rule 2 fires on an Infinity CPI. Without the installs
        // floor this would bill the whole $5.
        const [a] = accountsFor([fact({ spend: 5, spendPlus: 5, installs: 0 })], TH, 2);
        expect(a.problem?.rule).toBe(2);
        expect(a.waste).toBe(0);
    });

    it('grades neutral when the geo has no thresholds', () => {
        const [a] = accountsFor([fact({ spendPlus: 100, installs: 5 })], undefined, 2);
        expect(a.campaigns[0].verdict.verdict).toBe('neutral');
        expect(a.problem).toBeNull();
    });
});
