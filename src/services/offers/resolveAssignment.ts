import type { OfferAssignment } from '@/lib/domain/offerString';
import { findNicknameOwner, normalizeNickname } from '@/lib/auth/nickname';

// Pure resolution of a parsed Assignment against the roster (offers-and-home/04). Team by name,
// buyer by nickname — both trimmed and case-folded via the one nickname rule, which is exactly why
// nicknames became unique (slice 02). Anything unmatched leaves the card Unresolved but still
// saved; the raw text stays on the card for the fix (slice 06). Membership is deliberately not
// checked here: a buyer named in another team's string is still that buyer, and the card's team is
// still what the string said — the person fixing it decides, not the parser.

type TeamCandidate = { id: string; name: string };
type UserCandidate = { id: string; nickname: string };

export type ResolvedAssignment = {
    teamId: string | null;
    buyerUserId: string | null;
    isUnresolved: boolean;
};

export const resolveAssignment = (
    assignment: OfferAssignment,
    teams: readonly TeamCandidate[],
    users: readonly UserCandidate[]
): ResolvedAssignment => {
    const teamKey = normalizeNickname(assignment.team);
    const matchedTeam = teams.find((candidate) => {
        return normalizeNickname(candidate.name) === teamKey;
    });
    const matchedBuyer = assignment.recipient === null ? undefined : findNicknameOwner(assignment.recipient, users);

    const isTeamUnresolved = matchedTeam === undefined;
    const isBuyerUnresolved = assignment.recipient !== null && matchedBuyer === undefined;

    return {
        teamId: matchedTeam?.id ?? null,
        buyerUserId: matchedBuyer?.id ?? null,
        isUnresolved: isTeamUnresolved || isBuyerUnresolved,
    };
};
