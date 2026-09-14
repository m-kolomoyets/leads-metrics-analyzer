import { deriveNicknameFromEmail, findNicknameOwner, normalizeNickname } from './nickname';

// Pure seam (ADR-0005): the rule that turns an email into a human handle. Used by the one-time
// nickname backfill (drizzle migration mirrors this in SQL) and by the seed script.

describe('deriveNicknameFromEmail', () => {
    it('takes the local part of the address', () => {
        expect(deriveNicknameFromEmail('mykola@example.com')).toBe('mykola');
    });

    it('keeps dots and other local-part punctuation', () => {
        expect(deriveNicknameFromEmail('anna.smith+ads@example.com')).toBe('anna.smith+ads');
    });

    it('trims surrounding whitespace before splitting', () => {
        expect(deriveNicknameFromEmail('  lead@example.com  ')).toBe('lead');
    });

    it('falls back to the whole string when there is no @', () => {
        expect(deriveNicknameFromEmail('plainhandle')).toBe('plainhandle');
    });

    it('falls back to "user" when the local part is empty', () => {
        expect(deriveNicknameFromEmail('@example.com')).toBe('user');
        expect(deriveNicknameFromEmail('   ')).toBe('user');
    });
});

// Uniqueness rule (#offers-and-home/02): nicknames are compared case-insensitively and trimmed —
// the same key Assignment will use to resolve a buyer from a handle.

describe('normalizeNickname', () => {
    it('lowercases and trims', () => {
        expect(normalizeNickname('  Anna ')).toBe('anna');
    });

    it('keeps inner punctuation and spacing', () => {
        expect(normalizeNickname('Anna Smith+ads')).toBe('anna smith+ads');
    });
});

describe('findNicknameOwner', () => {
    const users = [
        { id: 'u1', nickname: 'Anna' },
        { id: 'u2', nickname: 'mykola' },
    ];

    it('returns the owner of an exact match', () => {
        expect(findNicknameOwner('mykola', users)).toEqual(users[1]);
    });

    it('matches case-insensitively and ignores surrounding whitespace', () => {
        expect(findNicknameOwner('  ANNA ', users)).toEqual(users[0]);
    });

    it('returns undefined when the handle is free', () => {
        expect(findNicknameOwner('olga', users)).toBeUndefined();
    });

    it('ignores the excluded user so a person may keep (or re-case) their own handle', () => {
        expect(findNicknameOwner('anna', users, 'u1')).toBeUndefined();
        expect(findNicknameOwner('anna', users, 'u2')).toEqual(users[0]);
    });
});
