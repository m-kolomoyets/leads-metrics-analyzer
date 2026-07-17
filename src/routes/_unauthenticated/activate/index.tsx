import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { Activate } from '@/modules/Activate';

export const Route = createFileRoute('/_unauthenticated/activate/')({
    // The raw invitation token rides in the URL (T4c). Missing/garbage falls back to '' → the form
    // shows the generic "invalid link" state rather than crashing.
    validateSearch: z.object({
        token: z.string().optional().catch(''),
    }),
    component: Activate,
});
