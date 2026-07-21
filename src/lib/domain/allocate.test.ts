import type { CampaignModel, ModelFunnel } from './join';
import type { Fact } from './types';
import { allocateGeo } from './allocate';

// Doc 06 allocation: a Campaign's real Spend⁺ split across its Offers / OS by that Campaign's own
// Installs. Installs must reconcile to the Geo (every install belongs to exactly one offer × os).

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
        expect(a?.metrics.spendPlus).toBeCloseTo(63.6, 5); // 6 × 10.6
        expect(b?.metrics.spendPlus).toBeCloseTo(42.4, 5); // 4 × 10.6
        // Every Offer prices at the same Geo rate (ADR-0013), so CPI is uniform across the table by
        // construction. What separates Offers is Revenue per Install — EPC, ROI and CPR/CPS, which
        // ride on real Keitaro counts. CPI is a costing basis here, never a comparison axis.
        expect(a?.metrics.cpi).toBeCloseTo(10.6, 5); // 106 / 10
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
        // One Geo rate, not each campaign's own: (50+100)/10 = 15, so A is 7 × 15 (ADR-0013). The
        // per-campaign split would have said 90 (50×5/5 + 100×2/5) — deliberately given up, because
        // it makes the Offer table's CPI disagree with the Geo header's over the same traffic.
        expect(a?.metrics.spendPlus).toBeCloseTo(105, 5);
        expect(a?.metrics.cpi).toBeCloseTo(15, 5);
    });

    it('prices Offers at the Geo rate even when some campaigns bought nothing', () => {
        // The whole point (ADR-0013): a campaign that spent and bought no Installs still spent that
        // money trying to. Its cost belongs in the unit rate, not stranded in `unallocated`.
        const models = new Map<string, CampaignModel>([
            ['c1', { offer: new Map([['A', { ...funnel({ installs: 10 }), label: 'A' }]]), os: new Map() }],
        ]);
        const facts = [
            fact({ campaign: 'c1', spend: 100, spendPlus: 100, installs: 10 }),
            fact({ campaign: 'dead', spend: 50, spendPlus: 50, installs: 0 }),
        ];
        const { offers, unallocated } = allocateGeo(facts, models);

        expect(offers[0].metrics.spendPlus).toBeCloseTo(150, 5); // 10 × (150/10)
        expect(offers[0].metrics.cpi).toBeCloseTo(15, 5); // the Geo's true CPI, not 10
        expect(unallocated.spendPlus).toBeCloseTo(0, 5);
    });

    it('a Geo that bought no Installs strands all its Spend⁺ in unallocated', () => {
        // No unit cost exists, so nothing can be priced — the money must still show up somewhere.
        const facts = [fact({ campaign: 'dead', spend: 80, spendPlus: 80, installs: 0 })];
        const { offers, unallocated } = allocateGeo(facts, new Map());
        expect(offers).toHaveLength(0);
        expect(unallocated.spendPlus).toBeCloseTo(80, 5);
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
