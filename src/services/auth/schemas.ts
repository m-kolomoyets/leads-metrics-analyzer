import { z } from 'zod';

// Minimum password strength for activation (T4c). Kept simple per spec — length floor only, no
// composition rules.
const passwordSchema = z.string().min(8, { error: 'Password must be at least 8 characters' });

export type ActivateInput = z.infer<typeof activateInputSchema>;
export const activateInputSchema = z.object({
    token: z.string().min(1, { error: 'Missing invitation token' }),
    password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export const loginInputSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, { error: 'This field is required' })
        .pipe(z.email({ error: 'Invalid email' })),
    password: z.string().min(1, { error: 'This field is required' }),
});
