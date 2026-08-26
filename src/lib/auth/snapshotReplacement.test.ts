import type { Viewer } from './scope';
import type { ReplacementSubject } from './snapshotReplacement';
import { describe, expect, it } from 'vitest';
import { REPLACEMENT_WINDOW_MINUTES, replacementVerdictFor } from './snapshotReplacement';

const NOW = new Date('2026-08-26T12:00:00.000Z');

const minutesAgo = (minutes: number): Date => {
    return new Date(NOW.getTime() - minutes * 60_000);
};

const buyer: Viewer = { id: 'buyer-1', role: 'buyer', teamId: 'team-1' };
const otherBuyer: Viewer = { id: 'buyer-2', role: 'buyer', teamId: 'team-1' };
const lead: Viewer = { id: 'lead-1', role: 'team_lead', teamId: 'team-1' };
const head: Viewer = { id: 'head-1', role: 'head', teamId: null };
const designer: Viewer = { id: 'designer-1', role: 'designer', teamId: null };

const subject = (overrides: Partial<ReplacementSubject> = {}): ReplacementSubject => {
    return {
        createdByUserId: 'buyer-1',
        teamId: 'team-1',
        status: 'active',
        takenAt: minutesAgo(10),
        reportDate: '2026-08-25',
        hasNewerActive: false,
        ...overrides,
    };
};

describe('replacementVerdictFor', () => {
    it('permits the creator inside the window', () => {
        expect(replacementVerdictFor(buyer, subject(), NOW)).toBe('ok');
    });

    it('permits the creator at the last minute of the window', () => {
        const takenAt = minutesAgo(REPLACEMENT_WINDOW_MINUTES);
        expect(replacementVerdictFor(buyer, subject({ takenAt }), NOW)).toBe('ok');
    });

    it('refuses the creator one minute past the window', () => {
        const takenAt = minutesAgo(REPLACEMENT_WINDOW_MINUTES + 1);
        expect(replacementVerdictFor(buyer, subject({ takenAt }), NOW)).toBe('window-elapsed');
    });

    it('refuses a different buyer even inside the window', () => {
        expect(replacementVerdictFor(otherBuyer, subject(), NOW)).toBe('forbidden');
    });

    it('refuses a team lead replacing a snapshot it merely reads — reading a team is not correcting it', () => {
        expect(replacementVerdictFor(lead, subject(), NOW)).toBe('forbidden');
    });

    it('refuses a dollar-barred role outright', () => {
        expect(replacementVerdictFor(designer, subject({ createdByUserId: 'designer-1' }), NOW)).toBe('forbidden');
    });

    it('permits the head to replace any snapshot, past the window included', () => {
        const takenAt = minutesAgo(REPLACEMENT_WINDOW_MINUTES * 10);
        expect(replacementVerdictFor(head, subject({ takenAt }), NOW)).toBe('ok');
    });

    it('refuses an already-replaced snapshot, for the head too', () => {
        expect(replacementVerdictFor(buyer, subject({ status: 'replaced' }), NOW)).toBe('already-replaced');
        expect(replacementVerdictFor(head, subject({ status: 'replaced' }), NOW)).toBe('already-replaced');
    });

    it('refuses when a newer active snapshot exists for the same buyer and report date', () => {
        expect(replacementVerdictFor(buyer, subject({ hasNewerActive: true }), NOW)).toBe('superseded');
        expect(replacementVerdictFor(head, subject({ hasNewerActive: true }), NOW)).toBe('superseded');
    });

    it('reports the ownership refusal before the window one — a stranger learns nothing about timing', () => {
        const takenAt = minutesAgo(REPLACEMENT_WINDOW_MINUTES + 1);
        expect(replacementVerdictFor(otherBuyer, subject({ takenAt }), NOW)).toBe('forbidden');
    });
});
