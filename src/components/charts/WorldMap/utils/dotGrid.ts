import type { Feature, Geometry } from 'geojson';
import { geoBounds, geoCentroid, geoContains } from 'd3-geo';

// The dot grid (slice 17's experiment): the world as one lattice of lon/lat points, each country
// keeping the points that fall inside it. One lattice for the whole world rather than one per
// country, so the dots line up across borders instead of each country carrying its own offset.
//
// Built once per density per geometry load: `geoContains` runs a spherical point-in-polygon per
// lattice point per country, which is cheap enough to do once and too slow to do on every render.

export type DotGridCountry = {
    // The shape's key, not its ISO code: a territory ISO does not number is land all the same.
    key: string;
    feature: Feature<Geometry>;
};

export type DotGrid = Record<string, [number, number][]>;

type Project = (point: [number, number]) => [number, number] | null;

// The lattice starts at the antimeridian, so a step of 2° lands on even degrees everywhere.
const LATTICE_ORIGIN = -180;

// The lattice values from `from` to `to` inclusive, counted by index rather than accumulated, so
// a step of 1.5 never drifts off the lattice.
const latticeIn = (from: number, to: number, step: number): number[] => {
    const values: number[] = [];
    const first = Math.ceil((from - LATTICE_ORIGIN) / step);

    for (let index = first; LATTICE_ORIGIN + index * step <= to; index += 1) {
        values.push(LATTICE_ORIGIN + index * step);
    }

    return values;
};

// The longitudes a box covers, on the lattice. A box across the antimeridian reads west > east
// (`geoBounds`), and is walked as two runs: west to the line and the line to east. The line itself
// is one meridian, so 180 is left to the second run's -180.
const lonsIn = (west: number, east: number, step: number): number[] => {
    if (west <= east) {
        return latticeIn(west, east, step).filter((lon) => {
            return lon < 180;
        });
    }

    return [
        ...latticeIn(west, 180, step).filter((lon) => {
            return lon < 180;
        }),
        ...latticeIn(LATTICE_ORIGIN, east, step),
    ];
};

export const buildDotGrid = (countries: DotGridCountry[], project: Project, step: number): DotGrid => {
    const grid: DotGrid = {};

    for (const { key, feature } of countries) {
        const [[west, south], [east, north]] = geoBounds(feature);
        const points: [number, number][] = [];
        const lons = lonsIn(west, east, step);

        for (const lat of latticeIn(south, north, step)) {
            for (const lon of lons) {
                if (!geoContains(feature, [lon, lat])) {
                    continue;
                }

                const point = project([lon, lat]);

                if (point) {
                    points.push(point);
                }
            }
        }

        // A country smaller than a cell still exists: one dot at its centre, off the lattice.
        if (points.length === 0) {
            const point = project(geoCentroid(feature));

            if (point) {
                points.push(point);
            }
        }

        grid[key] = points;
    }

    return grid;
};
