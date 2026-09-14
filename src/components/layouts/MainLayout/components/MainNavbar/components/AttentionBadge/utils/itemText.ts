import type { AttentionItem, AttentionKind } from '@/lib/domain/attention';
import { daysUntilDeadline, formatDeadline } from '@/lib/domain/deadline';

// The popover's copy (PRD story 36): one heading per kind and one line per card, plain enough to
// act on without opening the card first. Days are judged against the same Kyiv today the server
// built the items on, so a list fetched before midnight does not read "due today" after it.

export const ATTENTION_KIND_ORDER: AttentionKind[] = ['deadline', 'unread', 'claim', 'assignment'];

export const ATTENTION_KIND_TITLES: Record<AttentionKind, string> = {
    deadline: 'Deadlines',
    unread: 'Unread comments',
    claim: 'No advertiser claim',
    assignment: 'Unresolved assignments',
};

export const attentionItemText = (item: AttentionItem, today: string): string => {
    switch (item.kind) {
        case 'deadline': {
            const days = daysUntilDeadline(item.deadline, today);

            if (days < 0) {
                return `overdue since ${formatDeadline(item.deadline)}`;
            }

            if (days === 0) {
                return 'due today';
            }

            return days === 1 ? 'due tomorrow' : `due in ${days} days`;
        }
        case 'unread': {
            return item.unreadCount === 1 ? '1 unread comment' : `${item.unreadCount} unread comments`;
        }
        case 'claim': {
            return 'no advertiser claim yet';
        }
        case 'assignment': {
            return 'assignment unresolved';
        }
    }
};

// The trigger's accessible name: the count, and whether any of it is past due.
export const attentionSummaryText = (count: number, urgentCount: number): string => {
    const items = count === 1 ? '1 item needs attention' : `${count} items need attention`;

    return urgentCount > 0 ? `${items}, ${urgentCount} overdue` : items;
};
