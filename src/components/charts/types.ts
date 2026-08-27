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
