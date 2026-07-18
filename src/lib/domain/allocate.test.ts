import type { CampaignModel, ModelFunnel } from './join';
import type { Fact } from './types';
import { allocateGeo } from './allocate';

// Doc 06 allocation: a Campaign's real Spend⁺ split across its Offers / OS by that Campaign's own
// Installs. Installs must reconcile to the Geo (every install belongs to exactly one offer × os).

function fact(over: Partial<Fact>): Fact {
    return {
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

function funnel(over: Partial<ModelFunnel>): ModelFunnel {
    return { installs: 0, regs: 0, sales: 0, revenue: 0, linkClicks: 0, ...over };
}

describe('allocateGeo', () => {
    it('splits Spend⁺ across offers in proportion to each campaign install share', () => {
        // Campaign spends 100 (Spend⁺ 106) over 10 installs: offer A 6, offer B 4.
        const models = new Map<string, CampaignModel>([
            [
                'c1',
                {
                    offer: new Map([
                        ['A', { ...funnel({ installs: 6, revenue: 300 }), label: 'A |' }],
                        ['B', { ...funnel({ installs: 4, revenue: 100 }), label: 'B |' }],
                    ]),
                    os: new Map(),
                },
            ],
        ]);
        const { offers } = allocateGeo([fact({ campaign: 'c1', spend: 100, spendPlus: 106, installs: 10 })], models);

        const a = offers.find((r) => {
            return r.key === 'A';
        });
        const b = offers.find((r) => {
            return r.key === 'B';
        });
        expect(a?.metrics.spendPlus).toBeCloseTo(63.6, 5); // 106 × 6/10
        expect(b?.metrics.spendPlus).toBeCloseTo(42.4, 5); // 106 × 4/10
        // CPI is a REAL per-offer number, not the geo average (the prototype→change).
        expect(a?.metrics.cpi).toBeCloseTo(10.6, 5); // 63.6 / 6
        // 42.4 / 4 — equal to A only because spend split ∝ installs here.
        expect(b?.metrics.cpi).toBeCloseTo(10.6, 5);
    });

    it('sums allocated spend across campaigns; offer installs reconcile to the geo', () => {
        const models = new Map<string, CampaignModel>([
            ['c1', { offer: new Map([['A', { ...funnel({ installs: 5 }), label: 'A' }]]), os: new Map() }],
            [
                'c2',
                {
                    offer: new Map([
                        ['A', { ...funnel({ installs: 2 }), label: 'A' }],
                        ['B', { ...funnel({ installs: 3 }), label: 'B' }],
                    ]),
                    os: new Map(),
                },
            ],
        ]);
        const facts = [
            fact({ campaign: 'c1', spend: 50, spendPlus: 50, installs: 5 }),
            fact({ campaign: 'c2', spend: 100, spendPlus: 100, installs: 5 }),
        ];
        const { offers } = allocateGeo(facts, models);

        const totalOfferInstalls = offers.reduce((sum, r) => {
            return sum + r.metrics.installs;
        }, 0);
        const geoInstalls = facts.reduce((sum, f) => {
            return sum + f.installs;
        }, 0);
        expect(totalOfferInstalls).toBe(geoInstalls); // 10

        const a = offers.find((r) => {
            return r.key === 'A';
        });
        expect(a?.metrics.installs).toBe(7); // 5 + 2
        expect(a?.metrics.spendPlus).toBeCloseTo(90, 5); // 50×5/5 + 100×2/5
    });

    it('OS rows carry clicks (CPC), offers do not', () => {
        const models = new Map<string, CampaignModel>([
            [
                'c1',
                {
                    offer: new Map([['A', { ...funnel({ installs: 4 }), label: 'A' }]]),
                    os: new Map([['android', funnel({ installs: 4, linkClicks: 80 })]]),
                },
            ],
        ]);
        const { offers, os } = allocateGeo([fact({ campaign: 'c1', spend: 40, spendPlus: 40, installs: 4 })], models);

        expect(offers[0].metrics.cpc).toBeNull(); // no clicks source
        expect(os[0].metrics.linkClicks).toBe(80);
        expect(os[0].metrics.cpc).toBeCloseTo(0.5, 5); // 40 / 80
    });

    it('drops empty dimension values (no installs, no revenue) and labels offers', () => {
        const models = new Map<string, CampaignModel>([
            [
                'c1',
                {
                    offer: new Map([
                        ['A', { ...funnel({ installs: 3 }), label: 'IN | Brand | CPA' }],
                        ['empty', { ...funnel({}), label: 'x' }],
                    ]),
                    os: new Map(),
                },
            ],
        ]);
        const { offers } = allocateGeo([fact({ campaign: 'c1', spend: 30, spendPlus: 30, installs: 3 })], models);
        expect(offers).toHaveLength(1);
        expect(offers[0].label).toBe('IN | Brand | CPA');
    });
});
