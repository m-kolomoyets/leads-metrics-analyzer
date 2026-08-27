import type { BuyerTabState } from '@/modules/Dynamics/utils/buyerTabs';
import type { MemberDay } from '@/modules/Dynamics/utils/memberDays';
import { Link } from '@tanstack/react-router';
import { dayLabel } from '@/lib/utils/calendarMonth';
import { cn } from '@/lib/utils/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { DOT_CLASS, DOT_LABEL, OPENABLE_STATES } from '../../constants';
import { DayTooltip } from '../DayTooltip';

// A month as a shape. Thirty small marks answer a question no single figure can — is this person
// steady, or did one green day carry the month — and they answer it before the reader has clicked
// anything, which is the same job the buyer row was already doing for today.
//
// Three rows, filled left to right, with the column count taken from the month's own length — never
// a calendar's seven columns: the row a dot lands on carries no meaning here, and a weekday grid
// would invite a reader to compare Tuesdays when what the card is for is the run of the month.
//
// Three rather than "as many as fit" because the block is now a fixed shape on a fixed-width card: a
// wrapping grid grew and shrank a row between February and March, and two cards side by side with
// different heights read as two different kinds of card.

// How many rows the month is laid out on. The column count follows from it, so a 28-day February and
// a 31-day March are the same three rows at slightly different widths.
const GRID_ROWS = 3;

// Today's dot is ALWAYS marked, whatever state the person is in. It was once marked only when they
// owed a report, which meant the mark disappeared the moment they pushed — exactly when a reader
// most wants to find today in the row and see what it did. So the mark says WHERE today is, and its
// colour says whether today needs acting on: red and amber keep the glow, because "you are owed a
// report" is a thing to walk over about; every other state takes a plain hairline, which is chrome
// and claims nothing.
//
// An outline rather than a ring: Tailwind's ring is a box-shadow, the glow is a box-shadow, and the
// two would take turns winning the cascade. Outline draws outside the box and leaves the shadow free.
const TODAY_OUTLINE: Record<BuyerTabState, string> = {
    missing: 'outline-zone-red glow-dot-red',
    stale: 'outline-zone-yellow glow-dot-yellow',
    loss: 'outline-foreground',
    profit: 'outline-foreground',
    reported: 'outline-foreground',
    awaited: 'outline-foreground',
};

type MonthGridProps = {
    days: MemberDay[];
    // The day the page is READING — which is today until a dot or a link says otherwise. Marked
    // separately from today, and in the accent rather than a zone colour: "this is what you are
    // looking at" is navigation, not a verdict on the day.
    reading: string;
    // Whose month it is — the link's destination, and the tooltip's heading.
    buyerId: string;
    nickname: string;
    // NOW, in Kyiv (ADR-0017) — never the day the page happens to be reading. Following the read day
    // put the "today" mark on whichever dot had last been clicked, which is the one thing it must
    // never do.
    today: string;
    todayState: BuyerTabState;
};

function MonthGrid({ days, buyerId, nickname, reading, today, todayState }: MonthGridProps) {
    // Inline rather than a Tailwind class: the count is arithmetic on the month's length, and a
    // computed class name is exactly what the repo's static-class rule exists to forbid.
    const columns = Math.ceil(days.length / GRID_ROWS);

    return (
        <div
            className="grid w-fit grid-flow-row gap-1.5"
            style={{ gridTemplateColumns: `repeat(${columns}, min-content)` }}
        >
            {days.map((day) => {
                const openable = OPENABLE_STATES.includes(day.state);
                const isToday = day.date === today;
                const isReading = day.date === reading;
                // The dot is a background, so its name has to be written out: a link with no text is
                // a link a screen reader announces as its URL. The mark is spelled out too — an
                // outline is not something a screen reader can report.
                const name = [dayLabel(day.date), DOT_LABEL[day.state], isToday ? 'today' : '', isReading ? 'open' : '']
                    .filter(Boolean)
                    .join(' — ');
                // One outline per dot, because a dot has one edge to draw on. When today is also the
                // day being read the two marks are merged rather than fought over: today keeps its
                // colour — that is the one it is warning in — and the wider offset says it is open.
                const className = cn(
                    'size-2 shrink-0 rounded-full',
                    DOT_CLASS[day.state],
                    isToday && cn('outline', TODAY_OUTLINE[todayState]),
                    isToday && !isReading && 'outline-offset-1',
                    isReading && 'outline-2 outline-offset-2',
                    isReading && !isToday && 'outline-accent'
                );

                // A day with no push has nothing to say: no figures, no report, no link. It is drawn
                // and left alone — a tooltip that opens to state that the day is empty is a box the
                // reader has to dismiss to keep reading the month, thirty times over. The dot's
                // accessible name still says which day it is and that nothing was reported.
                if (!openable) {
                    // Nothing to open, so nothing to focus either: a month of empty days would
                    // otherwise cost thirty tab stops on the way to the next person.
                    return <span key={day.date} className={className} aria-label={name} role="img" />;
                }

                return (
                    <Tooltip key={day.date}>
                        <TooltipTrigger
                            render={
                                // Straight to that day, keeping the buyer: the dot's whole promise is
                                // "open the day I am pointing at". The geo is dropped — a market this
                                // person ran today is rarely one they ran then.
                                <Link
                                    to="/dashboard/dynamics"
                                    search={{ buyer: buyerId, day: day.date }}
                                    className={cn(
                                        className,
                                        'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none'
                                    )}
                                >
                                    <span className="sr-only">{name}</span>
                                </Link>
                            }
                        />
                        {/* Wider and taller than a one-line tooltip, and stacked rather than inline
                            — the surface itself is the shared one now, so only the box changes. */}
                        <TooltipContent className="w-56 max-w-none flex-col items-stretch p-3">
                            <DayTooltip day={day} nickname={nickname} />
                        </TooltipContent>
                    </Tooltip>
                );
            })}
        </div>
    );
}

export { MonthGrid };
