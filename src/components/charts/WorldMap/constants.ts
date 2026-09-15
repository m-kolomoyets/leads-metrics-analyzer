import type { WorldMapRegion } from './types';

// The map's logical canvas. Natural Earth is about 1.9 : 1, so the world fills this without air at
// the sides; the SVG scales to its container through the viewBox, and d3-zoom reads the viewBox, so
// every transform below is in these units whatever the rendered width.
export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 500;

// Never out past the whole world, and in far enough that Benelux is three shapes, not one.
export const MIN_SCALE = 1;
export const MAX_SCALE = 12;

// A preset frames its region at 90 % of the viewport; the world preset is the identity.
export const FIT_PADDING = 0.9;
export const FIT_DURATION_MS = 600;

// The regions the panel offers, and the lon/lat box each frames. Boxes rather than country lists:
// a preset is a camera move (PRD story 53), so what it must cover is land, and a box needs no
// membership decisions about Turkey or Russia.
export const WORLD_MAP_REGIONS = [
    'world',
    'europe',
    'asia',
    'africa',
    'north-america',
    'south-america',
    'oceania',
] as const;

// `[[west, south], [east, north]]` in degrees. `world` has no box — it is the identity transform.
export const REGION_BOUNDS: Record<Exclude<WorldMapRegion, 'world'>, [[number, number], [number, number]]> = {
    europe: [
        [-25, 34],
        [45, 72],
    ],
    asia: [
        [25, -12],
        [150, 60],
    ],
    africa: [
        [-20, -36],
        [55, 38],
    ],
    'north-america': [
        [-168, 8],
        [-52, 72],
    ],
    'south-america': [
        [-85, -57],
        [-33, 14],
    ],
    oceania: [
        [110, -50],
        [180, 0],
    ],
};

// The dot grid's lattice (slice 17): the step between dots in degrees, and each dot's radius as a
// share of the step's width at the equator, so the dots read as a texture with air between them.
// Fewer degrees is more dots — 1.5° is ~9,000 circles for the world, still a fluid zoom.
export const DOT_GRID_STEP = 1.5;
export const DOT_GRID_RADIUS_RATIO = 0.36;

// Antarctica: an ISO country, but a slab across the bottom of every projection that no campaign
// ever targets. Left off the map like every atlas does.
export const ANTARCTICA_ID = '010';

// Markets the 110m atlas has no shape for: city-states and islands smaller than its resolution.
// Singapore is the first market this app ever reported, so "too small to draw" cannot mean "not
// on the map" — a painted market with no shape is drawn as a dot at these coordinates instead.
// `[lon, lat]` in degrees; the 50m atlas would draw most of them but costs four times the bytes.
export const MICRO_COUNTRIES: Record<string, [number, number]> = {
    SG: [103.82, 1.35],
    HK: [114.17, 22.32],
    MO: [113.55, 22.2],
    BH: [50.55, 26.07],
    MT: [14.38, 35.9],
    MV: [73.22, 3.2],
    MU: [57.55, -20.35],
    SC: [55.45, -4.68],
    KM: [43.33, -11.65],
    CV: [-23.6, 15.1],
    ST: [6.73, 0.33],
    BB: [-59.55, 13.18],
    LC: [-60.98, 13.9],
    VC: [-61.2, 13.25],
    GD: [-61.68, 12.12],
    AG: [-61.8, 17.08],
    KN: [-62.72, 17.33],
    DM: [-61.37, 15.42],
    AD: [1.52, 42.5],
    LI: [9.55, 47.15],
    MC: [7.42, 43.73],
    SM: [12.45, 43.93],
    VA: [12.45, 41.9],
    BN: [114.73, 4.5],
    TO: [-175.2, -21.18],
    WS: [-172.1, -13.75],
    FM: [158.2, 6.9],
    PW: [134.5, 7.5],
    MH: [171.2, 7.1],
    KI: [-157.4, 1.87],
    NR: [166.93, -0.53],
    TV: [179.2, -8.5],
};
