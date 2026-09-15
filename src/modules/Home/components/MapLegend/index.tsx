import type { ChartTone } from '@/components/charts/types';
import { TONE_STROKE } from '@/components/charts/constants';

// What the colours say, in the map's own paint. Four zone swatches and the outline: the map is
// read from across the room, and a legend is how the first look becomes a reading.

type LegendEntry = {
    key: string;
    label: string;
    tone: ChartTone | null;
};

const ENTRIES: LegendEntry[] = [
    { key: 'green', label: 'ROI above +30%', tone: 'green' },
    { key: 'yellow', label: 'ROI −20% to +30%', tone: 'yellow' },
    { key: 'red', label: 'ROI below −20%', tone: 'red' },
    { key: 'neutral', label: 'Too little data (< $500 revenue)', tone: 'neutral' },
    { key: 'outline', label: 'No reports in the period', tone: null },
];

function MapLegend() {
    return (
        <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Map legend">
            {ENTRIES.map((entry) => {
                // The swatch is the map's own recipe: the tone at full strength on the border, the
                // same tone washed over the plot's surface at the map's fill opacity inside.
                const style =
                    entry.tone === null
                        ? { borderColor: 'var(--map-land-stroke)', backgroundColor: 'var(--map-land)' }
                        : {
                              borderColor: TONE_STROKE[entry.tone],
                              backgroundColor: `color-mix(in srgb, ${TONE_STROKE[entry.tone]} calc(var(--map-fill-opacity) * 100%), var(--chart-surface))`,
                          };

                return (
                    <li key={entry.key} className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="inline-block size-3 rounded-xs border" style={style} />
                        {entry.label}
                    </li>
                );
            })}
        </ul>
    );
}

export { MapLegend };
