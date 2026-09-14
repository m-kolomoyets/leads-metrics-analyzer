import type { AttentionItem, AttentionSeverity } from '@/lib/domain/attention';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { BellIcon } from 'lucide-react';
import { attentionSeverity } from '@/lib/domain/attention';
import { hasPermissions } from '@/lib/utils/auth/permissions';
import { cn } from '@/lib/utils/cn';
import { attentionQueryOptions } from '@/services/offers/queries';
import { offerCardAnchor } from '@/modules/Offers/constants';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { ATTENTION_KIND_ORDER, ATTENTION_KIND_TITLES, attentionItemText, attentionSummaryText } from './utils/itemText';

const routeApi = getRouteApi('/_authenticated');

// The badge's paint by severity (PRD story 36): red iff anything is past due, else yellow — the
// same `--zone-*` the Deadline marks wear, so the bar and the card agree on what red means.
const SEVERITY_VARIANT: Record<Exclude<AttentionSeverity, 'none'>, 'yellow' | 'red'> = {
    warning: 'yellow',
    urgent: 'red',
};

// The Attention Badge (offers-and-home/10, CONTEXT.md): one counter in the bar of what needs the
// viewer's action now, hidden at zero. Its click opens the items grouped by kind, each a link that
// lands on the card in the directory (story 36). Read with `useQuery`, not Suspense: the bar must
// not wait on a poll. Roles that cannot open Offers (Designer) have nothing to be told.
function AttentionBadge() {
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });
    const canView = hasPermissions('offers.view', role);
    const { data } = useQuery({ ...attentionQueryOptions(), enabled: canView });
    const [isOpen, setIsOpen] = useState(false);

    if (!canView || data === undefined) {
        return null;
    }

    const severity = attentionSeverity(data.items);

    if (severity === 'none') {
        return null;
    }

    const urgentCount = data.items.filter((item) => {
        return item.severity === 'urgent';
    }).length;
    const variant = SEVERITY_VARIANT[severity];
    const groups = ATTENTION_KIND_ORDER.flatMap((kind) => {
        const items = data.items.filter((item) => {
            return item.kind === kind;
        });

        return items.length > 0 ? [{ kind, items }] : [];
    });

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
                render={
                    <Button
                        variant="ghost"
                        size="sm"
                        aria-label={attentionSummaryText(data.items.length, urgentCount)}
                        className={cn(
                            'ml-auto shrink-0',
                            variant === 'red'
                                ? 'text-zone-red hover:text-zone-red'
                                : 'text-zone-yellow hover:text-zone-yellow'
                        )}
                    >
                        <BellIcon />
                        <Badge variant={variant} aria-hidden>
                            {data.items.length}
                        </Badge>
                    </Button>
                }
            />
            <PopoverContent align="end" className="w-72 p-0">
                <nav aria-label="Needs attention" className="max-h-96 overflow-y-auto p-1.5">
                    {groups.map((group) => {
                        return (
                            <section key={group.kind} className="not-first:mt-1.5">
                                <h3 className="text-muted-foreground px-2 py-1 text-xs font-medium">
                                    {ATTENTION_KIND_TITLES[group.kind]}
                                </h3>
                                <ul>
                                    {group.items.map((item) => {
                                        return (
                                            <li key={item.offerCardId}>
                                                <AttentionLink
                                                    item={item}
                                                    today={data.today}
                                                    onNavigate={() => {
                                                        setIsOpen(false);
                                                    }}
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        );
                    })}
                </nav>
            </PopoverContent>
        </Popover>
    );
}

type AttentionLinkProps = {
    item: AttentionItem;
    today: string;
    onNavigate: () => void;
};

// One row: the card's id, then what it wants. Lands on the card by its anchor with every directory
// filter cleared, so a filter set earlier cannot hide the card the row promised.
function AttentionLink({ item, today, onNavigate }: AttentionLinkProps) {
    return (
        <Link
            to="/offers"
            search={{}}
            hash={offerCardAnchor(item.offerCardId)}
            onClick={onNavigate}
            className={cn(
                'hover:bg-hover focus-visible:ring-ring flex items-baseline gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus-visible:ring-2',
                item.severity === 'urgent' && 'text-zone-red'
            )}
        >
            <span className="font-medium tabular-nums">#{item.offerId}</span>
            <span className="text-muted-foreground truncate">{attentionItemText(item, today)}</span>
        </Link>
    );
}

export { AttentionBadge };
