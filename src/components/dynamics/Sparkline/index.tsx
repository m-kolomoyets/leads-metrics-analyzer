import type { UTCTimestamp } from 'lightweight-charts';
import type { MetricTone } from '@/lib/domain/dynamics';
import type { Zone } from '@/lib/domain/types';
import type { ZoneSeriesApi } from '../ZoneSeries/types';
import { useEffect, useRef } from 'react';
import { ColorType, CrosshairMode } from 'lightweight-charts';
import { cn } from '@/lib/utils/cn';
import { useChartInstance } from '../hooks/useChartInstance';
import { useChartPalette } from '../hooks/useChartPalette';
import { ZoneSeries } from '../ZoneSeries';

// One mini chart from the strip (SPEC §6.6): the shape of a metric's day, about 40px tall, with no
// axes, no ticks and no crosshair — and the trailing figure printed beside it, because the shape says
// which way and the number says how far.
//
// It is a button, not a picture. Clicking it switches the main chart to this metric, which is the
// whole reason a lead scans the strip first: find the line that looks wrong, then go read it. The
// chart itself is inert — every pointer event belongs to the button around it.

// The strip reads as a shape, so the x axis is the ORDER of the pushes, not the clock: a lone push at
// 09:00 and one at 17:00 should not leave a sparkline that is mostly empty space.
const STEP_SECONDS = 60;

const TONE_TEXT_CLASS: Record<MetricTone, string> = {
    good: 'text-success',
    bad: 'text-danger',
    neutral: 'text-foreground',
};

type SparklineProps = {
    label: string;
    // The metric across the whole day, oldest first. Nulls are gaps, never zeroes.
    values: (number | null)[];
    // Each push's zone, parallel to `values` — the same grading the big chart strokes with, so a CPI
    // reading red up there cannot read plain blue down here. All-`neutral` for an ungraded metric.
    zones: Zone[];
    // The trailing figure, already formatted in the metric's own units.
    trailing: string;
    tone: MetricTone;
    // Whether the main chart is currently drawing this metric.
    selected: boolean;
    onSelect: () => void;
};

function Sparkline({ label, values, zones, trailing, tone, selected, onSelect }: SparklineProps) {
    const palette = useChartPalette();
    const seriesRef = useRef<ZoneSeriesApi | null>(null);
    const { containerRef, chart } = useChartInstance({
        autoSize: true,
        layout: { background: { type: ColorType.Solid, color: 'transparent' }, attributionLogo: false },
        grid: { vertLines: { visible: false }, horzLines: { visible: false } },
        leftPriceScale: { visible: false },
        rightPriceScale: { visible: false },
        timeScale: { visible: false, fixLeftEdge: true, fixRightEdge: true },
        crosshair: { mode: CrosshairMode.Hidden },
        handleScroll: false,
        handleScale: false,
    });

    // Serialised rather than passed by identity: the row is rebuilt on every render, and a fresh
    // array each time would tear the series down and put it back for no change at all.
    const dataKey = `${values.join('|')}::${zones.join('|')}::${tone}::${palette.zone.green}`;

    useEffect(
        function drawSeries() {
            if (chart === null) {
                return;
            }

            const series =
                seriesRef.current ??
                chart.addCustomSeries(new ZoneSeries(), {
                    priceLineVisible: false,
                    lastValueVisible: false,
                });

            seriesRef.current = series;

            series.applyOptions({
                // An ungraded metric keeps the strip's neutral, which is the accent and not grey: an
                // ungraded metric is not a broken one.
                zoneColors: palette.zone,
                flatColor: zones.every((zone) => {
                    return zone === 'neutral';
                })
                    ? palette.accent
                    : null,
                width: 2,
                points: 'last',
                pointRadius: 2.5,
                pointRing: palette.background,
                chromeColor: palette.muted,
            });

            series.setData(
                values.map((value, index) => {
                    const time = (index * STEP_SECONDS) as UTCTimestamp;

                    // An unmeasurable push is whitespace: a break in the line, never a dip to zero.
                    // A CPI nobody could compute is not a CPI of nothing.
                    if (value === null || !Number.isFinite(value)) {
                        return { time };
                    }

                    return { time, value, zone: zones[index] ?? 'neutral' };
                })
            );

            chart.timeScale().fitContent();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- `dataKey` stands in for the arrays.
        [chart, dataKey]
    );

    return (
        <button
            type="button"
            aria-pressed={selected}
            className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors',
                selected ? 'border-primary bg-secondary/40' : 'border-border hover:border-primary/50'
            )}
            onClick={onSelect}
        >
            {/* Name over figure on the left, plot on the right: a line given the full width of the card
                flattens into a near-horizontal streak, and the shape is the whole message. */}
            <span className="flex min-w-0 flex-col">
                <span className="text-muted-foreground text-[11px] tracking-widest uppercase">{label}</span>
                <span className={cn('font-mono text-sm font-semibold', TONE_TEXT_CLASS[tone])}>{trailing}</span>
            </span>

            {/* `pointer-events-none`: the chart is a picture here, and every click belongs to the
                button that switches the big chart to this metric. */}
            <div ref={containerRef} className="pointer-events-none ml-auto h-12 w-[60%]" aria-hidden={true} />
        </button>
    );
}

export { Sparkline };
