import type { UpdateUserInput } from '@/services/admin/schemas';
import type { AdminUser } from '@/services/admin/types';

// Form values the edit form holds. `teamId` carries a sentinel string (not a real uuid) to mean
// "no team", because Base UI Select values must be non-empty strings.
export type EditUserFormValues = {
    role: AdminUser['role'];
    status: AdminUser['status'];
    teamId: string;
};

// Diff the edited form against the current row into the minimal update payload. Only changed fields
// are included; the sentinel maps to `null` (explicit unassign). Returns `{ id }` alone when nothing
// changed — callers should treat that as a no-op and skip the request (the API rejects empty PATCH).
export const buildUpdateUserPayload = (
    current: AdminUser,
    values: EditUserFormValues,
    noTeamValue: string
): UpdateUserInput => {
    const payload: UpdateUserInput = { id: current.id };

    if (values.role !== current.role) {
        payload.role = values.role;
    }

    if (values.status !== current.status) {
        payload.status = values.status;
    }

    const nextTeamId = values.teamId === noTeamValue ? null : values.teamId;

    if (nextTeamId !== current.teamId) {
        payload.teamId = nextTeamId;
    }

    return payload;
};
