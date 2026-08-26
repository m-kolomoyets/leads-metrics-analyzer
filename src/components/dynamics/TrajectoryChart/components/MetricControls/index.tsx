import type { CostMetric } from '@/lib/domain/dynamics';
import type { FigureMetric } from '../../types';
import { COST_METRICS } from '@/lib/domain/dynamics';
import { Toggle, ToggleGroup } from '@/components/ui/ToggleGroup';
import { COST_DASH } from '../../constants';
import { METRIC_LABEL } from '../../../utils/metrics';

// The chart's configurator (SPEC §6.6), which is two questions and not one: WHICH costs to draw on
// the left axis — any number of them, so that group is multi-select — and WHICH single figure to hang
// on the right, where exactly one is always lit. Both are the same ToggleGroup, so the two read as
// one control panel rather than as a checkbox row that happens to sit beside a segmented button.
//
// Each cost toggle carries its own dash pattern rather than a tick. Colour on this chart is spoken
// for by the zones, so dash is the only thing telling two cost lines apart, and a control that shows
// the dash IS the legend — one thing to read instead of a box here and a key somewhere else.

const FIGURE_METRICS: FigureMetric[] = ['revenue', 'profit', 'spend', 'roi'];

type MetricControlsProps = {
    costMetrics: CostMetric[];
    figure: FigureMetric;
    onToggleCost: (metric: CostMetric) => void;
    onSelectFigure: (metric: FigureMetric) => void;
};

function Caption({ children }: { children: React.ReactNode }) {
    return <span className="text-muted-foreground/70 text-[10px] tracking-[0.15em] uppercase">{children}</span>;
}

function MetricControls({ costMetrics, figure, onToggleCost, onSelectFigure }: MetricControlsProps) {
    // The group hands back the whole next selection; the chart owns the one rule about it (a cost
    // click is a toggle, and the order the lines draw in is fixed), so the difference is forwarded
    // rather than the array.
    function handleCostChange(next: string[]) {
        const added = next.find((metric) => {
            return !costMetrics.includes(metric as CostMetric);
        });
        const removed = costMetrics.find((metric) => {
            return !next.includes(metric);
        });
        const changed = added ?? removed;

        if (changed !== undefined) {
            onToggleCost(changed as CostMetric);
        }
    }

    // Single-select, and never empty: the right axis always draws something, so a click on the lit
    // toggle is a no-op rather than a way to end up with a bare axis.
    function handleFigureChange(next: string[]) {
        const picked = next.at(0);

        if (picked !== undefined) {
            onSelectFigure(picked as FigureMetric);
        }
    }

    return (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="flex flex-col gap-1.5">
                <Caption>Left axis · cost</Caption>

                <ToggleGroup
                    multiple
                    aria-label="Cost metrics on the left axis"
                    value={costMetrics}
                    onValueChange={handleCostChange}
                >
                    {COST_METRICS.map((metric) => {
                        return (
                            <Toggle key={metric} value={metric}>
                                {/* The dash pattern, shown rather than described: it is the only thing
                                    telling two cost lines apart once both are on. */}
                                <svg width="20" height="8" aria-hidden={true} className="shrink-0">
                                    <line
                                        x1="1"
                                        y1="4"
                                        x2="19"
                                        y2="4"
                                        strokeWidth="2"
                                        strokeDasharray={COST_DASH[metric].join(' ')}
                                        style={{ stroke: 'currentcolor' }}
                                    />
                                </svg>
                                {METRIC_LABEL[metric]}
                            </Toggle>
                        );
                    })}
                </ToggleGroup>
            </div>

            <div className="flex flex-col items-end gap-1.5">
                <Caption>Right axis</Caption>

                <ToggleGroup aria-label="Figure on the right axis" value={[figure]} onValueChange={handleFigureChange}>
                    {FIGURE_METRICS.map((metric) => {
                        return (
                            <Toggle key={metric} value={metric}>
                                {METRIC_LABEL[metric]}
                            </Toggle>
                        );
                    })}
                </ToggleGroup>
            </div>
        </div>
    );
}

export { MetricControls };
