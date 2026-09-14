import { attentionItemText, attentionSummaryText } from './itemText';

describe('attentionItemText', () => {
    const today = '2026-09-14';
    const base = { offerCardId: 'a', offerId: '1' } as const;

    it('reads a deadline relative to the day the items were built on', () => {
        expect(
            attentionItemText({ ...base, kind: 'deadline', severity: 'urgent', deadline: '2026-09-12' }, today)
        ).toBe('overdue since 12.09.2026');
        expect(
            attentionItemText({ ...base, kind: 'deadline', severity: 'warning', deadline: '2026-09-14' }, today)
        ).toBe('due today');
        expect(
            attentionItemText({ ...base, kind: 'deadline', severity: 'warning', deadline: '2026-09-15' }, today)
        ).toBe('due tomorrow');
        expect(
            attentionItemText({ ...base, kind: 'deadline', severity: 'warning', deadline: '2026-09-17' }, today)
        ).toBe('due in 3 days');
    });

    it('counts unread comments', () => {
        expect(attentionItemText({ ...base, kind: 'unread', severity: 'warning', unreadCount: 1 }, today)).toBe(
            '1 unread comment'
        );
        expect(attentionItemText({ ...base, kind: 'unread', severity: 'warning', unreadCount: 4 }, today)).toBe(
            '4 unread comments'
        );
    });
});

describe('attentionSummaryText', () => {
    it('names the count and the overdue share', () => {
        expect(attentionSummaryText(1, 0)).toBe('1 item needs attention');
        expect(attentionSummaryText(3, 2)).toBe('3 items need attention, 2 overdue');
    });
});
