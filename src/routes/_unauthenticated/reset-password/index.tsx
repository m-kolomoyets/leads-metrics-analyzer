import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ResetPassword } from '@/modules/ResetPassword';

export const Route = createFileRoute('/_unauthenticated/reset-password/')({
    // The raw reset token rides in the URL (T4c). Missing/garbage falls back to '' → the form shows
    // the generic "invalid link" state rather than crashing. Signed-in users are redirected away by
    // the `_unauthenticated` guard.
    validateSearch: z.object({
        token: z.string().optional().catch(''),
    }),
    component: ResetPassword,
});
