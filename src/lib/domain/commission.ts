// 5 · Rulesets — Commission (doc 03 §Sellers, doc 05). Resolve the per-Account commission rate that
// feeds Spend⁺. An Account belongs to exactly one Seller at one rate; unclaimed Accounts fall to the
// default and are surfaced as a warning, never silently defaulted. Pure arithmetic → lives with it.

export type SellerRule = {
    // Fractional rate, e.g. 0.06 for 6 %.
    rate: number;
    accountIds: string[];
};

export type CommissionConfig = {
    // Fractional default rate applied to any Account no Seller claims.
    defaultCommission: number;
    sellers: SellerRule[];
};

// The rate for one Account: the first Seller rule that lists it, else the default. Case-sensitive —
// Account IDs are opaque strings.
export function rateFor(account: string, config: CommissionConfig): number {
    for (const seller of config.sellers) {
        if (seller.accountIds.includes(account)) {
            return seller.rate;
        }
    }
    return config.defaultCommission;
}

// Accounts no Seller claims (deduped, in first-seen order). Surfaced as a warning so a new account
// from a 10 % seller is never costed at the default unnoticed.
export function unclaimedAccounts(accounts: Iterable<string>, config: CommissionConfig): string[] {
    const claimed = new Set(
        config.sellers.flatMap((s) => {
            return s.accountIds;
        })
    );
    const out: string[] = [];
    const seen = new Set<string>();
    for (const account of accounts) {
        if (account === '' || claimed.has(account) || seen.has(account)) {
            continue;
        }
        seen.add(account);
        out.push(account);
    }
    return out;
}
