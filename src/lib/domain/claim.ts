// Advertiser Claim rates (offers-and-home/07). The advertiser's declared installs, Registrations and
// Sales against the Payout fixed at creation (ADR-0027) — promised figures, never measured ones,
// so nothing here touches a Snapshot. Rates are percent points like every other rate in the app;
// claimed EPC is Sales × Payout ÷ installs, the money the promise implies per install.

// Each figure is optional: a claim is whatever the advertiser stated. `null` means "not declared".
export type AdvertiserClaim = {
    installs: number | null;
    regs: number | null;
    sales: number | null;
};

// `null` whenever an input is missing, a denominator is zero, or (EPC only) the Payout is still
// `fx_pending` — the UI renders it as N/A, never as 0.
export type ClaimRates = {
    i2r: number | null;
    r2s: number | null;
    i2s: number | null;
    epc: number | null;
};

const ratioPercent = (numerator: number | null, denominator: number | null): number | null => {
    if (numerator === null || denominator === null || denominator === 0) {
        return null;
    }

    return (numerator / denominator) * 100;
};

export function claimRates(claim: AdvertiserClaim, payoutUsd: number | null): ClaimRates {
    const epc =
        claim.sales === null || claim.installs === null || claim.installs === 0 || payoutUsd === null
            ? null
            : (claim.sales * payoutUsd) / claim.installs;

    return {
        i2r: ratioPercent(claim.regs, claim.installs),
        r2s: ratioPercent(claim.sales, claim.regs),
        i2s: ratioPercent(claim.sales, claim.installs),
        epc,
    };
}

// A card "has a claim" once the advertiser declared anything at all (PRD story 14, 35).
export function hasClaim(claim: AdvertiserClaim): boolean {
    return claim.installs !== null || claim.regs !== null || claim.sales !== null;
}

// ---- Claim Gap (offers-and-home/12) --------------------------------------------------------------

// The offer's measured funnel: the Attributed rows summed over every buyer the viewer sees, all time.
export type ActualFunnel = {
    installs: number;
    regs: number;
    sales: number;
    revenue: number;
};

// The same four rates read off what happened. Actual EPC is revenue ÷ installs — the money the
// offer actually made per install, against the claimed EPC's Payout-implied one.
export function actualRates(funnel: ActualFunnel): ClaimRates {
    return {
        i2r: ratioPercent(funnel.regs, funnel.installs),
        r2s: ratioPercent(funnel.sales, funnel.regs),
        i2s: ratioPercent(funnel.sales, funnel.installs),
        epc: funnel.installs === 0 ? null : funnel.revenue / funnel.installs,
    };
}

const CLAIM_GAP_METRICS = ['i2r', 'r2s', 'i2s', 'epc'] as const;

export type ClaimGapMetric = (typeof CLAIM_GAP_METRICS)[number];

// Below 0.8 of the promise is red, above 1.2 green; the band between is neutral — the edges included.
const CLAIM_GAP_RED_BELOW = 0.8;
const CLAIM_GAP_GREEN_ABOVE = 1.2;

export type ClaimGapTone = 'red' | 'green' | 'neutral';

export type ClaimGapRow = {
    metric: ClaimGapMetric;
    claimed: number;
    actual: number;
    // actual ÷ claimed: 1 is the promise kept exactly.
    gap: number;
    tone: ClaimGapTone;
};

export function claimGapTone(gap: number): ClaimGapTone {
    if (gap < CLAIM_GAP_RED_BELOW) {
        return 'red';
    }

    if (gap > CLAIM_GAP_GREEN_ABOVE) {
        return 'green';
    }

    return 'neutral';
}

// One row per rate both sides can say something about; a claimed 0 has nothing to be measured
// against and drops too. No rows means no block — the caller renders nothing (PRD story 22).
export function claimGap(claimed: ClaimRates, actual: ClaimRates): ClaimGapRow[] {
    return CLAIM_GAP_METRICS.flatMap((metric): ClaimGapRow[] => {
        const promised = claimed[metric];
        const measured = actual[metric];

        if (promised === null || promised === 0 || measured === null) {
            return [];
        }

        const gap = measured / promised;

        return [{ metric, claimed: promised, actual: measured, gap, tone: claimGapTone(gap) }];
    });
}
