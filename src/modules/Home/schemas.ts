import { z } from 'zod';
import { MAP_FILL_MODES } from '@/lib/domain/mapFill';
import { HOME_PERIODS } from './utils/period';

// The Home page's search params (offers-and-home/13, 14). The feed's `range`/`from`/`to` names with
// the Home token vocabulary, plus the opened country; `.catch()` throughout per repo convention, so
// a stale token or a mangled date opens on this month rather than throwing the page away.

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const homeSearchSchema = z.object({
    range: z.enum(HOME_PERIODS).catch('month').default('month'),
    // Meaningful only for `custom`; a missing edge resolves to today (`resolvePeriod`).
    from: calendarDateSchema.optional().catch(undefined),
    to: calendarDateSchema.optional().catch(undefined),
    // How strong each market's wash is (slice 15); the colour is the zone in every mode.
    mode: z.enum(MAP_FILL_MODES).catch('profitability').default('profitability'),
    // The market opened in the panel (slice 14), ISO alpha-2, so a country view is a link.
    country: z
        .string()
        .regex(/^[A-Z]{2}$/)
        .optional()
        .catch(undefined),
});
