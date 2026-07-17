import { z } from 'zod';

export type LoginInput = z.infer<typeof loginInputSchema>;
export const loginInputSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, { error: 'This field is required' })
        .pipe(z.email({ error: 'Invalid email' })),
    password: z.string().min(1, { error: 'This field is required' }),
});
