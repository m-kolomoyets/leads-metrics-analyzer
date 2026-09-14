// Pure validation of a hand-picked Assignment against the roster (offers-and-home/06) — the
// counterpart of `resolveAssignment`, which reads the string. Here the author chose from lists, so
// the only questions are whether the team still exists and whether the buyer, if any, is one of
// its members: a buyer from another team would make the card visible to the wrong people.

type TeamCandidate = { id: string };
type UserCandidate = { id: string; teamId: string | null };

export type AssignmentPick = {
    teamId: string;
    // Null picks the whole team.
    buyerUserId: string | null;
};

export type PickedAssignment =
    { ok: true; teamId: string; buyerUserId: string | null } | { ok: false; reason: 'team' | 'buyer' };

export const pickAssignment = (
    pick: AssignmentPick,
    teams: readonly TeamCandidate[],
    users: readonly UserCandidate[]
): PickedAssignment => {
    const team = teams.find((candidate) => {
        return candidate.id === pick.teamId;
    });

    if (!team) {
        return { ok: false, reason: 'team' };
    }

    if (pick.buyerUserId === null) {
        return { ok: true, teamId: team.id, buyerUserId: null };
    }

    const buyer = users.find((candidate) => {
        return candidate.id === pick.buyerUserId;
    });

    if (!buyer || buyer.teamId !== team.id) {
        return { ok: false, reason: 'buyer' };
    }

    return { ok: true, teamId: team.id, buyerUserId: buyer.id };
};
