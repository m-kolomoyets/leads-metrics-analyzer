import type { OfferWarning } from '@/services/offers/warnings';
import type { OfferCardItemProps } from './types';
import { useMutation } from '@tanstack/react-query';
import { RefreshCwIcon, TriangleAlertIcon } from 'lucide-react';
import { toast } from 'sonner';
import { retryOfferFxMutationOptions } from '@/services/offers/queries';
import { offerWarnings } from '@/services/offers/warnings';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { offerCardAnchor } from '../../constants';
import { formatPayoutOriginal, formatPayoutUsd } from '../../utils/formatPayout';

const createdFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

const warningText = (warning: OfferWarning): string => {
    switch (warning.kind) {
        case 'team_unresolved': {
            return `Team "${warning.text}" matches no team — assignment unresolved.`;
        }
        case 'buyer_unresolved': {
            return `Recipient "${warning.text}" matches no user — assignment unresolved.`;
        }
        case 'fx_pending': {
            return 'Rate service was unreachable — payout not fixed in USD yet.';
        }
    }
};

// One Offer Card in the directory (offers-and-home/04): id and Payout up top, the raw string as the
// caption underneath (PRD story 12), then who it is for and who issued it. Warnings sit last, each
// with its fix where one exists here (retry the rate); fixing an Assignment is slice 06.
function OfferCardItem({ card, canRetryFx }: OfferCardItemProps) {
    const { mutate: retryFx, isPending: isRetrying } = useMutation(retryOfferFxMutationOptions());
    const warnings = offerWarnings(card);
    const original = formatPayoutOriginal(card);
    const assignment = card.isAssignmentUnresolved
        ? 'Unresolved'
        : `${card.teamName ?? card.assignedTeamText}${card.buyerNickname ? ` · ${card.buyerNickname}` : ' · whole team'}`;

    function handleRetryFx() {
        retryFx(
            { offerCardId: card.id },
            {
                onSuccess(updated) {
                    if (updated.fxStatus === 'fixed') {
                        toast.success('Payout fixed in USD');
                    } else {
                        toast.error('Rate service still unreachable');
                    }
                },
                onError() {
                    toast.error('Failed to retry the rate');
                },
            }
        );
    }

    return (
        <Card
            render={<article />}
            id={offerCardAnchor(card.id)}
            className="flex flex-col gap-3 p-4 target:ring-2 target:ring-ring"
        >
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-base font-semibold tabular-nums">#{card.offerId}</h3>
                <p className="flex items-baseline gap-2">
                    <span className={card.payoutUsd === null ? 'text-muted-foreground text-sm' : 'font-semibold'}>
                        {formatPayoutUsd(card)}
                    </span>
                    {original && <span className="text-muted-foreground text-xs">({original})</span>}
                </p>
            </header>

            <p className="text-muted-foreground font-mono text-xs break-words">{card.rawString}</p>

            <dl className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 text-xs">
                <div className="flex gap-1">
                    <dt>Assigned to</dt>
                    <dd className="text-foreground">
                        {card.isAssignmentUnresolved ? <Badge variant="yellow">{assignment}</Badge> : assignment}
                    </dd>
                </div>
                <div className="flex gap-1">
                    <dt>Created by</dt>
                    <dd className="text-foreground">{card.createdByNickname}</dd>
                </div>
                <div className="flex gap-1">
                    <dt>Created</dt>
                    <dd className="text-foreground">
                        <time dateTime={card.createdAt}>{createdFormat.format(new Date(card.createdAt))}</time>
                    </dd>
                </div>
            </dl>

            {warnings.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {warnings.map((warning) => {
                        return (
                            <li key={warning.kind} className="text-zone-yellow flex items-center gap-2 text-xs">
                                <TriangleAlertIcon className="size-3.5 shrink-0" aria-hidden="true" />
                                <span>{warningText(warning)}</span>
                                {warning.kind === 'fx_pending' && canRetryFx && (
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={handleRetryFx}
                                        isLoading={isRetrying}
                                        className="ml-auto"
                                    >
                                        <RefreshCwIcon className="size-3" />
                                        Retry rate
                                    </Button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
}

export { OfferCardItem };
