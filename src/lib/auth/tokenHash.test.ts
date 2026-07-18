import { hashInvitationToken, hashResetToken } from './tokenHash';

// Pure hashing seam (ADR-0005). The activate flow trusts that hashing a presented token yields the
// exact value stored at invite time — deterministic, and distinct per token.
describe('hashInvitationToken', () => {
    it('is deterministic for the same token', () => {
        expect(hashInvitationToken('abc')).toBe(hashInvitationToken('abc'));
    });

    it('differs for different tokens', () => {
        expect(hashInvitationToken('abc')).not.toBe(hashInvitationToken('abd'));
    });

    it('returns a 64-char hex sha256 digest', () => {
        const digest = hashInvitationToken('any-token');
        expect(digest).toMatch(/^[0-9a-f]{64}$/);
    });
});

// Reset tokens share the same one-way hasher (same 256-bit entropy, same at-rest storage need).
describe('hashResetToken', () => {
    it('is deterministic for the same token', () => {
        expect(hashResetToken('abc')).toBe(hashResetToken('abc'));
    });

    it('returns a 64-char hex sha256 digest', () => {
        expect(hashResetToken('any-token')).toMatch(/^[0-9a-f]{64}$/);
    });

    it('agrees with the shared sha256 hasher', () => {
        expect(hashResetToken('same')).toBe(hashInvitationToken('same'));
    });
});
