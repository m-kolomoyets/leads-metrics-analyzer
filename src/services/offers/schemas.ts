import { z } from 'zod';
import { RATING_PERIODS } from '@/lib/domain/offerRating';

// Zod input schemas for the Offers API (offers-and-home/04). Validated at the server-function
// boundary (`inputValidator`) so handlers can trust the shape; the offer string itself is parsed
// by `domain/offerString` inside the handler, not here — its failures name a fragment, not a field.

const REQUIRED_MESSAGE = 'This field is required';

export type CreateOfferCardInput = z.infer<typeof createOfferCardInputSchema>;
export const createOfferCardInputSchema = z.object({
    // The external Keitaro offer id (`13002`) — pasted beside the string, not read out of it.
    offerId: z.string().trim().min(1, { error: REQUIRED_MESSAGE }),
    rawString: z.string().trim().min(1, { error: REQUIRED_MESSAGE }),
});

export type RetryOfferFxInput = z.infer<typeof retryOfferFxInputSchema>;
export const retryOfferFxInputSchema = z.object({
    offerCardId: z.uuid(),
});

export type OfferCardIdInput = z.infer<typeof offerCardIdInputSchema>;
export const offerCardIdInputSchema = z.object({
    offerCardId: z.uuid(),
});

export type ChangeOfferAssignmentInput = z.infer<typeof changeOfferAssignmentInputSchema>;
export const changeOfferAssignmentInputSchema = z.object({
    offerCardId: z.uuid(),
    teamId: z.uuid(),
    // Null assigns the whole team (offers-and-home/06).
    buyerUserId: z.uuid().nullable(),
});

export const OFFER_COMMENT_MAX_LENGTH = 2000;

const commentBody = z
    .string()
    .trim()
    .min(1, { error: REQUIRED_MESSAGE })
    .max(OFFER_COMMENT_MAX_LENGTH, { error: `At most ${OFFER_COMMENT_MAX_LENGTH} characters` });

export type AddOfferCommentInput = z.infer<typeof addOfferCommentInputSchema>;
export const addOfferCommentInputSchema = z.object({
    offerCardId: z.uuid(),
    body: commentBody,
});

export type EditOfferCommentInput = z.infer<typeof editOfferCommentInputSchema>;
export const editOfferCommentInputSchema = z.object({
    entryId: z.uuid(),
    body: commentBody,
});

export type OfferThreadEntryIdInput = z.infer<typeof offerThreadEntryIdInputSchema>;
export const offerThreadEntryIdInputSchema = z.object({
    entryId: z.uuid(),
});

export type SetOfferDeadlineInput = z.infer<typeof setOfferDeadlineInputSchema>;
export const setOfferDeadlineInputSchema = z.object({
    offerCardId: z.uuid(),
    // `YYYY-MM-DD`, or null to clear (slice 09).
    deadline: z.iso.date().nullable(),
});

export type OfferRatingInputData = z.infer<typeof offerRatingInputSchema>;
export const offerRatingInputSchema = z.object({
    // The external Keitaro offer id the card is keyed by — the Campaign Model's `key`.
    offerId: z.string().trim().min(1),
    period: z.enum(RATING_PERIODS),
});
