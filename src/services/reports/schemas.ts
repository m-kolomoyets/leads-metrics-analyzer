import { z } from 'zod';

// Input validator for the Report reads. The range is already resolved to two calendar dates by the
// time it reaches the server — token resolution is viewer-local and therefore a client concern
// (`resolveRange`), and the server only ever sees concrete `from`/`to`.

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Date must be YYYY-MM-DD' });

export const reportRangeInputSchema = z.object({
    from: calendarDateSchema,
    to: calendarDateSchema,
});

export type ReportRangeInput = z.infer<typeof reportRangeInputSchema>;
