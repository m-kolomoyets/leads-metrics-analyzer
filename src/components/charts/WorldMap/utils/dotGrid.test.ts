import type { Feature, Polygon } from 'geojson';
import { buildDotGrid } from './dotGrid';

// The dot grid is one lon/lat lattice laid over the world: a country keeps the lattice points that
// fall inside it, so dots line up across borders, and a country too small to catch a point still
// gets one at its centre.

// Projects degrees straight to units, so the assertions read in lon/lat.
const identity = (point: [number, number]): [number, number] | null => {
    return point;
};

const square = (key: string, west: number, south: number, east: number, north: number) => {
    const feature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            // Clockwise, as d3-geo wants an exterior ring (the opposite of RFC 7946).
            coordinates: [
                [
                    [west, south],
                    [west, north],
                    [east, north],
                    [east, south],
                    [west, south],
                ],
            ],
        },
    };

    return { key, feature };
};

describe('buildDotGrid', () => {
    it('keeps the lattice points inside a country, on the global lattice', () => {
        const grid = buildDotGrid([square('AA', 0.5, 0.5, 4.5, 2.5)], identity, 2);

        // A 2° lattice from -180 lands on even degrees: (2, 2) and (4, 2) are inside, (0, 0) is not.
        expect(grid.AA).toEqual([
            [2, 2],
            [4, 2],
        ]);
    });

    it('drops the points outside the country', () => {
        const grid = buildDotGrid([square('AA', 0.5, 0.5, 4.5, 2.5)], identity, 1);

        for (const [lon, lat] of grid.AA) {
            expect(lon).toBeGreaterThan(0.5);
            expect(lon).toBeLessThan(4.5);
            expect(lat).toBeGreaterThan(0.5);
            expect(lat).toBeLessThan(2.5);
        }

        expect(grid.AA).toHaveLength(8);
    });

    it('gives a country too small for the lattice one dot at its centre', () => {
        const grid = buildDotGrid([square('SM', 12.2, 43.8, 12.6, 44.1)], identity, 2);

        expect(grid.SM).toHaveLength(1);
        expect(grid.SM[0][0]).toBeCloseTo(12.4, 1);
        expect(grid.SM[0][1]).toBeCloseTo(43.95, 1);
    });

    it('walks a country across the antimeridian both ways round', () => {
        // Fiji-like: west of the line and east of it, so its bounds read west > east.
        const feature: Feature<Polygon> = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [177, -19],
                        [177, -16],
                        [-177, -16],
                        [-177, -19],
                        [177, -19],
                    ],
                ],
            },
        };
        const grid = buildDotGrid([{ key: 'FJ', feature }], identity, 2);

        expect(grid.FJ).toEqual(
            expect.arrayContaining([
                [178, -18],
                [-178, -18],
            ])
        );
        // 178, the line (once, as -180) and -178 on one latitude row.
        expect(grid.FJ).toHaveLength(3);
    });

    it('counts the antimeridian once', () => {
        // A box straddling the line: 180 and -180 are one meridian, so one dot, not two.
        const grid = buildDotGrid([square('XX', 178.5, -1, -178.5, 1)], identity, 1);
        const lons = grid.XX.map(([lon]) => {
            return lon;
        });

        expect(lons).not.toContain(180);
        expect(
            [...new Set(lons)].sort((a, b) => {
                return a - b;
            })
        ).toEqual([-180, -179, 179]);
        // Three longitudes on three latitude rows.
        expect(grid.XX).toHaveLength(9);
    });

    it('keys every country by its key', () => {
        const grid = buildDotGrid([square('AA', 0, 0, 3, 3), square('BB', 10, 10, 13, 13)], identity, 1);

        expect(Object.keys(grid).sort()).toEqual(['AA', 'BB']);
    });
});
