import type { Viewer, VisibilityScope } from './scope';
import { scopeFor } from './scope';

// External-behavior tests (ADR-0005/0007): assert the returned descriptor, never internals. One case
// per role plus the edges the ticket calls out (buyer with no team, team_lead of one team vs another,
// designer denied a dollar dimension).

const buyer = (over: Partial<Viewer> = {}): Viewer => {
    return { id: 'u-buyer', role: 'buyer', ...over };
};

const FULL_DIMENSIONS: VisibilityScope['dimensions'] = ['campaign', 'account', 'geo', 'creative', 'offer'];

describe('scopeFor', () => {
    const cases: Array<{ name: string; viewer: Viewer; expected: VisibilityScope }> = [
        {
            name: 'head sees all rows and every dimension',
            viewer: { id: 'u-head', role: 'head' },
            expected: { rowScope: 'all', dimensions: FULL_DIMENSIONS },
        },
        {
            name: 'team_lead is scoped to its own team, full dimensions',
            viewer: { id: 'u-tl', role: 'team_lead', teamId: 't-1' },
            expected: { rowScope: 'team', teamId: 't-1', userId: 'u-tl', dimensions: FULL_DIMENSIONS },
        },
        {
            name: 'buyer sees only its own rows, full dimensions',
            viewer: buyer(),
            expected: { rowScope: 'own', userId: 'u-buyer', dimensions: FULL_DIMENSIONS },
        },
        {
            name: 'designer sees all rows but only the creative dimension',
            viewer: { id: 'u-des', role: 'designer' },
            expected: { rowScope: 'all', dimensions: ['creative'] },
        },
        {
            name: 'bdm sees all rows but only the offer dimension',
            viewer: { id: 'u-bdm', role: 'bdm' },
            expected: { rowScope: 'all', dimensions: ['offer'] },
        },
    ];

    it.each(cases)('$name', ({ viewer, expected }) => {
        expect(scopeFor(viewer)).toEqual(expected);
    });

    it('binds a buyer to its own id regardless of any team membership', () => {
        expect(scopeFor(buyer({ teamId: 't-9' }))).toEqual({
            rowScope: 'own',
            userId: 'u-buyer',
            dimensions: FULL_DIMENSIONS,
        });
    });

    it('leaves a teamless buyer own-scoped (no team binding needed)', () => {
        const scope = scopeFor(buyer({ teamId: null }));
        expect(scope.rowScope).toBe('own');
        expect(scope.teamId).toBeUndefined();
    });

    it('binds each team_lead to its own team, never another', () => {
        const teamA = scopeFor({ id: 'u-a', role: 'team_lead', teamId: 't-a' });
        const teamB = scopeFor({ id: 'u-b', role: 'team_lead', teamId: 't-b' });
        expect(teamA.teamId).toBe('t-a');
        expect(teamB.teamId).toBe('t-b');
        expect(teamA.teamId).not.toBe(teamB.teamId);
    });

    it('leaves team_lead teamId unbound until a team is assigned, but binds its userId', () => {
        const scope = scopeFor({ id: 'u-tl', role: 'team_lead' });
        expect(scope.teamId).toBeUndefined();
        expect(scope.userId).toBe('u-tl');
    });

    it('denies a designer any dollar-carrying dimension (only creative)', () => {
        const { dimensions } = scopeFor({ id: 'u-des', role: 'designer' });
        expect(dimensions).toStrictEqual(['creative']);
        expect(dimensions).not.toContain('campaign');
        expect(dimensions).not.toContain('geo');
        expect(dimensions).not.toContain('account');
        expect(dimensions).not.toContain('offer');
    });

    it('gives a bdm the offer dimension only, not creative', () => {
        const { dimensions } = scopeFor({ id: 'u-bdm', role: 'bdm' });
        expect(dimensions).toStrictEqual(['offer']);
        expect(dimensions).not.toContain('creative');
    });
});
