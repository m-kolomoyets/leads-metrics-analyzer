import type { PointerEvent } from 'react';
import type { WorldMapCountry, WorldMapProps, WorldMapRegion } from './types';
import type { WorldShape } from './utils/geometry';
import { Suspense, use, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';
import { Skeleton } from '@/components/ui/Skeleton';
import { TONE_STROKE } from '../constants';
import { FIT_PADDING, MAP_HEIGHT, MAP_WIDTH, MAX_SCALE, MIN_SCALE, WORLD_MAP_REGIONS } from './constants';
import { fitTransform } from './utils/fitTransform';
import { loadWorldGeometry } from './utils/geometry';
import { useMapZoom } from './hooks/useMapZoom';

// The world, coloured by whatever the caller grades it with. A chart primitive (ADR-0025): it takes
// countries as `{ code, tone, tooltip }`, imports nothing from the domain, and does not know that
// the tone is an ROI zone or that the tooltip rows are money.
//
// Hand-rolled SVG over d3-geo rather than a map library: the map is one projection, one zoom and a
// hundred and seventy paths, and every colour on it must come from the app's own tokens (ADR-0020)
// — a library's own fill, border and tooltip would be a second design system showing through, as
// the canvas charts' defaults once did.
//
// Zoom is a camera and nothing else. Wheel and drag move it; a continent preset moves it to a box
// (PRD story 53). Nothing here ever filters the data, so "World" only ever brings the camera back.

// What is under the pointer: a shape or a dot, named by the atlas for the tooltip's fallback title.
type HoverTarget = {
    code: string | null;
    name: string;
};

type Hover = HoverTarget & {
    // Pointer position and the plot's width, both relative to the plot's frame and both read at the
    // pointer event — the frame is a ref, and a render reads none.
    x: number;
    y: number;
    frameWidth: number;
};

// Where the hover card sits relative to the pointer, and how far from the plot's edge it flips.
const TOOLTIP_OFFSET = 14;
const TOOLTIP_FLIP_AT = 0.6;

// A shapeless market's dot, in screen pixels at any zoom.
const DOT_RADIUS = 4;

type WorldMapViewProps = WorldMapProps & {
    geometryPromise: Promise<Awaited<ReturnType<typeof loadWorldGeometry>>>;
};

function WorldMapView({
    countries,
    regionLabels,
    countryNames,
    render = 'shapes',
    isStale = false,
    geometryPromise,
}: WorldMapViewProps) {
    const { shapes, points, regionBounds } = use(geometryPromise);
    const svgRef = useRef<SVGSVGElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const { transform, isUserDriven, fitTo } = useMapZoom(svgRef);
    const [requestedRegion, setRequestedRegion] = useState<WorldMapRegion>('world');
    const [hover, setHover] = useState<Hover | null>(null);
    // The highlight follows the camera: once the reader has moved it, no preset describes the view.
    const activeRegion = isUserDriven ? null : requestedRegion;

    const byCode = new Map(
        countries.map((country) => {
            return [country.code, country] as const;
        })
    );
    // Outline first, painted after, so a painted stroke is never covered by a neighbour's outline.
    const outlined = shapes.filter((shape) => {
        return shape.code === null || !byCode.has(shape.code);
    });
    const painted =
        render === 'shapes'
            ? shapes.filter((shape) => {
                  return shape.code !== null && byCode.has(shape.code);
              })
            : [];
    // A painted market the atlas has no shape for is a dot instead (Singapore, Hong Kong, Malta…).
    const shaped = new Set(
        shapes.map((shape) => {
            return shape.code;
        })
    );
    const dotted = countries.filter((country) => {
        return !shaped.has(country.code) && country.code in points;
    });
    const hoveredCountry = hover?.code ? byCode.get(hover.code) : undefined;

    function selectRegion(region: WorldMapRegion) {
        setRequestedRegion(region);

        if (region === 'world') {
            fitTo({ k: MIN_SCALE, x: 0, y: 0 });
            return;
        }

        fitTo(
            fitTransform(
                regionBounds[region],
                { width: MAP_WIDTH, height: MAP_HEIGHT },
                { padding: FIT_PADDING, maxScale: MAX_SCALE, minScale: MIN_SCALE }
            )
        );
    }

    function handlePointerMove(target: HoverTarget, event: PointerEvent<SVGElement>) {
        const frame = frameRef.current;

        if (!frame) {
            return;
        }

        const rect = frame.getBoundingClientRect();

        setHover({ ...target, x: event.clientX - rect.left, y: event.clientY - rect.top, frameWidth: rect.width });
    }

    function handlePointerLeave() {
        setHover(null);
    }

    function renderShape(shape: WorldShape, country: WorldMapCountry | undefined) {
        const stroke = country ? TONE_STROKE[country.tone] : 'var(--map-land-stroke)';
        const fill = country ? TONE_STROKE[country.tone] : 'var(--map-land)';
        const fillOpacity = country ? (country.fillOpacity ?? 'var(--map-fill-opacity)') : 1;

        return (
            <path
                key={shape.key}
                d={shape.d}
                // Strokes keep their width under zoom: a border that thickens as the reader zooms in
                // becomes the map, and the fill it outlines disappears behind it.
                vectorEffect="non-scaling-stroke"
                strokeWidth={country ? 1.25 : 0.5}
                strokeLinejoin="round"
                style={{ fill, fillOpacity, stroke }}
                className={cn(
                    'motion-safe:transition-[fill-opacity] motion-safe:duration-150',
                    country && 'hover:[fill-opacity:0.7]!'
                )}
                onPointerMove={(event) => {
                    handlePointerMove(shape, event);
                }}
                onPointerLeave={handlePointerLeave}
            />
        );
    }

    function renderDot(country: WorldMapCountry) {
        const [cx, cy] = points[country.code];

        return (
            <circle
                key={country.code}
                cx={cx}
                cy={cy}
                // Held at one screen size under zoom, like the strokes: a dot is a marker, not land.
                r={DOT_RADIUS / transform.k}
                vectorEffect="non-scaling-stroke"
                strokeWidth={1.25}
                style={{
                    fill: TONE_STROKE[country.tone],
                    fillOpacity: country.fillOpacity ?? 'var(--map-fill-opacity)',
                    stroke: TONE_STROKE[country.tone],
                }}
                className="motion-safe:transition-[fill-opacity] hover:[fill-opacity:0.7]! motion-safe:duration-150"
                onPointerMove={(event) => {
                    handlePointerMove({ code: country.code, name: country.code }, event);
                }}
                onPointerLeave={handlePointerLeave}
            />
        );
    }

    function renderTooltip() {
        if (!hover) {
            return null;
        }

        const flip = hover.x > hover.frameWidth * TOOLTIP_FLIP_AT;
        const title = hoveredCountry?.tooltip.title ?? countryNames?.[hover.code ?? ''] ?? hover.name;

        return (
            <div
                className="border-border bg-popover text-popover-foreground shadow-overlay pointer-events-none absolute z-10 flex w-max max-w-xs flex-col gap-1 rounded-md border px-3 py-2 text-xs"
                style={{
                    top: hover.y + TOOLTIP_OFFSET,
                    left: flip ? undefined : hover.x + TOOLTIP_OFFSET,
                    right: flip ? hover.frameWidth - hover.x + TOOLTIP_OFFSET : undefined,
                }}
            >
                <p className="font-medium">{title}</p>
                {hoveredCountry && (
                    <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-3 tabular-nums">
                        {hoveredCountry.tooltip.rows.map((row) => {
                            return (
                                <div key={row.label} className="contents">
                                    <dt>{row.label}</dt>
                                    <dd
                                        className="text-right"
                                        style={row.tone === undefined ? undefined : { color: TONE_STROKE[row.tone] }}
                                    >
                                        {row.value}
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <Segmented label="Region">
                {WORLD_MAP_REGIONS.map((region) => {
                    return (
                        <SegmentedItem
                            key={region}
                            selected={region === activeRegion}
                            onSelect={() => {
                                selectRegion(region);
                            }}
                            className="px-2 py-0.5 text-xs"
                        >
                            {regionLabels[region]}
                        </SegmentedItem>
                    );
                })}
            </Segmented>

            <div
                ref={frameRef}
                className={cn(
                    'bg-chart-surface relative overflow-hidden rounded-md motion-safe:transition-opacity motion-safe:duration-300',
                    isStale && 'opacity-60'
                )}
            >
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                    className="block h-auto w-full cursor-grab touch-none select-none active:cursor-grabbing"
                    role="img"
                    aria-label="World map"
                >
                    <g transform={transform.toString()}>
                        {outlined.map((shape) => {
                            return renderShape(shape, undefined);
                        })}
                        {painted.map((shape) => {
                            return renderShape(shape, byCode.get(shape.code ?? ''));
                        })}
                        {render === 'shapes' && dotted.map(renderDot)}
                    </g>
                </svg>

                {/* The dot grid is slice 17's experiment: the branch exists so a page can ask for it,
                    and answers with the land alone until it is built. */}
                {render === 'dots' && (
                    <p className="text-muted-foreground absolute inset-x-0 bottom-2 text-center text-xs">
                        Dot grid render is not built yet.
                    </p>
                )}

                {renderTooltip()}
            </div>
        </div>
    );
}

function WorldMapPlaceholder() {
    return (
        <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading the map">
            <Skeleton className="h-6 w-96 max-w-full" />
            <Skeleton className="w-full rounded-md" style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }} />
        </div>
    );
}

function WorldMap({ className, ...props }: WorldMapProps) {
    // Requested on first render, not at import: the atlas chunk is fetched after the page has
    // painted its frame, and the placeholder holds the map's place meanwhile.
    const geometryPromise = loadWorldGeometry();

    return (
        <div className={className}>
            <Suspense fallback={<WorldMapPlaceholder />}>
                <WorldMapView {...props} geometryPromise={geometryPromise} />
            </Suspense>
        </div>
    );
}

export { WorldMap };
