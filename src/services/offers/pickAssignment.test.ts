import { pickAssignment } from './pickAssignment';

// Fixing or changing an Assignment by hand (offers-and-home/06): a team from the list and, at most,
// one member of that team. The pick is validated against the roster rather than trusted — a stale
// picker, or a hand-built request, must not point a card at a team that is gone or at a buyer from
// another team.
describe('pickAssignment', () => {
    const teams = [
        { id: 't1', name: 'Falcons' },
        { id: 't2', name: 'Wolves' },
    ];
    const users = [
        { id: 'u1', nickname: 'mbchips', teamId: 't1' },
        { id: 'u2', nickname: 'wolf', teamId: 't2' },
        { id: 'u3', nickname: 'nomad', teamId: null },
    ];

    it('resolves a whole-team pick', () => {
        expect(pickAssignment({ teamId: 't1', buyerUserId: null }, teams, users)).toEqual({
            ok: true,
            teamId: 't1',
            buyerUserId: null,
        });
    });

    it('resolves a buyer of the picked team', () => {
        expect(pickAssignment({ teamId: 't1', buyerUserId: 'u1' }, teams, users)).toEqual({
            ok: true,
            teamId: 't1',
            buyerUserId: 'u1',
        });
    });

    it('refuses an unknown team', () => {
        expect(pickAssignment({ teamId: 't9', buyerUserId: null }, teams, users)).toEqual({
            ok: false,
            reason: 'team',
        });
    });

    it('refuses a buyer from another team', () => {
        expect(pickAssignment({ teamId: 't1', buyerUserId: 'u2' }, teams, users)).toEqual({
            ok: false,
            reason: 'buyer',
        });
    });

    it('refuses a teamless user and an unknown user alike', () => {
        expect(pickAssignment({ teamId: 't1', buyerUserId: 'u3' }, teams, users)).toEqual({
            ok: false,
            reason: 'buyer',
        });
        expect(pickAssignment({ teamId: 't1', buyerUserId: 'u9' }, teams, users)).toEqual({
            ok: false,
            reason: 'buyer',
        });
    });
});
