// The Thread's pure rules (offers-and-home/08, CONTEXT.md §Thread). Server-enforced, unit-tested
// here; the UI reads the same functions so a button never promises what the server refuses.

export type OfferThreadEntryKind = 'comment' | 'deadline_changed' | 'assignment_changed';

// The minimal entry both rules read.
export type OfferThreadEntrySubject = {
    kind: OfferThreadEntryKind;
    authorUserId: string | null;
    createdAt: Date;
    deletedAt: Date | null;
};

// Fifteen minutes from posting (PRD story 31): long enough to fix a slip, short enough that the
// record stays the record.
export const COMMENT_EDIT_WINDOW_MS = 15 * 60 * 1000;

export const canEditComment = (entry: OfferThreadEntrySubject, viewerId: string, now: Date): boolean => {
    if (entry.kind !== 'comment' || entry.deletedAt !== null || entry.authorUserId !== viewerId) {
        return false;
    }

    return now.getTime() - entry.createdAt.getTime() < COMMENT_EDIT_WINDOW_MS;
};

// Unread = live comments by others after the viewer's last seen mark (PRD story 34). A card never
// opened (`lastSeenAt` null) has everything by others unread. System entries do not count: they
// are history, not a conversation waiting for a reply.
export const countUnread = (
    entries: readonly OfferThreadEntrySubject[],
    viewerId: string,
    lastSeenAt: Date | null
): number => {
    return entries.filter((entry) => {
        if (entry.kind !== 'comment' || entry.deletedAt !== null || entry.authorUserId === viewerId) {
            return false;
        }

        return lastSeenAt === null || entry.createdAt.getTime() > lastSeenAt.getTime();
    }).length;
};
