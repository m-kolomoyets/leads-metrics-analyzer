import type { ReactNode } from 'react';
import type { ChartSeries, ChartTone } from '../types';
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
    CURVE,
    HALO_SPREAD,
    STROKE_WIDTH,
    TONE_STROKE,
    UNGRADED_STROKE,
} from '../constants';
import { toneStops } from '../utils/gradient';

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
    // Given the index of the push being pointed at. Deliberately not Recharts' payload: the payload
    // is cleared the moment the pointer leaves the SVG for the card, which is exactly when the card
    // still needs to be on screen.
    renderTooltip: (index: number) => ReactNode;
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

// What the pointer is over, and whether it is being held still. `pinned` is separate from `index`
// because moving onto the card is not the same as moving to another push: while the card is being
// read — or its button aimed at — the reading behind it must not change under it.
//
// `left` is a WINDOW coordinate, not a plot one: the card is positioned `fixed` so that no ancestor
// with `overflow: hidden` — the accordion panel the chart may be folded inside, the section card
// around it — can clip a card that is deliberately allowed out of the plot.
type Hover = { index: number; left: number };

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
    renderTooltip,
    onSelectPoint,
    className,
}: TrajectoryCardProps) {
    // `useId` output is unique per instance, so two of these on one page — which is exactly what the
    // comparison route renders — cannot collide on a gradient and steal each other's colours.
    const prefix = useId();
    const plotRef = useRef<HTMLDivElement>(null);
    // Measured rather than assumed: the card is the caller's, and this component has no idea how
    // wide it chose to be. Read in the move handler, never in render — and never through a ref
    // callback, which fires with `null` on every detach and would set state in a loop.
    const cardRef = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState<Hover | null>(null);
    const [pinned, setPinned] = useState(false);
    const [top, setTop] = useState(TOOLTIP_GAP);

    // The card hangs off the MARKED POINT, not the pointer — and is measured rather than computed:
    // turning a value back into a pixel would mean reproducing Recharts' plot geometry (margins, two
    // axis widths, the time axis's height) here, and that copy would be wrong the first time any of
    // them changed. The marker is already on screen and knows exactly where it is.
    useLayoutEffect(
        function placeCard() {
            const plot = plotRef.current;
            const card = cardRef.current;
            if (hover === null || plot === null || card === null) {
                return;
            }
            // The first marker belongs to the first series — a cost line, the graded one the reader
            // is following. The pulse rings are reference dots too, and bigger, so the marker is
            // asked for by name rather than taken as the first dot on the plot.
            const marker = plot.querySelector('.chart-point-marker circle');
            if (marker === null) {
                return;
            }
            const markerBox = marker.getBoundingClientRect();
            // Above the point, and deliberately NOT clamped to the plot: a card this size squeezed
            // inside an h-80 plot would sit on top of the very line it describes. Nothing clips it,
            // so it is allowed out — the reader keeps the shape and the reading at once.
            const above = markerBox.top - card.offsetHeight - TOOLTIP_GAP;

            // The window IS a real edge, though. A push near the top of the screen has no room above
            // it, and a card half off the top is a card whose link cannot be pressed — so it drops
            // under the point rather than being cut.
            setTop(above < VIEWPORT_MARGIN ? markerBox.bottom + TOOLTIP_GAP : above);
        },
        [hover]
    );

    // The card is placed in WINDOW coordinates, and a wheel under a stationary pointer moves the plot
    // without moving the pointer — so nothing else would tell the card its push had walked out from
    // under it. It is dismissed rather than followed: the reading is a moment's answer, and a card
    // chasing the page while the reader scrolls past it is noise.
    useEffect(
        function dismissOnScroll() {
            if (hover === null) {
                return;
            }

            function handleScroll() {
                setHover(null);
                setPinned(false);
            }

            window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

            return function stopListening() {
                window.removeEventListener('scroll', handleScroll, { capture: true });
            };
        },
        [hover]
    );

    // Every nth stamp, so the labels stay evenly spaced instead of being dropped where they collide.
    const timeInterval = Math.max(0, Math.ceil(rows.length / TIME_LABELS) - 1);

    return (
        <div className={cn('bg-card border-border rounded-lg border p-6', className)}>
            <div
                ref={plotRef}
                className="relative h-80 w-full"
                // Dismissal belongs to the PLOT BOX, not the canvas. Leaving the SVG is not leaving
                // the chart — it may be the pointer on its way to the card — and closing there would
                // snatch the card away mid-reach.
                onMouseLeave={() => {
                    setHover(null);
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
                            const x = state.activeCoordinate?.x;
                            if (index === null || typeof x !== 'number') {
                                return;
                            }
                            // Anchored to the push, then pulled back inside the window at either end.
                            // A card hanging half off the right edge is a card whose link cannot be
                            // clicked, which is the bug this whole arrangement exists to fix.
                            // Zero on the very first move, when the card has never been mounted — it
                            // lands under the pointer for one frame and centres itself on the next,
                            // which is quicker than a reader can see.
                            const card = cardRef.current?.offsetWidth ?? 0;
                            const plotLeft = plotRef.current?.getBoundingClientRect().left ?? 0;
                            // Held inside the WINDOW rather than inside the plot. The plot's edge is
                            // not a real boundary — nothing clips the card — but the window's is, and
                            // a card half off the screen is a card whose link cannot be clicked.
                            const wanted = plotLeft + x - card / 2;
                            const furthest = Math.max(VIEWPORT_MARGIN, window.innerWidth - card - VIEWPORT_MARGIN);
                            const left = Math.min(Math.max(wanted, VIEWPORT_MARGIN), furthest);
                            setHover({ index, left });
                        }}
                    >
                        <defs>
                            {series.map((entry) => {
                                if (!entry.tones) {
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
                                        {toneStops(entry.tones).map((stop) => {
                                            return (
                                                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
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
                            our own state, so it holds still when the card does. */}
                        <Tooltip content={renderNothing} cursor={false} />
                        {hover && <ReferenceLine stroke="var(--border-strong)" x={hover.index} yAxisId="cost" />}

                        {series.flatMap((entry) => {
                            const stroke = entry.tones ? `url(#${prefix}${entry.dataKey})` : UNGRADED_STROKE;
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

                        {/* The marked push, ours rather than the library's. Recharts' own activeDot
                            is tied to its tooltip state, which clears the instant the pointer leaves
                            the SVG — so the point would vanish exactly as the reader reaches for the
                            card that point opened. */}
                        {hover &&
                            series.flatMap((entry) => {
                                const value = rows[hover.index]?.[entry.dataKey];
                                if (typeof value !== 'number') {
                                    return [];
                                }
                                const color = pointColor(entry.tones, hover.index);
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
                                        x={hover.index}
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
                                        x={hover.index}
                                        y={value}
                                        yAxisId={entry.axis}
                                    />,
                                ];
                            })}
                    </ComposedChart>
                </ResponsiveContainer>

                {hover && (
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
                        style={{ left: hover.left, top }}
                    >
                        {renderTooltip(hover.index)}
                    </div>
                )}
            </div>
        </div>
    );
}

export { TrajectoryCard };
export type { TrajectoryRow };
