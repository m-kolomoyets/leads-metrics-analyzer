import type { AdminUser } from '@/services/admin/types';
import { buildUpdateUserPayload } from './buildUpdateUserPayload';

// Pure diff seam (ADR-0005). The edit form submits full field values; the update API rejects a no-op
// PATCH and treats `teamId: null` as a real change (unassign). This helper turns "current row + form
// values" into the minimal payload so the UI never sends unchanged fields and never fires an empty
// update.

const NONE = '__none__';

const baseUser: AdminUser = {
    id: 'u1',
    email: 'a@b.co',
    role: 'buyer',
    status: 'active',
    teamId: 't1',
};

describe('buildUpdateUserPayload', () => {
    it('returns id-only diff when nothing changed', () => {
        const payload = buildUpdateUserPayload(baseUser, { role: 'buyer', status: 'active', teamId: 't1' }, NONE);
        expect(payload).toEqual({ id: 'u1' });
    });

    it('includes only the changed fields', () => {
        const payload = buildUpdateUserPayload(baseUser, { role: 'team_lead', status: 'active', teamId: 't1' }, NONE);
        expect(payload).toEqual({ id: 'u1', role: 'team_lead' });
    });

    it('maps the sentinel team value to null (unassign) as a real change', () => {
        const payload = buildUpdateUserPayload(baseUser, { role: 'buyer', status: 'active', teamId: NONE }, NONE);
        expect(payload).toEqual({ id: 'u1', teamId: null });
    });

    it('does not emit teamId when both current and next are unassigned', () => {
        const payload = buildUpdateUserPayload(
            { ...baseUser, teamId: null },
            { role: 'buyer', status: 'active', teamId: NONE },
            NONE
        );
        expect(payload).toEqual({ id: 'u1' });
    });

    it('emits every changed field together', () => {
        const payload = buildUpdateUserPayload(baseUser, { role: 'designer', status: 'disabled', teamId: 't2' }, NONE);
        expect(payload).toEqual({ id: 'u1', role: 'designer', status: 'disabled', teamId: 't2' });
    });
});
