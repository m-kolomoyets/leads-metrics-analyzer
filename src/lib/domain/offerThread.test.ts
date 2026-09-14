import { canEditComment, COMMENT_EDIT_WINDOW_MS, countUnread } from './offerThread';

// The Thread's two pure rules (offers-and-home/08). Edit/delete is the author's, for 15 minutes from
// posting (PRD story 31); unread is what OTHERS said, in a comment, after the viewer last opened the
// card (story 34) — never the viewer's own words, never a system entry.
describe('canEditComment', () => {
    const posted = new Date('2026-09-14T10:00:00.000Z');
    const entry = { kind: 'comment' as const, authorUserId: 'u1', createdAt: posted, deletedAt: null };

    it('lets the author edit within the window', () => {
        expect(canEditComment(entry, 'u1', new Date('2026-09-14T10:14:59.000Z'))).toBe(true);
    });

    it('closes the window at exactly 15 minutes', () => {
        expect(canEditComment(entry, 'u1', new Date(posted.getTime() + COMMENT_EDIT_WINDOW_MS))).toBe(false);
    });

    it('refuses anyone but the author', () => {
        expect(canEditComment(entry, 'u2', new Date('2026-09-14T10:01:00.000Z'))).toBe(false);
    });

    it('refuses a deleted comment and a system entry', () => {
        expect(canEditComment({ ...entry, deletedAt: posted }, 'u1', posted)).toBe(false);
        expect(canEditComment({ ...entry, kind: 'deadline_changed' }, 'u1', posted)).toBe(false);
    });
});

describe('countUnread', () => {
    const at = (iso: string) => {
        return new Date(iso);
    };
    const entries = [
        { kind: 'comment' as const, authorUserId: 'u2', createdAt: at('2026-09-14T09:00:00Z'), deletedAt: null },
        { kind: 'comment' as const, authorUserId: 'u2', createdAt: at('2026-09-14T11:00:00Z'), deletedAt: null },
        { kind: 'comment' as const, authorUserId: 'u1', createdAt: at('2026-09-14T12:00:00Z'), deletedAt: null },
        {
            kind: 'deadline_changed' as const,
            authorUserId: 'u2',
            createdAt: at('2026-09-14T13:00:00Z'),
            deletedAt: null,
        },
        {
            kind: 'comment' as const,
            authorUserId: 'u3',
            createdAt: at('2026-09-14T14:00:00Z'),
            deletedAt: at('2026-09-14T14:05:00Z'),
        },
    ];

    it('counts others’ live comments after the last seen mark', () => {
        expect(countUnread(entries, 'u1', at('2026-09-14T10:00:00Z'))).toBe(1);
    });

    it('counts everything by others when the card was never opened', () => {
        expect(countUnread(entries, 'u1', null)).toBe(2);
    });

    it('excludes own comments, system entries and deleted comments', () => {
        // Only u1's 12:00 comment is left for u2: own two, the system entry and the deleted one go.
        expect(countUnread(entries, 'u2', null)).toBe(1);
    });

    it('treats a comment posted at the seen instant as seen', () => {
        expect(countUnread(entries, 'u1', at('2026-09-14T11:00:00Z'))).toBe(0);
    });
});
