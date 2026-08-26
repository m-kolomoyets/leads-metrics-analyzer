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
