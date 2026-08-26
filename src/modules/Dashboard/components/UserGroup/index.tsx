import type { Locale } from '@/components/report/utils/i18n';
import type { ReportUserGroup } from '../../types';
import { Link } from '@tanstack/react-router';
import { ArrowUpRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ui } from '@/components/report/utils/i18n';
import { AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { SnapshotCard } from '../SnapshotCard';

type UserGroupProps = {
    group: ReportUserGroup;
    locale: Locale;
};

// Last-ever push as an absolute local date + time. Deliberately not "3 days ago": an overseer scanning
// a roster is comparing people to each other, and a relative phrase makes that arithmetic harder.
const stampFormat = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

// One person in the feed. A user with nothing in range still renders — collapsed and dimmed, headed by
// the time they last reported EVER, or "never" (spec stories 4, 5). That is what makes "nobody
// reported today" informative rather than a blank page.
function UserGroup({ group, locale }: UserGroupProps) {
    const { user, cards } = group;
    const isQuiet = cards.length === 0;
    const lastReport = user.lastTakenAt ? stampFormat.format(new Date(user.lastTakenAt)) : ui('never', locale);

    return (
        <AccordionItem
            value={user.id}
            disabled={isQuiet}
            className={cn('border-border rounded-lg border p-3', isQuiet && 'opacity-50')}
        >
            <AccordionHeader>
                <AccordionTrigger className="w-full">
                    <span className="text-foreground text-base font-semibold">{user.nickname}</span>
                    <span className="text-muted-foreground text-xs">
                        {ui('lastReport', locale)}: {lastReport}
                    </span>
                    <span className="flex-1" />
                    {isQuiet && <span className="text-muted-foreground text-xs">{ui('noReportsInRange', locale)}</span>}
                </AccordionTrigger>
            </AccordionHeader>

            <AccordionPanel>
                <div className="flex flex-col gap-4 pt-3">
                    {cards.map((card) => {
                        return <SnapshotCard key={card.snapshotId} card={card} locale={locale} />;
                    })}

                    {/* The way out of the range: this person's whole history, in the archive, where
                        every re-push survives. `all` rather than the current window on purpose — the
                        question this answers is "what has this buyer ever reported", and carrying the
                        feed's range would just reproduce the cards directly above it. */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="self-end"
                        render={
                            <Link to="/dashboard/archive" search={{ range: 'all', user: user.id }}>
                                {ui('userArchive', locale)}
                                <ArrowUpRightIcon />
                            </Link>
                        }
                    />
                </div>
            </AccordionPanel>
        </AccordionItem>
    );
}

export { UserGroup };
