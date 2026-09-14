import type { Viewer } from '@/lib/auth/scope';
import type { OfferCardView } from './types';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { offerAccessFor } from '@/lib/auth/offerAccess';
import { db } from '@/lib/db';
import { offerCard, team, user } from '@/lib/db/schema';

// SERVER-ONLY. The one joined read of `offer_card` (team name, buyer and creator nicknames) and its
// mapping into the client view with the viewer's verdict attached. Kept out of `functions.ts` so the
// server-fn compiler has nothing drizzle-shaped left at module level in the client bundle.

// Creator and buyer both point at `user`; alias one so a single select can join both. Built inside
// the function (not at module level): the server-fn compiler keeps module-level calls in the client
// bundle, and `alias()` would drag drizzle's pg-core (and `Buffer`) into the browser.
export const selectOfferCards = () => {
    const buyer = alias(user, 'buyer');

    return db
        .select({
            id: offerCard.id,
            offerId: offerCard.offerId,
            rawString: offerCard.rawString,
            payoutOriginal: offerCard.payoutOriginal,
            payoutCurrency: offerCard.payoutCurrency,
            fxStatus: offerCard.fxStatus,
            fxRate: offerCard.fxRate,
            fxFetchedAt: offerCard.fxFetchedAt,
            payoutUsd: offerCard.payoutUsd,
            assignedTeamText: offerCard.assignedTeamText,
            assignedRecipientText: offerCard.assignedRecipientText,
            teamId: offerCard.teamId,
            teamName: team.name,
            buyerUserId: offerCard.buyerUserId,
            buyerNickname: buyer.nickname,
            isAssignmentUnresolved: offerCard.isAssignmentUnresolved,
            createdByUserId: offerCard.createdByUserId,
            createdByNickname: user.nickname,
            createdAt: offerCard.createdAt,
            archivedAt: offerCard.archivedAt,
        })
        .from(offerCard)
        .leftJoin(team, eq(offerCard.teamId, team.id))
        .leftJoin(buyer, eq(offerCard.buyerUserId, buyer.id))
        .leftJoin(user, eq(offerCard.createdByUserId, user.id));
};

type OfferCardJoinedRow = Awaited<ReturnType<typeof selectOfferCards>>[number];

export const toOfferCardView = (viewer: Viewer, row: OfferCardJoinedRow): OfferCardView => {
    return {
        id: row.id,
        offerId: row.offerId,
        rawString: row.rawString,
        payoutOriginal: row.payoutOriginal,
        payoutCurrency: row.payoutCurrency,
        fxStatus: row.fxStatus,
        fxRate: row.fxRate,
        fxFetchedAt: row.fxFetchedAt?.toISOString() ?? null,
        payoutUsd: row.payoutUsd,
        assignedTeamText: row.assignedTeamText,
        assignedRecipientText: row.assignedRecipientText,
        teamId: row.teamId,
        teamName: row.teamName,
        buyerUserId: row.buyerUserId,
        buyerNickname: row.buyerNickname,
        isAssignmentUnresolved: row.isAssignmentUnresolved,
        createdByUserId: row.createdByUserId,
        // The creator FK cascades on user delete, so a listed card always has one; guard anyway.
        createdByNickname: row.createdByNickname ?? '',
        createdAt: row.createdAt.toISOString(),
        archivedAt: row.archivedAt?.toISOString() ?? null,
        access: offerAccessFor(viewer, {
            teamId: row.teamId,
            buyerUserId: row.buyerUserId,
            isAssignmentUnresolved: row.isAssignmentUnresolved,
        }),
    };
};

// The single shape every read and write returns; `undefined` when the card is missing or the viewer
// may not see it — the two are the same answer to the client.
export const loadOfferCardView = async (viewer: Viewer, offerCardId: string): Promise<OfferCardView | undefined> => {
    const [row] = await selectOfferCards().where(eq(offerCard.id, offerCardId)).limit(1);

    if (!row) {
        return undefined;
    }

    const view = toOfferCardView(viewer, row);

    return view.access === 'read' ? view : undefined;
};
