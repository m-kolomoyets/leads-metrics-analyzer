import type { OfferCardView } from '@/services/offers/types';

const usdFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const originalFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// The Payout as the list shows it: USD first (ADR-0027), the original beside it only when it was
// declared in another currency. A pending rate has no USD figure yet — say so rather than show 0.
export const formatPayoutUsd = (card: OfferCardView): string => {
    return card.payoutUsd === null ? 'rate pending' : usdFormat.format(card.payoutUsd);
};

export const formatPayoutOriginal = (card: OfferCardView): string | null => {
    if (card.payoutCurrency === 'USD') {
        return null;
    }

    return `${originalFormat.format(card.payoutOriginal)} ${card.payoutCurrency}`;
};
