import type { Fact } from '@/lib/domain/types';
import type { PresetView, SharedSettingsView } from '@/services/presets/types';
import { describe, expect, it } from 'vitest';
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

const base = {
    facts: [fact()],
    geos: ['BR'],
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
        expect(plan.ok && plan.input.geos).toEqual([{ geo: 'BR', presetVersionId: preset().activeVersionId }]);
        expect(plan.ok && plan.input.sharedSettingsVersionId).toBe(shared.activeVersionId);
        expect(plan.ok && plan.input.reportDate).toBe('2026-07-02');
    });

    it('maps facts field-for-field, dropping only the attribution class', () => {
        const plan = planSnapshot(base);

        expect(plan.ok && plan.input.facts[0]).toEqual({
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

        expect(plan.ok && plan.input.geos).toEqual([{ geo: 'BR', presetVersionId: second.activeVersionId }]);
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
