import type { BuyerTab } from '@/modules/Dynamics/utils/buyerTabs';
import type { RosterGeoProfit } from '@/services/dynamics/types';
import { cn } from '@/lib/utils/cn';
import { flagEmoji } from '@/lib/utils/flagEmoji';
import { DASH, usdSigned } from '@/components/report/utils/format';
import { Card } from '@/components/ui/Card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { STATE_CLASS, STATE_HINT, STATE_LABEL, STATE_MARKER } from './constants';

// One team member, as the page's primary control (SPEC §6.2). It answers two questions at one
// distance: WHO do I walk over to right now — the name and the day's figure, read across the header
// in a second — and WHICH MARKET is carrying that figure, which is the list underneath.
//
// Every figure on the card comes from that buyer's LATEST push of the day and nothing is summed
// across pushes: a Snapshot restates the day so far (ADR-0017), so the header is Σ of the market
// lines below it, and both are what the last report said rather than a running tally of the day.
//
// The card is not a tab and does not try to be one. The WHOLE card is one control — there is nothing
// inside it to link to separately — and the accent border says which person the page is reading.
//
// It is one control the way a stretched link is: the button stays in the header, where the only
// phrasing content is, and grows a pseudo-element over the whole card. A `<button>` wrapped round
// the market list would be invalid markup — a `<ul>` is not phrasing content — and a `role="button"`
// div would hand back the keyboard behaviour a real button already has.

type MemberCardProps = {
    tab: BuyerTab;
    // The markets that buyer's latest push froze, in the same order the geo tabs below list them.
    // Empty for the dollar-free frames
    // (#10), where no money was selected at all — the card is then its header and nothing else.
    geoProfits?: RosterGeoProfit[];
    selected: boolean;
    onSelect: () => void;
};

// One market of the day: which one, and what the last report said it made. The code is spelled
// beside the flag rather than replaced by it — a flag is unreadable to a screen reader and to anyone
// who does not know the market by its colours.
function GeoRow({ geo, profit }: RosterGeoProfit) {
    const flag = flagEmoji(geo);

    return (
        <li className="flex items-baseline justify-between gap-4">
            <span className="text-foreground flex items-baseline gap-1.5 font-medium">
                {flag && (
                    <span aria-hidden={true} className="text-base">
                        {flag}
                    </span>
                )}
                {geo}
            </span>

            {/* Quieter than the header on purpose: the total is the card's headline, and the markets
                are the decomposition a reader goes looking for once it has caught their eye. */}
            <span className="text-muted-foreground tabular-nums">{usdSigned(profit)}</span>
        </li>
    );
}

function MemberCard({ tab, geoProfits, selected, onSelect }: MemberCardProps) {
    const marker = STATE_MARKER[tab.state];
    const hint = STATE_HINT[tab.state];
    const geos = geoProfits ?? [];

    return (
        <Card
            className={cn(
                // Sized to its own contents, not to a share of a track: the header — the nickname and
                // the day's figure, side by side and never wrapped — is the card's floor, and the
                // market lines below are narrower than it. A card that stretched with the viewport
                // stranded three short rows in the corner of a 400px box.
                'relative w-fit shrink-0 cursor-pointer gap-2 p-3 motion-safe:transition-colors motion-safe:duration-150',
                // The ring is drawn by the CARD, not the button inside it: the reader's control is
                // the card, so that is the shape focus has to outline.
                'has-[:focus-visible]:outline-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1',
                selected ? 'border-ring' : 'hover:border-border-strong'
            )}
        >
            <button
                type="button"
                // A pressed toggle rather than a tab: the cards are a grid, and `tablist` semantics
                // would promise arrow-key navigation along a row that wraps.
                aria-pressed={selected}
                className={cn(
                    'flex cursor-pointer items-baseline justify-between gap-3 text-left whitespace-nowrap',
                    // The hit area, stretched over the card: everything below the header — the market
                    // lines — is text nobody clicks, so covering it costs nothing and makes the
                    // target the size the card looks like it is.
                    'after:absolute after:inset-0 after:rounded-lg',
                    // The ring is the card's now, so the button draws none of its own.
                    'focus-visible:outline-none'
                )}
                onClick={onSelect}
            >
                <span className="text-foreground font-medium">{tab.nickname}</span>

                {/* The day's figure, and the day's state on it. Graded on the sign of profit alone,
                    which is the same call the page has always made about the day in front of the
                    reader.

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
                        // header button, and a button inside a button is invalid markup.
                        <Tooltip>
                            {/* Above the stretched hit area, or the card's own overlay would eat the
                                hover this glyph exists to answer. */}
                            <TooltipTrigger render={<span aria-hidden={true} className="relative z-10" />}>
                                {marker}
                            </TooltipTrigger>
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

            {geos.length > 0 && (
                // Rendered only when there is something to split: an empty list under the header
                // would read as "this buyer ran no markets", which is a claim the card cannot make —
                // a push that froze no rollup has no markets to report, not zero of them.
                <ul aria-label={`${tab.nickname} by market`} className="flex flex-col gap-1 text-sm">
                    {geos.map((geo) => {
                        return <GeoRow key={geo.geo} geo={geo.geo} profit={geo.profit} />;
                    })}
                </ul>
            )}
        </Card>
    );
}

export { MemberCard };
