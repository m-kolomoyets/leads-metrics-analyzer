import type { UserStatus } from '@/lib/constants';

// Pure, DB-free reset policy (ADR-0005/0007) — the branches the reset server functions will consult,
// kept unit-testable with no db/HTTP import. Mirrors the `scope`/`tokenHash` pure-module pattern.

// Status gate: only an `active` account may be sent through a hand-delivered reset. An `invited`
// account activates via its invitation instead; a `disabled` account must not be reset back to life.
export const canRequestPasswordReset = (status: UserStatus): boolean => {
    return status === 'active';
};

// The persisted token fields a usability check reads — a subset of `PasswordResetRow`. A null
// `tokenHash` means no link has been minted yet.
export type ResetTokenState = {
    tokenHash: string | null;
    expiresAt: Date | null;
    usedAt: Date | null;
};

// Token gate: a reset token is usable only if it has been minted, not yet redeemed, and not past its
// expiry at `now`. Same shape currently inlined in `activateFn`. The expiry check is strict (`>`), so
// a token is dead exactly at `expiresAt`.
export const isResetTokenUsable = (token: ResetTokenState, now: Date): boolean => {
    if (!token.tokenHash || !token.expiresAt || token.usedAt) {
        return false;
    }

    return token.expiresAt.getTime() > now.getTime();
};
