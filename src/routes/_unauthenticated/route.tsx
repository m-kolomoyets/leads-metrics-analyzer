import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { landingFor } from '@/lib/utils/auth/permissions';
import { meQueryOptions } from '@/services/auth/queries';

export const Route = createFileRoute('/_unauthenticated')({
    validateSearch: z.object({
        // Only accept internal paths ("/…" but not "//…") so a crafted ?redirect=https://evil.com
        // cannot turn login into an open redirect. Anything else falls back to '' (→ the role's landing).
        redirect: z
            .string()
            .refine((value) => {
                return value.startsWith('/') && !value.startsWith('//');
            })
            .optional()
            .catch(''),
    }),
    async beforeLoad({ context: { queryClient }, search }) {
        let me = null;

        try {
            me = await queryClient.ensureQueryData(meQueryOptions());
        } catch {
            // Auth check failed (e.g. transient DB error) — render the login page rather than break it.
        }

        if (me) {
            throw redirect({
                to: search.redirect || landingFor(me.role),
                replace: true,
            });
        }
    },
    component: Outlet,
});
