import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { PlusIcon, TagIcon } from 'lucide-react';
import { canOffer } from '@/lib/auth/offerAccess';
import { offerCardsQueryOptions } from '@/services/offers/queries';
import {
    MainLayoutHeader,
    MainLayoutHeaderActions,
    MainLayoutHeaderTitle,
} from '@/components/layouts/MainLayoutHeader';
import { Button } from '@/components/ui/Button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/Empty';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { CreateOfferCardForm } from './components/CreateOfferCardForm';
import { OfferCardItem } from './components/OfferCardItem';

const routeApi = getRouteApi('/_authenticated');

// The Offers directory (offers-and-home/04). The list is already scoped by the server through
// `offerAccessFor` — a buyer gets own/team-wide cards, a team lead their team's, bdm/head all — so
// this page renders what comes back. Creation is for the roles that issue offers (`canOffer`).
function Offers() {
    const { data: cards } = useSuspenseQuery(offerCardsQueryOptions());
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });
    const canCreate = canOffer(role, 'create');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle>Offers</MainLayoutHeaderTitle>
                {canCreate && (
                    <MainLayoutHeaderActions>
                        <Button
                            size="sm"
                            onClick={() => {
                                setIsCreateOpen(true);
                            }}
                        >
                            <PlusIcon className="size-4" />
                            New card
                        </Button>
                    </MainLayoutHeaderActions>
                )}
            </MainLayoutHeader>

            {cards.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <TagIcon />
                        </EmptyMedia>
                        <EmptyTitle>No offer cards yet</EmptyTitle>
                        <EmptyDescription>
                            {canCreate
                                ? 'Paste an offer string to create the first card.'
                                : 'Cards assigned to you or your team will show up here.'}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <ul className="flex flex-col gap-3">
                    {cards.map((card) => {
                        return (
                            <li key={card.id}>
                                <OfferCardItem card={card} canRetryFx={canCreate} />
                            </li>
                        );
                    })}
                </ul>
            )}

            {canCreate && (
                <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <SheetContent className="gap-0">
                        <SheetHeader>
                            <SheetTitle>New offer card</SheetTitle>
                            <SheetDescription>
                                Paste the offer string as issued. Payout and assignment are read from it; the rest stays
                                as the card&apos;s caption.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="p-4">
                            <CreateOfferCardForm
                                onSuccess={() => {
                                    setIsCreateOpen(false);
                                }}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </>
    );
}

export { Offers };
