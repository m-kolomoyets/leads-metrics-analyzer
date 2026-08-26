import type { z } from 'zod';
import type { reportSearchSchema } from './schemas';

// Where the reader came from. Carried in the URL rather than read off history, so a shared link opens
// with the same way out as the tab that produced it, and a reload does not lose it.
export type ReportOrigin = NonNullable<z.infer<typeof reportSearchSchema>['from']>;
