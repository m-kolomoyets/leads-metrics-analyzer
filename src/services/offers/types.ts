import type { OfferAccess } from '@/lib/auth/offerAccess';
import type { UserRole } from '@/lib/constants';
import type { OfferCurrency, OfferStringFragment } from '@/lib/domain/offerString';
import type { OfferThreadEntryKind } from '@/lib/domain/offerThread';

// Domain shapes for the Offers API (offers-and-home/04). An Offer Card as returned to the client:
// the raw string (its caption), the Payout fixed per ADR-0027, the Assignment as resolved and as
// named, the creator, and the viewer's verdict — enough to render the list without a second trip.

type OfferFxStatus = 'fixed' | 'pending';

export type OfferCardView = {
    id: string;
    offerId: string;
    rawString: string;
    payoutOriginal: number;
    payoutCurrency: OfferCurrency;
    fxStatus: OfferFxStatus;
    // Null while `fxStatus` is `pending` (ADR-0027).
    fxRate: number | null;
    fxFetchedAt: string | null;
    payoutUsd: number | null;
    assignedTeamText: string;
    assignedRecipientText: string;
    teamId: string | null;
    teamName: string | null;
    // Null for a team-wide offer and for an Unresolved one.
    buyerUserId: string | null;
    buyerNickname: string | null;
    isAssignmentUnresolved: boolean;
    createdByUserId: string;
    createdByNickname: string;
    createdAt: string;
    // `YYYY-MM-DD` or null (slice 09).
    deadline: string | null;
    archivedAt: string | null;
    // Live comments by others since the viewer last opened the card (offers-and-home/08).
    unreadCount: number;
    access: OfferAccess;
};

// The create verdict. Parse failures and a duplicate live `offer_id` are outcomes the form shows
// inline (with the fragment / a link to the existing card), not exceptions — so they travel as data.
export type CreateOfferCardResult =
    | { ok: true; card: OfferCardView }
    | { ok: false; reason: 'parse'; fragment: OfferStringFragment }
    | { ok: false; reason: 'duplicate'; existingCardId: string };

// An Unlisted Offer (CONTEXT.md): an `offer_id` seen in the viewer's active Snapshots' Campaign Models
// with no live card anywhere. `label` is the Keitaro offer name as the model stored it — the seed for
// the card's raw string; `lastReportDate` is the latest day it ran, for ordering (PRD story 15).
export type UnlistedOfferView = {
    offerId: string;
    label: string;
    lastReportDate: string;
};

// Unarchive is refused as data, like create: a newer live card may have taken the id meanwhile.
export type UnarchiveOfferCardResult =
    { ok: true; card: OfferCardView } | { ok: false; reason: 'duplicate'; existingCardId: string };

// The roster the Assignment picker chooses from (offers-and-home/06): every team, and every user
// who can be a card's recipient — placed in a team and not disabled. `teamId` lets the buyer list
// narrow to the picked team on the client.
export type OfferAssigneesView = {
    teams: { id: string; name: string }[];
    users: { id: string; nickname: string; teamId: string }[];
};

// A refused pick is data, like a duplicate on create: the picker may be stale (team deleted, user
// moved) and the form shows which side went wrong.
export type ChangeOfferAssignmentResult = { ok: true; card: OfferCardView } | { ok: false; reason: 'team' | 'buyer' };

// One Thread entry as the client renders it (offers-and-home/08). A comment carries its author; a
// system entry (slice 09) carries the actor the same way, and `body` holds the new value as text. A
// deleted comment is listed with `deletedAt` set and an empty body, so the stream keeps its shape.
export type OfferThreadEntryView = {
    id: string;
    kind: OfferThreadEntryKind;
    body: string;
    authorUserId: string | null;
    authorNickname: string | null;
    authorRole: UserRole | null;
    createdAt: string;
    editedAt: string | null;
    deletedAt: string | null;
    // Whether the viewer may still edit or delete this entry, as the server judged it at read time.
    canEdit: boolean;
};
