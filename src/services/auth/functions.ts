import type { MeData } from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, eq, isNull } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { canRequestPasswordReset, isResetTokenUsable } from '@/lib/auth/passwordResetPolicy';
import { createSession, destroySession, getSessionUser } from '@/lib/auth/session';
import { hashInvitationToken, hashResetToken } from '@/lib/auth/tokenHash';
import { db } from '@/lib/db';
import { invitation, passwordReset, team, user } from '@/lib/db/schema';
import {
    activateInputSchema,
    loginInputSchema,
    requestPasswordResetInputSchema,
    resetPasswordInputSchema,
} from './schemas';

// TanStack Start server functions (ADR-0008). Handlers run server-side; their DB/argon/session
// imports are stripped from the client bundle. Input is Zod-validated via `inputValidator`.

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

// A precomputed scrypt hash verified when the email is unknown, so the response time does not reveal
// whether an account exists (defeats user enumeration by timing). Must match the current scrypt cost
// parameters so the decoy verify does the same work as a real one.
const DUMMY_PASSWORD_HASH =
    'scrypt$65536$8$1$1860bd1ef52a75b2ee3df3c7c2c5e56f$926288038b40142ac9a0b992897f5468c8c65f20c266f6f37710524e21d29d95';

export const loginFn = createServerFn({ method: 'POST' })
    .inputValidator(loginInputSchema)
    .handler(async ({ data }): Promise<MeData> => {
        const [found] = await db
            .select({
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: team.name,
                passwordHash: user.passwordHash,
            })
            .from(user)
            .leftJoin(team, eq(user.teamId, team.id))
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

        return {
            id: found.id,
            email: found.email,
            role: found.role,
            status: found.status,
            teamId: found.teamId,
            teamName: found.teamName,
        };
    });

// Request a password reset (T5, #42): a public endpoint. Anti-enumeration — the response is one
// fixed confirmation regardless of whether the email exists or the account's status, so a probe
// cannot distinguish states. Only an `active` account raises a flag the Head sees; invited / disabled
// / unknown are silent no-ops (status gate lives in the pure `passwordResetPolicy` module). Repeated
// requests collapse to a single pending row via the `user_id` unique upsert.
const PASSWORD_RESET_REQUESTED_MESSAGE = 'If an account exists, your Head has been notified';

export const requestPasswordResetFn = createServerFn({ method: 'POST' })
    .inputValidator(requestPasswordResetInputSchema)
    .handler(async ({ data }): Promise<{ message: string }> => {
        const [found] = await db
            .select({ id: user.id, status: user.status })
            .from(user)
            .where(eq(user.email, data.email))
            .limit(1);

        if (found && canRequestPasswordReset(found.status)) {
            // Upsert the pending flag. A re-request bumps `requested_at` and clears `used_at`/token so
            // the row is pending again — collapsing to one row per user (unique `user_id`).
            await db
                .insert(passwordReset)
                .values({ userId: found.id })
                .onConflictDoUpdate({
                    target: passwordReset.userId,
                    set: { requestedAt: new Date(), tokenHash: null, expiresAt: null, usedAt: null },
                });
        }

        return { message: PASSWORD_RESET_REQUESTED_MESSAGE };
    });

// Redeem an invitation (T4c, #14): a public endpoint — the token IS the credential. Sets the user's
// password, flips `invited` → `active`, burns the token, and signs them in. All errors collapse to
// one generic message so a probe cannot distinguish unknown / used / expired / already-active.
const INVALID_INVITATION_MESSAGE = 'This invitation link is invalid or has expired';

export const activateFn = createServerFn({ method: 'POST' })
    .inputValidator(activateInputSchema)
    .handler(async ({ data }): Promise<MeData> => {
        const tokenHash = hashInvitationToken(data.token);

        const [invite] = await db
            .select({
                id: invitation.id,
                userId: invitation.userId,
                expiresAt: invitation.expiresAt,
                usedAt: invitation.usedAt,
            })
            .from(invitation)
            .where(eq(invitation.tokenHash, tokenHash))
            .limit(1);

        if (!invite || invite.usedAt || invite.expiresAt <= new Date()) {
            throw new Error(INVALID_INVITATION_MESSAGE);
        }

        const passwordHash = await hashPassword(data.password);

        const activated = await db.transaction(async (tx) => {
            // Gate on `status = 'invited'` so a concurrent redemption or an already-active account can
            // never be re-activated — a no-match returns undefined and aborts.
            const [row] = await tx
                .update(user)
                .set({ passwordHash, status: 'active' })
                .where(and(eq(user.id, invite.userId), eq(user.status, 'invited')))
                .returning({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    teamId: user.teamId,
                });

            if (!row) {
                throw new Error(INVALID_INVITATION_MESSAGE);
            }

            // Burn the token — single use.
            await tx.update(invitation).set({ usedAt: new Date() }).where(eq(invitation.id, invite.id));

            return row;
        });

        await createSession(activated.id);

        // Resolve the team's display name for the returned session (join is not expressible in the
        // update…returning above). Teamless activations skip the lookup.
        let teamName: string | null = null;
        if (activated.teamId) {
            const [row] = await db.select({ name: team.name }).from(team).where(eq(team.id, activated.teamId)).limit(1);
            teamName = row?.name ?? null;
        }

        return { ...activated, teamName };
    });

// Complete a password reset (T4c, #44): a public endpoint — the token IS the credential. Sets the
// user's new password and burns the token, but deliberately does NOT create a session: the user is
// bounced to /login to sign in fresh. All errors collapse to one generic message so a probe cannot
// distinguish missing / used / expired. Burning the token (setting `used_at`) also clears the Head's
// pending indicator, which reads `used_at IS NULL`.
const INVALID_RESET_MESSAGE = 'This reset link is invalid or has expired';

export const resetPasswordFn = createServerFn({ method: 'POST' })
    .inputValidator(resetPasswordInputSchema)
    .handler(async ({ data }): Promise<{ success: true }> => {
        const tokenHash = hashResetToken(data.token);

        const [row] = await db
            .select({
                id: passwordReset.id,
                userId: passwordReset.userId,
                tokenHash: passwordReset.tokenHash,
                expiresAt: passwordReset.expiresAt,
                usedAt: passwordReset.usedAt,
            })
            .from(passwordReset)
            .where(eq(passwordReset.tokenHash, tokenHash))
            .limit(1);

        if (!row || !isResetTokenUsable(row, new Date())) {
            throw new Error(INVALID_RESET_MESSAGE);
        }

        const passwordHash = await hashPassword(data.password);

        await db.transaction(async (tx) => {
            // Burn the token first, gated on `used_at IS NULL`, so a concurrent redemption cannot set
            // the password twice — a no-match returns undefined and aborts before the user is touched.
            const [burned] = await tx
                .update(passwordReset)
                .set({ usedAt: new Date() })
                .where(and(eq(passwordReset.id, row.id), isNull(passwordReset.usedAt)))
                .returning({ id: passwordReset.id });

            if (!burned) {
                throw new Error(INVALID_RESET_MESSAGE);
            }

            await tx.update(user).set({ passwordHash }).where(eq(user.id, row.userId));
        });

        return { success: true };
    });

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
    await destroySession();

    return { success: true } as const;
});

export const meFn = createServerFn({ method: 'GET' }).handler((): Promise<MeData | null> => {
    return getSessionUser();
});
