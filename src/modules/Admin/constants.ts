import type { SelectFieldItem } from '@/components/Form/components/SelectField/types';
import { USER_ROLES, USER_STATUSES } from '@/lib/constants';
import { ROLES_CONFIG } from '@/lib/utils/auth/permissions';

// Sentinel for the "no team" Select option — Base UI Select values must be non-empty strings, so a
// null teamId cannot be modelled by an empty value. The edit-payload builder maps this back to null.
export const NO_TEAM_VALUE = '__none__';

export const ROLE_OPTIONS: SelectFieldItem[] = USER_ROLES.map((role) => {
    return { value: role, label: ROLES_CONFIG[role].label };
});

const STATUS_LABELS: Record<(typeof USER_STATUSES)[number], string> = {
    active: 'Active',
    invited: 'Invited',
    disabled: 'Disabled',
};

export const STATUS_OPTIONS: SelectFieldItem[] = USER_STATUSES.map((status) => {
    return { value: status, label: STATUS_LABELS[status] };
});
