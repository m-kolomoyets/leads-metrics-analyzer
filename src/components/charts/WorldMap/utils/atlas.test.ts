import type { Topology } from 'topojson-specification';
import type { WorldTopology } from './atlas';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import { restoreCrimea } from './atlas';

// Natural Earth draws Crimea inside Russia. The atlas is corrected at load, so the map draws the
// border the way Ukraine's is: Crimea is Ukraine.

const SIMFEROPOL: [number, number] = [34.1, 44.95];

const load = (): WorldTopology => {
    return structuredClone(world as unknown as Topology) as WorldTopology;
};

const countryOf = (topology: WorldTopology, id: string) => {
    const geometry = topology.objects.countries.geometries.find((entry) => {
        return String(entry.id) === id;
    });

    if (!geometry) {
        throw new Error(`no ${id}`);
    }

    const shape = feature(topology, geometry);

    if (shape.type !== 'Feature') {
        throw new Error(`${id} is a collection`);
    }

    return shape;
};

describe('restoreCrimea', () => {
    it('is inside Russia in the atlas as shipped', () => {
        const topology = load();

        expect(geoContains(countryOf(topology, '643'), SIMFEROPOL)).toBe(true);
        expect(geoContains(countryOf(topology, '804'), SIMFEROPOL)).toBe(false);
    });

    it('moves Crimea to Ukraine', () => {
        const topology = restoreCrimea(load());

        expect(geoContains(countryOf(topology, '804'), SIMFEROPOL)).toBe(true);
        expect(geoContains(countryOf(topology, '643'), SIMFEROPOL)).toBe(false);
    });

    it('joins Crimea to the mainland as one polygon', () => {
        const topology = restoreCrimea(load());
        const ukraine = countryOf(topology, '804');

        expect(ukraine.geometry.type).toBe('Polygon');
        // Kyiv and Simferopol in the same ring.
        expect(geoContains(ukraine, [30.5, 50.45])).toBe(true);
    });

    it('leaves the rest of Russia alone', () => {
        const topology = restoreCrimea(load());

        expect(geoContains(countryOf(topology, '643'), [37.6, 55.75])).toBe(true);
    });
});
