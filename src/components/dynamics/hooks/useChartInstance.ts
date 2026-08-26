import type { DeepPartial, IChartApi, TimeChartOptions } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

// Mounts one Lightweight Charts instance into a div and hands it back once it exists. Creation is an
// effect and never a render: the library writes DOM and reads layout, neither of which happens on the
// server, and `remove()` on cleanup is what keeps a route change from leaking a canvas.
//
// The options passed here are the ones fixed for the chart's lifetime. Anything that changes with
// data or theme is applied by the caller through `chart.applyOptions`, which is cheap and idempotent.
export function useChartInstance(
    options: DeepPartial<TimeChartOptions>,
    // Creation waits on this. A chart built inside a collapsed panel measures its container at zero
    // and stays blank after the panel opens, so the caller says when the box is real.
    enabled = true
): {
    containerRef: React.RefObject<HTMLDivElement | null>;
    chart: IChartApi | null;
} {
    const containerRef = useRef<HTMLDivElement>(null);
    const [chart, setChart] = useState<IChartApi | null>(null);
    // Read once, on mount: re-creating the chart because a caller passed a fresh object literal would
    // throw away every series on every render.
    const initialOptions = useRef(options);

    useEffect(
        function mountChart() {
            const container = containerRef.current;

            if (container === null || !enabled) {
                return;
            }

            const created = createChart(container, initialOptions.current);

            setChart(created);

            return function unmountChart() {
                created.remove();
                setChart(null);
            };
        },
        [enabled]
    );

    return { containerRef, chart };
}
