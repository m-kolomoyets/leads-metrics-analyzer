import type { MeData } from './types';
import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, destroySession, getSessionUser } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { loginInputSchema } from './schemas';

// TanStack Start server functions (ADR-0008). Handlers run server-side; their DB/argon/session
// imports are stripped from the client bundle. Input is Zod-validated via `inputValidator`.

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

// A precomputed Argon2id hash verified when the email is unknown, so the response time does not
// reveal whether an account exists (defeats user enumeration by timing).
const DUMMY_PASSWORD_HASH =
    '$argon2id$v=19$m=19456,t=2,p=1$aD/SRybOA88SOuzoKxdk5Q$TgmabwP9ljp3m87r2CH0zuUVs6ATUUS/TtFxHqHI5j8';

export const loginFn = createServerFn({ method: 'POST' })
    .inputValidator(loginInputSchema)
    .handler(async ({ data }): Promise<MeData> => {
        const [found] = await db
            .select({
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                passwordHash: user.passwordHash,
            })
            .from(user)
            .where(eq(user.email, data.email))
            .limit(1);

        // Always run a verify (against a dummy hash when the email is unknown) so timing is constant
        // and the generic message does not leak whether the account exists.
        const isValid = await verifyPassword(found?.passwordHash ?? DUMMY_PASSWORD_HASH, data.password);

        // Only active accounts can log in — invited (not yet activated) and disabled cannot
        // (spec stories 22, 24).
        if (!found || found.status !== 'active' || !isValid) {
            throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        await createSession(found.id);

        return { id: found.id, email: found.email, role: found.role, status: found.status };
    });

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
    await destroySession();

    return { success: true } as const;
});

export const meFn = createServerFn({ method: 'GET' }).handler((): Promise<MeData | null> => {
    return getSessionUser();
});
