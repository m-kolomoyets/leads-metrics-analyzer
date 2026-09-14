import { systemEntryText } from './systemEntryText';

describe('systemEntryText', () => {
    it('names a moved and a cleared deadline', () => {
        expect(systemEntryText({ kind: 'deadline_changed', body: '12.09.2026' })).toBe('Deadline moved to 12.09.2026');
        expect(systemEntryText({ kind: 'deadline_changed', body: '' })).toBe('Deadline cleared');
    });

    it('names a new assignment', () => {
        expect(systemEntryText({ kind: 'assignment_changed', body: 'Falcons · MbChips' })).toBe(
            'Assigned to Falcons · MbChips'
        );
    });
});
