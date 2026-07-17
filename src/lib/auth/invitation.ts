import { randomBytes } from 'node:crypto';
import { db } from '@/lib/db';
import { invitation } from '@/lib/db/schema';
import { hashInvitationToken } from './tokenHash';

// SERVER-ONLY (T4c, #14). Invitation tokens let an `invited` user set a password and activate without
// email infra — the Head hand-delivers the link. Imported only inside `createServerFn` handlers, so
// it never reaches the client bundle. The pure hash lives in `tokenHash.ts` (unit-testable, no db).

export const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Issue (or replace) a user's invitation and return the raw token — shown to the Head exactly once,
// never stored. Re-inviting overwrites the previous token and clears `used_at`, so the old link dies.
export const issueInvitation = async (userId: string): Promise<string> => {
    // base64url so the token drops straight into a `?token=` query param with no escaping.
    const rawToken = randomBytes(32).toString('base64url');
    const tokenHash = hashInvitationToken(rawToken);
    const expiresAt = new Date(Date.now() + INVITATION_TTL_MS);

    await db
        .insert(invitation)
        .values({ userId, tokenHash, expiresAt })
        .onConflictDoUpdate({
            target: invitation.userId,
            set: { tokenHash, expiresAt, usedAt: null },
        });

    return rawToken;
};
