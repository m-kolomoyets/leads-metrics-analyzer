import type { Viewer } from '@/lib/auth/scope';
import type { MeData } from '@/services/auth/types';
import type { CreateOfferCardResult, OfferCardView, UnarchiveOfferCardResult, UnlistedOfferView } from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, desc, eq, isNull, max, ne, notInArray } from 'drizzle-orm';
import { assertDimension } from '@/lib/auth/denial';
import { FORBIDDEN_MESSAGE, requireUser } from '@/lib/auth/guards';
import { canOffer } from '@/lib/auth/offerAccess';
import { scopeFor } from '@/lib/auth/scope';
import { db } from '@/lib/db';
import { offerCard, snapshot, snapshotCampaignModel, team, user } from '@/lib/db/schema';
import { parseOfferString } from '@/lib/domain/offerString';
import { listSnapshotsFilter, matchesNoRows } from '@/services/snapshots/visibility';
import { createOfferCardInputSchema, offerCardIdInputSchema, retryOfferFxInputSchema } from './schemas';
import { fixRateToUsd } from './fx';
import { loadOfferCardView, selectOfferCards, toOfferCardView } from './read';
import { resolveAssignment } from './resolveAssignment';

// Offers API (offers-and-home/04). Reads run every row through the pure `offerAccessFor` seam
// (ADR-0007) — visibility follows the Assignment, not the creator, so the filter is applied to the
// loaded rows rather than restated in SQL; the directory is bounded by the number of live offers.
// Writes gate on `canOffer(role, ...)` — the per-role capability set beside the seam. The joined
// read and its view mapping live in `./read` (server-only) so nothing here but handler bodies
// touches drizzle — the server-fn compiler strips those from the client bundle, and anything
// referenced at module level would drag `postgres` into the browser.

const viewerFrom = (me: MeData): Viewer => {
    return { id: me.id, role: me.role, teamId: me.teamId };
};

const OFFER_NOT_FOUND_MESSAGE = 'Offer card not found';

// Postgres unique_violation on the live-`offer_id` partial index: two authors pasted the same offer
// at once and the pre-check above let both through. The loser gets the same "duplicate" verdict
// (with the winner's id) as if the pre-check had caught it.
const LIVE_OFFER_ID_INDEX = 'offer_card_live_offer_id_key';

const isLiveOfferIdViolation = (error: unknown): boolean => {
    const pgError = error as { code?: string; constraint_name?: string } | null;

    return pgError?.code === '23505' && pgError.constraint_name === LIVE_OFFER_ID_INDEX;
};

const findLiveCardId = async (offerId: string): Promise<string | undefined> => {
    const [existing] = await db
        .select({ id: offerCard.id })
        .from(offerCard)
        .where(and(eq(offerCard.offerId, offerId), isNull(offerCard.archivedAt)))
        .limit(1);

    return existing?.id;
};

// Every card the viewer may see, live and archived, newest first. Search and filters (incl. the
// archived/live split) are the client's, over this scoped list (ADR-0004) — the directory is
// bounded by the number of offers ever issued, and the filters live in the URL, not in a query.
export const listOfferCardsFn = createServerFn({ method: 'GET' }).handler(async (): Promise<OfferCardView[]> => {
    const me = await requireUser();
    const viewer = viewerFrom(me);

    const rows = await selectOfferCards().orderBy(desc(offerCard.createdAt));

    return rows
        .map((row) => {
            return toOfferCardView(viewer, row);
        })
        .filter((view) => {
            return view.access === 'read';
        });
});

export const createOfferCardFn = createServerFn({ method: 'POST' })
    .inputValidator(createOfferCardInputSchema)
    .handler(async ({ data }): Promise<CreateOfferCardResult> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        if (!canOffer(me.role, 'create')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        // Parse first, save nothing on a miss — the failure names the fragment (PRD story 6).
        const parsed = parseOfferString(data.rawString);

        if (!parsed.ok) {
            return { ok: false, reason: 'parse', fragment: parsed.fragment };
        }

        // One live card per `offer_id` (story 9). The partial unique index is the backstop; this
        // read is what gives the author the link.
        const existingCardId = await findLiveCardId(data.offerId);

        if (existingCardId) {
            return { ok: false, reason: 'duplicate', existingCardId };
        }

        // Resolve against the whole roster — small tables, and the comparison rule lives in one
        // pure seam rather than being restated in SQL (same call as the nickname pre-check).
        const [teams, users] = await Promise.all([
            db.select({ id: team.id, name: team.name }).from(team),
            db.select({ id: user.id, nickname: user.nickname }).from(user),
        ]);
        const assignment = resolveAssignment(parsed.value.assignment, teams, users);

        // Fixed once, now (ADR-0027). Unreachable rate service ⇒ `pending`, never a failed create.
        const { payout } = parsed.value;
        const fixed = await fixRateToUsd(payout.currency);

        let createdId: string;

        try {
            const [created] = await db
                .insert(offerCard)
                .values({
                    offerId: data.offerId,
                    rawString: data.rawString,
                    payoutOriginal: payout.amount,
                    payoutCurrency: payout.currency,
                    fxStatus: fixed ? 'fixed' : 'pending',
                    fxRate: fixed?.rate ?? null,
                    fxFetchedAt: fixed?.fetchedAt ?? null,
                    payoutUsd: fixed ? payout.amount * fixed.rate : null,
                    assignedTeamText: parsed.value.assignment.team,
                    assignedRecipientText: parsed.value.assignment.recipient ?? parsed.value.assignment.team,
                    teamId: assignment.teamId,
                    buyerUserId: assignment.buyerUserId,
                    isAssignmentUnresolved: assignment.isUnresolved,
                    createdByUserId: me.id,
                })
                .returning({ id: offerCard.id });

            createdId = created.id;
        } catch (error) {
            if (isLiveOfferIdViolation(error)) {
                const winnerId = await findLiveCardId(data.offerId);

                if (winnerId) {
                    return { ok: false, reason: 'duplicate', existingCardId: winnerId };
                }
            }

            throw error;
        }

        // Re-read joined so the response carries names; the creator's own card is always readable
        // for bdm/head, but a team lead creating an Unresolved card may not see it — return the raw
        // view then, so the form can still show the warning.
        const [row] = await selectOfferCards().where(eq(offerCard.id, createdId)).limit(1);

        if (!row) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        return { ok: true, card: toOfferCardView(viewer, row) };
    });

// Fixes the rate of an `fx_pending` card on the day the retry succeeds (ADR-0027). The response
// carries the card either way; `fxStatus` tells whether it worked.
export const retryOfferFxFn = createServerFn({ method: 'POST' })
    .inputValidator(retryOfferFxInputSchema)
    .handler(async ({ data }): Promise<OfferCardView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        if (!canOffer(me.role, 'create')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const current = await loadOfferCardView(viewer, data.offerCardId);

        if (!current) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        if (current.fxStatus === 'fixed') {
            return current;
        }

        const fixed = await fixRateToUsd(current.payoutCurrency);

        if (!fixed) {
            return current;
        }

        await db
            .update(offerCard)
            .set({
                fxStatus: 'fixed',
                fxRate: fixed.rate,
                fxFetchedAt: fixed.fetchedAt,
                payoutUsd: current.payoutOriginal * fixed.rate,
                updatedAt: new Date(),
            })
            // Guarded on `pending` so a concurrent retry cannot overwrite an already fixed rate.
            .where(and(eq(offerCard.id, data.offerCardId), eq(offerCard.fxStatus, 'pending')));

        const view = await loadOfferCardView(viewer, data.offerCardId);

        if (!view) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        return view;
    });

// Archive (PRD story 10): the card leaves the live list, keeps its history and frees its `offer_id`
// for a newer card. Idempotent — archiving an archived card is the same answer.
export const archiveOfferCardFn = createServerFn({ method: 'POST' })
    .inputValidator(offerCardIdInputSchema)
    .handler(async ({ data }): Promise<OfferCardView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        if (!canOffer(me.role, 'archive')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const current = await loadOfferCardView(viewer, data.offerCardId);

        if (!current) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        if (current.archivedAt === null) {
            await db
                .update(offerCard)
                .set({ archivedAt: new Date(), updatedAt: new Date() })
                .where(and(eq(offerCard.id, data.offerCardId), isNull(offerCard.archivedAt)));
        }

        const view = await loadOfferCardView(viewer, data.offerCardId);

        if (!view) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        return view;
    });

// Unarchive puts the card back among the live ones — unless a newer live card took the id meanwhile,
// in which case the caller gets the link, as on create. The partial unique index is the backstop.
export const unarchiveOfferCardFn = createServerFn({ method: 'POST' })
    .inputValidator(offerCardIdInputSchema)
    .handler(async ({ data }): Promise<UnarchiveOfferCardResult> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        if (!canOffer(me.role, 'archive')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const current = await loadOfferCardView(viewer, data.offerCardId);

        if (!current) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        if (current.archivedAt !== null) {
            const existingCardId = await findLiveCardId(current.offerId);

            if (existingCardId) {
                return { ok: false, reason: 'duplicate', existingCardId };
            }

            try {
                await db
                    .update(offerCard)
                    .set({ archivedAt: null, updatedAt: new Date() })
                    .where(eq(offerCard.id, data.offerCardId));
            } catch (error) {
                if (isLiveOfferIdViolation(error)) {
                    const winnerId = await findLiveCardId(current.offerId);

                    if (winnerId) {
                        return { ok: false, reason: 'duplicate', existingCardId: winnerId };
                    }
                }

                throw error;
            }
        }

        const view = await loadOfferCardView(viewer, data.offerCardId);

        if (!view) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        return { ok: true, card: view };
    });

// Unlisted Offers (PRD story 15): every `offer_id` in the viewer's active Snapshots' Campaign Models
// with no live card ANYWHERE — a card the viewer cannot see still lists the offer, so the check is
// global while the Snapshots are row-scoped through the same seam every Snapshot read composes
// (`listSnapshotsFilter`). Latest-run first, so what is running now sits on top.
export const listUnlistedOffersFn = createServerFn({ method: 'GET' }).handler(
    async (): Promise<UnlistedOfferView[]> => {
        const me = await requireUser();
        const scope = scopeFor(viewerFrom(me));

        // A Designer's scope carries no offer dimension (PRD story 18): refused, not an empty list.
        assertDimension(scope, 'offer');

        if (matchesNoRows(scope)) {
            return [];
        }

        const liveOfferIds = db
            .select({ offerId: offerCard.offerId })
            .from(offerCard)
            .where(isNull(offerCard.archivedAt));

        const rows = await db
            .select({
                offerId: snapshotCampaignModel.key,
                label: max(snapshotCampaignModel.label),
                lastReportDate: max(snapshot.reportDate),
            })
            .from(snapshotCampaignModel)
            .innerJoin(snapshot, eq(snapshotCampaignModel.snapshotId, snapshot.id))
            .where(
                and(
                    listSnapshotsFilter(scope),
                    eq(snapshotCampaignModel.dimension, 'offer'),
                    // A campaign whose Keitaro rows carried no Offer ID models under an empty key.
                    ne(snapshotCampaignModel.key, ''),
                    notInArray(snapshotCampaignModel.key, liveOfferIds)
                )
            )
            .groupBy(snapshotCampaignModel.key)
            .orderBy(desc(max(snapshot.reportDate)), snapshotCampaignModel.key);

        return rows.map((row): UnlistedOfferView => {
            return {
                offerId: row.offerId,
                label: row.label ?? '',
                lastReportDate: row.lastReportDate ?? '',
            };
        });
    }
);
