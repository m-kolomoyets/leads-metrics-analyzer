import { z } from 'zod';

// Client-side reset form: password strength floor + confirmation match. The server re-validates the
// password (resetPasswordInputSchema); confirmation is UI-only. Mirrors `Activate/schemas.ts`.
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export const resetPasswordFormSchema = z
    .object({
        password: z.string().min(8, { error: 'Password must be at least 8 characters' }),
        confirmPassword: z.string().min(1, { error: 'Please confirm your password' }),
    })
    .refine(
        (value) => {
            return value.password === value.confirmPassword;
        },
        { error: 'Passwords do not match', path: ['confirmPassword'] }
    );
