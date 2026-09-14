import type { OfferStringFragment } from '@/lib/domain/offerString';

// What the author reads when a fragment of the string could not be parsed (PRD story 6). Names
// the fragment and what the parser looked for, so the fix is obvious.
export const PARSE_FAILURE_MESSAGES: Record<OfferStringFragment, string> = {
    payout: 'No payout found — the string needs an amount in USD or EUR, e.g. "27 USD".',
    assignment: 'No assignment found — the string must end with "| Team | Recipient".',
};

// The anchor a card renders under, so a duplicate refusal can link straight to the live one.
export const offerCardAnchor = (offerCardId: string) => {
    return `offer-${offerCardId}`;
};
