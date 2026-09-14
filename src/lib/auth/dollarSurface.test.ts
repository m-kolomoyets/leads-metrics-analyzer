import type { UserRole } from '@/lib/constants';
import type { DollarSurface } from './dollarSurface';
import { USER_ROLES } from '@/lib/constants';
import { seesDollarsOn } from './dollarSurface';

// Per-surface dollar permission (offers-and-home PRD): BDM reads dollar figures on Offers and Home
// only. Expressed here, beside `scopeFor`, and NOT by widening its dimension set — feed, report and
// Dynamics stay closed to BDM through `scopeFor` exactly as before.
describe('seesDollarsOn', () => {
    const surfaces: DollarSurface[] = ['offers', 'home'];
    const allowed: UserRole[] = ['head', 'team_lead', 'buyer', 'bdm'];

    it.each(surfaces)('grants %s dollars to every role but designer', (surface) => {
        for (const role of USER_ROLES) {
            expect(seesDollarsOn(surface, role)).toBe(allowed.includes(role));
        }
    });

    it('denies an absent role', () => {
        expect(seesDollarsOn('offers', undefined)).toBe(false);
    });
});
