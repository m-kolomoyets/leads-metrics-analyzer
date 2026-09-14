import { resolveAssignment } from './resolveAssignment';

// Assignment resolution (offers-and-home/04): the string's team/recipient text against the real
// roster, trimmed and case-folded the way nicknames compare. Whatever matches nobody leaves the
// card Unresolved — saved, warned about, fixable later (PRD story 7).
describe('resolveAssignment', () => {
    const teams = [
        { id: 't-falcons', name: 'Falcons' },
        { id: 't-eagles', name: ' Eagles ' },
    ];
    const users = [
        { id: 'u-mb', nickname: 'MbChips' },
        { id: 'u-anna', nickname: 'anna' },
    ];

    it('resolves a team-wide offer to its team', () => {
        expect(resolveAssignment({ team: 'Falcons', recipient: null }, teams, users)).toEqual({
            teamId: 't-falcons',
            buyerUserId: null,
            isUnresolved: false,
        });
    });

    it('resolves a buyer offer to team and buyer', () => {
        expect(resolveAssignment({ team: 'Falcons', recipient: 'MbChips' }, teams, users)).toEqual({
            teamId: 't-falcons',
            buyerUserId: 'u-mb',
            isUnresolved: false,
        });
    });

    it('matches team and buyer case-insensitively and trimmed', () => {
        expect(resolveAssignment({ team: 'eagles', recipient: ' MBCHIPS ' }, teams, users)).toEqual({
            teamId: 't-eagles',
            buyerUserId: 'u-mb',
            isUnresolved: false,
        });
    });

    it('is unresolved when the team names nobody, even if the buyer exists', () => {
        expect(resolveAssignment({ team: 'Hawks', recipient: 'MbChips' }, teams, users)).toEqual({
            teamId: null,
            buyerUserId: 'u-mb',
            isUnresolved: true,
        });
    });

    it('is unresolved when the buyer names nobody, keeping the team', () => {
        expect(resolveAssignment({ team: 'Falcons', recipient: 'Ghost' }, teams, users)).toEqual({
            teamId: 't-falcons',
            buyerUserId: null,
            isUnresolved: true,
        });
    });
});
