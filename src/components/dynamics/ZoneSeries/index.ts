import type {
    CustomSeriesPricePlotValues,
    CustomSeriesWhitespaceData,
    ICustomSeriesPaneRenderer,
    ICustomSeriesPaneView,
    PaneRendererCustomData,
    PriceToCoordinateConverter,
    Time,
} from 'lightweight-charts';
import type { ZonePoint, ZoneSeriesOptions } from './types';
import { customSeriesDefaultOptions } from 'lightweight-charts';

// The zone-graded line, as a Lightweight Charts custom series (docs: plugins/custom_series). The
// library's own Line series carries ONE colour, and the whole point of this chart is that a cost
// cooling red → green says so in the stroke — so the drawing is ours, on the canvas the library
// hands over, and everything else (scales, crosshair, time axis, panning) stays the library's.
//
// Each interval is painted as its own gradient, from the verdict at its start to the verdict at its
// end, which is what makes half a line red and half of it green.

// `CanvasRenderingTarget2D` lives in fancy-canvas, a transitive dependency — read the type off the
// renderer contract instead of importing it, so the app takes no direct dependency on it.
type RenderTarget = Parameters<ICustomSeriesPaneRenderer['draw']>[0];

const DEFAULT_OPTIONS: ZoneSeriesOptions = {
    ...customSeriesDefaultOptions,
    zoneColors: { green: '#22c55e', yellow: '#eab308', red: '#ef4444', neutral: '#94a3b8' },
    flatColor: null,
    width: 2,
    dash: [],
    areaOpacity: 0,
    points: 'all',
    pointRadius: 4.5,
    pointRing: '#000000',
    fadedOpacity: 0.55,
    activeIndex: null,
    showGuide: false,
    guideColor: '#94a3b8',
    chromeColor: '#94a3b8',
};

// `#rrggbb` → `rgb(r g b / a)`. The area needs the line's colour at two alphas, and a gradient that
// ends at the keyword `transparent` fades through transparent BLACK — visibly grey over a light
// surface. Anything that is not a six-digit hex gets no wash rather than a wrong one.
function withAlpha(color: string, alpha: number): string | null {
    if (!/^#[0-9a-f]{6}$/i.test(color)) {
        return null;
    }

    const value = Number.parseInt(color.slice(1), 16);

    return `rgb(${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255} / ${alpha})`;
}

type PlacedPoint = {
    // The item's logical index on the time scale — what `activeIndex` is matched against.
    index: number;
    x: number;
    y: number;
    zone: ZonePoint['zone'];
    faded: boolean;
    badge: boolean;
    flags: readonly string[];
};

class ZoneSeriesRenderer implements ICustomSeriesPaneRenderer {
    _data: PaneRendererCustomData<Time, ZonePoint> | null = null;
    _options: ZoneSeriesOptions | null = null;

    update(data: PaneRendererCustomData<Time, ZonePoint>, options: ZoneSeriesOptions): void {
        this._data = data;
        this._options = options;
    }

    draw(target: RenderTarget, priceConverter: PriceToCoordinateConverter): void {
        target.useMediaCoordinateSpace((scope) => {
            this._draw(scope.context, priceConverter, scope.mediaSize.height);
        });
    }

    // Media (CSS-pixel) space rather than bitmap space: every size here — stroke width, marker
    // radius, dash lengths — is meant in the same units as the rest of the app's styling, and the
    // library already scales the context for the device pixel ratio.
    _draw(ctx: CanvasRenderingContext2D, priceConverter: PriceToCoordinateConverter, paneHeight: number): void {
        const data = this._data;
        const options = this._options;

        if (data === null || options === null || data.bars.length === 0) {
            return;
        }

        const placed: PlacedPoint[] = [];

        for (const bar of data.bars) {
            const y = priceConverter(bar.originalData.value);

            if (y === null) {
                continue;
            }

            placed.push({
                index: bar.time,
                x: bar.x,
                y,
                zone: bar.originalData.zone,
                faded: bar.originalData.faded === true,
                badge: bar.originalData.badge === true,
                flags: bar.originalData.flags ?? [],
            });
        }

        ctx.save();

        // The guide first, under everything: it is the answer to "which push am I reading", and a
        // line drawn over the markers would cut them in half.
        const activePoint =
            options.activeIndex === null
                ? null
                : (placed.find((point) => {
                      return point.index === options.activeIndex;
                  }) ?? null);

        if (options.showGuide && activePoint !== null) {
            ctx.save();
            ctx.strokeStyle = options.guideColor;
            ctx.lineWidth = 1;
            ctx.setLineDash([10, 8]);
            ctx.beginPath();
            ctx.moveTo(activePoint.x, 0);
            ctx.lineTo(activePoint.x, paneHeight);
            ctx.stroke();
            ctx.restore();
        }

        // The wash under the line, before the line: it is the line's own weight carried down the pane,
        // so it belongs under every stroke and marker rather than over them. Only a flat-coloured
        // line takes one — a zone-graded stroke has no single hue to fade.
        this._fillArea(ctx, placed, paneHeight);

        ctx.lineWidth = options.width;
        ctx.lineCap = 'round';
        ctx.setLineDash(options.dash);

        for (let index = 1; index < placed.length; index += 1) {
            const from = placed[index - 1];
            const to = placed[index];
            const fromColor = this._colorOf(from.zone);
            const toColor = this._colorOf(to.zone);

            ctx.globalAlpha = to.faded ? options.fadedOpacity : 1;

            if (fromColor === toColor) {
                ctx.strokeStyle = fromColor;
            } else {
                const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
                gradient.addColorStop(0, fromColor);
                gradient.addColorStop(1, toColor);
                ctx.strokeStyle = gradient;
            }

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }

        // The markers are drawn after every stroke and never dashed: a point is a push that happened,
        // not a claim about the interval, and it has to stay findable where two lines cross.
        const marked = options.points === 'all' ? placed : placed.slice(-1);

        if (options.points !== 'none') {
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1.5;

            for (const point of marked) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, options.pointRadius, 0, Math.PI * 2);
                ctx.fillStyle = this._colorOf(point.zone);
                ctx.fill();
                ctx.strokeStyle = options.pointRing;
                ctx.stroke();

                // Only the push that did the correcting is badged, and the badge does not cascade
                // forward (ADR-0018).
                if (point.badge) {
                    ctx.beginPath();
                    ctx.arc(
                        point.x + options.pointRadius * 1.5,
                        point.y - options.pointRadius * 1.5,
                        3,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = options.pointRing;
                    ctx.fill();
                    ctx.strokeStyle = options.chromeColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.lineWidth = 1.5;
                }
            }
        }

        // The push the card is open on, marked twice its size over a soft halo of its own colour: at
        // a glance the reader has to be able to say WHICH point the numbers beside them belong to.
        if (activePoint !== null && options.points !== 'none') {
            const color = this._colorOf(activePoint.zone);

            ctx.setLineDash([]);
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.arc(activePoint.x, activePoint.y, options.pointRadius * 2.6, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(activePoint.x, activePoint.y, options.pointRadius * 1.45, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = options.pointRing;
            ctx.stroke();
        }

        // The edge-case lane, along the foot of the pane.
        ctx.globalAlpha = 1;
        ctx.fillStyle = options.chromeColor;
        ctx.font = '9px system-ui, sans-serif';
        ctx.textAlign = 'center';

        for (const point of placed) {
            point.flags.forEach((glyph, position) => {
                // Side by side, centred on the push as a group, so two flags never print on top of
                // each other.
                ctx.fillText(glyph, point.x + (position - (point.flags.length - 1) / 2) * 9, paneHeight - 3);
            });
        }

        ctx.restore();
    }

    _fillArea(ctx: CanvasRenderingContext2D, placed: PlacedPoint[], paneHeight: number): void {
        const options = this._options;

        if (options === null || options.areaOpacity <= 0 || options.flatColor === null || placed.length < 2) {
            return;
        }

        const top = withAlpha(options.flatColor, options.areaOpacity);
        const foot = withAlpha(options.flatColor, 0);

        if (top === null || foot === null) {
            return;
        }

        // Anchored to the pane rather than to the highest point: the fade has to read the same when
        // the reader pans and the peak leaves the view.
        const gradient = ctx.createLinearGradient(0, 0, 0, paneHeight);

        gradient.addColorStop(0, top);
        gradient.addColorStop(1, foot);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(placed[0].x, paneHeight);

        for (const point of placed) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.lineTo(placed[placed.length - 1].x, paneHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    _colorOf(zone: ZonePoint['zone']): string {
        const options = this._options;

        if (options === null) {
            return '#000000';
        }

        return options.flatColor ?? options.zoneColors[zone];
    }
}

export class ZoneSeries implements ICustomSeriesPaneView<Time, ZonePoint, ZoneSeriesOptions> {
    _renderer = new ZoneSeriesRenderer();

    priceValueBuilder(plotRow: ZonePoint): CustomSeriesPricePlotValues {
        return [plotRow.value];
    }

    isWhitespace(data: ZonePoint | CustomSeriesWhitespaceData<Time>): data is CustomSeriesWhitespaceData<Time> {
        return (data as Partial<ZonePoint>).value === undefined;
    }

    renderer(): ICustomSeriesPaneRenderer {
        return this._renderer;
    }

    update(data: PaneRendererCustomData<Time, ZonePoint>, options: ZoneSeriesOptions): void {
        this._renderer.update(data, options);
    }

    defaultOptions(): ZoneSeriesOptions {
        return DEFAULT_OPTIONS;
    }
}
