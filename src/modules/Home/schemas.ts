import { z } from 'zod';
import { HOME_PERIODS } from './utils/period';

// The Home page's search params (offers-and-home/13). The feed's `range`/`from`/`to` names with the
// Home token vocabulary; `.catch()` throughout per repo convention, so a stale token or a mangled
// date opens on this month rather than throwing the page away.

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const homeSearchSchema = z.object({
    range: z.enum(HOME_PERIODS).catch('month').default('month'),
    // Meaningful only for `custom`; a missing edge resolves to today (`resolvePeriod`).
    from: calendarDateSchema.optional().catch(undefined),
    to: calendarDateSchema.optional().catch(undefined),
});
