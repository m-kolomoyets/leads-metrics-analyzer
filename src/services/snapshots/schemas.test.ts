import { createSnapshotInputSchema, mutedCampaignCount } from './schemas';

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

    // S2a (#53, ADR-0015). A Snapshot now carries what its report allocates over. The older shape —
    // everything a pre-S2a client sent — must still parse, because rejecting it would break the save
    // path the moment a stale tab posts.
    describe('snapshot completeness', () => {
        const thresholds = {
            installs: { gy: 1, yr: 2 },
            regs: { gy: 3, yr: 4 },
            sales: { gy: 5, yr: 6 },
            clicks: { gy: 0.1, yr: 0.2 },
        };

        it('accepts the older shape, leaving the new parts empty rather than rejecting', () => {
            const parsed = createSnapshotInputSchema.parse(base);

            expect(parsed.geoRollups).toEqual([]);
            expect(parsed.creatives).toEqual([]);
            expect(parsed.campaignModels).toEqual([]);
            expect(parsed.settings).toBeNull();
            expect(parsed.geos[0].thresholds).toBeNull();
            // The only class the old write path could grade (ADR-0012).
            expect(parsed.facts[0].attribution).toBe('full');
        });

        it('keeps an explicit campaign-lost attribution', () => {
            const parsed = createSnapshotInputSchema.parse({
                ...base,
                facts: [{ ...fact, attribution: 'campaign_lost' }],
            });

            expect(parsed.facts[0].attribution).toBe('campaign_lost');
        });

        it('rejects an unknown attribution rather than defaulting it', () => {
            expect(
                createSnapshotInputSchema.safeParse({ ...base, facts: [{ ...fact, attribution: 'partial' }] }).success
            ).toBe(false);
        });

        it('carries a frozen geo rollup, keeping the Geo Total distinct from attributed revenue', () => {
            const parsed = createSnapshotInputSchema.parse({
                ...base,
                geoRollups: [
                    {
                        geo: 'kr',
                        spendPlus: 110,
                        geoTotal: 260,
                        attributedRevenue: 200,
                        linkClicks: 50,
                        installs: 20,
                        regs: 10,
                        sales: 5,
                        profit: 150,
                        roi: 136.36,
                        cpc: 2.2,
                        cpi: 5.5,
                        cpr: 11,
                        cps: 22,
                        waste: 12,
                    },
                ],
            });

            expect(parsed.geoRollups[0].geo).toBe('KR');
            expect(parsed.geoRollups[0].geoTotal).toBe(260);
            expect(parsed.geoRollups[0].attributedRevenue).toBe(200);
            // The Geo Total's funnel, untagged rows included — as underivable from Facts as the
            // revenue is, so it is frozen beside it (#54).
            expect(parsed.geoRollups[0].installs).toBe(20);
        });

        it('defaults an unmeasurable cost metric to null rather than zero', () => {
            const parsed = createSnapshotInputSchema.parse({
                ...base,
                geoRollups: [{ geo: 'KR', spendPlus: 0, geoTotal: 0, attributedRevenue: 0, profit: 0, waste: 0 }],
            });

            expect(parsed.geoRollups[0].roi).toBeNull();
            expect(parsed.geoRollups[0].cpi).toBeNull();
            // A rollup written between #53 and #54 froze the money but not the counts; it still parses.
            expect(parsed.geoRollups[0].installs).toBe(0);
        });

        it('carries creative splits and campaign models', () => {
            const parsed = createSnapshotInputSchema.parse({
                ...base,
                creatives: [{ geo: 'kr', campaign: 'C-1', adName: '🇰🇷 KR_12 [Game]', spend: 40, impressions: 900 }],
                campaignModels: [
                    {
                        campaign: 'C-1',
                        dimension: 'offer',
                        key: '512',
                        label: 'FortuneGems',
                        revenue: 200,
                        linkClicks: 0,
                        installs: 20,
                        regs: 10,
                        sales: 5,
                    },
                ],
            });

            expect(parsed.creatives[0].geo).toBe('KR');
            expect(parsed.creatives[0].impressions).toBe(900);
            expect(parsed.campaignModels[0].dimension).toBe('offer');
        });

        it('rejects a campaign model on an unknown dimension', () => {
            expect(
                createSnapshotInputSchema.safeParse({
                    ...base,
                    campaignModels: [
                        {
                            campaign: 'C-1',
                            dimension: 'creative',
                            key: 'k',
                            label: 'l',
                            revenue: 0,
                            linkClicks: 0,
                            installs: 0,
                            regs: 0,
                            sales: 0,
                        },
                    ],
                }).success
            ).toBe(false);
        });

        it('copies the resolved thresholds and shared settings so a deleted preset cannot un-grade it', () => {
            const parsed = createSnapshotInputSchema.parse({
                ...base,
                settings: { reviewMultiplier: 3, defaultCommission: 7, wasteZones: { gy: 5, yr: 10 } },
                geos: [{ ...base.geos[0], thresholds }],
            });

            expect(parsed.geos[0].thresholds).toEqual(thresholds);
            expect(parsed.settings?.wasteZones).toEqual({ gy: 5, yr: 10 });
        });

        it('rejects a half-copied threshold set', () => {
            expect(
                createSnapshotInputSchema.safeParse({
                    ...base,
                    geos: [{ ...base.geos[0], thresholds: { installs: { gy: 1, yr: 2 } } }],
                }).success
            ).toBe(false);
        });
    });
});

// The detailed report tells an overseer how many campaigns the buyer muted, so nobody compares a
// filtered report to an unfiltered one (spec story 33). The count comes back out of the `meta` jsonb
// column, which is `unknown` on the wire and legitimately null on every Snapshot saved with nothing
// muted — so the reader is a parse, never a cast.
describe('mutedCampaignCount', () => {
    it('counts the campaigns the buyer muted', () => {
        expect(mutedCampaignCount({ excludedCampaigns: ['C-1', 'C-2'] })).toBe(2);
    });

    it('reads a snapshot with nothing muted as zero', () => {
        expect(mutedCampaignCount(null)).toBe(0);
        expect(mutedCampaignCount(undefined)).toBe(0);
        expect(mutedCampaignCount({})).toBe(0);
    });

    it('reads an unparseable meta as zero rather than throwing', () => {
        expect(mutedCampaignCount({ excludedCampaigns: 'C-1' })).toBe(0);
        expect(mutedCampaignCount('muted')).toBe(0);
    });
});
