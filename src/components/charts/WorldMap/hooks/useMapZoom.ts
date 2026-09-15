import type { RefObject } from 'react';
import type { ZoomBehavior, ZoomTransform } from 'd3-zoom';
import type { MapTransform } from '../utils/fitTransform';
import { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { zoom as zoomBehaviour, zoomIdentity } from 'd3-zoom';
import { FIT_DURATION_MS, MAP_HEIGHT, MAP_WIDTH, MAX_SCALE, MIN_SCALE } from '../constants';
// Side-effect import: it patches `selection.transition()` on, which `fitTo` animates through.
import 'd3-transition';

export type MapZoomState = {
    transform: ZoomTransform;
    // True once the reader has wheeled or dragged since the last preset, so a panel highlight can
    // step aside: the camera is theirs now, not the preset's.
    isUserDriven: boolean;
};

// d3-zoom bound to the SVG: wheel zooms, drag pans, the world's edges are the pan limit. The
// behaviour writes nothing to the DOM itself — every zoom event lands in React state and the
// `<g transform>` is rendered from it, so the shapes stay React's and the pointer stays d3's.
export function useMapZoom(svgRef: RefObject<SVGSVGElement | null>) {
    const [state, setState] = useState<MapZoomState>({ transform: zoomIdentity, isUserDriven: false });
    const behaviourRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

    useEffect(
        function bindZoom() {
            const svg = svgRef.current;

            if (!svg) {
                return;
            }

            const behaviour = zoomBehaviour<SVGSVGElement, unknown>()
                .scaleExtent([MIN_SCALE, MAX_SCALE])
                .translateExtent([
                    [0, 0],
                    [MAP_WIDTH, MAP_HEIGHT],
                ])
                .on('zoom', (event) => {
                    // A programmatic move (`fitTo`) carries no source event; a wheel or drag does.
                    setState({ transform: event.transform, isUserDriven: event.sourceEvent !== null });
                });

            select(svg).call(behaviour);
            behaviourRef.current = behaviour;

            return () => {
                select(svg).on('.zoom', null);
                behaviourRef.current = null;
            };
        },
        [svgRef]
    );

    function fitTo({ k, x, y }: MapTransform) {
        const svg = svgRef.current;
        const behaviour = behaviourRef.current;

        if (!svg || !behaviour) {
            return;
        }

        select(svg)
            .transition()
            .duration(FIT_DURATION_MS)
            .call(behaviour.transform, zoomIdentity.translate(x, y).scale(k));
    }

    return { ...state, fitTo };
}
