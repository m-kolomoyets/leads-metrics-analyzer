import type { GeometryCollection, MultiPolygon, Polygon, Topology } from 'topojson-specification';
import { geoCentroid } from 'd3-geo';
import { feature, mergeArcs } from 'topojson-client';

// Corrections to the atlas before it is drawn. Natural Earth follows de facto control, so
// world-atlas ships Crimea as a ring of Russia's MultiPolygon; this app draws Ukraine's border as
// Ukraine's, so the ring is moved back and welded to the mainland along the isthmus they share.

type CountryProperties = { name: string };

export type WorldTopology = Topology<{ countries: GeometryCollection<CountryProperties> }>;

const RUSSIA_ID = '643';
const UKRAINE_ID = '804';

// The peninsula's box: any ring of Russia centred in it is Crimea, whichever atlas revision is on.
const CRIMEA_BOX = { west: 32, east: 37, south: 44, north: 46.5 };

const isInCrimea = ([lon, lat]: [number, number]): boolean => {
    return lon >= CRIMEA_BOX.west && lon <= CRIMEA_BOX.east && lat >= CRIMEA_BOX.south && lat <= CRIMEA_BOX.north;
};

const findCountry = (topology: WorldTopology, id: string) => {
    return topology.objects.countries.geometries.find((geometry) => {
        return String(geometry.id) === id;
    });
};

export const restoreCrimea = (topology: WorldTopology): WorldTopology => {
    const russia = findCountry(topology, RUSSIA_ID);
    const ukraine = findCountry(topology, UKRAINE_ID);

    if (
        russia?.type !== 'MultiPolygon' ||
        !ukraine ||
        (ukraine.type !== 'Polygon' && ukraine.type !== 'MultiPolygon')
    ) {
        return topology;
    }

    const rings = russia.arcs.filter((ring) => {
        const shape = feature(topology, { type: 'Polygon', arcs: ring });

        return isInCrimea(geoCentroid(shape));
    });

    if (rings.length === 0) {
        return topology;
    }

    russia.arcs = russia.arcs.filter((ring) => {
        return !rings.includes(ring);
    });

    // Merging drops the arcs the two share — the isthmus — so what is left is one outline.
    const crimea: Polygon[] = rings.map((ring) => {
        return { type: 'Polygon', arcs: ring };
    });
    const merged: MultiPolygon = mergeArcs(topology, [ukraine, ...crimea]);
    const joined: Polygon | MultiPolygon =
        merged.arcs.length === 1 ? { type: 'Polygon', arcs: merged.arcs[0] } : merged;

    Object.assign(ukraine, joined);

    return topology;
};
