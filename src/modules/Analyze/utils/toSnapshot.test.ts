import type { GeoRollup, Ruleset } from '@/lib/domain';
import type { CampaignCreatives, CampaignModel } from '@/lib/domain/join';
import type { Fact, Totals } from '@/lib/domain/types';
import type { PresetView, SharedSettingsView } from '@/services/presets/types';
import { describe, expect, it } from 'vitest';
import { metricsFor } from '@/lib/domain/aggregate';
import { defaultReportDate, planSnapshot } from './toSnapshot';

const THRESHOLDS = {
    installs: { gy: 1, yr: 2 },
    regs: { gy: 1, yr: 2 },
    sales: { gy: 1, yr: 2 },
    clicks: { gy: 1, yr: 2 },
};

function preset(over: Partial<PresetView> = {}): PresetView {
    return {
        id: 'p1',
        teamId: null,
        ownerUserId: 'u1',
        ownerEmail: 'a@b.c',
        teamName: null,
        geo: 'BR',
        name: 'BR',
        activeVersionId: '11111111-1111-4111-8111-111111111111',
        thresholds: THRESHOLDS,
        access: 'edit',
        ...over,
    };
}

function fact(over: Partial<Fact> = {}): Fact {
    return {
        attribution: 'full',
        campaign: 'c1',
        creative: 'cr1',
        reportDate: '2026-07-01',
        geo: 'BR',
        account: 'acc1',
        offer: 'off1',
        os: 'Android',
        spend: 10,
        spendPlus: 10.7,
        revenue: 20,
        linkClicks: 5,
        installs: 4,
        regs: 3,
        sales: 1,
        verdict: 'green',
        zone: 'green',
        ...over,
    };
}

const shared: SharedSettingsView = {
    id: 's1',
    teamId: null,
    activeVersionId: '22222222-2222-4222-8222-222222222222',
    payload: { reviewMultiplier: 3, defaultCommission: 7, wasteZones: { gy: 5, yr: 10 }, sellers: [] },
};

const ZERO: Totals = { spend: 0, spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0 };

// One Geo's roll-up as `GeoStat` renders it. `untaggedRevenue` is the whole point of freezing it: it
// rides in the Geo Total and in nothing else, so no Fact can ever give it back (ADR-0003).
function rollup(geo = 'BR', untaggedRevenue = 0, over: Partial<Totals> = {}): GeoRollup {
    const attributed: Totals = {
        ...ZERO,
        spend: 10,
        spendPlus: 10.7,
        revenue: 20,
        linkClicks: 5,
        installs: 4,
        regs: 3,
        sales: 1,
        ...over,
    };
    return {
        geo,
        metrics: metricsFor({ ...attributed, revenue: attributed.revenue + untaggedRevenue }),
        attributed: metricsFor(attributed),
        allocation: { offers: [], os: [], unallocated: ZERO },
    };
}

const campaignCreatives = new Map<string, CampaignCreatives>([
    [
        'c1',
        new Map([
            ['🇧🇷 BR_12 [Game]', { spend: 6, impressions: 900 }],
            ['🇧🇷 BR_13 [Game]', { spend: 4, impressions: 700 }],
        ]),
    ],
]);

const campaignModels = new Map<string, CampaignModel>([
    [
        'c1',
        {
            offer: new Map([
                ['512', { label: 'FortuneGems', installs: 4, regs: 3, sales: 1, revenue: 20, linkClicks: 0 }],
            ]),
            os: new Map([['Android', { installs: 4, regs: 3, sales: 1, revenue: 20, linkClicks: 5 }]]),
        },
    ],
]);

const ruleset: Ruleset = {
    thresholds: { BR: THRESHOLDS },
    commission: { defaultCommission: 0.07, sellers: [] },
    reviewMultiplier: 3,
};

const base = {
    facts: [fact()],
    geos: ['BR'],
    rollups: [rollup()],
    campaignCreatives,
    campaignModels,
    ruleset,
    presets: [preset()],
    shared,
    selectedPresetByGeo: {},
    excluded: new Set<string>(),
    reportDate: '2026-07-02',
};

describe('planSnapshot', () => {
    it('pins each analyzed geo to its preset active version and the shared version', () => {
        const plan = planSnapshot(base);

        expect(plan.ok).toBe(true);
        expect(plan.ok && plan.input.geos).toEqual([
            { geo: 'BR', presetVersionId: preset().activeVersionId, thresholds: THRESHOLDS },
        ]);
        expect(plan.ok && plan.input.sharedSettingsVersionId).toBe(shared.activeVersionId);
        expect(plan.ok && plan.input.reportDate).toBe('2026-07-02');
    });

    it('maps facts field-for-field, attribution included', () => {
        const plan = planSnapshot(base);

        expect(plan.ok && plan.input.facts[0]).toEqual({
            attribution: 'full',
            campaign: 'c1',
            creative: 'cr1',
            reportDate: '2026-07-01',
            geo: 'BR',
            account: 'acc1',
            offer: 'off1',
            os: 'Android',
            spend: 10,
            spendPlus: 10.7,
            revenue: 20,
            linkClicks: 5,
            installs: 4,
            regs: 3,
            sales: 1,
            verdict: 'green',
            zone: 'green',
        });
    });

    it('keeps campaign-lost facts — they carry real revenue at geo grain', () => {
        const plan = planSnapshot({ ...base, facts: [fact(), fact({ attribution: 'campaign-lost', campaign: 'u1' })] });

        expect(plan.ok && plan.input.facts).toHaveLength(2);
    });

    it('blocks the save when an analyzed geo has no saved preset version', () => {
        const plan = planSnapshot({ ...base, geos: ['BR', 'IN'] });

        expect(plan.ok).toBe(false);
        expect(!plan.ok && plan.unpinnedGeos).toEqual(['IN']);
    });

    it('blocks the save when the geo has a preset but no saved version yet', () => {
        const plan = planSnapshot({ ...base, presets: [preset({ activeVersionId: null, thresholds: null })] });

        expect(plan.ok).toBe(false);
        expect(!plan.ok && plan.unpinnedGeos).toEqual(['BR']);
    });

    it('pins the preset the owner picked when a geo carries several', () => {
        const second = preset({ id: 'p2', activeVersionId: '33333333-3333-4333-8333-333333333333' });
        const plan = planSnapshot({
            ...base,
            presets: [preset(), second],
            selectedPresetByGeo: { BR: 'p2' },
        });

        expect(plan.ok && plan.input.geos).toEqual([
            { geo: 'BR', presetVersionId: second.activeVersionId, thresholds: THRESHOLDS },
        ]);
    });

    it('drops muted campaigns — the saved facts are the on-screen ones', () => {
        const plan = planSnapshot({
            ...base,
            facts: [fact(), fact({ campaign: 'c2' })],
            excluded: new Set(['BR:c2']),
        });

        expect(plan.ok && plan.input.facts).toHaveLength(1);
        expect(plan.ok && plan.input.meta).toEqual({ excludedCampaigns: ['BR:c2'] });
    });

    it('mutes independently per geo', () => {
        const plan = planSnapshot({
            ...base,
            geos: ['BR', 'IN'],
            presets: [
                preset(),
                preset({ id: 'p2', geo: 'IN', activeVersionId: '44444444-4444-4444-8444-444444444444' }),
            ],
            facts: [fact(), fact({ geo: 'IN' })],
            excluded: new Set(['IN:c1']),
        });

        expect(
            plan.ok &&
                plan.input.facts.map((row) => {
                    return row.geo;
                })
        ).toEqual(['BR']);
    });

    it('drops facts whose geo was never analyzed (untagged rows carry no geo)', () => {
        const plan = planSnapshot({ ...base, facts: [fact(), fact({ geo: '' })] });

        expect(plan.ok && plan.input.facts).toHaveLength(1);
    });

    it('substitutes a placeholder for an empty creative or offer, and null for an empty OS', () => {
        const plan = planSnapshot({ ...base, facts: [fact({ creative: '', offer: '', os: '' })] });

        expect(plan.ok && plan.input.facts[0].creative).toBe('—');
        expect(plan.ok && plan.input.facts[0].offer).toBe('—');
        expect(plan.ok && plan.input.facts[0].os).toBeNull();
    });

    it('falls back to the picked report date when a fact carries no usable one', () => {
        const plan = planSnapshot({ ...base, facts: [fact({ reportDate: '' })] });

        expect(plan.ok && plan.input.facts[0].reportDate).toBe('2026-07-02');
    });

    it('blocks the save when nothing survives the mute', () => {
        const plan = planSnapshot({ ...base, excluded: new Set(['BR:c1']) });

        expect(plan.ok).toBe(false);
        expect(!plan.ok && plan.factCount).toBe(0);
    });

    it('blocks the save when the report-date field was cleared', () => {
        const plan = planSnapshot({ ...base, reportDate: '' });

        expect(plan.ok).toBe(false);
        expect(!plan.ok && plan.validDate).toBe(false);
    });

    it('carries a null shared version for a team that never saved one', () => {
        const plan = planSnapshot({ ...base, shared: { ...shared, activeVersionId: null } });

        expect(plan.ok && plan.input.sharedSettingsVersionId).toBeNull();
    });

    it('keeps a campaign-lost fact labelled as such, not inferred from a placeholder later', () => {
        const plan = planSnapshot({
            ...base,
            facts: [fact(), fact({ attribution: 'campaign-lost', campaign: '⟨unfired⟩|BR|acc1|cr1', spend: 0 })],
        });

        expect(
            plan.ok &&
                plan.input.facts.map((row) => {
                    return row.attribution;
                })
        ).toEqual(['full', 'campaign_lost']);
    });

    // S2a (#53, ADR-0015): a Snapshot must carry what its report allocates over, and the one figure
    // that can never be derived from Facts.
    describe('snapshot completeness', () => {
        it('freezes the geo rollup, Geo Total included', () => {
            const plan = planSnapshot({ ...base, rollups: [rollup('BR', 30)] });
            const frozen = plan.ok ? plan.input.geoRollups[0] : null;

            expect(frozen?.geo).toBe('BR');
            // Untagged revenue rides in the Geo Total and nowhere else — no Fact can give it back.
            expect(frozen?.geoTotal).toBe(50);
            expect(frozen?.attributedRevenue).toBe(20);
            expect(frozen?.spendPlus).toBe(10.7);
            expect(frozen?.profit).toBeCloseTo(39.3, 10);
            expect(frozen?.cpi).toBeCloseTo(10.7 / 4, 10);
        });

        it('freezes an unmeasurable cost metric as null, never as zero', () => {
            const plan = planSnapshot({ ...base, rollups: [rollup('BR', 0, { sales: 0, linkClicks: 0 })] });

            expect(plan.ok && plan.input.geoRollups[0].cps).toBeNull();
            expect(plan.ok && plan.input.geoRollups[0].cpc).toBeNull();
        });

        it('freezes the waste the buyer saw, muted campaigns left out of it', () => {
            const two = { ...base, facts: [fact(), fact({ campaign: 'c2' })] };
            const whole = planSnapshot(two);
            const muted = planSnapshot({ ...two, excluded: new Set(['BR:c2']) });

            expect(whole.ok && whole.input.geoRollups[0].waste).toBeGreaterThan(0);
            expect(muted.ok && muted.input.geoRollups[0].waste).toBeLessThan(
                whole.ok ? whole.input.geoRollups[0].waste : 0
            );
        });

        it('carries the real per-creative spend and impressions, once per campaign', () => {
            // The same campaign on two days: the creative breakdown already aggregates across them, so
            // writing it per fact would double every impression.
            const plan = planSnapshot({ ...base, facts: [fact(), fact({ reportDate: '2026-07-02' })] });

            expect(plan.ok && plan.input.creatives).toEqual([
                { geo: 'BR', campaign: 'c1', adName: '🇧🇷 BR_12 [Game]', spend: 6, impressions: 900 },
                { geo: 'BR', campaign: 'c1', adName: '🇧🇷 BR_13 [Game]', spend: 4, impressions: 700 },
            ]);
        });

        it('carries the campaign model for both dimensions, with no spend of its own', () => {
            const plan = planSnapshot(base);

            expect(plan.ok && plan.input.campaignModels).toEqual([
                {
                    campaign: 'c1',
                    dimension: 'offer',
                    key: '512',
                    label: 'FortuneGems',
                    revenue: 20,
                    linkClicks: 0,
                    installs: 4,
                    regs: 3,
                    sales: 1,
                },
                {
                    campaign: 'c1',
                    dimension: 'os',
                    key: 'Android',
                    label: 'Android',
                    revenue: 20,
                    linkClicks: 5,
                    installs: 4,
                    regs: 3,
                    sales: 1,
                },
            ]);
        });

        it('drops a muted campaign from the creative splits and campaign models too', () => {
            const plan = planSnapshot({
                ...base,
                facts: [fact({ campaign: 'c2' }), fact()],
                excluded: new Set(['BR:c1']),
            });

            expect(plan.ok && plan.input.creatives).toEqual([]);
            expect(plan.ok && plan.input.campaignModels).toEqual([]);
        });

        it('copies the shared settings so a pruned version cannot re-grade the snapshot', () => {
            const plan = planSnapshot(base);

            expect(plan.ok && plan.input.settings).toEqual({
                reviewMultiplier: 3,
                defaultCommission: 7,
                wasteZones: { gy: 5, yr: 10 },
            });
        });

        it('carries null settings for a team with no saved shared settings', () => {
            const plan = planSnapshot({ ...base, shared: { ...shared, payload: null } });

            expect(plan.ok && plan.input.settings).toBeNull();
        });

        it('copies the ruleset thresholds when the picked preset carries none of its own', () => {
            // The owner can pick a preset whose active version has no parseable thresholds; grading
            // then falls back to the ruleset's first-wins pick, so that is what gets copied.
            const plan = planSnapshot({
                ...base,
                presets: [preset({ id: 'p2', thresholds: null }), preset()],
                selectedPresetByGeo: { BR: 'p2' },
            });

            expect(plan.ok && plan.input.geos[0].thresholds).toEqual(THRESHOLDS);
        });
    });
});

describe('defaultReportDate', () => {
    it('takes the latest report date the facts carry', () => {
        const dates = defaultReportDate([fact(), fact({ reportDate: '2026-07-09' })], '2026-08-02');

        expect(dates).toBe('2026-07-09');
    });

    it('falls back to today when no fact carries a calendar date', () => {
        expect(defaultReportDate([fact({ reportDate: '01/07/2026' })], '2026-08-02')).toBe('2026-08-02');
        expect(defaultReportDate([], '2026-08-02')).toBe('2026-08-02');
    });
});
