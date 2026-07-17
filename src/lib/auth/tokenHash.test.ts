import { hashInvitationToken } from './tokenHash';

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
