import type { MeData } from '@/services/auth/types';
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { session, user } from '@/lib/db/schema';

// SERVER-ONLY. Server-side session store (spec §Roles): the session id is an opaque uuid held in an
// httpOnly cookie; the source of truth is the `session` row, so deleting it revokes access on the
// next request. Imported only inside `createServerFn` handlers — never reaches the client bundle.

export const SESSION_COOKIE_NAME = 'lead_metrics_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

// Postgres error code 22P02 = invalid_text_representation (e.g. a non-uuid session cookie).
const isInvalidUuidError = (error: unknown) => {
    return (error as { code?: string } | null)?.code === '22P02';
};

const writeSessionCookie = (sessionId: string) => {
    setCookie(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
    });
};

// Creates a session row for the user and sets its id as an httpOnly cookie.
export const createSession = async (userId: string) => {
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    const [row] = await db.insert(session).values({ userId, expiresAt }).returning({ id: session.id });

    writeSessionCookie(row.id);
};

// Resolves the current user from the session cookie, or null. Expired or revoked sessions are
// cleaned up; a disabled user is treated as signed out (spec story 24).
export const getSessionUser = async (): Promise<MeData | null> => {
    const sessionId = getCookie(SESSION_COOKIE_NAME);

    if (!sessionId) {
        return null;
    }

    let rows: Array<{
        id: string;
        email: string;
        role: MeData['role'];
        status: MeData['status'];
        teamId: string | null;
        expiresAt: Date;
    }>;

    try {
        rows = await db
            .select({
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                expiresAt: session.expiresAt,
            })
            .from(session)
            .innerJoin(user, eq(session.userId, user.id))
            .where(eq(session.id, sessionId))
            .limit(1);
    } catch (error) {
        // Only a malformed (non-uuid) cookie is permanent — clear it. A transient DB error must NOT
        // destroy a valid session cookie (that would log everyone out on a brief outage).
        if (isInvalidUuidError(error)) {
            deleteCookie(SESSION_COOKIE_NAME, { path: '/' });
        }

        return null;
    }

    const found = rows[0];

    // Only active accounts hold a session; invited (not yet activated) and disabled do not.
    if (!found || found.expiresAt.getTime() <= Date.now() || found.status !== 'active') {
        if (found) {
            await db.delete(session).where(eq(session.id, sessionId));
        }

        deleteCookie(SESSION_COOKIE_NAME, { path: '/' });

        return null;
    }

    return { id: found.id, email: found.email, role: found.role, status: found.status, teamId: found.teamId };
};

// Deletes the session row (if any) and clears the cookie.
export const destroySession = async () => {
    const sessionId = getCookie(SESSION_COOKIE_NAME);

    if (sessionId) {
        try {
            await db.delete(session).where(eq(session.id, sessionId));
        } catch {
            // Malformed cookie — nothing to delete.
        }
    }

    deleteCookie(SESSION_COOKIE_NAME, { path: '/' });
};
