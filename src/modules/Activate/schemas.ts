import { z } from 'zod';

// Client-side activation form: password strength floor + confirmation match. The server re-validates
// the password (activateInputSchema); confirmation is UI-only.
export type ActivateFormValues = z.infer<typeof activateFormSchema>;
export const activateFormSchema = z
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
