import { z } from 'zod';

// Input validator for the Home map read (offers-and-home/13). The period is resolved to two calendar
// dates viewer-side (`resolvePeriod`) — "this month" is a Kyiv question, and the server only ever
// sees a concrete window.

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Date must be YYYY-MM-DD' });

export type HomeRangeInput = z.infer<typeof homeRangeInputSchema>;
export const homeRangeInputSchema = z.object({
    from: calendarDateSchema,
    to: calendarDateSchema,
});
