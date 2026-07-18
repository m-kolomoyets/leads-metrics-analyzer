import { createSnapshotInputSchema } from './schemas';

// The create-snapshot validator carries the non-trivial input rules: Geo normalizes to upper-case
// ISO-2, and a snapshot must pin at least one geo and carry at least one fact (empty is meaningless).
// The fact/geo shapes are structurally validated by Zod itself, so we pin only these behaviors.

const fact = {
    campaign: 'C-1',
    creative: 'cr-1',
    reportDate: '2026-07-18',
    geo: 'kr',
    account: 'acc-1',
    offer: 'off-1',
    os: null,
    spend: 100,
    spendPlus: 110,
    revenue: 200,
    linkClicks: 50,
    installs: 20,
    regs: 10,
    sales: 5,
    verdict: 'green',
    zone: 'green',
};

const base = {
    reportDate: '2026-07-18',
    sharedSettingsVersionId: null,
    geos: [{ geo: 'kr', presetVersionId: '11111111-1111-4111-8111-111111111111' }],
    facts: [fact],
};

describe('createSnapshotInputSchema', () => {
    it('normalizes a lower-case geo to upper-case in both geos and facts', () => {
        const parsed = createSnapshotInputSchema.parse(base);

        expect(parsed.geos[0].geo).toBe('KR');
        expect(parsed.facts[0].geo).toBe('KR');
    });

    it('rejects a snapshot pinning no geo', () => {
        expect(createSnapshotInputSchema.safeParse({ ...base, geos: [] }).success).toBe(false);
    });

    it('rejects a snapshot carrying no facts', () => {
        expect(createSnapshotInputSchema.safeParse({ ...base, facts: [] }).success).toBe(false);
    });

    it('rejects a bad report date', () => {
        expect(createSnapshotInputSchema.safeParse({ ...base, reportDate: '18/07/2026' }).success).toBe(false);
    });

    it('rejects an out-of-range zone', () => {
        expect(createSnapshotInputSchema.safeParse({ ...base, facts: [{ ...fact, zone: 'blue' }] }).success).toBe(
            false
        );
    });
});
