import type { ReactNode } from 'react';
import type { ChartTone } from '../types';
import type { BarSpan } from '../utils/bars';
import { Bar, BarChart, Rectangle, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils/cn';
import { BAR_CATEGORY_GAP, BAR_HALO_SPREAD, UNGRADED_STROKE } from '../constants';
import { barSpans } from '../utils/bars';
import { accentFill, toneFill } from '../utils/gradient';

// One metric, read as a figure and a shape at once: the reading on the left, the day that produced
// it on the right. The strip of these under the trajectory is a navigation control, not decoration —
// a lead scans four shapes, finds the one bending the wrong way and clicks it.
//
// Two variants, and the difference is whether the metric HAS a verdict:
//
//   graded — a cost, with thresholds behind it. Every candle takes the colour of the verdict on the
//            push it arrives at, so a run of red is visible from across the room.
//   plain  — money or a ratio, with no thresholds anywhere (SPEC §6.6). One accent hue for the whole
//            plot. Nothing here is a verdict, so nothing here shouts.
//
// The shape is candles, not a line: one floating segment per interval, spanning the move that
// interval made. A line is a shape to be traced and a strip card is never traced — it is glanced at,
// and a row of marks whose LENGTHS vary answers "was this day steady" before the eye has followed
// anything. No grid behind them, for the same reason: the plot is a picture of movement, not a
// surface to read values off (the trajectory above is where a value gets read).
//
// Selection reads as chrome — a ring and a lifted surface — never as hue, because every hue on this
// card is already spoken for by the zone (ADR-0019).

type MetricCardProps = {
    label: ReactNode;
    value: string;
    // Paints the FIGURE, not the plot. Reserved for a metric whose sign is its whole meaning — a
    // profit that turned negative — where the minus sign alone is one glyph doing a job the card is
    // scanned too fast to read. Not a verdict and not a zone: `undefined` is the norm, and an
    // ungraded money figure that wore a colour would be claiming an opinion nobody wrote (ADR-0019).
    valueTone?: 'green' | 'red';
    // The shape, oldest first. Nulls break the line, which is correct: an unmeasurable interval is
    // not a value of zero.
    values: readonly (number | null)[];
    // Per-point grades, same length as `values`. Absent means the metric has no thresholds to be
    // graded against at all, and the card draws its plain variant.
    tones?: readonly ChartTone[];
    // The range the plot draws over, wider than the data so the stroke is not clipped by the panel.
    // Passed in rather than fitted here: nothing on a chart surface is computed during a render.
    domain: [number, number];
    selected?: boolean;
    onSelect?: () => void;
    className?: string;
};

// Recharts hands a shape everything it worked out about the bar, and the row it came from with it.
// The bar is a pill — a candle with square ends reads as a column of a bar chart, which is the one
// thing it is not — so the radius is half the width and never a fixed number.
type CandleProps = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    payload?: BarSpan;
};

function renderCandle({ x = 0, y = 0, width = 0, height = 0, payload }: CandleProps) {
    return (
        <g>
            {/* The light under the candle, drawn first and grown about its own centre so it spills
                past the mark in every direction: the same trick the trajectory's line halo uses, so
                a candle appears to sit above its own glow rather than to cast a shadow.

                Part of this shape rather than a second `<Bar>`: two bars on one chart are GROUPED by
                Recharts — side by side, each half the width — and the halo would end up beside its
                candle instead of behind it. */}
            <Rectangle
                fill={payload?.color}
                height={height + BAR_HALO_SPREAD}
                radius={(width + BAR_HALO_SPREAD) / 2}
                style={{ filter: 'blur(var(--chart-halo-blur))', opacity: 'var(--chart-halo-opacity)' }}
                width={width + BAR_HALO_SPREAD}
                x={x - BAR_HALO_SPREAD / 2}
                y={y - BAR_HALO_SPREAD / 2}
            />
            <Rectangle fill={payload?.color} height={height} radius={width / 2} width={width} x={x} y={y} />
        </g>
    );
}

// Room for the halo to bleed into, so the outermost candles are not cut in half by the panel.
const PLOT_MARGIN = { top: 8, right: 6, bottom: 8, left: 6 };

const VALUE_TONE = {
    green: 'text-zone-green',
    red: 'text-zone-red',
} as const;

function MetricCard({
    label,
    value,
    valueTone,
    values,
    tones,
    domain,
    selected = false,
    onSelect,
    className,
}: MetricCardProps) {
    // Graded when the caller handed over verdicts to draw. Derived rather than passed: a caller who
    // knew to set a `graded` flag would already have had to look at the tones, and two sources for
    // one fact is one of them going stale. An EMPTY list is not graded — a day with no pushes has no
    // verdict to paint, and a row of neutral candles is not the same claim as no candles at all.
    const graded = (tones?.length ?? 0) > 0;
    const fill = graded ? toneFill(tones ?? []) : accentFill(UNGRADED_STROKE);
    const rows = barSpans(values, graded ? tones : undefined, domain, UNGRADED_STROKE);

    const content = (
        <>
            {/* Two lines and no third. A card in a strip of four is scanned, not studied — a delta
                and a footnote under every figure turn four glances into twelve, and the movement is
                already in the shape to the right. */}
            {/* `min-w-0`, because the figure is set in a wide numeric face and a full-cent profit
                ("+$8,559.33") is a long word to a flex item: without it the column refuses to go
                below its content and pushes the plot off the card's right edge instead. The figure
                wraps rather than truncates — a clipped money amount is a wrong money amount — and
                the size steps up only where the grid gives the card room for it. */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-3 pl-4">
                <span className="text-muted-foreground text-sm font-medium">{label}</span>
                <span
                    className={cn(
                        'text-lg leading-tight font-semibold tabular-nums xl:text-xl',
                        valueTone ? VALUE_TONE[valueTone] : 'text-foreground'
                    )}
                    style={{ letterSpacing: 'var(--tracking-figure)' }}
                >
                    {value}
                </span>
            </div>
            <div
                // Every card wears the same inset panel, graded or not: the difference between them
                // is what the plot SAYS — zone colours on the candles, or one accent hue — not how
                // it is mounted.
                // `shrink-0` against a long figure: the panel is a fixed share of the card and the
                // figure beside it gets the rest, rather than the two negotiating and the plot
                // collapsing to a sliver on the one card whose number is longest.
                className="bg-chart-surface relative my-2.5 mr-2.5 w-2/5 shrink-0 overflow-hidden rounded-md"
            >
                {/* Decor. A horizontal band of the candles' own colours, pooled at the floor of the
                    plot and masked away toward the top — the panel gets somewhere to stand without
                    a second reading of the data appearing under the first. */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: fill,
                        filter: 'blur(var(--chart-fill-blur))',
                        maskImage: 'linear-gradient(to top, black 0%, transparent 68%)',
                        opacity: 'var(--chart-fill-opacity)',
                    }}
                />
                {/* Inert. The strip's card is the control; the shape inside it is a picture, and a
                    picture that reacts to the pointer invites a click that lands somewhere else. */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <ResponsiveContainer height="100%" width="100%">
                        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={rows} margin={PLOT_MARGIN}>
                            {/* Hidden, and present only to own the domain: without it Recharts fits the
                                data to the box exactly and the tallest candle touches both edges. */}
                            <YAxis domain={domain} hide />
                            <Bar dataKey="span" isAnimationActive={false} shape={renderCandle} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );

    const shell = cn(
        'bg-card border-border relative flex h-28 items-stretch overflow-hidden rounded-lg border text-left transition-colors',
        selected ? 'border-ring bg-surface-overlay' : 'hover:border-border-strong',
        className
    );

    // A card that selects is a button; a card that only reports is not. The strip needs the former
    // and the lab's "Now / Next" rows need the latter, and giving both the button role would put
    // four unusable tab stops in front of a reader who cannot act on any of them.
    if (!onSelect) {
        return <div className={shell}>{content}</div>;
    }

    return (
        <button aria-pressed={selected} className={shell} onClick={onSelect} type="button">
            {content}
        </button>
    );
}

export { MetricCard };
