import type { BuyerTab } from '@/modules/Dynamics/utils/buyerTabs';
import type { MemberDay } from '@/modules/Dynamics/utils/memberDays';
import { cn } from '@/lib/utils/cn';
import { DASH, usdSigned } from '@/components/report/utils/format';
import { Card } from '@/components/ui/Card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { STATE_CLASS, STATE_HINT, STATE_LABEL, STATE_MARKER } from './constants';
import { MonthGrid } from './components/MonthGrid';

// One team member, as the page's primary control (SPEC §6.2). It answers two questions at two
// distances: WHO do I walk over to right now — the name and today's figure, read across the row in a
// second — and IS TODAY TYPICAL, which is the month underneath and cannot be read from any one day.
//
// The card is not a tab and does not try to be one. Only the header is a control, so the grid below
// can hold links of its own without nesting a button inside a button; the wash and the stronger
// border say which person the page is currently reading.

type MemberCardProps = {
    tab: BuyerTab;
    days: MemberDay[];
    // NOW, in Kyiv — what the grid marks as today, and what it splits the month's past from its
    // future on. Never the day the page happens to be reading.
    today: string;
    // The day the page is reading — marked in the month grid, so a card whose dot was clicked shows
    // WHICH dot it was and not only that the person is selected.
    reading: string;
    selected: boolean;
    onSelect: () => void;
};

function MemberCard({ tab, days, reading, today, selected, onSelect }: MemberCardProps) {
    const marker = STATE_MARKER[tab.state];
    const hint = STATE_HINT[tab.state];

    return (
        <Card
            className={cn(
                // Sized to its own contents, not to a share of a track: the header — the nickname
                // and the day's figure, side by side and never wrapped — is the card's floor, and
                // the month grid below is a fixed shape, so the card ends up as wide as whichever of
                // the two needs more. A card that stretched with the viewport put a 148px grid in
                // the corner of a 400px card; a fixed width truncated the long nicknames instead.
                'w-fit shrink-0 gap-3 p-3 motion-safe:transition-colors motion-safe:duration-150',
                // Border only, never a wash: the card's body holds a month of coloured dots, and a
                // tinted ground under them shifts every one of those colours. The accent border is
                // the same "this one is picked" the metric cards already use.
                selected ? 'border-ring' : 'hover:border-border-strong'
            )}
        >
            <button
                type="button"
                // A pressed toggle rather than a tab: the cards are a grid, and `tablist` semantics
                // would promise arrow-key navigation along a row that wraps.
                aria-pressed={selected}
                className="hover:text-foreground flex cursor-pointer items-baseline justify-between gap-3 text-left whitespace-nowrap"
                onClick={onSelect}
            >
                <span className="text-foreground font-medium">{tab.nickname}</span>

                {/* Today's figure, and today's state on it. The month below is graded on ROI; this is
                    graded on the sign of profit alone, which is the same call the page has always
                    made about the day in front of the reader.

                    Absent, not dashed: a viewer with no dollar dimension gets no money here at all,
                    where a dash would imply a figure that is merely missing. A dash still marks a
                    push that froze no rollup (CONTEXT.md). */}
                <span className={cn('flex items-baseline gap-1 tabular-nums', STATE_CLASS[tab.state])}>
                    {marker && hint && (
                        // The glyph says THAT something is wrong; the tooltip says what, and says it
                        // with the hour or the age it was decided by — a `?` on its own is a warning
                        // a reader has to already know the rules to read.
                        //
                        // A span, not the trigger's default button: this sits inside the card's own
                        // header button, and a button inside a button is invalid markup. Keyboard
                        // readers lose nothing — the header button they land on carries the whole
                        // state in its accessible text below.
                        <Tooltip>
                            <TooltipTrigger render={<span aria-hidden={true}>{marker}</span>} />
                            <TooltipContent className="max-w-56">{hint}</TooltipContent>
                        </Tooltip>
                    )}
                    {tab.totalProfit !== undefined && (
                        <span className="text-lg leading-none font-semibold">
                            {tab.totalProfit === null ? DASH : usdSigned(tab.totalProfit)}
                        </span>
                    )}
                    {/* The state is spelled out, not only painted: colour and a marker glyph are the
                        same signal to a reader who gets neither. */}
                    <span className="sr-only">{STATE_LABEL[tab.state]}</span>
                </span>
            </button>

            <MonthGrid
                buyerId={tab.id}
                days={days}
                nickname={tab.nickname}
                reading={reading}
                today={today}
                todayState={tab.state}
            />
        </Card>
    );
}

export { MemberCard };
