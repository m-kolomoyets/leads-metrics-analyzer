import { z } from 'zod';
import { RANGE_TOKENS } from './types';

// The Report surfaces' search params. `.catch()` throughout per repo convention: the range is a
// shareable link's payload, so a stale token or a malformed date falls back to the default window
// rather than throwing a page away. The feed defaults to `1d` — opening the app answers "today".

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const reportSearchSchema = z.object({
    // Defaulted as well as caught, so `<Link to="/dashboard" />` needs no search object at all: the
    // feed's answer to "no range asked for" is the same as its answer to a broken one — today.
    range: z.enum(RANGE_TOKENS).catch('1d').default('1d'),
    // Meaningful only for `custom`; a missing edge resolves to today (`resolveRange`).
    from: calendarDateSchema.optional().catch(undefined),
    to: calendarDateSchema.optional().catch(undefined),
});
