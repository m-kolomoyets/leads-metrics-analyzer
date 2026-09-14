import { z } from 'zod';

// The Offers directory's search params (offers-and-home/05). Same convention as the feed's range:
// `.catch()` throughout, so a shared link with a stale or malformed filter opens the directory rather
// than throwing the page away. Every filter is absent by default — "no question asked" is the whole
// live list.

export const OFFER_DEADLINE_FILTERS = ['none', 'any'] as const;
export const OFFER_CLAIM_FILTERS = ['yes', 'no'] as const;

export type OfferDeadlineFilter = (typeof OFFER_DEADLINE_FILTERS)[number];
export type OfferClaimFilter = (typeof OFFER_CLAIM_FILTERS)[number];

const optionalToken = z.string().trim().min(1).optional().catch(undefined);

export type OffersSearch = z.infer<typeof offersSearchSchema>;
export const offersSearchSchema = z.object({
    // Matches the `offer_id` and the raw string, case-insensitively (PRD story 13).
    q: optionalToken,
    // Team and buyer ids; an id outside the viewer's list matches nothing rather than revealing it.
    team: optionalToken,
    buyer: optionalToken,
    // Deadline state and Advertiser Claim presence — placeholders until slices 09 and 07 land the
    // fields: every card reads "no deadline" / "no claim" for now (PRD story 14).
    deadline: z.enum(OFFER_DEADLINE_FILTERS).optional().catch(undefined),
    claim: z.enum(OFFER_CLAIM_FILTERS).optional().catch(undefined),
    // Archived cards are hidden by default and shown INSTEAD of live ones when asked for (story 11).
    archived: z.boolean().catch(false).default(false),
});
