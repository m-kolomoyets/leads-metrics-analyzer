// The zoom transform that frames a projected bounding box in the viewport — d3's classic
// "zoom to bounding box", kept pure and without d3 so it can be unit tested. `k` is the scale, `x`/`y`
// the translation, in the same terms `d3-zoom`'s `zoomIdentity.translate(x, y).scale(k)` takes.

export type ProjectedBounds = [[number, number], [number, number]];

export type Viewport = {
    width: number;
    height: number;
};

export type FitOptions = {
    // The share of the viewport the box may fill: 0.9 leaves a 5 % margin on the tight axis.
    padding: number;
    maxScale: number;
    minScale?: number;
};

export type MapTransform = {
    k: number;
    x: number;
    y: number;
};

export const fitTransform = (
    [[x0, y0], [x1, y1]]: ProjectedBounds,
    { width, height }: Viewport,
    { padding, maxScale, minScale = 0 }: FitOptions
): MapTransform => {
    const k = Math.max(minScale, Math.min(maxScale, padding / Math.max((x1 - x0) / width, (y1 - y0) / height)));

    return {
        k,
        x: width / 2 - (k * (x0 + x1)) / 2,
        y: height / 2 - (k * (y0 + y1)) / 2,
    };
};
