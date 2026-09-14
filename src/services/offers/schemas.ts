import { z } from 'zod';

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
