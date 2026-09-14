import type { OfferAccess } from '@/lib/auth/offerAccess';
import type { UserRole } from '@/lib/constants';
import { canOffer } from '@/lib/auth/offerAccess';
import { deadlineState } from './deadline';

// The Attention Badge's pure builder (offers-and-home/10, CONTEXT.md §Attention Badge, PRD stories
// 35–37): from the cards a viewer may see, the items that need their action right now. Each kind is
// raised only where the viewer may act on it — a Deadline and unread comments concern everyone on
// the card, a missing Advertiser Claim and an Unresolved Assignment only the roles that fix them
// (`canOffer`). An archived card raises nothing. Today is Kyiv's today, passed in (ADR-0017).

export type AttentionKind = 'deadline' | 'unread' | 'claim' | 'assignment';

// Urgent is "past due" and nothing else (story 36): the badge is red iff one urgent item exists.
type AttentionItemSeverity = 'warning' | 'urgent';

export type AttentionSeverity = 'none' | AttentionItemSeverity;

// The minimal card shape the rule reads. `hasClaim` is null while the Advertiser Claim field is not
// on the card yet (slice 07): an unknown claim raises no item rather than every card lighting up.
export type AttentionSubject = {
    id: string;
    offerId: string;
    deadline: string | null;
    archivedAt: string | null;
    unreadCount: number;
    hasClaim: boolean | null;
    isAssignmentUnresolved: boolean;
    access: OfferAccess;
};

type AttentionItemBase = {
    offerCardId: string;
    offerId: string;
    severity: AttentionItemSeverity;
};

export type AttentionItem = AttentionItemBase &
    (
        | { kind: 'deadline'; deadline: string }
        | { kind: 'unread'; unreadCount: number }
        | { kind: 'claim' }
        | { kind: 'assignment' }
    );

const itemsFor = (role: UserRole, subject: AttentionSubject, today: string): AttentionItem[] => {
    const base = { offerCardId: subject.id, offerId: subject.offerId };
    const items: AttentionItem[] = [];
    const state = deadlineState(subject, today);

    if (subject.deadline !== null && state !== 'neutral') {
        items.push({
            ...base,
            kind: 'deadline',
            severity: state === 'overdue' ? 'urgent' : 'warning',
            deadline: subject.deadline,
        });
    }

    if (subject.unreadCount > 0) {
        items.push({ ...base, kind: 'unread', severity: 'warning', unreadCount: subject.unreadCount });
    }

    if (subject.hasClaim === false && canOffer(role, 'editClaim')) {
        items.push({ ...base, kind: 'claim', severity: 'warning' });
    }

    if (subject.isAssignmentUnresolved && canOffer(role, 'changeAssignment')) {
        items.push({ ...base, kind: 'assignment', severity: 'warning' });
    }

    return items;
};

export const attentionItems = (role: UserRole, subjects: AttentionSubject[], today: string): AttentionItem[] => {
    return subjects.flatMap((subject) => {
        if (subject.access !== 'read' || subject.archivedAt !== null) {
            return [];
        }

        return itemsFor(role, subject, today);
    });
};

export const attentionSeverity = (items: AttentionItem[]): AttentionSeverity => {
    if (items.length === 0) {
        return 'none';
    }

    return items.some((item) => {
        return item.severity === 'urgent';
    })
        ? 'urgent'
        : 'warning';
};
