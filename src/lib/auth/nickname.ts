// The handle rule (#52): a user's nickname defaults to the local part of their email, so the Report
// feed can name people the way the team talks about them. Pure — no DB, no session. The one-time
// backfill migration mirrors this in SQL (`split_part(email, '@', 1)`), and `scripts/seed.ts` uses it
// for the seeded Head. Once set, a nickname is only changed by the Head in the admin panel.

const FALLBACK_NICKNAME = 'user';

export const deriveNicknameFromEmail = (email: string): string => {
    const [localPart] = email.trim().split('@');

    return localPart || FALLBACK_NICKNAME;
};
