import type { PresetView, SharedSettingsView } from '@/services/presets/types';
import type { CreateSnapshotInput } from '@/services/snapshots/schemas';
import type { SnapshotBundleView } from '@/services/snapshots/types';
import type { AnalyzeResult } from './index';
import type { GeoThresholds, Ruleset, ThresholdPair } from './types';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { bundleFromSnapshot } from '@/services/snapshots/toBundle';
import { planSnapshot } from '@/modules/Analyze/utils/toSnapshot';
import { accountsFor } from './accounts';
import { creativesFor } from './creatives';
import { analyze } from './index';
import { analyzeSnapshot } from './snapshot';

// The round-trip property (spec 0003 §Testing Decisions): analyze real files, plan a Snapshot from
// the result, then rebuild that Snapshot and assert the report is the SAME report. This is the test
// the whole Report feature rests on — if it holds, an overseer reads the buyer's numbers rather than
// a second implementation's approximation of them.

function pair(gy: number, yr: number): ThresholdPair {
    return { gy, yr };
}

const VERSION_ID = '11111111-1111-4111-8111-111111111111';
const SHARED_VERSION_ID = '22222222-2222-4222-8222-222222222222';

// Commission is a percent in persistence and a fraction in the domain (`toRuleset`), so 6 here is the
// 0.06 the analysing ruleset below grades with — the round trip has to survive that conversion too.
const COMMISSION_PERCENT = 6;
const REVIEW_MULTIPLIER = 2;

function ruleset(thresholds: Record<string, GeoThresholds>): Ruleset {
    return {
        thresholds,
        commission: { defaultCommission: COMMISSION_PERCENT / 100, sellers: [] },
        reviewMultiplier: REVIEW_MULTIPLIER,
    };
}

function presetsFor(thresholds: Record<string, GeoThresholds>): PresetView[] {
    return Object.entries(thresholds).map(([geo, geoThresholds]): PresetView => {
        return {
            id: `p-${geo}`,
            teamId: null,
            ownerUserId: 'u1',
            ownerEmail: 'buyer@example.com',
            teamName: null,
            geo,
            name: geo,
            activeVersionId: VERSION_ID,
            thresholds: geoThresholds,
            access: 'edit',
        };
    });
}

const SHARED: SharedSettingsView = {
    id: 's1',
    teamId: null,
    activeVersionId: SHARED_VERSION_ID,
    payload: {
        reviewMultiplier: REVIEW_MULTIPLIER,
        defaultCommission: COMMISSION_PERCENT,
        wasteZones: pair(5, 10),
        sellers: [],
    },
};

// Plan a Snapshot out of a live analysis, exactly as the Save button does.
function plan(result: AnalyzeResult, thresholds: Record<string, GeoThresholds>): CreateSnapshotInput {
    const geos = result.geos.map((geo) => {
        return geo.geo;
    });
    const planned = planSnapshot({
        facts: result.facts,
        geos,
        rollups: result.geos,
        campaignCreatives: result.campaignCreatives,
        campaignModels: result.campaignModels,
        ruleset: ruleset(thresholds),
        presets: presetsFor(thresholds),
        shared: SHARED,
        selectedPresetByGeo: {},
        excluded: new Set(),
        reportDate: '2026-07-01',
    });
    if (!planned.ok) {
        throw new Error(`snapshot plan refused: ${JSON.stringify(planned)}`);
    }
    return planned.input;
}

// What the database gives back for a planned Snapshot. Everything is carried verbatim — the point of
// the round trip is that no step in between re-derives anything.
function stored(input: CreateSnapshotInput, over: Partial<SnapshotBundleView> = {}): SnapshotBundleView {
    return {
        snapshot: {
            id: 'snap-1',
            createdByUserId: 'u1',
            teamId: null,
            appliedRulesetId: 'ar-1',
            sharedSettingsVersionId: input.sharedSettingsVersionId,
            geos: input.geos.map((geo) => {
                return { geo: geo.geo, presetVersionId: geo.presetVersionId };
            }),
            reportDate: input.reportDate,
            takenAt: '2026-07-02T08:00:00.000Z',
            access: 'read',
        },
        geos: input.geos.map((geo) => {
            return { geo: geo.geo, presetVersionId: geo.presetVersionId, thresholds: geo.thresholds };
        }),
        settings: input.settings,
        facts: input.facts.map((fact, index) => {
            return { id: `fact-${index}`, ...fact };
        }),
        geoRollups: input.geoRollups,
        creatives: input.creatives,
        campaignModels: input.campaignModels,
        mutedCampaigns: 0,
        ...over,
    };
}

function rebuild(input: CreateSnapshotInput, over: Partial<SnapshotBundleView> = {}): AnalyzeResult {
    const { bundle, ruleset: pinned } = bundleFromSnapshot(stored(input, over));
    return analyzeSnapshot(bundle, pinned);
}

function factsIn(result: AnalyzeResult, geo: string) {
    return result.facts.filter((fact) => {
        return fact.geo === geo;
    });
}

function rollupIn(result: AnalyzeResult, geo: string) {
    const found = result.geos.find((entry) => {
        return entry.geo === geo;
    });
    if (!found) {
        throw new Error(`geo ${geo} missing`);
    }
    return found;
}

// ── The golden files ────────────────────────────────────────────────────────────────────────────
// Real exports, 602 facts over two markets: many creatives per campaign, many offers and OS values,
// an Unfired-Macro geo and untagged installs/clicks. Prior art: `analyze.test.ts`.

const REF = resolve(__dirname, '../../../references');
function fixture(name: string): string {
    return readFileSync(resolve(REF, name), 'utf-8');
}

const GOLDEN_THRESHOLDS: Record<string, GeoThresholds> = {
    IN: { installs: pair(2, 4), regs: pair(5, 10), sales: pair(30, 60), clicks: pair(0.2, 0.5) },
    KR: { installs: pair(10, 14), regs: pair(14, 25), sales: pair(100, 250), clicks: pair(4, 6) },
};

const golden = analyze(
    [fixture('FB.csv'), fixture('KT_main.csv'), fixture('KT_Clicks.csv')],
    ruleset(GOLDEN_THRESHOLDS)
);
const goldenInput = plan(golden, GOLDEN_THRESHOLDS);
const goldenRebuilt = rebuild(goldenInput);

describe('analyzeSnapshot — the golden files round-trip', () => {
    it.each(['IN', 'KR'])('%s rebuilds the same Geo roll-up, to the cent', (geo) => {
        const before = rollupIn(golden, geo);
        const after = rollupIn(goldenRebuilt, geo);
        const frozenWaste = goldenInput.geoRollups.find((rollup) => {
            return rollup.geo === geo;
        })?.waste;

        expect(after.metrics).toEqual(before.metrics);
        expect(after.attributed).toEqual(before.attributed);
        // Analyze measures waste per open tab against the live mute set, so its roll-up carries none;
        // a Snapshot hands back the one that was frozen at save.
        expect(after.total).toEqual({ ...before.total, waste: frozenWaste });
    });

    it.each(['IN', 'KR'])('%s rebuilds the same Offers and OS rows', (geo) => {
        const before = rollupIn(golden, geo).allocation;
        const after = rollupIn(goldenRebuilt, geo).allocation;

        expect(after.offers).toEqual(before.offers);
        expect(after.os).toEqual(before.os);
        expect(after.unallocated).toEqual(before.unallocated);
        expect(after.offers.length).toBeGreaterThan(1);
        expect(after.os.length).toBeGreaterThan(1);
    });

    it.each(['IN', 'KR'])('%s rebuilds the same Creative rows, real impressions and all', (geo) => {
        const thresholds = GOLDEN_THRESHOLDS[geo];
        const before = creativesFor(factsIn(golden, geo), golden.campaignCreatives, thresholds);
        const after = creativesFor(factsIn(goldenRebuilt, geo), goldenRebuilt.campaignCreatives, thresholds);

        expect(after).toEqual(before);
        expect(after.length).toBeGreaterThan(1);
        expect(
            after.some((row) => {
                return row.impressions > 0;
            })
        ).toBe(true);
    });

    it.each(['IN', 'KR'])('%s rebuilds the same account totals', (geo) => {
        const thresholds = GOLDEN_THRESHOLDS[geo];
        const before = accountsFor(factsIn(golden, geo), thresholds, REVIEW_MULTIPLIER);
        const after = accountsFor(factsIn(goldenRebuilt, geo), thresholds, REVIEW_MULTIPLIER);

        expect(after).toEqual(before);
        expect(after.length).toBeGreaterThan(0);
    });

    it('rebuilds the same Problem Accounts', () => {
        expect(goldenRebuilt.problemAccounts).toEqual(golden.problemAccounts);
        expect(goldenRebuilt.problemAccounts.length).toBeGreaterThan(0);
    });

    it('claims no unclaimed accounts, rather than claiming they are all unclaimed', () => {
        // A Snapshot freezes the resolved commission RATE, not the Seller map behind it. Running the
        // ingest-time detector over an empty Seller map would name every account in the report.
        expect(golden.unclaimedAccounts.length).toBeGreaterThan(0);
        expect(goldenRebuilt.unclaimedAccounts).toEqual([]);
    });
});

// ── A hand-built market ─────────────────────────────────────────────────────────────────────────
// The golden files have untagged installs but no untagged REVENUE, which is the one figure a Frozen
// Geo Rollup exists for. This fixture puts every awkward case in one small market: untagged revenue,
// an Unfired-Macro row, a campaign with two creatives, and a campaign with two offers and two OS.

const HAND_FB = [
    'Country,Account ID,Campaign ID,Ad name,Amount spent (USD),Impressions,Reporting starts,Reporting ends',
    'BR,acc1,c1,BR_10 [Game],40,4000,2026-07-01,2026-07-01',
    'BR,acc1,c1,BR_11 [Game],60,6000,2026-07-01,2026-07-01',
    'BR,acc2,c2,BR_12 [Game],100,5000,2026-07-01,2026-07-01',
].join('\n');

const HAND_KT_MAIN = [
    'Country;Sub ID 2;Sub ID 4;Sub ID 5;Offer ID;Offer;OS;Clicks;UC (campaign);Conv.;Sales;Revenue',
    'Brazil;c1;acc1;BR_10;o1;BR | Alpha;Android;50;20;10;2;300',
    'Brazil;c1;acc1;BR_10;o2;BR | Beta;iOS;30;10;4;1;150',
    'Brazil;c2;acc2;BR_12;o1;BR | Alpha;Android;40;15;5;0;60',
    // Untagged: every Sub ID empty, Country/Offer/OS real. Its revenue rides in the Geo Total and in
    // nothing else — no Fact will ever carry it (ADR-0003).
    'Brazil;;;;o1;BR | Alpha;Android;12;6;3;1;90',
    // Unfired Macro: Campaign lost, Account/Creative/Offer/OS/Geo intact (ADR-0012).
    'Brazil;{sub2};acc3;BR_20;o3;BR | Gamma;Android;8;4;2;1;120',
].join('\n');

const HAND_KT_CLICKS = [
    'Country;Sub ID 2;Sub ID 4;Sub ID 5;OS;UC (campaign);ROI (confirmed)',
    'Brazil;c1;acc1;BR_10;Android;35;0',
    'Brazil;c1;acc1;BR_10;iOS;15;0',
    'Brazil;c2;acc2;BR_12;Android;25;0',
    'Brazil;;;;Android;7;0',
    'Brazil;{sub2};acc3;BR_20;Android;5;0',
].join('\n');

const HAND_THRESHOLDS: Record<string, GeoThresholds> = {
    BR: { installs: pair(2, 4), regs: pair(5, 10), sales: pair(30, 60), clicks: pair(0.2, 0.5) },
};

const hand = analyze([HAND_FB, HAND_KT_MAIN, HAND_KT_CLICKS], ruleset(HAND_THRESHOLDS));
const handInput = plan(hand, HAND_THRESHOLDS);
const handRebuilt = rebuild(handInput);

describe('analyzeSnapshot — the awkward cases round-trip', () => {
    it('the fixture really carries untagged revenue, an unfired macro and a split campaign', () => {
        const before = rollupIn(hand, 'BR');
        expect(before.metrics.revenue - before.attributed.revenue).toBeCloseTo(90, 6);
        expect(
            hand.facts.some((fact) => {
                return fact.attribution === 'campaign-lost';
            })
        ).toBe(true);
        expect(hand.campaignCreatives.get('c1')?.size).toBe(2);
        expect(hand.campaignModels.get('c1')?.offer.size).toBe(2);
        expect(hand.campaignModels.get('c1')?.os.size).toBe(2);
    });

    it('the Geo Total survives the round trip, untagged revenue and all', () => {
        const before = rollupIn(hand, 'BR');
        const after = rollupIn(handRebuilt, 'BR');

        expect(after.metrics).toEqual(before.metrics);
        expect(after.attributed).toEqual(before.attributed);
        expect(after.total?.revenue).toBeCloseTo(before.metrics.revenue, 6);
        // The proof it came off the Frozen Geo Rollup and not the Facts.
        expect(after.total?.revenue).toBeGreaterThan(after.attributed.revenue);
    });

    it('the Unfired-Macro fact keeps its attribution, so the Problem Account detector still skips it', () => {
        const lost = handRebuilt.facts.filter((fact) => {
            return fact.attribution === 'campaign-lost';
        });
        expect(lost).toHaveLength(1);
        expect(lost[0].spend).toBe(0);
        expect(lost[0].account).toBe('acc3');
        // Its revenue counts in the Geo, Offer, OS and Creative tables, and nowhere near the accounts.
        expect(
            accountsFor(factsIn(handRebuilt, 'BR'), HAND_THRESHOLDS.BR, REVIEW_MULTIPLIER).some((account) => {
                return account.account === 'acc3';
            })
        ).toBe(false);
        expect(handRebuilt.problemAccounts).toEqual(hand.problemAccounts);
    });

    it('the split campaign rebuilds its Creative rows, with real impressions behind CTR and CPM', () => {
        const before = creativesFor(factsIn(hand, 'BR'), hand.campaignCreatives, HAND_THRESHOLDS.BR);
        const after = creativesFor(factsIn(handRebuilt, 'BR'), handRebuilt.campaignCreatives, HAND_THRESHOLDS.BR);

        expect(after).toEqual(before);
        expect(
            after.map((row) => {
                return row.key;
            })
        ).toEqual(expect.arrayContaining(['BR_10', 'BR_11', 'BR_12', 'BR_20']));
        expect(
            after.find((row) => {
                return row.key === 'BR_10';
            })?.impressions
        ).toBe(4000);
    });

    it('both allocations rebuild — several offers and several OS values', () => {
        const before = rollupIn(hand, 'BR').allocation;
        const after = rollupIn(handRebuilt, 'BR').allocation;

        expect(after).toEqual(before);
        expect(
            after.offers.map((row) => {
                return row.key;
            })
        ).toEqual(expect.arrayContaining(['o1', 'o2', 'o3']));
        expect(
            after.os.map((row) => {
                return row.key;
            })
        ).toEqual(expect.arrayContaining(['Android', 'iOS']));
    });

    it('the account totals rebuild', () => {
        expect(accountsFor(factsIn(handRebuilt, 'BR'), HAND_THRESHOLDS.BR, REVIEW_MULTIPLIER)).toEqual(
            accountsFor(factsIn(hand, 'BR'), HAND_THRESHOLDS.BR, REVIEW_MULTIPLIER)
        );
    });
});

describe('analyzeSnapshot — a Snapshot that froze no Geo Rollup', () => {
    // A Snapshot pushed before ADR-0015. Its Untagged Revenue is gone for good.
    const older = rebuild(handInput, { geoRollups: [] });

    it('reports Geo Total, Profit, ROI and Waste as unknown rather than as an Attributed sum', () => {
        const rollup = rollupIn(older, 'BR');
        expect(rollup.total).toBeNull();
        // The untagged $90 must not reappear anywhere, least of all as a Geo Total.
        expect(rollup.metrics.revenue).toBeCloseTo(rollup.attributed.revenue, 6);
        expect(rollup.metrics.revenue).toBeLessThan(rollupIn(hand, 'BR').metrics.revenue);
    });

    it('still rebuilds everything that does not depend on the untagged rows', () => {
        expect(rollupIn(older, 'BR').attributed).toEqual(rollupIn(hand, 'BR').attributed);
        expect(rollupIn(older, 'BR').allocation).toEqual(rollupIn(hand, 'BR').allocation);
        expect(older.problemAccounts).toEqual(hand.problemAccounts);
        expect(creativesFor(factsIn(older, 'BR'), older.campaignCreatives, HAND_THRESHOLDS.BR)).toEqual(
            creativesFor(factsIn(hand, 'BR'), hand.campaignCreatives, HAND_THRESHOLDS.BR)
        );
        expect(accountsFor(factsIn(older, 'BR'), HAND_THRESHOLDS.BR, REVIEW_MULTIPLIER)).toEqual(
            accountsFor(factsIn(hand, 'BR'), HAND_THRESHOLDS.BR, REVIEW_MULTIPLIER)
        );
    });
});

describe('analyzeSnapshot — a Snapshot that froze no ruleset', () => {
    // The rest of what a pre-ADR-0015 Snapshot is missing: the copied thresholds and the copied
    // shared settings. Its rows grade neutral, exactly as an ungraded Geo does on the Analyze screen.
    // Built on the golden files because they DO raise Problem Accounts when graded — so "none" here
    // is the ruleset being absent, not the data being quiet.
    const ungraded = rebuild(goldenInput, {
        settings: null,
        geos: goldenInput.geos.map((geo) => {
            return { geo: geo.geo, presetVersionId: geo.presetVersionId, thresholds: null };
        }),
    });

    it('grades neutral rather than crashing or re-grading with someone else’s thresholds', () => {
        expect(golden.problemAccounts.length).toBeGreaterThan(0);
        expect(ungraded.problemAccounts).toEqual([]);
    });

    it('still reports the money, which never depended on the ruleset', () => {
        // Spend⁺ was priced at save and rides on the Facts; the Geo Total rides on the frozen rollup.
        expect(rollupIn(ungraded, 'IN').metrics).toEqual(rollupIn(golden, 'IN').metrics);
        expect(rollupIn(ungraded, 'IN').allocation).toEqual(rollupIn(golden, 'IN').allocation);
    });
});

describe('analyzeSnapshot — a Geo that bought nothing on Facebook', () => {
    // Every macro in this market failed, so no Facebook row joined and the Geo's Spend⁺ is 0. Its
    // cost-per line is then all zeroes, which is exactly why the Geo Total's funnel is frozen outright
    // instead of being read back out of that line (ADR-0003).
    const FB = [
        'Country,Account ID,Campaign ID,Ad name,Amount spent (USD),Impressions,Reporting starts,Reporting ends',
        'IN,acc1,c9,IN_1 [Game],10,1000,2026-07-01,2026-07-01',
    ].join('\n');
    const KT_MAIN = [
        'Country;Sub ID 2;Sub ID 4;Sub ID 5;Offer ID;Offer;OS;Clicks;UC (campaign);Conv.;Sales;Revenue',
        'India;c9;acc1;IN_1;o1;IN | Alpha;Android;10;5;2;1;40',
        'Portugal;{sub2};acc9;PT_1;o1;PT | Alpha;Android;9;4;2;1;120',
        'Portugal;;;;o1;PT | Alpha;Android;12;6;3;1;90',
    ].join('\n');
    const KT_CLICKS = [
        'Country;Sub ID 2;Sub ID 4;Sub ID 5;OS;UC (campaign);ROI (confirmed)',
        'India;c9;acc1;IN_1;Android;8;0',
        'Portugal;{sub2};acc9;PT_1;Android;5;0',
        'Portugal;;;;Android;7;0',
    ].join('\n');
    const thresholds: Record<string, GeoThresholds> = {
        IN: { installs: pair(2, 4), regs: pair(5, 10), sales: pair(30, 60), clicks: pair(0.2, 0.5) },
        PT: { installs: pair(2, 4), regs: pair(5, 10), sales: pair(30, 60), clicks: pair(0.2, 0.5) },
    };

    const live = analyze([FB, KT_MAIN, KT_CLICKS], ruleset(thresholds));
    const rebuilt = rebuild(plan(live, thresholds));

    it('really has a zero-Spend⁺ Geo carrying untagged revenue', () => {
        expect(rollupIn(live, 'PT').metrics.spendPlus).toBe(0);
        expect(rollupIn(live, 'PT').metrics.revenue).toBeGreaterThan(rollupIn(live, 'PT').attributed.revenue);
    });

    it('rebuilds its Geo Total funnel, not its Attributed one', () => {
        expect(rollupIn(rebuilt, 'PT').metrics).toEqual(rollupIn(live, 'PT').metrics);
        expect(rollupIn(rebuilt, 'PT').metrics.installs).toBeGreaterThan(rollupIn(rebuilt, 'PT').attributed.installs);
    });
});
