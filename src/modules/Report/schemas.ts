import { z } from 'zod';

// `.catch()` per repo convention: both params are a shareable link's payload, so a stale or malformed
// value falls back rather than throwing. `geo` falls back to the Snapshot's first market (`activeGeo`
// makes the same call once the Snapshot is known); `from` falls back to the feed, which every role
// that may open a report can also open.
export const reportSearchSchema = z.object({
    geo: z.string().optional().catch(undefined),
    from: z.enum(['dynamics', 'archive', 'dashboard']).optional().catch(undefined),
});
