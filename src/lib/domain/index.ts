import type { CampaignCreatives, CampaignModel, RawFact, RawTotals } from './join';
import type { ParsedFiles } from './parse';
import type { GeoRollup } from './rollup';
import type { Fact, Ruleset, Totals } from './types';
import type { ProblemAccount } from './verdict';
import { spendPlus, sumTotals } from './aggregate';
import { rateFor } from './commission';
import { join } from './join';
import { parseFiles } from './parse';
import { rollUp } from './rollup';
import { verdictFor } from './verdict';

// The compute layer's public entry (ADR-0010): raw CSV text → graded facts + roll-ups, pure. Data
// flows parse → join → commission → aggregate → verdict. No React, no DB, no transport. The roll-up
// half lives in `rollup.ts` and is shared verbatim with `analyzeSnapshot` (snapshot.ts).

export type { GeoRollup, GeoTotal } from './rollup';
export type { Ruleset } from './types';

export type AnalyzeResult = {
    facts: Fact[];
    geos: GeoRollup[];
    // Per-campaign FB creative Spend/Impressions (#35). The per-Geo Creative table (`creativesFor`)
    // allocates the funnel over these; kept raw here since grading depends on the UI-active preset.
    campaignCreatives: Map<string, CampaignCreatives>;
    // Per-campaign Offer/OS funnel breakdown (doc 06) — the input `allocation` is derived from. Kept
    // on the result so a Snapshot can persist it: it sits below the Fact Grain, so without it a saved
    // report has the Offers/OS totals but no way to reproduce their rows (ADR-0015).
    campaignModels: Map<string, CampaignModel>;
    problemAccounts: ProblemAccount[];
    // Accounts no Seller claims → costed at the default (surface, doc 03 §Sellers).
    unclaimedAccounts: string[];
    warnings: ReturnType<typeof join>['warnings'];
    parseWarnings: ReturnType<typeof parseFiles>['warnings'];
};

// Lift a RawFact to a full Fact: add per-Account Spend⁺ and the campaign Verdict/zone.
function gradeFact(raw: RawFact, ruleset: Ruleset): Fact {
    const commission = rateFor(raw.account, ruleset.commission);
    const sp = spendPlus(raw.spend, commission);
    const totals: Totals = {
        spend: raw.spend,
        spendPlus: sp,
        revenue: raw.revenue,
        linkClicks: raw.linkClicks,
        installs: raw.installs,
        regs: raw.regs,
        sales: raw.sales,
    };
    const thresholds = ruleset.thresholds[raw.geo];
    const verdict = thresholds
        ? verdictFor(totals, thresholds)
        : { verdict: 'neutral' as const, zone: 'neutral' as const };
    return {
        attribution: raw.attribution,
        campaign: raw.campaign,
        creative: raw.creative,
        reportDate: raw.reportDate,
        geo: raw.geo,
        account: raw.account,
        offer: raw.offer,
        os: raw.os,
        spend: raw.spend,
        spendPlus: sp,
        revenue: raw.revenue,
        linkClicks: raw.linkClicks,
        installs: raw.installs,
        regs: raw.regs,
        sales: raw.sales,
        verdict: verdict.verdict,
        zone: verdict.zone,
    };
}

// A RawTotals (untagged bucket) as a Totals: untagged rows carry no FB spend, so spend/Spend⁺ = 0.
function untaggedTotals(raw: RawTotals): Totals {
    return { ...raw, spend: 0, spendPlus: 0 };
}

// Grade an already-parsed batch: join → commission → aggregate → verdict. The heavy CSV parse is
// hoisted to the caller (parse-once at ingest); this re-runs cheaply on every ruleset change.
export function analyzeParsed(parsed: ParsedFiles, ruleset: Ruleset): AnalyzeResult {
    const { facts: rawFacts, geoUntagged, campaignModels, campaignCreatives, warnings } = join(parsed);
    const facts = rawFacts.map((raw) => {
        return gradeFact(raw, ruleset);
    });

    // Roll up per Geo, through the half both entry points share. The Geo Total is Attributed plus the
    // Geo's untagged bucket (ADR-0003) — always knowable here, since the untagged rows are right in
    // front of us. Waste is left unset: Analyze measures it per open tab against the live mute set.
    const { geos, problemAccounts, unclaimedAccounts } = rollUp(
        {
            facts,
            geoTotalFor(geo, attributed) {
                const untagged = geoUntagged.get(geo);
                return untagged ? sumTotals([attributed, untaggedTotals(untagged)]) : attributed;
            },
            geoWaste: new Map(),
            campaignModels,
        },
        ruleset
    );

    return {
        facts,
        geos,
        campaignCreatives,
        campaignModels,
        problemAccounts,
        unclaimedAccounts,
        warnings,
        parseWarnings: parsed.warnings,
    };
}

// Convenience entry: parse raw CSV text then grade in one call. The UI hoists the parse to ingest and
// calls `analyzeParsed` directly (so preset edits skip the re-parse); this stays for tests/batch use.
export function analyze(texts: string[], ruleset: Ruleset): AnalyzeResult {
    return analyzeParsed(parseFiles(texts), ruleset);
}
