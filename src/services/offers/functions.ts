import type { Viewer } from '@/lib/auth/scope';
import type { MeData } from '@/services/auth/types';
import type { CreateOfferCardResult, OfferCardView } from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { FORBIDDEN_MESSAGE, requireUser } from '@/lib/auth/guards';
import { canOffer } from '@/lib/auth/offerAccess';
import { db } from '@/lib/db';
import { offerCard, team, user } from '@/lib/db/schema';
import { parseOfferString } from '@/lib/domain/offerString';
import { createOfferCardInputSchema, retryOfferFxInputSchema } from './schemas';
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

// Live cards the viewer may see, newest first. Archived cards are out until the filter lands
// (slice 05).
export const listOfferCardsFn = createServerFn({ method: 'GET' }).handler(async (): Promise<OfferCardView[]> => {
    const me = await requireUser();
    const viewer = viewerFrom(me);

    const rows = await selectOfferCards().where(isNull(offerCard.archivedAt)).orderBy(desc(offerCard.createdAt));

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
