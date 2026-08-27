import type { ReactNode } from 'react';
import type { ChartTone } from '../types';
import { useId } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils/cn';
import { CURVE, HALO_SPREAD, STROKE_WIDTH, UNGRADED_STROKE } from '../constants';
import { accentFill, toneFill, toneStops } from '../utils/gradient';

// One metric, read as a figure and a shape at once: the reading on the left, the day that produced
// it on the right. The strip of these under the trajectory is a navigation control, not decoration —
// a lead scans four shapes, finds the one bending the wrong way and clicks it.
//
// Two variants, and the difference is whether the metric HAS a verdict:
//
//   graded — a cost, with thresholds behind it. Its stroke carries the zone gradient and its plot
//            wears a dotted grid. The card is louder because the metric can be wrong.
//   plain  — money or a ratio, with no thresholds anywhere (SPEC §6.6). One accent hue and a quiet
//            solid grid. Nothing here is a verdict, so nothing here shouts.
//
// Selection reads as chrome — a ring and a lifted surface — never as hue, because every hue on this
// card is already spoken for by the zone (ADR-0019).

type MetricCardProps = {
    label: ReactNode;
    value: string;
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

function MetricCard({ label, value, values, tones, domain, selected = false, onSelect, className }: MetricCardProps) {
    const gradientId = useId();
    const stops = toneStops(tones ?? []);
    // Graded when the caller handed over verdicts to draw. Derived rather than passed: a caller who
    // knew to set a `graded` flag would already have had to look at the tones, and two sources for
    // one fact is one of them going stale. An EMPTY list is not graded — a gradient with no stops
    // paints nothing, so a day with no pushes would lose its stroke rather than draw a flat one.
    const graded = stops.length > 0;
    // Graded lines carry the zone gradient; ungraded ones take the accent, and their halo with them.
    const stroke = graded ? `url(#${gradientId})` : UNGRADED_STROKE;
    const fill = graded ? toneFill(tones ?? []) : accentFill(UNGRADED_STROKE);
    const rows = values.map((entry, index) => {
        return { index, value: entry };
    });

    const content = (
        <>
            {/* Two lines and no third. A card in a strip of four is scanned, not studied — a delta
                and a footnote under every figure turn four glances into twelve, and the movement is
                already in the shape to the right. */}
            <div className="flex flex-1 flex-col justify-center gap-0.5 py-3 pl-4">
                <span className="text-muted-foreground text-sm font-medium">{label}</span>
                <span
                    className="text-foreground text-2xl font-semibold tabular-nums"
                    style={{ letterSpacing: 'var(--tracking-figure)' }}
                >
                    {value}
                </span>
            </div>
            <div
                // Every card wears the same inset panel, graded or not: the difference between them
                // is what the plot SAYS — a dotted grid and a zone gradient — not how it is mounted.
                className="bg-chart-surface relative my-2.5 mr-2.5 w-1/2 overflow-hidden rounded-md"
            >
                {/* Decor. A horizontal band of the line's own colours, pooled at the floor of the
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
                        <LineChart data={rows} margin={{ top: 8, right: 0, bottom: 8, left: 0 }}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                                    {stops.map((stop) => {
                                        return <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />;
                                    })}
                                </linearGradient>
                            </defs>
                            {/* Hidden, and present only to own the domain: without it Recharts fits the
                            data to the box exactly and the stroke hangs over both edges. */}
                            <YAxis domain={domain} hide />
                            <CartesianGrid
                                stroke={graded ? 'var(--chart-grid-dotted)' : 'var(--chart-grid)'}
                                strokeDasharray={graded ? '4 4' : undefined}
                                vertical={graded}
                            />
                            {/* Drawn first and never hit-tested: the halo is the same path, wider, blurred
                            and dimmed, so the line appears to sit above its own light. */}
                            <Line
                                dataKey="value"
                                dot={false}
                                isAnimationActive={false}
                                stroke={stroke}
                                strokeLinecap="round"
                                strokeWidth={STROKE_WIDTH.small + HALO_SPREAD}
                                style={{
                                    filter: 'blur(var(--chart-halo-blur))',
                                    opacity: 'var(--chart-halo-opacity)',
                                }}
                                type={CURVE}
                            />
                            <Line
                                activeDot={false}
                                dataKey="value"
                                dot={false}
                                isAnimationActive={false}
                                stroke={stroke}
                                strokeLinecap="round"
                                strokeWidth={STROKE_WIDTH.small}
                                type={CURVE}
                            />
                        </LineChart>
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
