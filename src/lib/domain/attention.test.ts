import type { AttentionSubject } from './attention';
import { attentionItems, attentionSeverity } from './attention';

// The Attention Badge (offers-and-home/10, CONTEXT.md §Attention Badge, PRD stories 35–37): what
// needs the viewer's action right now, each kind only where the viewer may act; never an archived
// card, never one the viewer may not see. Red iff anything is past due, else yellow, nothing at zero.
describe('attentionItems', () => {
    const today = '2026-09-14';
    const card = (overrides: Partial<AttentionSubject> = {}): AttentionSubject => {
        return {
            id: 'card-1',
            offerId: '13002',
            deadline: null,
            archivedAt: null,
            unreadCount: 0,
            hasClaim: true,
            isAssignmentUnresolved: false,
            access: 'read',
            ...overrides,
        };
    };

    it('raises nothing for a quiet card', () => {
        expect(attentionItems('head', [card()], today)).toEqual([]);
    });

    it('raises a due-soon deadline as a warning and a past one as urgent', () => {
        expect(attentionItems('buyer', [card({ deadline: '2026-09-16' })], today)).toEqual([
            { kind: 'deadline', offerCardId: 'card-1', offerId: '13002', severity: 'warning', deadline: '2026-09-16' },
        ]);
        expect(attentionItems('buyer', [card({ deadline: '2026-09-13' })], today)).toEqual([
            { kind: 'deadline', offerCardId: 'card-1', offerId: '13002', severity: 'urgent', deadline: '2026-09-13' },
        ]);
        expect(attentionItems('buyer', [card({ deadline: '2026-09-20' })], today)).toEqual([]);
    });

    it('raises unread comments for every role, with the count', () => {
        expect(attentionItems('buyer', [card({ unreadCount: 2 })], today)).toEqual([
            { kind: 'unread', offerCardId: 'card-1', offerId: '13002', severity: 'warning', unreadCount: 2 },
        ]);
    });

    it('raises a missing claim and an unresolved assignment for bdm and head only', () => {
        const subjects = [card({ hasClaim: false, isAssignmentUnresolved: true })];
        const kinds = (role: Parameters<typeof attentionItems>[0]) => {
            return attentionItems(role, subjects, today).map((item) => {
                return item.kind;
            });
        };

        expect(kinds('bdm')).toEqual(['claim', 'assignment']);
        expect(kinds('head')).toEqual(['claim', 'assignment']);
        expect(kinds('team_lead')).toEqual([]);
        expect(kinds('buyer')).toEqual([]);
    });

    it('raises no claim item while the claim field is unknown (slice 07 pending)', () => {
        expect(attentionItems('bdm', [card({ hasClaim: null })], today)).toEqual([]);
    });

    it('never counts an archived card', () => {
        const archived = card({
            archivedAt: '2026-09-10T00:00:00.000Z',
            deadline: '2026-09-01',
            unreadCount: 3,
            hasClaim: false,
            isAssignmentUnresolved: true,
        });

        expect(attentionItems('head', [archived], today)).toEqual([]);
    });

    it('never counts a card the viewer may not see', () => {
        expect(attentionItems('head', [card({ deadline: '2026-09-01', access: 'none' })], today)).toEqual([]);
    });

    it('lists every kind a card raises, in kind order, across cards', () => {
        const items = attentionItems(
            'bdm',
            [
                card({ id: 'a', offerId: '1', unreadCount: 1, deadline: '2026-09-14' }),
                card({ id: 'b', offerId: '2', hasClaim: false }),
            ],
            today
        );

        expect(
            items.map((item) => {
                return [item.kind, item.offerCardId];
            })
        ).toEqual([
            ['deadline', 'a'],
            ['unread', 'a'],
            ['claim', 'b'],
        ]);
    });
});

describe('attentionSeverity', () => {
    it('is none at zero, urgent iff anything is urgent, else warning', () => {
        const warning = {
            kind: 'unread',
            offerCardId: 'a',
            offerId: '1',
            severity: 'warning',
            unreadCount: 1,
        } as const;
        const urgent = {
            kind: 'deadline',
            offerCardId: 'b',
            offerId: '2',
            severity: 'urgent',
            deadline: '2026-09-01',
        } as const;

        expect(attentionSeverity([])).toBe('none');
        expect(attentionSeverity([warning])).toBe('warning');
        expect(attentionSeverity([warning, urgent])).toBe('urgent');
    });
});
