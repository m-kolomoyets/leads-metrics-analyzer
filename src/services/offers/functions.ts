import type { Viewer } from '@/lib/auth/scope';
import type { MeData } from '@/services/auth/types';
import type {
    AttentionView,
    ChangeOfferAssignmentResult,
    CreateOfferCardResult,
    OfferAssigneesView,
    OfferCardView,
    OfferRatingView,
    OfferThreadEntryView,
    UnarchiveOfferCardResult,
    UnlistedOfferView,
} from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, desc, eq, gte, inArray, isNotNull, isNull, lte, max, ne, notInArray } from 'drizzle-orm';
import { assertDimension } from '@/lib/auth/denial';
import { FORBIDDEN_MESSAGE, requireUser } from '@/lib/auth/guards';
import { canOffer } from '@/lib/auth/offerAccess';
import { scopeFor } from '@/lib/auth/scope';
import { db } from '@/lib/db';
import {
    offerCard,
    offerCardSeen,
    offerThreadEntry,
    snapshot,
    snapshotCampaignModel,
    snapshotFact,
    snapshotGeo,
    team,
    user,
} from '@/lib/db/schema';
import { attentionItems } from '@/lib/domain/attention';
import { formatDeadline } from '@/lib/domain/deadline';
import { ratingWindowRange } from '@/lib/domain/offerRating';
import { parseOfferString } from '@/lib/domain/offerString';
import { canEditComment } from '@/lib/domain/offerThread';
import { kyivDay } from '@/lib/utils/kyivDay';
import { listSnapshotsFilter, matchesNoRows } from '@/services/snapshots/visibility';
import {
    addOfferCommentInputSchema,
    changeOfferAssignmentInputSchema,
    createOfferCardInputSchema,
    editOfferCommentInputSchema,
    offerCardIdInputSchema,
    offerRatingInputSchema,
    offerThreadEntryIdInputSchema,
    retryOfferFxInputSchema,
    setOfferDeadlineInputSchema,
    updateOfferClaimInputSchema,
} from './schemas';
import { fixRateToUsd } from './fx';
import { pickAssignment } from './pickAssignment';
import {
    listVisibleOfferCards,
    loadOfferCardView,
    selectOfferCards,
    selectThreadEntries,
    toOfferCardView,
    toThreadEntryView,
} from './read';
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
const OFFER_ARCHIVED_MESSAGE = 'Offer card is archived';

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

    return listVisibleOfferCards(viewerFrom(me), 'all');
});

// The Attention Badge's items (offers-and-home/10): the same scoped read as the list, run through
// the pure builder against Kyiv's today. Live cards only — the rule drops archived ones itself, and
// the list read is bounded the same way. The Advertiser Claim field is not on the card yet (slice
// 07), so its presence travels as unknown and raises no item until then.
export const listAttentionItemsFn = createServerFn({ method: 'GET' }).handler(async (): Promise<AttentionView> => {
    const me = await requireUser();
    const today = kyivDay();
    const counted = await listVisibleOfferCards(viewerFrom(me), 'live');

    return {
        today,
        items: attentionItems(
            me.role,
            counted.map((view) => {
                return { ...view, hasClaim: null };
            }),
            today
        ),
    };
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

// Writes the Advertiser Claim (offers-and-home/07): one set of values, overwritten on every edit, no
// history (PRD story 19). bdm/head only, server-enforced; an archived card is read-only.
export const updateOfferClaimFn = createServerFn({ method: 'POST' })
    .inputValidator(updateOfferClaimInputSchema)
    .handler(async ({ data }): Promise<OfferCardView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        if (!canOffer(me.role, 'editClaim')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const current = await loadOfferCardView(viewer, data.offerCardId);

        if (!current) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        if (current.archivedAt !== null) {
            throw new Error(OFFER_ARCHIVED_MESSAGE);
        }

        await db
            .update(offerCard)
            .set({
                claimInstalls: data.installs,
                claimRegs: data.regs,
                claimSales: data.sales,
                updatedAt: new Date(),
            })
            // Guarded on live so a concurrent archive cannot be written over.
            .where(and(eq(offerCard.id, data.offerCardId), isNull(offerCard.archivedAt)));

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

// Who can receive a card: a buyer or team lead placed in a team, not disabled. One predicate for
// the picker's list and the change's check, so the two cannot drift apart.
const assignableUsersFilter = () => {
    return and(isNotNull(user.teamId), inArray(user.role, ['buyer', 'team_lead']), ne(user.status, 'disabled'));
};

// The roster the Assignment picker offers (offers-and-home/06): every team, and every user who can
// receive a card — a buyer or team lead placed in a team, not disabled. Gated like the change itself,
// so a role that cannot reassign never lists the company's people through this door.
export const listOfferAssigneesFn = createServerFn({ method: 'GET' }).handler(async (): Promise<OfferAssigneesView> => {
    const me = await requireUser();

    if (!canOffer(me.role, 'changeAssignment')) {
        throw new Error(FORBIDDEN_MESSAGE);
    }

    const [teams, users] = await Promise.all([
        db.select({ id: team.id, name: team.name }).from(team).orderBy(team.name),
        db
            .select({ id: user.id, nickname: user.nickname, teamId: user.teamId })
            .from(user)
            .where(assignableUsersFilter())
            .orderBy(user.nickname),
    ]);

    return {
        teams,
        users: users.flatMap((row) => {
            return row.teamId === null ? [] : [{ id: row.id, nickname: row.nickname, teamId: row.teamId }];
        }),
    };
});

// Fix an Unresolved Assignment or reassign a resolved one (PRD story 8, slice 06). The pick is
// validated against the roster by the pure seam; the raw team/recipient text the string named is
// never rewritten — it stays as the record of what was issued. An archived card is read-only.
export const changeOfferAssignmentFn = createServerFn({ method: 'POST' })
    .inputValidator(changeOfferAssignmentInputSchema)
    .handler(async ({ data }): Promise<ChangeOfferAssignmentResult> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        if (!canOffer(me.role, 'changeAssignment')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const current = await loadOfferCardView(viewer, data.offerCardId);

        if (!current) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        if (current.archivedAt !== null) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        // The same roster the picker lists — a hand-built request cannot name a disabled user or
        // a role that never receives a card.
        const [teams, users] = await Promise.all([
            db.select({ id: team.id }).from(team),
            db.select({ id: user.id, teamId: user.teamId }).from(user).where(assignableUsersFilter()),
        ]);
        const picked = pickAssignment({ teamId: data.teamId, buyerUserId: data.buyerUserId }, teams, users);

        if (!picked.ok) {
            return { ok: false, reason: picked.reason };
        }

        // The change and its Thread entry land together (PRD story 32): ownership history must
        // never miss a step. The entry names the new Assignment as people read it, with the actor.
        await db.transaction(async (tx) => {
            await tx
                .update(offerCard)
                .set({
                    teamId: picked.teamId,
                    buyerUserId: picked.buyerUserId,
                    isAssignmentUnresolved: false,
                    updatedAt: new Date(),
                })
                .where(eq(offerCard.id, data.offerCardId));

            const [assigned] = await tx
                .select({ teamName: team.name, buyerNickname: user.nickname })
                .from(offerCard)
                .leftJoin(team, eq(offerCard.teamId, team.id))
                .leftJoin(user, eq(offerCard.buyerUserId, user.id))
                .where(eq(offerCard.id, data.offerCardId))
                .limit(1);

            await tx.insert(offerThreadEntry).values({
                offerCardId: data.offerCardId,
                authorUserId: me.id,
                kind: 'assignment_changed',
                body: `${assigned?.teamName ?? current.assignedTeamText} · ${assigned?.buyerNickname ?? 'whole team'}`,
            });
        });

        const view = await loadOfferCardView(viewer, data.offerCardId);

        if (!view) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        return { ok: true, card: view };
    });

// Set, move or clear the Deadline (PRD stories 26–27, 29). Gated by the role's `editDeadline`
// capability — a buyer reads it, never moves it. Every actual change writes a system entry into
// the Thread with the actor and the new value; a no-op save writes nothing. Archived cards are
// read-only.
export const setOfferDeadlineFn = createServerFn({ method: 'POST' })
    .inputValidator(setOfferDeadlineInputSchema)
    .handler(async ({ data }): Promise<OfferCardView> => {
        const me = await requireUser();
        const viewer = viewerFrom(me);

        if (!canOffer(me.role, 'editDeadline')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const current = await loadOfferCardView(viewer, data.offerCardId);

        if (!current) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        if (current.archivedAt !== null) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        if (current.deadline === data.deadline) {
            return current;
        }

        await db.transaction(async (tx) => {
            await tx
                .update(offerCard)
                .set({ deadline: data.deadline, updatedAt: new Date() })
                .where(eq(offerCard.id, data.offerCardId));

            await tx.insert(offerThreadEntry).values({
                offerCardId: data.offerCardId,
                authorUserId: me.id,
                kind: 'deadline_changed',
                body: data.deadline === null ? '' : formatDeadline(data.deadline),
            });
        });

        const view = await loadOfferCardView(viewer, data.offerCardId);

        if (!view) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        return view;
    });

// ---- Thread (offers-and-home/08) ----------------------------------------------------------------

const ENTRY_NOT_FOUND_MESSAGE = 'Comment not found';

// Whoever may read the card may read its Thread (PRD story 30). Oldest first — newest at the bottom.
export const listOfferThreadFn = createServerFn({ method: 'GET' })
    .inputValidator(offerCardIdInputSchema)
    .handler(async ({ data }): Promise<OfferThreadEntryView[]> => {
        const me = await requireUser();
        const card = await loadOfferCardView(viewerFrom(me), data.offerCardId);

        if (!card) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        const rows = await selectThreadEntries()
            .where(eq(offerThreadEntry.offerCardId, data.offerCardId))
            .orderBy(offerThreadEntry.createdAt, offerThreadEntry.id);
        const now = new Date();

        return rows.map((row) => {
            return toThreadEntryView(me.id, now, row);
        });
    });

// Post a comment (PRD story 30). Read access to the card plus the role's `comment` capability;
// an archived card's Thread is closed to new comments (story 33).
export const addOfferCommentFn = createServerFn({ method: 'POST' })
    .inputValidator(addOfferCommentInputSchema)
    .handler(async ({ data }): Promise<OfferThreadEntryView> => {
        const me = await requireUser();

        if (!canOffer(me.role, 'comment')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const card = await loadOfferCardView(viewerFrom(me), data.offerCardId);

        if (!card) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        if (card.archivedAt !== null) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const [created] = await db
            .insert(offerThreadEntry)
            .values({ offerCardId: data.offerCardId, authorUserId: me.id, kind: 'comment', body: data.body })
            .returning({ id: offerThreadEntry.id });
        const [row] = await selectThreadEntries().where(eq(offerThreadEntry.id, created.id)).limit(1);

        if (!row) {
            throw new Error(ENTRY_NOT_FOUND_MESSAGE);
        }

        return toThreadEntryView(me.id, new Date(), row);
    });

// The author's own comment, within the 15-minute window (PRD story 31), on a card they can still
// read and that is still live. The window is judged here against `created_at`, not trusted from
// the client.
const loadEditableComment = async (me: MeData, entryId: string): Promise<void> => {
    const [row] = await selectThreadEntries().where(eq(offerThreadEntry.id, entryId)).limit(1);

    if (!row) {
        throw new Error(ENTRY_NOT_FOUND_MESSAGE);
    }

    const card = await loadOfferCardView(viewerFrom(me), row.offerCardId);

    if (!card) {
        throw new Error(ENTRY_NOT_FOUND_MESSAGE);
    }

    if (card.archivedAt !== null || !canEditComment(row, me.id, new Date())) {
        throw new Error(FORBIDDEN_MESSAGE);
    }
};

export const editOfferCommentFn = createServerFn({ method: 'POST' })
    .inputValidator(editOfferCommentInputSchema)
    .handler(async ({ data }): Promise<OfferThreadEntryView> => {
        const me = await requireUser();

        await loadEditableComment(me, data.entryId);

        await db
            .update(offerThreadEntry)
            .set({ body: data.body, editedAt: new Date() })
            .where(eq(offerThreadEntry.id, data.entryId));

        const [row] = await selectThreadEntries().where(eq(offerThreadEntry.id, data.entryId)).limit(1);

        if (!row) {
            throw new Error(ENTRY_NOT_FOUND_MESSAGE);
        }

        return toThreadEntryView(me.id, new Date(), row);
    });

// Soft delete: the row stays with `deleted_at` set so the stream keeps its shape and the unread
// rule can skip it.
export const deleteOfferCommentFn = createServerFn({ method: 'POST' })
    .inputValidator(offerThreadEntryIdInputSchema)
    .handler(async ({ data }): Promise<void> => {
        const me = await requireUser();

        await loadEditableComment(me, data.entryId);

        await db.update(offerThreadEntry).set({ deletedAt: new Date() }).where(eq(offerThreadEntry.id, data.entryId));
    });

// Opening a card marks it seen (PRD story 34): upsert the viewer's mark to now.
export const markOfferCardSeenFn = createServerFn({ method: 'POST' })
    .inputValidator(offerCardIdInputSchema)
    .handler(async ({ data }): Promise<void> => {
        const me = await requireUser();
        const card = await loadOfferCardView(viewerFrom(me), data.offerCardId);

        if (!card) {
            throw new Error(OFFER_NOT_FOUND_MESSAGE);
        }

        const now = new Date();

        await db
            .insert(offerCardSeen)
            .values({ userId: me.id, offerCardId: data.offerCardId, lastSeenAt: now })
            .onConflictDoUpdate({
                target: [offerCardSeen.userId, offerCardSeen.offerCardId],
                set: { lastSeenAt: now },
            });
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

// The offer buyer rating's rows (offers-and-home/11, PRD stories 38–45). Gated by `seeRating` — a
// buyer is refused, not handed an empty list (story 45) — and row-scoped through the same
// `listSnapshotsFilter` every Snapshot read composes, so a team lead reads their team only (story
// 44). Selection only (ADR-0004): every active push in the period for the buyers who ran the offer,
// the offer's Campaign Model rows, each campaign's Geo from that push's Facts, and the Frozen Geo
// Rollup's costing half; the client picks the latest push per day and prices the rows.
export const listOfferRatingFn = createServerFn({ method: 'GET' })
    .inputValidator(offerRatingInputSchema)
    .handler(async ({ data }): Promise<OfferRatingView> => {
        const me = await requireUser();

        if (!canOffer(me.role, 'seeRating')) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const scope = scopeFor(viewerFrom(me));
        const today = kyivDay();
        const empty: OfferRatingView = { today, snapshots: [], models: [], geos: [] };

        if (matchesNoRows(scope)) {
            return empty;
        }

        // `all` (the Claim Gap's actual side, slice 12) has no lower bound; `to` still cuts off a
        // report date from tomorrow, which the row-scope alone would let through.
        const { from, to } = ratingWindowRange(data.period, today);
        const inPeriod = and(
            listSnapshotsFilter(scope),
            from === null ? undefined : gte(snapshot.reportDate, from),
            lte(snapshot.reportDate, to)
        );

        // The offer's rows first: they name the pushes and the buyers the rest of the read is about.
        const modelRows = await db
            .select({
                snapshotId: snapshotCampaignModel.snapshotId,
                buyerUserId: snapshot.createdByUserId,
                campaign: snapshotCampaignModel.campaign,
                revenue: snapshotCampaignModel.revenue,
                installs: snapshotCampaignModel.installs,
                regs: snapshotCampaignModel.regs,
                sales: snapshotCampaignModel.sales,
            })
            .from(snapshotCampaignModel)
            .innerJoin(snapshot, eq(snapshotCampaignModel.snapshotId, snapshot.id))
            .where(
                and(inPeriod, eq(snapshotCampaignModel.dimension, 'offer'), eq(snapshotCampaignModel.key, data.offerId))
            );

        if (modelRows.length === 0) {
            return empty;
        }

        const snapshotIds = [
            ...new Set(
                modelRows.map((row) => {
                    return row.snapshotId;
                })
            ),
        ];
        const buyerIds = [
            ...new Set(
                modelRows.map((row) => {
                    return row.buyerUserId;
                })
            ),
        ];
        const campaigns = [
            ...new Set(
                modelRows.map((row) => {
                    return row.campaign;
                })
            ),
        ];

        // Every push of those buyers in the period, not only the ones carrying the offer: the latest
        // push restates the day, and one that dropped the offer must win over an earlier one that had
        // it (ADR-0017). Nicknames ride along so the rating needs no roster read.
        const [pushes, campaignGeos, geos] = await Promise.all([
            db
                .select({
                    snapshotId: snapshot.id,
                    buyerUserId: snapshot.createdByUserId,
                    buyerNickname: user.nickname,
                    reportDate: snapshot.reportDate,
                    takenAt: snapshot.takenAt,
                    status: snapshot.status,
                })
                .from(snapshot)
                .innerJoin(user, eq(snapshot.createdByUserId, user.id))
                .where(and(inPeriod, inArray(snapshot.createdByUserId, buyerIds)))
                .orderBy(snapshot.takenAt),
            db
                .selectDistinct({
                    snapshotId: snapshotFact.snapshotId,
                    campaign: snapshotFact.campaign,
                    geo: snapshotFact.geo,
                })
                .from(snapshotFact)
                .where(and(inArray(snapshotFact.snapshotId, snapshotIds), inArray(snapshotFact.campaign, campaigns))),
            db
                .select({
                    snapshotId: snapshotGeo.snapshotId,
                    geo: snapshotGeo.geo,
                    spendPlus: snapshotGeo.spendPlus,
                    installs: snapshotGeo.installs,
                })
                .from(snapshotGeo)
                .where(inArray(snapshotGeo.snapshotId, snapshotIds)),
        ]);

        const geoOf = new Map(
            campaignGeos.map((row) => {
                return [`${row.snapshotId}\u0000${row.campaign}`, row.geo] as const;
            })
        );

        return {
            today,
            snapshots: pushes.map((row) => {
                return { ...row, takenAt: row.takenAt.toISOString() };
            }),
            models: modelRows.map((row) => {
                return {
                    snapshotId: row.snapshotId,
                    campaign: row.campaign,
                    // A campaign with no Fact in its own push has no market to price it in; the
                    // rule then allocates it nothing.
                    geo: geoOf.get(`${row.snapshotId}\u0000${row.campaign}`) ?? '',
                    revenue: row.revenue,
                    installs: row.installs,
                    regs: row.regs,
                    sales: row.sales,
                };
            }),
            geos,
        };
    });
