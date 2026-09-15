import type { GeometryCollection, Topology } from 'topojson-specification';
import type { WorldMapRegion } from '../types';
import type { DotGrid, DotGridCountry } from './dotGrid';
import type { ProjectedBounds } from './fitTransform';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import countries from 'i18n-iso-countries';
import { feature } from 'topojson-client';
import { ANTARCTICA_ID, MAP_HEIGHT, MAP_WIDTH, MICRO_COUNTRIES, REGION_BOUNDS } from '../constants';
import { buildDotGrid } from './dotGrid';

// The world's shapes, projected once. The atlas is ~110 kB of TopoJSON, so it is code-split and
// pulled in only when a map first renders — after the page has painted its frame — and then kept
// for the session: the geometry never changes, and the projection is fixed to the logical canvas.

export type WorldShape = {
    key: string;
    // ISO 3166-1 alpha-2, or null for a territory the atlas draws but ISO does not number (Kosovo,
    // Somaliland, Northern Cyprus) — outline only, never paintable.
    code: string | null;
    name: string;
    // The projected SVG path.
    d: string;
};

export type WorldGeometry = {
    shapes: WorldShape[];
    // Projected dots for the markets the atlas has no shape for, by code.
    points: Record<string, [number, number]>;
    // Each region's box, projected, for the panel's presets.
    regionBounds: Record<Exclude<WorldMapRegion, 'world'>, ProjectedBounds>;
    // The dot grid (slice 17) at a lattice step in degrees, projected and keyed by shape key. Built
    // on first ask per step and kept: the lattice is a function of the geometry and the step alone.
    dotGrid: (step: number) => DotGrid;
};

type CountryProperties = { name: string };
type WorldTopology = Topology<{ countries: GeometryCollection<CountryProperties> }>;

// Natural Earth is pseudocylindrical: y depends on latitude alone and x grows with longitude, so a
// box's extremes sit on its two meridians — but at which latitude depends on the box, so both edges
// are sampled top to bottom rather than only at the corners.
const EDGE_SAMPLES = 12;

const projectBounds = (
    project: (point: [number, number]) => [number, number] | null,
    [[west, south], [east, north]]: [[number, number], [number, number]]
): ProjectedBounds => {
    let x0 = Number.POSITIVE_INFINITY;
    let y0 = Number.POSITIVE_INFINITY;
    let x1 = Number.NEGATIVE_INFINITY;
    let y1 = Number.NEGATIVE_INFINITY;

    for (let step = 0; step <= EDGE_SAMPLES; step += 1) {
        const lat = south + ((north - south) * step) / EDGE_SAMPLES;

        for (const lon of [west, east]) {
            const point = project([lon, lat]);

            if (point) {
                x0 = Math.min(x0, point[0]);
                y0 = Math.min(y0, point[1]);
                x1 = Math.max(x1, point[0]);
                y1 = Math.max(y1, point[1]);
            }
        }
    }

    return [
        [x0, y0],
        [x1, y1],
    ];
};

const buildGeometry = (world: WorldTopology): WorldGeometry => {
    const projection = geoNaturalEarth1().fitExtent(
        [
            [0, 0],
            [MAP_WIDTH, MAP_HEIGHT],
        ],
        { type: 'Sphere' }
    );
    const path = geoPath(projection);
    const collection = feature(world, world.objects.countries);

    const land: DotGridCountry[] = [];
    const shapes = collection.features.flatMap((shape): WorldShape[] => {
        const id = String(shape.id ?? '');

        if (id === ANTARCTICA_ID) {
            return [];
        }

        const d = path(shape);

        if (!d) {
            return [];
        }

        const key = id || shape.properties.name;

        land.push({ key, feature: shape });

        return [
            {
                key,
                code: countries.numericToAlpha2(id) ?? null,
                name: shape.properties.name,
                d,
            },
        ];
    });

    const regionBounds = Object.fromEntries(
        Object.entries(REGION_BOUNDS).map(([region, box]) => {
            return [region, projectBounds(projection, box)];
        })
    ) as WorldGeometry['regionBounds'];

    const points: Record<string, [number, number]> = {};

    for (const [code, lonLat] of Object.entries(MICRO_COUNTRIES)) {
        const point = projection(lonLat);

        if (point) {
            points[code] = point;
        }
    }

    const dotGrids = new Map<number, DotGrid>();
    const dotGrid = (step: number): DotGrid => {
        let grid = dotGrids.get(step);

        if (!grid) {
            grid = buildDotGrid(land, projection, step);
            dotGrids.set(step, grid);
        }

        return grid;
    };

    return { shapes, points, regionBounds, dotGrid };
};

let pending: Promise<WorldGeometry> | null = null;

// Memoised at module level so `use()` sees one stable promise across renders and routes. The import
// is dynamic on purpose: it is what makes the atlas its own chunk.
export const loadWorldGeometry = (): Promise<WorldGeometry> => {
    pending ??= import('world-atlas/countries-110m.json').then((module) => {
        return buildGeometry(module.default as unknown as WorldTopology);
    });

    return pending;
};
