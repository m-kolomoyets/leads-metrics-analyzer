import { z } from 'zod';

// The Dynamics page's search params. Buyer, geo and day live in the URL so a view is shareable and
// survives a reload, the way the Report feed's range already does (spec story 20).
//
// `.catch()` throughout, per repo convention: every one of these is a shared link's payload, so a
// buyer who has left, a market nobody ran today, or a hand-mangled date falls back rather than
// throwing the page away. The fallbacks themselves live in `utils/frame` and `activeGeo`.

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const dynamicsSearchSchema = z.object({
    // Absent means "whoever the tab row puts first" — which, given problems-first ordering, is the
    // person most worth looking at.
    buyer: z.string().optional().catch(undefined),
    geo: z.string().optional().catch(undefined),
    // Absent means today in Europe/Kyiv, resolved viewer-side (ADR-0017): the server only ever sees
    // a concrete date. Only "today" has a UI today; the param is what makes yesterday's link work.
    day: calendarDateSchema.optional().catch(undefined),
});
