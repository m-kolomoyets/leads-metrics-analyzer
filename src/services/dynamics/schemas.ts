import { z } from 'zod';

// Input validators for the Dynamics reads. The day arrives as a resolved calendar date: which day
// "today" is depends on the Kyiv business day (ADR-0017), and that resolution is viewer-local, so
// the server only ever sees a concrete `YYYY-MM-DD`.

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Date must be YYYY-MM-DD' });

export const dynamicsDayInputSchema = z.object({
    buyerId: z.string().min(1),
    reportDate: calendarDateSchema,
});

export const dynamicsRosterInputSchema = z.object({
    reportDate: calendarDateSchema,
});

export type DynamicsDayInput = z.infer<typeof dynamicsDayInputSchema>;
export type DynamicsRosterInput = z.infer<typeof dynamicsRosterInputSchema>;

// The Designer/BDM day read (#10). The dimension is asked for explicitly rather than derived from the
// caller's role on the server, so that a Designer asking for offers is a request that can be REFUSED
// (`assertRollupRead`) instead of one silently rewritten into the only table they may see.
export const dynamicsDimensionDayInputSchema = z.object({
    buyerId: z.string().min(1),
    reportDate: calendarDateSchema,
    dimension: z.enum(['creative', 'offer']),
});

export type DynamicsDimensionDayInput = z.infer<typeof dynamicsDimensionDayInputSchema>;

// The month behind the member cards' dot grids. The range arrives already resolved, for the same
// reason the day does: which month "this month" is depends on the Kyiv business day (ADR-0017), and
// that resolution is viewer-local.
export const dynamicsHistoryInputSchema = z.object({
    from: calendarDateSchema,
    to: calendarDateSchema,
});

export type DynamicsHistoryInput = z.infer<typeof dynamicsHistoryInputSchema>;
