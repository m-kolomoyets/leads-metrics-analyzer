// The handle rule (#52): a user's nickname defaults to the local part of their email, so the Report
// feed can name people the way the team talks about them. Pure — no DB, no session. The one-time
// backfill migration mirrors this in SQL (`split_part(email, '@', 1)`), and `scripts/seed.ts` uses it
// for the seeded Head. Once set, a nickname is only changed by the Head in the admin panel.

const FALLBACK_NICKNAME = 'user';

export const deriveNicknameFromEmail = (email: string): string => {
    const [localPart] = email.trim().split('@');

    return localPart || FALLBACK_NICKNAME;
};

// Uniqueness key (offers-and-home/02): two handles collide when they match case-insensitively after
// trimming — the same resolution Assignment applies when it maps a handle to a buyer. The DB mirrors
// this with a unique index on `lower(nickname)`; the pre-check below is what gives the admin form a
// readable message instead of a constraint error.
export const normalizeNickname = (nickname: string): string => {
    return nickname.trim().toLowerCase();
};

type NicknameOwner = { id: string; nickname: string };

// The user who already holds `candidate`, if any. `excludeId` lets an edit keep (or re-case) the
// editor's own handle without reporting a self-collision.
export const findNicknameOwner = <T extends NicknameOwner>(
    candidate: string,
    users: readonly T[],
    excludeId?: string
): T | undefined => {
    const key = normalizeNickname(candidate);

    return users.find((candidateOwner) => {
        return candidateOwner.id !== excludeId && normalizeNickname(candidateOwner.nickname) === key;
    });
};
