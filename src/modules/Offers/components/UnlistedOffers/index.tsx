import type { UnlistedOffersProps } from './types';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { matchesOfferSearch } from '../../utils/filterCards';
import { Highlight } from '../Highlight';

const lastRunFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

// Unlisted Offers (PRD story 15): real traffic in the viewer's Snapshots with no card to manage it —
// shown, never hidden. The search narrows this section too (an id typed into the box should find the
// offer wherever it is); the other filters do not apply, since an Unlisted Offer has no Assignment,
// Deadline or Claim to filter by. "Create card" opens the form with the model label as the seed —
// the label is the first blocks of the offer name, so the author pastes the full string over it.
function UnlistedOffers({ offers, query, canCreate, onCreate }: UnlistedOffersProps) {
    const visible = offers.filter((offer) => {
        return matchesOfferSearch({ offerId: offer.offerId, rawString: offer.label }, query);
    });

    if (visible.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="unlisted-offers-heading" className="flex flex-col gap-3">
            <header className="flex items-baseline gap-2">
                <h2 id="unlisted-offers-heading" className="text-sm font-semibold">
                    Unlisted
                </h2>
                <p className="text-muted-foreground text-xs">Running in snapshots, no card yet · {visible.length}</p>
            </header>

            <ul className="flex flex-col gap-2">
                {visible.map((offer) => {
                    return (
                        <li key={offer.offerId}>
                            <Card
                                render={<article />}
                                className="flex flex-wrap items-center gap-x-4 gap-y-1 border-dashed px-4 py-3"
                            >
                                <h3 className="text-sm font-semibold tabular-nums">
                                    #<Highlight text={offer.offerId} query={query} />
                                </h3>
                                <p className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-xs">
                                    <Highlight text={offer.label} query={query} />
                                </p>
                                {offer.lastReportDate !== '' && (
                                    <p className="text-muted-foreground text-xs">
                                        Last run{' '}
                                        <time dateTime={offer.lastReportDate}>
                                            {lastRunFormat.format(new Date(offer.lastReportDate))}
                                        </time>
                                    </p>
                                )}
                                {canCreate && (
                                    <Button
                                        type="button"
                                        size="xs"
                                        variant="outline"
                                        onClick={() => {
                                            onCreate(offer);
                                        }}
                                    >
                                        <PlusIcon data-icon="inline-start" />
                                        Create card
                                    </Button>
                                )}
                            </Card>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export { UnlistedOffers };
