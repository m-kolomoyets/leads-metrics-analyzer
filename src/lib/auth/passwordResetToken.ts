import { randomBytes } from 'node:crypto';
import { db } from '@/lib/db';
import { passwordReset } from '@/lib/db/schema';
import { hashResetToken } from './tokenHash';

// SERVER-ONLY (T4c, #43). Mirrors `invitation.ts`. The Head mints a hand-delivered reset link for an
// `active` user who forgot their password. Imported only inside `createServerFn` handlers, so it
// never reaches the client bundle. The pure hash lives in `tokenHash.ts` (unit-testable, no db).

export const PASSWORD_RESET_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Mint (or re-mint) the reset token on the user's pending `password_reset` row and return the raw
// token — shown to the Head exactly once, never stored. A pending row already exists (created by
// `requestPasswordResetFn`); minting fills in `tokenHash`/`expiresAt`. Re-minting overwrites the
// token and resets expiry, so an old, mislaid link stops working. `usedAt` stays null — the pending
// flag persists until the user actually completes the reset (#42 indicator, story 13). The upsert
// insert branch is a safety net for a mint with no prior request; it seeds `requestedAt` by default.
export const issueResetToken = async (userId: string): Promise<string> => {
    // base64url so the token drops straight into a `?token=` query param with no escaping.
    const rawToken = randomBytes(32).toString('base64url');
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await db
        .insert(passwordReset)
        .values({ userId, tokenHash, expiresAt })
        .onConflictDoUpdate({
            target: passwordReset.userId,
            set: { tokenHash, expiresAt, usedAt: null },
        });

    return rawToken;
};
