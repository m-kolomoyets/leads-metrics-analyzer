import { deriveNicknameFromEmail } from './nickname';

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
