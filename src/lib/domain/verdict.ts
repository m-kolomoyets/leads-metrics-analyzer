import type { GeoThresholds, ThresholdPair, Totals, VerdictReason, Zone } from './types';

// 4 · The Verdict Engine (doc 04). One Campaign's metrics → one action, via the funnel waterfall.
// Grades Spend⁺ cost (doc 03). Returns a structured reason, never a display string (ADR-0004).

// Grade a cost against a threshold pair. Lower is better; `yr` inclusive.
export function zoneFor(cost: number, pair: ThresholdPair): Zone {
    if (cost < pair.gy) {
        return 'green';
    }
    if (cost <= pair.yr) {
        return 'yellow';
    }
    return 'red';
}

export type Verdict = {
    // The campaign action grade (green = scale/БУСТ, yellow = hold, red = stop, neutral = too early).
    verdict: Zone;
    // The ROI/spend grade. ROI bands are deferred (slice 4); until then it mirrors the verdict grade.
    zone: Zone;
    reason: VerdictReason | null;
    // Spend⁺ above the red line for the results achieved (doc 06). Non-zero only for a red verdict;
    // 0 for every other grade — spend below the line is still working toward the next result.
    waste: number;
};

// Stages checked deepest-first; the first with a result decides (doc 04). A clicks-only campaign can
// only be red or neutral — a cheap click is never scale on its own ("чекаємо інстал").
const STAGES = [
    { stage: 'sales', metric: 'cps', count: 'sales', pair: 'sales', clicksOnly: false },
    { stage: 'regs', metric: 'cpr', count: 'regs', pair: 'regs', clicksOnly: false },
    { stage: 'installs', metric: 'cpi', count: 'installs', pair: 'installs', clicksOnly: false },
    { stage: 'clicks', metric: 'cpc', count: 'linkClicks', pair: 'clicks', clicksOnly: true },
] as const;

// The Verdict for one Campaign's summed Totals against its Geo thresholds.
export function verdictFor(totals: Totals, thresholds: GeoThresholds): Verdict {
    for (const s of STAGES) {
        const count = totals[s.count];
        if (count > 0) {
            const cost = totals.spendPlus / count;
            let zone = zoneFor(cost, thresholds[s.pair]);
            // A clicks-judged campaign is never green — it holds at yellow awaiting an install.
            if (s.clicksOnly && zone === 'green') {
                zone = 'yellow';
            }
            // A non-red clicks verdict is the "чекаємо інстал" hold; everything else is a plain grade.
            const reason: VerdictReason =
                s.clicksOnly && zone !== 'red'
                    ? { kind: 'clicksWaiting', stage: 'clicks', metric: 'cpc', value: cost, zone: 'yellow' }
                    : { kind: 'graded', stage: s.stage, metric: s.metric, value: cost, zone };
            return {
                verdict: zone,
                zone,
                reason,
                waste: zone === 'red' ? waste(totals.spendPlus, count, thresholds[s.pair].yr) : 0,
            };
        }
    }

    // Zero-result campaign: red if spend alone exceeds a stage's red line (deepest stage first),
    // else neutral ("рано судити" — too early).
    for (const s of STAGES) {
        if (totals.spendPlus > thresholds[s.pair].yr) {
            return {
                verdict: 'red',
                zone: 'red',
                reason: { kind: 'zeroResult', stage: s.stage, metric: s.metric, value: totals.spendPlus },
                // Zero results past a red line: no achieved count, so the whole Spend⁺ is waste
                // (formula with count 0). Prototype subtracted one red line; this is honest-strict.
                waste: totals.spendPlus,
            };
        }
    }
    // Nothing judged: Spend⁺ = 0 is nothing to analyse; otherwise it is spent-but-too-early.
    const reason: VerdictReason =
        totals.spendPlus === 0 ? { kind: 'spendZero' } : { kind: 'tooEarly', value: totals.spendPlus };
    return { verdict: 'neutral', zone: 'neutral', reason, waste: 0 };
}

// Waste = spend above the red line for the results achieved — only for a red Verdict, else 0.
// Spend below the line is budget still working toward the next result, not waste.
export function waste(spendPlus: number, count: number, yr: number): number {
    return Math.max(0, spendPlus - yr * count);
}

// Account Waste — a Problem Account's waste, measured at ACCOUNT grain against the review-multiplied
// bar, and deliberately NOT the sum of its campaigns' Waste (ADR-0014). Once an account is problem-
// flagged the whole account should have been paused, so every dollar past the bar is lost — including
// dollars spent by campaigns that graded green on their own.
//
// `max(installs, 1)` collapses both rules into one formula: rule 1 (installs 0) bills a single bar,
// and so does the rule-2 case that fires on an Infinity CPI with no installs — which rule 1 declines
// when spend sits under the bar, and which would otherwise bill the whole spend of a $5 account.
// The floor is non-binding for the real cases: each rule's own condition already puts spend past it.
export function accountWaste(
    spendPlus: number,
    installs: number,
    thresholds: GeoThresholds,
    reviewMultiplier: number
): number {
    const bar = reviewMultiplier * thresholds.installs.yr;
    return Math.max(0, spendPlus - bar * Math.max(installs, 1));
}

export type ProblemAccount = {
    account: string;
    // Which alarm fired: money out with nothing tracked, or cost blown with the funnel dead.
    rule: 1 | 2;
};

// Account-level alarm for broken tracking/launch (doc 04), distinct from a red Verdict. Compared to
// the ABSOLUTE `K × installs.yr`, never the geo average (which goes quiet when the market is on fire).
export function problemAccount(
    account: string,
    totals: Totals,
    thresholds: GeoThresholds,
    reviewMultiplier: number
): ProblemAccount | null {
    const yrI = thresholds.installs.yr;
    const bar = reviewMultiplier * yrI;

    // rule 1: money out, nothing tracked.
    if (totals.spendPlus >= bar && totals.installs === 0) {
        return { account, rule: 1 };
    }

    // rule 2: CPI blown, funnel dead past installs (CPR over the red line or no regs), no sales.
    const cpi = totals.installs === 0 ? Infinity : totals.spendPlus / totals.installs;
    const regsDead = totals.regs === 0 || totals.spendPlus / totals.regs > thresholds.regs.yr;
    if (cpi >= bar && regsDead && totals.sales === 0) {
        return { account, rule: 2 };
    }
    return null;
}
