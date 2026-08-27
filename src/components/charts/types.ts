// The grade a chart paints a point with. Structurally identical to the domain's `Zone`, and declared
// here rather than imported so these primitives stay domain-free: a chart that imported the campaign
// domain could only ever be used by the campaign domain, and the design system is meant to outlive
// this one page. A caller holding a `Zone` passes it straight in.
export type ChartTone = 'green' | 'yellow' | 'red' | 'neutral';

// One series the trajectory draws. `tones` grades it point-by-point and produces the zone gradient;
// a series with no `tones` is ungraded and draws in one neutral colour, which is what money does.
export type ChartSeries = {
    // Matches a key on the row objects handed to the card.
    dataKey: string;
    label: string;
    // Per-point grades, same length and order as the rows. Omitted for an ungraded series.
    tones?: ChartTone[];
    // Told apart from its siblings by dash, never by hue (ADR-0019).
    dash?: number[];
    // Which of the two Y scales it belongs to.
    axis: 'cost' | 'figure';
};

// One edge case a chart can mark an interval with: what it prints, in what colour, and what it means
// in words. Named and coloured by the caller — a chart primitive knows nothing about a campaign
// (ADR-0025), so which three cases exist and what they are called is the domain's business.
export type ChartFlag = {
    key: string;
    glyph: string;
    color: string;
    label: string;
    hint: string;
};

// What a chart knows about one push beyond its figures. Parallel to the rows, one entry per push,
// and read as the INTERVAL ending at that push — which is why `flags` describes a stroke while
// `badge` describes the point itself.
export type ChartMark = {
    // Keys of the flags raised on the interval ending here, in the legend's own order.
    flags: string[];
    // This push restated an earlier one, so it wears the correction badge — and only it does.
    badge: boolean;
};
