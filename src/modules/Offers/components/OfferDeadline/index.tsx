import type { DeadlineState } from '@/lib/domain/deadline';
import type { OfferDeadlineProps } from './types';
import { useMutation } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { formatDeadline } from '@/lib/domain/deadline';
import { setOfferDeadlineMutationOptions } from '@/services/offers/queries';
import { DatePicker } from '@/components/DatePicker';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// The mark's paint per state (PRD story 28): yellow within three days, red past due. Neutral wears
// none — the date alone.
const MARK: Record<Exclude<DeadlineState, 'neutral'>, { variant: 'yellow' | 'red'; label: string }> = {
    'due-soon': { variant: 'yellow', label: 'Due soon' },
    overdue: { variant: 'red', label: 'Overdue' },
};

// A card's Deadline (offers-and-home/09, PRD stories 26–28): the date with its mark for everyone;
// a picker and a clear for the roles that may move it, on a live card. Every change goes to the
// server, which writes the Thread entry — nothing is optimistic, so the mark never lies.
function OfferDeadline({ card, state, canEdit }: OfferDeadlineProps) {
    const { mutate: setDeadline, isPending } = useMutation(setOfferDeadlineMutationOptions());
    const isEditable = canEdit && card.archivedAt === null;

    function change(deadline: string | null) {
        setDeadline(
            { offerCardId: card.id, deadline },
            {
                onSuccess() {
                    toast.success(
                        deadline === null ? 'Deadline cleared' : `Deadline set to ${formatDeadline(deadline)}`
                    );
                },
                onError() {
                    toast.error('Failed to change the deadline');
                },
            }
        );
    }

    const mark = state === 'neutral' ? null : <Badge variant={MARK[state].variant}>{MARK[state].label}</Badge>;

    if (!isEditable) {
        return (
            <span className="text-foreground flex items-center gap-2">
                {card.deadline === null ? (
                    <span className="text-muted-foreground">—</span>
                ) : (
                    <time dateTime={card.deadline}>{formatDeadline(card.deadline)}</time>
                )}
                {mark}
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1">
            <DatePicker
                value={card.deadline ?? ''}
                onChange={change}
                locale="en"
                disabled={isPending}
                className="h-6 rounded-sm px-2 text-xs"
            />
            {card.deadline !== null && (
                <Button
                    size="icon-xs"
                    variant="ghost"
                    aria-label="Clear deadline"
                    disabled={isPending}
                    onClick={() => {
                        change(null);
                    }}
                >
                    <XIcon />
                </Button>
            )}
            {mark}
        </span>
    );
}

export { OfferDeadline };
