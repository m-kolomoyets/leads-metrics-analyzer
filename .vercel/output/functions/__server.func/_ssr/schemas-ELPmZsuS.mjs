import { e as email, o as object, s as string } from '../_libs/zod.mjs';

const passwordSchema = string().min(8, { error: 'Password must be at least 8 characters' });
const activateInputSchema = object({
    token: string().min(1, { error: 'Missing invitation token' }),
    password: passwordSchema,
});
const loginInputSchema = object({
    email: string()
        .trim()
        .min(1, { error: 'This field is required' })
        .pipe(email({ error: 'Invalid email' })),
    password: string().min(1, { error: 'This field is required' }),
});
export { activateInputSchema as a, loginInputSchema as l };
