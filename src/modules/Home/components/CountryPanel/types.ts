import type { CountryBuyerRollup, CountryRollup } from '@/lib/domain/periodRollup';

// A buyer's row with the name to print it under.
export type CountryPanelBuyer = CountryBuyerRollup & {
    nickname: string;
};

export type CountryPanelProps = {
    geo: string;
    name: string;
    // The market's own row — the tooltip's figures. Absent when the period has no rows for it: a
    // pasted link to a market the new period does not contain.
    market: CountryRollup | undefined;
    buyers: CountryPanelBuyer[];
    // The first read of the period is still out: nothing to show yet, and nothing to say "no" about.
    isLoading?: boolean;
    onClose: () => void;
};
