import type { FigureMetric } from '@/components/dynamics/types';
import type { CostMetric } from '@/lib/domain/dynamics';
import { useState } from 'react';
import { buildSeries, hasZone } from '@/lib/domain/dynamics';
import { cn } from '@/lib/utils/cn';
import { MetricStrip } from '@/components/dynamics/MetricStrip';
import { Trajectory } from '@/components/dynamics/Trajectory';
import { TrajectoryChart } from '@/components/dynamics/TrajectoryChart';
import { LAB_GEO, LAB_SNAPSHOTS } from './utils/fixture';
import { Pair } from './components/Pair';

// The comparison route: every chart surface the redesign touches, drawn the way it is drawn today
// and the way the new primitives draw it, on ONE fixture so the only difference on screen is the
// design. It is a lab, not a page of the product — nothing here reads a Snapshot, and nothing here
// is reachable from the app's navigation.

const POINTS = buildSeries(LAB_SNAPSHOTS, LAB_GEO);

// A theme the lab pins on its own subtree, independent of the app's. `.light` and `.dark` re-declare
// the tokens, and the `@custom-variant dark` rule in index.css makes a nested pane win over the
// theme on `html` — so both can be judged without leaving the page.
type LabTheme = 'light' | 'dark';

function ChartsLab() {
    const [theme, setTheme] = useState<LabTheme>('dark');
    const [selected, setSelected] = useState<CostMetric[]>(['cpi']);
    // Both lanes carry the same selection, so the two drawings are always saying the same thing and
    // the only difference on screen is the design.
    const [figure, setFigure] = useState<FigureMetric>('revenue');

    return (
        // `shrink-0` is load-bearing: #root is `h-dvh flex flex-col`, so a flex child taller than the
        // viewport gets shrunk to fit and paints its background over one screen while its content
        // spills past it — the rest of the scroll then shows the document's own theme underneath.
        <div className={cn(theme, 'bg-background text-foreground min-h-svh shrink-0')}>
            <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-10">
                <header className="flex items-start justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold">Charts lab</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            One fixture — {POINTS.length} pushes, {LAB_GEO} — drawn twice. Now is Lightweight Charts;
                            Next is the Recharts redesign.
                        </p>
                    </div>
                    <button
                        className="border-border hover:bg-hover rounded-md border px-3 py-1.5 text-sm"
                        onClick={() => {
                            setTheme(theme === 'dark' ? 'light' : 'dark');
                        }}
                        type="button"
                    >
                        {theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                </header>

                <Pair
                    next={
                        <Trajectory
                            costMetrics={selected}
                            figure={figure}
                            mode="cumulative"
                            points={POINTS}
                            onCostMetricsChange={setSelected}
                            onFigureChange={setFigure}
                        />
                    }
                    note="Cost lines told apart by dash, graded by zone. Right axis carries Revenue, ungraded."
                    now={
                        <TrajectoryChart
                            costMetrics={selected}
                            figure={figure}
                            mode="cumulative"
                            onCostMetricsChange={setSelected}
                            onFigureChange={setFigure}
                            points={POINTS}
                        />
                    }
                    title="Trajectory"
                />

                {/* The strip has shipped: the Dynamics page draws these cards, so there is no
                    "now" left to compare against and the lane retired with the sparkline it held.
                    It stays on the lab as the place both themes are judged in one screen. */}
                <section className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Metric strip</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            CPI is the only graded metric on the strip, so it is the only card with a dotted grid and a
                            zone gradient.
                        </p>
                    </div>
                    <MetricStrip
                        onSelect={(metric) => {
                            // The lab has no figure axis of its own to jump, so only a cost lands.
                            if (hasZone(metric)) {
                                setSelected([metric]);
                            }
                        }}
                        points={POINTS}
                        selected={selected}
                    />
                </section>
            </div>
        </div>
    );
}

export { ChartsLab };
