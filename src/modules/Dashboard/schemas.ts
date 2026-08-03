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

// The archive asks a lookup question — "what happened last week" — so it opens on a window wide
// enough to have something in it. Same token vocabulary and same param names as the feed, which is
// what lets a link between the two pages carry the current range verbatim (spec story 21).
export const archiveSearchSchema = z.object({
    range: z.enum(RANGE_TOKENS).catch('7d').default('7d'),
    from: calendarDateSchema.optional().catch(undefined),
    to: calendarDateSchema.optional().catch(undefined),
    // Narrows the archive to one person — the feed's "all reports by this buyer" entry. Absent means
    // everybody. Not a permission: the roster it filters is already scoped on the server, so an id
    // from outside it matches nobody rather than revealing one.
    user: z.string().optional().catch(undefined),
});
