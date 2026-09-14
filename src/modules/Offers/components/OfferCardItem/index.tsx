import type { OfferWarning } from '@/services/offers/warnings';
import type { OfferCardItemProps } from './types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    ArchiveIcon,
    ArchiveRestoreIcon,
    MessageSquareIcon,
    RefreshCwIcon,
    TriangleAlertIcon,
    UsersIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import {
    archiveOfferCardMutationOptions,
    retryOfferFxMutationOptions,
    unarchiveOfferCardMutationOptions,
} from '@/services/offers/queries';
import { offerWarnings } from '@/services/offers/warnings';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { offerCardAnchor } from '../../constants';
import { formatPayoutOriginal, formatPayoutUsd } from '../../utils/formatPayout';
import { ChangeAssignmentForm } from '../ChangeAssignmentForm';
import { Highlight } from '../Highlight';
import { OfferDeadline } from '../OfferDeadline';
import { OfferThread } from '../OfferThread';

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
// with its fix where one exists (retry the rate, change the Assignment — slice 06). An archived card
// is read-only (story 10): it keeps everything but offers no action beyond unarchive.
function OfferCardItem({
    card,
    query,
    canRetryFx,
    canArchive,
    canChangeAssignment,
    canComment,
    deadlineState,
    canEditDeadline,
}: OfferCardItemProps) {
    const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
    const [isThreadOpen, setIsThreadOpen] = useState(false);
    const { mutate: retryFx, isPending: isRetrying } = useMutation(retryOfferFxMutationOptions());
    const { mutate: archive, isPending: isArchiving } = useMutation(archiveOfferCardMutationOptions());
    const { mutate: unarchive, isPending: isUnarchiving } = useMutation(unarchiveOfferCardMutationOptions());
    const isArchived = card.archivedAt !== null;
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

    function handleArchive() {
        archive(
            { offerCardId: card.id },
            {
                onSuccess() {
                    toast.success('Offer card archived');
                },
                onError() {
                    toast.error('Failed to archive the card');
                },
            }
        );
    }

    function handleUnarchive() {
        unarchive(
            { offerCardId: card.id },
            {
                onSuccess(result) {
                    if (result.ok) {
                        toast.success('Offer card restored');
                    } else {
                        toast.error('A live card for this offer already exists');
                    }
                },
                onError() {
                    toast.error('Failed to restore the card');
                },
            }
        );
    }

    return (
        <Card
            render={<article />}
            id={offerCardAnchor(card.id)}
            // A hash landing (duplicate link, Attention Badge) scrolls the card clear of the fixed bar
            // and the sticky page header, which would otherwise cover exactly the card promised.
            className={cn(
                'flex scroll-mt-[calc(var(--navbar-height,0px)+4rem)] flex-col gap-3 p-4 target:ring-2 target:ring-ring',
                isArchived && 'border-dashed'
            )}
        >
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="flex items-baseline gap-2 text-base font-semibold tabular-nums">
                    <span>
                        #<Highlight text={card.offerId} query={query} />
                    </span>
                    {isArchived && <Badge variant="outline">Archived</Badge>}
                </h3>
                <p className="flex items-baseline gap-2">
                    <span className={card.payoutUsd === null ? 'text-muted-foreground text-sm' : 'font-semibold'}>
                        {formatPayoutUsd(card)}
                    </span>
                    {original && <span className="text-muted-foreground text-xs">({original})</span>}
                </p>
            </header>

            <p className="text-muted-foreground font-mono text-xs break-words">
                <Highlight text={card.rawString} query={query} />
            </p>

            <dl className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 text-xs">
                <div className="flex gap-1">
                    <dt>Assigned to</dt>
                    <dd className="text-foreground flex items-center gap-2">
                        {card.isAssignmentUnresolved ? <Badge variant="yellow">{assignment}</Badge> : assignment}
                        {canChangeAssignment && !isArchived && (
                            <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => {
                                    setIsAssignmentOpen(true);
                                }}
                            >
                                <UsersIcon data-icon="inline-start" />
                                Change
                            </Button>
                        )}
                    </dd>
                </div>
                <div className="flex items-center gap-1">
                    <dt>Deadline</dt>
                    <dd>
                        <OfferDeadline card={card} state={deadlineState} canEdit={canEditDeadline} />
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
                                {warning.kind === 'fx_pending' && canRetryFx && !isArchived && (
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

            <footer className="flex items-center justify-between gap-2">
                <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                        setIsThreadOpen(true);
                    }}
                >
                    <MessageSquareIcon data-icon="inline-start" />
                    Thread
                    {card.unreadCount > 0 && (
                        <Badge variant="default" aria-label={`${card.unreadCount} unread`}>
                            {card.unreadCount}
                        </Badge>
                    )}
                </Button>
                {canArchive &&
                    (isArchived ? (
                        <Button size="xs" variant="ghost" onClick={handleUnarchive} isLoading={isUnarchiving}>
                            <ArchiveRestoreIcon data-icon="inline-start" />
                            Unarchive
                        </Button>
                    ) : (
                        <Button size="xs" variant="ghost" onClick={handleArchive} isLoading={isArchiving}>
                            <ArchiveIcon data-icon="inline-start" />
                            Archive
                        </Button>
                    ))}
            </footer>

            <OfferThread card={card} open={isThreadOpen} onOpenChange={setIsThreadOpen} canComment={canComment} />

            {canChangeAssignment && (
                <Dialog open={isAssignmentOpen} onOpenChange={setIsAssignmentOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change assignment</DialogTitle>
                            <DialogDescription>
                                Pick the team and, optionally, one of its members. The card becomes visible to them
                                right away.
                            </DialogDescription>
                        </DialogHeader>
                        {isAssignmentOpen && (
                            <ChangeAssignmentForm
                                card={card}
                                onSuccess={() => {
                                    setIsAssignmentOpen(false);
                                }}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
}

export { OfferCardItem };
