import { USER_ROLES } from '@/lib/constants';
import { hasPermissions, landingFor } from './permissions';

// Route gates for the two new surfaces plus the post-login landing they change.
describe('home / offers route permissions', () => {
    it.each(['home.view', 'offers.view'] as const)('%s admits every role but designer', (key) => {
        for (const role of USER_ROLES) {
            expect(hasPermissions(key, role)).toBe(role !== 'designer');
        }
    });
});

describe('landingFor', () => {
    it('sends the roles that may open Home to /home', () => {
        for (const role of ['head', 'team_lead', 'buyer', 'bdm'] as const) {
            expect(landingFor(role)).toBe('/home');
        }
    });

    it('keeps the designer on the old landing', () => {
        expect(landingFor('designer')).toBe('/dashboard');
    });

    it('falls back to the old landing when the role is unknown', () => {
        expect(landingFor(undefined)).toBe('/dashboard');
    });
});
