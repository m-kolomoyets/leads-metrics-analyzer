import type { CreateOfferCardInput } from '@/services/offers/schemas';
import type { OfferFilterOption } from './components/OffersFilters/types';
import type { OffersSearch } from './schemas';
import type { OfferFilterSubject } from './utils/filterCards';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { PlusIcon, SearchXIcon, TagIcon } from 'lucide-react';
import { canOffer } from '@/lib/auth/offerAccess';
import { hasClaim } from '@/lib/domain/claim';
import { deadlineState } from '@/lib/domain/deadline';
import { kyivDay } from '@/lib/utils/kyivDay';
import { offerCardsQueryOptions, unlistedOffersQueryOptions } from '@/services/offers/queries';
import {
    MainLayoutHeader,
    MainLayoutHeaderActions,
    MainLayoutHeaderTitle,
} from '@/components/layouts/MainLayoutHeader';
import { Button } from '@/components/ui/Button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/Empty';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { filterOfferCards } from './utils/filterCards';
import { CreateOfferCardForm } from './components/CreateOfferCardForm';
import { OfferCardItem } from './components/OfferCardItem';
import { OffersFilters } from './components/OffersFilters';
import { UnlistedOffers } from './components/UnlistedOffers';

const routeApi = getRouteApi('/_authenticated/offers/');

// The Offers directory (offers-and-home/04, 05). The list is already scoped by the server through
// `offerAccessFor` — a buyer gets own/team-wide cards, a team lead their team's, bdm/head all — so
// this page slices what comes back by the URL's search and filters (ADR-0004) and never asks the
// server twice for the same question. Creation is for the roles that issue offers (`canOffer`).
function Offers() {
    const search = routeApi.useSearch();
    const navigate = routeApi.useNavigate();
    const { data: cards } = useSuspenseQuery(offerCardsQueryOptions());
    const { data: unlisted } = useSuspenseQuery(unlistedOffersQueryOptions());
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });
    const canCreate = canOffer(role, 'create');
    const canArchive = canOffer(role, 'archive');
    const canChangeAssignment = canOffer(role, 'changeAssignment');
    const canComment = canOffer(role, 'comment');
    const canEditDeadline = canOffer(role, 'editDeadline');
    const canSeeRating = canOffer(role, 'seeRating');
    const canEditClaim = canOffer(role, 'editClaim');
    // Null while closed; an object (possibly empty) while open, so a seed from an Unlisted Offer
    // survives until the sheet closes and the next "New card" opens blank.
    const [createSeed, setCreateSeed] = useState<Partial<CreateOfferCardInput> | null>(null);

    const query = search.q ?? '';
    // Today is Kyiv's today (ADR-0017): the filter, the marks and the badge judge one day.
    const today = kyivDay();
    const subjects = cards.map((card): OfferFilterSubject & { card: typeof card } => {
        return {
            card,
            offerId: card.offerId,
            rawString: card.rawString,
            teamId: card.teamId,
            buyerUserId: card.buyerUserId,
            archivedAt: card.archivedAt,
            deadline: card.deadline,
            deadlineState: deadlineState(card, today),
            hasClaim: hasClaim(card.claim),
        };
    });
    const visible = filterOfferCards(subjects, search);

    // The pickers name only what the viewer's cards name — scope-safe by construction. The buyer list
    // narrows to the chosen team so the two filters cannot be set to contradict each other.
    const teams = uniqueOptions(
        cards.flatMap((card) => {
            return card.teamId && card.teamName ? [{ value: card.teamId, label: card.teamName }] : [];
        })
    );
    const buyers = uniqueOptions(
        cards.flatMap((card) => {
            if (!card.buyerUserId || !card.buyerNickname) {
                return [];
            }

            if (search.team !== undefined && card.teamId !== search.team) {
                return [];
            }

            return [{ value: card.buyerUserId, label: card.buyerNickname }];
        })
    );

    function changeSearch(next: OffersSearch) {
        // Replaced rather than pushed, as on the feed: the search box fires per keystroke.
        navigate({ search: next, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle>Offers</MainLayoutHeaderTitle>
                {canCreate && (
                    <MainLayoutHeaderActions>
                        <Button
                            size="sm"
                            onClick={() => {
                                setCreateSeed({});
                            }}
                        >
                            <PlusIcon className="size-4" />
                            New card
                        </Button>
                    </MainLayoutHeaderActions>
                )}
            </MainLayoutHeader>

            <div className="flex flex-col gap-6">
                <OffersFilters search={search} onChange={changeSearch} teams={teams} buyers={buyers} />

                {visible.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">{cards.length === 0 ? <TagIcon /> : <SearchXIcon />}</EmptyMedia>
                            <EmptyTitle>{cards.length === 0 ? 'No offer cards yet' : 'No cards match'}</EmptyTitle>
                            <EmptyDescription>{emptyDescription(cards.length, search, canCreate)}</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {visible.map(({ card, deadlineState: state }) => {
                            return (
                                <li key={card.id}>
                                    <OfferCardItem
                                        card={card}
                                        deadlineState={state}
                                        canEditDeadline={canEditDeadline}
                                        query={query}
                                        canRetryFx={canCreate}
                                        canArchive={canArchive}
                                        canChangeAssignment={canChangeAssignment}
                                        canComment={canComment}
                                        canSeeRating={canSeeRating}
                                        canEditClaim={canEditClaim}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                )}

                <UnlistedOffers
                    offers={unlisted}
                    query={query}
                    canCreate={canCreate}
                    onCreate={(offer) => {
                        setCreateSeed({ offerId: offer.offerId, rawString: offer.label });
                    }}
                />
            </div>

            {canCreate && (
                <Sheet
                    open={createSeed !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setCreateSeed(null);
                        }
                    }}
                >
                    <SheetContent className="gap-0">
                        <SheetHeader>
                            <SheetTitle>New offer card</SheetTitle>
                            <SheetDescription>
                                Paste the offer string as issued. Payout and assignment are read from it; the rest stays
                                as the card&apos;s caption.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="p-4">
                            {createSeed !== null && (
                                <CreateOfferCardForm
                                    defaultValues={createSeed}
                                    onSuccess={() => {
                                        setCreateSeed(null);
                                    }}
                                />
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </>
    );
}

// De-duplicates picker options by value, keeping first-seen order (the list is newest first, so a
// team's most recent card names it), then sorts by label for a stable picker.
function uniqueOptions(options: OfferFilterOption[]): OfferFilterOption[] {
    const byValue = new Map<string, OfferFilterOption>();

    for (const option of options) {
        if (!byValue.has(option.value)) {
            byValue.set(option.value, option);
        }
    }

    return [...byValue.values()].sort((a, b) => {
        return a.label.localeCompare(b.label);
    });
}

function emptyDescription(total: number, search: OffersSearch, canCreate: boolean): string {
    if (total === 0) {
        return canCreate
            ? 'Paste an offer string to create the first card.'
            : 'Cards assigned to you or your team will show up here.';
    }

    if (search.archived) {
        return 'No archived cards match. Switch to Live to see the current ones.';
    }

    return 'Try another search or clear the filters.';
}

export { Offers };
