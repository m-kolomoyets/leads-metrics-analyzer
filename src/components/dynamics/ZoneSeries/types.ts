import type {
    CustomData,
    CustomSeriesOptions,
    ISeriesApi,
    SeriesPartialOptions,
    Time,
    WhitespaceData,
} from 'lightweight-charts';
import type { Zone } from '@/lib/domain/types';

export type ZonePoint = CustomData<Time> & {
    // The figure at this push. A push that could not measure the metric is passed as whitespace
    // instead — a gap in the line, never a dive to zero.
    value: number;
    // The verdict this push's own frozen thresholds gave (ADR-0002). `neutral` is ungraded money.
    zone: Zone;
    // Facebook restated the interval ENDING at this push: the stroke into it is drawn faded.
    faded?: boolean;
    // This push restated an earlier one, so it wears the correction badge (ADR-0018).
    badge?: boolean;
    // The edge-case glyphs for the interval ending here, drawn in a lane along the bottom of the
    // pane: they describe the INTERVAL, and hanging them off the line would make them look like
    // properties of the figure.
    flags?: readonly string[];
};

export type ZoneSeriesOptions = CustomSeriesOptions & {
    // Canvas cannot read `var(--zone-green)`, so the palette arrives already resolved to real colours
    // and is re-applied whenever the theme flips.
    zoneColors: Record<Zone, string>;
    // Set for the money/ROI line, which takes no verdict: one flat colour whatever the zones say.
    flatColor: string | null;
    width: number;
    dash: number[];
    // `all` on the big chart, where every push is a target; `last` on a sparkline, which marks only
    // where the day ended; `none` when the shape is the whole message.
    points: 'all' | 'last' | 'none';
    pointRadius: number;
    // Ring around each marker, so a point stays visible where two lines cross.
    pointRing: string;
    fadedOpacity: number;
    // The push the tooltip is open on, as its logical index — drawn larger, over a soft halo, so the
    // card can never be read against the wrong point. Null when no card is open.
    activeIndex: number | null;
    // The vertical guide dropped through the active push. Only one line on the chart draws it: two
    // would double its opacity at the same x and read as a solid rule.
    showGuide: boolean;
    guideColor: string;
    // The flag lane's ink and the badge ring. Chrome about the push, never a verdict on it, so it
    // stays off the zone palette.
    chromeColor: string;
};

// What `chart.addCustomSeries(new ZoneSeries(), ...)` hands back, spelled once so a caller can hold it
// in a ref without restating five generic arguments.
export type ZoneSeriesApi = ISeriesApi<
    'Custom',
    Time,
    ZonePoint | WhitespaceData<Time>,
    ZoneSeriesOptions,
    SeriesPartialOptions<ZoneSeriesOptions>
>;
