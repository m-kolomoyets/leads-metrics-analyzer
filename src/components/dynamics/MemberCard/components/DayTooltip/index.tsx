import type { Zone } from '@/lib/domain/types';
import type { MemberDay, MemberDayState } from '@/modules/Dynamics/utils/memberDays';
import { dayLabel } from '@/lib/utils/calendarMonth';
import { DASH, pct, usd, usdSigned } from '@/components/report/utils/format';
import { ZONE_LABEL, ZONE_STROKE } from '../../../constants';
import { DOT_LABEL } from '../../constants';

// One dot, spelled out — and spelled out the same way the trajectory's point tooltip spells a push,
// because they are the same kind of object: a mark on a shape, opened to ask what it was.
//
// Same three tiers, in the same order, read straight down: the verdict first, at size and in its own
// zone colour, since that is the one thing the card is opened for; the bases it was computed from
// underneath, muted, because a grade nobody can check is a grade nobody can argue with; the action
// last.

// The dot's state as a Zone, so the figure wears the same colour the dot did. There is no green ROI
// threshold in any Ruleset — the band is the grid's own (see `GREEN_ABOVE_ROI`) — but once graded, a
// day is said in the app's one zone vocabulary rather than a second one invented here.
const ZONE_OF: Record<MemberDayState, Zone> = {
    future: 'neutral',
    unreported: 'neutral',
    ungraded: 'neutral',
    green: 'green',
    yellow: 'yellow',
    red: 'red',
};

type DayTooltipProps = {
    day: MemberDay;
    nickname: string;
};

// Only a day that was actually pushed gets this card at all — the grid draws the empty ones and
// leaves them alone — so there is no "nothing here" branch to write: every day that reaches this
// component has figures and a report behind it.
function DayTooltip({ day, nickname }: DayTooltipProps) {
    const zone = ZONE_OF[day.state];

    return (
        <div className="flex flex-col gap-2.5">
            <p className="text-muted-foreground border-border flex items-baseline justify-between gap-2 border-b pb-2">
                <span>{dayLabel(day.date)}</span>
                <span>{nickname}</span>
            </p>
            {/* One column, top to bottom: profit, then ROI, then Spend⁺. Two columns put the verdict
                beside its own bases at the same optical weight and the big figure ran in under them;
                stacked, the order IS the hierarchy — what the day made, what that was worth against
                the money, and what the money was. */}
            <dl className="flex flex-col gap-1.5">
                <div className="flex flex-col">
                    <dt className="text-muted-foreground">Profit</dt>
                    {/* The figure IS the verdict, so it wears it — painted in the zone its dot
                        was painted in, at the size the card is opened for. */}
                    <dd
                        className="text-2xl leading-tight font-semibold tabular-nums"
                        style={zone === 'neutral' ? undefined : { color: ZONE_STROKE[zone] }}
                    >
                        {day.profit === null ? DASH : usdSigned(day.profit)}
                        {/* The grade in words, for anyone the colour does not reach. */}
                        <span className="sr-only">{zone === 'neutral' ? DOT_LABEL[day.state] : ZONE_LABEL[zone]}</span>
                    </dd>
                </div>

                {/* The bases the verdict was taken over: ROI is what the day was actually graded
                    on, and Spend⁺ is why a day with nothing risked cannot be graded at all. */}
                <div className="text-muted-foreground border-border flex items-baseline justify-between gap-3 border-t pt-1.5 tabular-nums">
                    <dt>ROI</dt>
                    <dd>{pct(day.roi)}</dd>
                </div>

                <div className="text-muted-foreground flex items-baseline justify-between gap-3 tabular-nums">
                    <dt>Spend⁺</dt>
                    <dd>{usd(day.spendPlus)}</dd>
                </div>
            </dl>
            <p className="text-muted-foreground border-border border-t pt-2">Click to open this day.</p>
        </div>
    );
}

export { DayTooltip };
