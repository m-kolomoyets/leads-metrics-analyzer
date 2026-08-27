import type { ReactNode } from 'react';
import type { XAxisTickContentProps } from 'recharts';
import type { ChartFlag, ChartMark, ChartSeries, ChartTone } from '../types';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import {
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { cn } from '@/lib/utils/cn';
import {
    ACTIVE_POINT_RADIUS,
    ACTIVE_RING_RADIUS,
    BADGE_RADIUS,
    CHROME_STROKE,
    CURVE,
    FLAG_GLYPH_SIZE,
    FLAG_LANE_HEIGHT,
    HALO_SPREAD,
    STROKE_WIDTH,
    TONE_STROKE,
    UNGRADED_STROKE,
} from '../constants';
import { strokeStops } from '../utils/gradient';
import { pointStep } from '../utils/keyboard';

// The day, at the size the day deserves. It draws several lines at once and tells them apart by
// DASH, because the one colour channel it has is spent entirely on the zone (ADR-0019) — two
// meanings on one channel is one meaning lost.
//
// The card is the plot and nothing else. Where the day STANDS is reported by the figures around it;
// this reports how it got there, and a card that did both would say each of them worse.
//
// No pan and no zoom: the card draws one day and a day fits (ADR-0023). The reader's questions here
// are "which way is it bending" and "what was it at 17:00", and both are answered by hovering.
//
// The tooltip is OURS, not the library's, for one reason: the card it opens has a link in it.
// Recharts' tooltip follows the pointer and its wrapper is `pointer-events: none`, so a button
// inside it can never be reached — it walks away from the cursor sent to press it, and would not
// take the click if it stood still. So Recharts is left doing the only part it is better at (which
// push is the pointer over) and the card is positioned, frozen and dismissed here.
//
// The pointer is not the only way in. The plot carries a transparent button in the tab order:
// arrows walk the pushes, Home and End jump to the day's ends, Enter opens the report of the push in
// hand. Its position is held apart from the pointer's on purpose — a pointer leaving the plot closes
// the card, and must not also throw away where the keyboard was.

// One push, as the plot eats it. `index` is what the time axis is keyed on rather than `label`: two
// pushes inside the same minute print the same clock, and a category axis keyed on a repeated label
// would put the marker and the crosshair on the first of them whichever was pointed at.
type TrajectoryRow = { index: number; label: string } & Record<string, number | string | null>;

type TrajectoryCardProps = {
    rows: TrajectoryRow[];
    series: ChartSeries[];
    // Both scales, already worked out: the round figures each prints and the range it draws over.
    // Passed in rather than fitted here — nothing on a chart surface is computed during a render,
    // so a wrong axis is caught by a test of the builder rather than by a reader (ADR-0025).
    costTicks: number[];
    figureTicks: number[];
    costDomain: [number, number];
    figureDomain: [number, number];
    costTick?: (value: number) => string;
    figureTick?: (value: number) => string;
    // What the plot draws, in words, for a reader who cannot see it. Rendered into the SVG's own
    // `<desc>`, which is where a screen reader looks for it.
    description?: string;
    // What the keyboard's handle announces itself as. Falls back to the description, which already
    // names both axes; a caller with keys to explain passes its own.
    label?: string;
    // The push the keyboard has in hand, said out loud. Without it the arrow keys move a highlight
    // that a screen-reader user has no way to read.
    describePoint?: (index: number) => string;
    // Given the index of the push being pointed at. Deliberately not Recharts' payload: the payload
    // is cleared the moment the pointer leaves the SVG for the card, which is exactly when the card
    // still needs to be on screen.
    renderTooltip: (index: number) => ReactNode;
    // What happened to each push beyond its figures, parallel to `rows`: which edge cases the
    // interval into it carried, whether that interval measured anything, and whether the push
    // restated an earlier one. Worked out by the caller, like everything else on this surface.
    marks?: readonly ChartMark[];
    // The key for the lane, holding only the flags the day actually raised. Empty — or absent — and
    // no lane is drawn at all: a key to three cases that did not happen is furniture.
    flagLegend?: readonly ChartFlag[];
    onSelectPoint?: (index: number) => void;
    className?: string;
};

// The point a push earned, in the ONE colour that push earned. The line beneath it is a gradient
// because a verdict moves between two pushes; a point is a single moment, and painting it from a
// gradient would leave it holding whatever hue the blend happened to be passing through.
//
// Only the hovered push is marked. A dot at every push turns a 14-push day into a row of beads and
// competes with the shape — which is the thing the chart exists to show. The reader asks about one
// push at a time, and the crosshair already says which one.
function pointColor(tones: readonly ChartTone[] | undefined, index: number): string {
    return tones ? TONE_STROKE[tones[index] ?? 'neutral'] : UNGRADED_STROKE;
}

const AXIS_PROPS = {
    axisLine: false,
    tickLine: { stroke: 'var(--border-strong)' },
    tickSize: 5,
    tickMargin: 8,
    tick: {
        fill: 'var(--foreground)',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: 'var(--tracking-figure)',
    },
} as const;

// Roughly this many labels on the time axis, whatever the day's length. Fourteen hourly stamps in a
// row is a ruler; seven is a scale.
const TIME_LABELS = 7;

// Clear air between the marked point and the card hanging over it, and the margin the card keeps
// from the window's own edges.
const TOOLTIP_GAP = 14;
const VIEWPORT_MARGIN = 8;

// Recharts hands the active index back as `number | TooltipIndex | undefined`, and TooltipIndex is a
// STRING — so a `typeof x === 'number'` guard silently rejects every real hover. Coerced once, here,
// rather than trusted at each call site.
function indexOf(active: number | string | null | undefined): number | null {
    const index = Number(active);
    return Number.isInteger(index) && index >= 0 ? index : null;
}

// Recharts insists on rendering its own tooltip node; this is how it renders nothing.
function renderNothing() {
    return null;
}

// Where the card sits, in WINDOW coordinates rather than plot ones: it is positioned `fixed` so that
// no ancestor with `overflow: hidden` — the accordion panel the chart may be folded inside, the
// section card around it — can clip a card that is deliberately allowed out of the plot.
type Spot = { left: number; top: number };

function TrajectoryCard({
    rows,
    series,
    costTicks,
    figureTicks,
    costDomain,
    figureDomain,
    costTick,
    figureTick,
    description,
    label,
    describePoint,
    renderTooltip,
    marks,
    flagLegend,
    onSelectPoint,
    className,
}: TrajectoryCardProps) {
    // `useId` output is unique per instance, so two of these on one page cannot collide on a
    // gradient and steal each other's colours.
    const prefix = useId();
    const plotRef = useRef<HTMLDivElement>(null);
    // Measured rather than assumed: the card is the caller's, and this component has no idea how
    // wide it chose to be.
    const cardRef = useRef<HTMLDivElement>(null);
    // What the pointer is over. Cleared the moment it leaves the plot box.
    const [hovered, setHovered] = useState<number | null>(null);
    // Where the KEYBOARD is, which is a different question and survives a different set of events.
    // It is remembered while the plot is unfocused so that tabbing back in resumes the day where the
    // reader left it rather than at breakfast.
    const [focused, setFocused] = useState(0);
    // Whether the keyboard's position is the one on screen: true while the plot holds focus and the
    // reader has not pressed Escape.
    const [walking, setWalking] = useState(false);
    // True while the pointer is ON the card. Moving onto the card is not the same as moving to
    // another push — while the card is being read, or its button aimed at, the reading behind it
    // must not change under it.
    const [pinned, setPinned] = useState(false);
    const [spot, setSpot] = useState<Spot | null>(null);
    // Bumped when the page moves under a keyboard reading, to send the card after its push.
    const [placement, setPlacement] = useState(0);

    // The pointer wins while it is on the plot: it is the more recent thing the reader did, and two
    // markers on one plot is two answers to one question.
    const reading = hovered ?? (walking ? focused : null);
    // Clamped rather than trusted, whichever of the two it came from: both positions outlive a mode
    // switch that shortens the day, and a marker on a push that no longer exists is a crosshair
    // standing in empty air.
    const active = reading === null || rows.length === 0 ? null : Math.min(reading, rows.length - 1);

    // The card hangs off the MARKED POINT, not the pointer — and is measured rather than computed:
    // turning a value back into a pixel would mean reproducing Recharts' plot geometry (margins, two
    // axis widths, the time axis's height) here, and that copy would be wrong the first time any of
    // them changed. The marker is already on screen and knows exactly where it is.
    //
    // Before paint, so the card never shows at last frame's position: it is rendered hidden, placed
    // here, and revealed in the same frame.
    useLayoutEffect(
        function placeCard() {
            const plot = plotRef.current;
            const card = cardRef.current;
            if (active === null || plot === null || card === null) {
                return;
            }
            // The first marker belongs to the first series — a cost line, the graded one the reader
            // is following. The pulse rings are reference dots too, and bigger, so the marker is
            // asked for by name rather than taken as the first dot on the plot.
            const marker = plot.querySelector('.chart-point-marker circle');
            if (marker === null) {
                // Every series is null at this push, so there is no point to hang a card off. Better
                // no card than one floating over an arbitrary part of the plot.
                setSpot(null);
                return;
            }
            const markerBox = marker.getBoundingClientRect();

            // Above the point, and deliberately NOT clamped to the plot: a card this size squeezed
            // inside an h-80 plot would sit on top of the very line it describes. Nothing clips it,
            // so it is allowed out — the reader keeps the shape and the reading at once.
            const above = markerBox.top - card.offsetHeight - TOOLTIP_GAP;
            // The window IS a real edge, though. A push near the top of the screen has no room above
            // it, and a card half off the top is a card whose link cannot be pressed — so it drops
            // under the point rather than being cut. Same at either side: a card hanging off the
            // right edge is a card whose link cannot be clicked, which is the bug this whole
            // arrangement exists to fix.
            const wanted = markerBox.left + markerBox.width / 2 - card.offsetWidth / 2;
            const furthest = Math.max(VIEWPORT_MARGIN, window.innerWidth - card.offsetWidth - VIEWPORT_MARGIN);

            setSpot({
                left: Math.min(Math.max(wanted, VIEWPORT_MARGIN), furthest),
                top: above < VIEWPORT_MARGIN ? markerBox.bottom + TOOLTIP_GAP : above,
            });
        },
        // `rows` and `series` are in the list because either changing moves the marker without
        // moving the reading: a metric switched on rescales the axis under a card already open.
        [active, placement, rows, series]
    );

    // The card is placed in WINDOW coordinates, and a wheel under a stationary pointer moves the plot
    // without moving the pointer — so nothing else would tell the card its push had walked out from
    // under it. A POINTER reading is dismissed rather than followed: it is a moment's answer, and a
    // card chasing the page while the reader scrolls past it is noise. A KEYBOARD reading is
    // followed, because the reader has not let go of that push — the plot still holds focus.
    useEffect(
        function trackScroll() {
            if (active === null) {
                return;
            }

            function handleScroll() {
                setHovered(null);
                setPinned(false);
                setPlacement((count) => {
                    return count + 1;
                });
            }

            window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

            return function stopListening() {
                window.removeEventListener('scroll', handleScroll, { capture: true });
            };
        },
        [active]
    );

    // The keyboard path across a plot the pointer owns: arrows walk the day, Home and End jump to its
    // ends, Enter opens the report of the push in hand, Escape puts the card away without losing the
    // place. Space is Enter's twin here because this handle is a button and a reader will press it.
    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        const next = pointStep(event.key, focused, rows.length);

        if (next !== null) {
            event.preventDefault();
            setFocused(next);
            setWalking(true);
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (onSelectPoint && rows.length > 0) {
                onSelectPoint(Math.min(focused, rows.length - 1));
            }
            return;
        }

        if (event.key === 'Escape') {
            setWalking(false);
        }
    }

    // Every nth stamp, so the labels stay evenly spaced instead of being dropped where they collide.
    const timeInterval = Math.max(0, Math.ceil(rows.length / TIME_LABELS) - 1);

    // Which intervals were restated, parallel to the rows. A restated interval is a clamped
    // remainder rather than a measurement, so every line is weakened across it — the figures it
    // would have carried are already gaps, and a full-strength stroke joining the two ends would
    // claim a step nobody traded through.
    const faded = rows.map((_row, index) => {
        return marks?.[index]?.faded === true;
    });
    const restated = faded.includes(true);

    // A line is painted from a gradient when it has something to vary along its length: a grade at
    // each push, a weakened interval, or both. A line with neither takes the flat accent, which is
    // one fewer node for the browser to interpolate on every hover.
    function gradient(entry: ChartSeries) {
        return entry.tones !== undefined || restated;
    }

    function colorsOf(entry: ChartSeries): string[] {
        return rows.map((_row, index) => {
            return entry.tones ? TONE_STROKE[entry.tones[index] ?? 'neutral'] : UNGRADED_STROKE;
        });
    }

    // The lane exists only for a day that raised something. It hangs BENEATH the time axis in a
    // strip of its own — the flags describe the interval, and printing them on the line would make
    // them look like properties of the figure.
    const legend = flagLegend ?? [];
    const flagsByKey = new Map(
        legend.map((flag) => {
            return [flag.key, flag];
        })
    );

    // One push's glyphs, drawn as the lane axis's tick. Coloured per flag so the lane and the key
    // under it are read as one thing; the key carries the words, so the glyphs are hidden from a
    // screen reader rather than spelled out as punctuation.
    function renderFlagTick({ x, y, payload }: XAxisTickContentProps) {
        const flags = marks?.[Number(payload.value)]?.flags ?? [];

        if (flags.length === 0) {
            return null;
        }

        return (
            <text aria-hidden={true} fontSize={FLAG_GLYPH_SIZE} textAnchor="middle" x={x} y={y} dy={FLAG_GLYPH_SIZE}>
                {flags.map((key) => {
                    const flag = flagsByKey.get(key);

                    return flag === undefined ? null : (
                        <tspan key={key} fill={flag.color}>
                            {flag.glyph}
                        </tspan>
                    );
                })}
            </text>
        );
    }

    return (
        <div className={cn('bg-card border-border rounded-lg border p-6', className)}>
            <div
                ref={plotRef}
                className="relative h-80 w-full"
                // Dismissal belongs to the PLOT BOX, not the canvas. Leaving the SVG is not leaving
                // the chart — it may be the pointer on its way to the card — and closing there would
                // snatch the card away mid-reach.
                onMouseLeave={() => {
                    setHovered(null);
                    setPinned(false);
                }}
            >
                <ResponsiveContainer height="100%" width="100%">
                    <ComposedChart
                        data={rows}
                        desc={description}
                        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                        onClick={(state) => {
                            const index = indexOf(state.activeTooltipIndex);
                            if (onSelectPoint && index !== null) {
                                onSelectPoint(index);
                            }
                        }}
                        onMouseMove={(state) => {
                            if (pinned) {
                                return;
                            }
                            const index = indexOf(state.activeTooltipIndex);
                            if (index === null) {
                                return;
                            }
                            setHovered(index);
                        }}
                    >
                        <defs>
                            {series.map((entry) => {
                                if (!gradient(entry)) {
                                    return null;
                                }
                                return (
                                    <linearGradient
                                        key={entry.dataKey}
                                        id={`${prefix}${entry.dataKey}`}
                                        x1="0"
                                        x2="1"
                                        y1="0"
                                        y2="0"
                                    >
                                        {strokeStops(colorsOf(entry), faded).map((stop, index) => {
                                            return (
                                                <stop
                                                    // Two stops can share an offset — that is how the
                                                    // strength steps at a boundary without the colour
                                                    // stepping with it — so the offset is not a key.
                                                    key={index}
                                                    offset={stop.offset}
                                                    stopColor={stop.color}
                                                    stopOpacity={stop.opacity}
                                                />
                                            );
                                        })}
                                    </linearGradient>
                                );
                            })}
                        </defs>

                        {/* Horizontal only. A vertical rule would answer "which push is this", and the
                            crosshair the tooltip already brings answers that better. */}
                        <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                        <XAxis
                            {...AXIS_PROPS}
                            dataKey="index"
                            interval={timeInterval}
                            tickFormatter={(value: number) => {
                                return rows[value]?.label ?? '';
                            }}
                            tickMargin={14}
                        />
                        {/* The lane: a second time axis carrying glyphs instead of clocks. It is
                            an axis rather than an overlay so that Recharts places each glyph on the
                            push it belongs to and reserves the strip's height out of the plot's —
                            the lane can never sit on the line, at any width or in either theme. */}
                        {legend.length > 0 && (
                            <XAxis
                                axisLine={false}
                                dataKey="index"
                                height={FLAG_LANE_HEIGHT}
                                interval={0}
                                tick={renderFlagTick}
                                tickLine={false}
                                xAxisId="flags"
                            />
                        )}
                        <YAxis
                            {...AXIS_PROPS}
                            domain={costDomain}
                            tickFormatter={costTick}
                            ticks={costTicks}
                            width={60}
                            yAxisId="cost"
                        />
                        <YAxis
                            {...AXIS_PROPS}
                            domain={figureDomain}
                            orientation="right"
                            tickFormatter={figureTick}
                            ticks={figureTicks}
                            width={68}
                            yAxisId="figure"
                        />
                        {/* Mounted, and draws nothing. Recharts computes which push the pointer is
                            over only while a Tooltip is present, and that hit-testing is the one
                            part of this worth keeping. The cursor rule is drawn below instead, off
                            our own state, so it holds still when the card does — and so the keyboard
                            gets the same rule the pointer does. */}
                        <Tooltip content={renderNothing} cursor={false} />
                        {active !== null && <ReferenceLine stroke="var(--border-strong)" x={active} yAxisId="cost" />}

                        {series.flatMap((entry) => {
                            const stroke = gradient(entry) ? `url(#${prefix}${entry.dataKey})` : UNGRADED_STROKE;
                            const dash = entry.dash?.length ? entry.dash.join(' ') : undefined;
                            return [
                                <Line
                                    key={`${entry.dataKey}-halo`}
                                    dataKey={entry.dataKey}
                                    dot={false}
                                    isAnimationActive={false}
                                    stroke={stroke}
                                    strokeDasharray={dash}
                                    strokeLinecap="round"
                                    strokeWidth={STROKE_WIDTH.big + HALO_SPREAD}
                                    style={{
                                        filter: 'blur(var(--chart-halo-blur))',
                                        opacity: 'var(--chart-halo-opacity)',
                                    }}
                                    type={CURVE}
                                    yAxisId={entry.axis}
                                />,
                                <Line
                                    key={entry.dataKey}
                                    activeDot={false}
                                    dataKey={entry.dataKey}
                                    dot={false}
                                    isAnimationActive={false}
                                    name={entry.label}
                                    stroke={stroke}
                                    strokeDasharray={dash}
                                    strokeLinecap="round"
                                    strokeWidth={STROKE_WIDTH.big}
                                    type={CURVE}
                                    yAxisId={entry.axis}
                                />,
                            ];
                        })}

                        {/* The badge a restated push wears: a ring around the point, drawn ONCE
                            per push — one push corrected an earlier one, and printing that on every
                            drawn metric would read as several corrections. It hangs on the first
                            line that measured anything there, because the metric a restatement makes
                            unmeasurable is exactly the one that has no point to hang it off. It is
                            drawn in the chrome colour and never from the zone palette (ADR-0019):
                            the badge is a fact about the push, not a verdict on it, and a green ring
                            would read as praise. */}
                        {rows.flatMap((row, index) => {
                            if (marks?.[index]?.badge !== true) {
                                return [];
                            }

                            const anchor = series.find((entry) => {
                                return typeof row[entry.dataKey] === 'number';
                            });
                            const value = anchor === undefined ? null : row[anchor.dataKey];

                            if (anchor === undefined || typeof value !== 'number') {
                                return [];
                            }

                            return [
                                <ReferenceDot
                                    key={`badge-${row.index}`}
                                    fill="none"
                                    r={BADGE_RADIUS}
                                    stroke={CHROME_STROKE}
                                    strokeWidth={1.5}
                                    x={index}
                                    y={value}
                                    yAxisId={anchor.axis}
                                />,
                            ];
                        })}

                        {/* The marked push, ours rather than the library's. Recharts' own activeDot
                            is tied to its tooltip state, which clears the instant the pointer leaves
                            the SVG — so the point would vanish exactly as the reader reaches for the
                            card that point opened, and would never appear at all for a reader who
                            never touches a pointer. */}
                        {active !== null &&
                            series.flatMap((entry) => {
                                const value = rows[active]?.[entry.dataKey];
                                if (typeof value !== 'number') {
                                    return [];
                                }
                                const color = pointColor(entry.tones, active);
                                return [
                                    // The ring, breathing on the app's own 4.8s ambient clock and
                                    // held still under `prefers-reduced-motion` — both live in the
                                    // `chart-point-pulse` class, so the rhythm is set in one place
                                    // for every ambient animation in the app rather than here.
                                    // Under the point rather than around it: the point itself never
                                    // moves, so the thing being pointed at stays where the pointer
                                    // put it.
                                    <ReferenceDot
                                        key={`${entry.dataKey}-ring`}
                                        className="chart-point-pulse"
                                        fill={color}
                                        r={ACTIVE_RING_RADIUS}
                                        stroke="none"
                                        x={active}
                                        y={value}
                                        yAxisId={entry.axis}
                                    />,
                                    <ReferenceDot
                                        key={`${entry.dataKey}-mark`}
                                        className="chart-point-marker"
                                        fill={color}
                                        r={ACTIVE_POINT_RADIUS}
                                        stroke="var(--card)"
                                        strokeWidth={2}
                                        x={active}
                                        y={value}
                                        yAxisId={entry.axis}
                                    />,
                                ];
                            })}
                    </ComposedChart>
                </ResponsiveContainer>

                {/* The keyboard's handle on a plot the pointer owns: a real button laid over it,
                    transparent to the pointer so hovering and clicking still reach the chart, but in
                    the tab order and carrying the arrow keys. Its focus ring is the app's own, drawn
                    around the whole plot — which is honest, because the whole plot is what the keys
                    now belong to. */}
                <button
                    type="button"
                    aria-label={label ?? description}
                    className="pointer-events-none absolute inset-0 rounded-lg"
                    onBlur={() => {
                        setWalking(false);
                    }}
                    onFocus={() => {
                        setWalking(true);
                    }}
                    onKeyDown={handleKeyDown}
                />

                {active !== null && (
                    <div
                        ref={cardRef}
                        className="pointer-events-auto fixed z-50"
                        // Entering the card pins the reading behind it. Without this the pointer's
                        // own travel would walk the tooltip onto a neighbouring push and back out
                        // from under itself.
                        onMouseEnter={() => {
                            setPinned(true);
                        }}
                        onMouseLeave={() => {
                            setPinned(false);
                        }}
                        // Laid out before it is shown: the placement below measures this node
                        // against the marker, so it has to exist first. Hidden rather than unmounted
                        // for that one pass, and revealed in the same frame.
                        style={
                            spot === null
                                ? { left: 0, top: 0, visibility: 'hidden' }
                                : { left: spot.left, top: spot.top }
                        }
                    >
                        {renderTooltip(active)}
                    </div>
                )}
            </div>

            {/* The key to the lane, and only to the flags the day actually raised. Each entry
                carries its hint, so the reader can find out what a glyph means where they met it
                rather than being sent to a legend page. */}
            {legend.length > 0 && (
                <ul className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {legend.map((flag) => {
                        return (
                            <li key={flag.key} className="flex items-center gap-1.5" title={flag.hint}>
                                <span aria-hidden={true} style={{ color: flag.color }}>
                                    {flag.glyph}
                                </span>
                                {flag.label}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* What the keyboard has in hand, said out loud. Without it the arrow keys would move a
                highlight a screen-reader user cannot see. */}
            {describePoint && (
                <p aria-live="polite" className="sr-only">
                    {walking && rows.length > 0 ? describePoint(Math.min(focused, rows.length - 1)) : ''}
                </p>
            )}
        </div>
    );
}

export { TrajectoryCard };
export type { TrajectoryRow };
