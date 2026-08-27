import type { FigureMetric } from '@/components/dynamics/TrajectoryChart/types';
import type { DynamicsMode } from '@/components/dynamics/types';
import type { CostMetric, DynamicsMetric, SeriesPoint } from '@/lib/domain/dynamics';
import { Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { buildSeries, hasZone } from '@/lib/domain/dynamics';
import { dynamicsDayQueryOptions } from '@/services/dynamics/queries';
import { activeGeo } from '@/modules/Report/utils/activeGeo';
import { ComparisonPanel } from '@/components/dynamics/ComparisonPanel';
import { MetricTiles } from '@/components/dynamics/MetricTiles';
import { SparklineStrip } from '@/components/dynamics/SparklineStrip';
import { TrajectoryChart } from '@/components/dynamics/TrajectoryChart';
import { PendingArea } from '@/components/PendingArea';
import { GeoTabs } from '@/components/report/GeoTabs';
import { SectionCard } from '@/components/report/SectionCard';
import { geoTabs } from '../../utils/frame';
import { DetailTables } from '../DetailTables';

// The frame's third level: the markets one buyer ran on one day. Split out from the page so that
// switching buyers suspends this alone — the team and buyer rows above are read from the roster and
// must not blink while a trajectory loads.
//
// This is also where the chart area's empty states are decided, because only here is the length of
// the series known. None of them is a spinner or a blank box: the screen must never look broken to
// someone whose buyer simply has not pushed twice yet (SPEC §6.6).
//
// The tables that hang under the chart get a Suspense boundary of their own: they read the whole
// Snapshot bundle, which is the expensive half of the page, and must not hold the trajectory back
// (SPEC §8).

type BuyerDayProps = {
    buyerId: string;
    reportDate: string;
    geo: string | undefined;
    onSelectGeo: (geo: string) => void;
    // Set in the page header and spent here, on the chart and nothing else.
    mode: DynamicsMode;
};

// The Trajectory card: the plot and the Metric strip under it, two siblings inside one section.
//
// The selection lives here rather than in either of them because both speak about it — the strip
// jumps the chart to a metric, and the chart's own controls change the same lines. The card owns the
// answer; neither child does.
function TrajectorySection({ points, mode }: { points: SeriesPoint[]; mode: DynamicsMode }) {
    const [costMetrics, setCostMetrics] = useState<CostMetric[]>(['cpi']);
    const [figure, setFigure] = useState<FigureMetric>('revenue');

    // A sparkline is a jump, not an addition: it answers "show me THAT one", so a cost click replaces
    // the cost selection rather than piling a second dashed line onto it.
    function selectFromStrip(metric: DynamicsMetric) {
        if (hasZone(metric)) {
            setCostMetrics([metric]);
            return;
        }

        setFigure(metric);
    }

    return (
        <SectionCard label="Trajectory" className="flex flex-col gap-3">
            <TrajectoryChart
                points={points}
                mode={mode}
                costMetrics={costMetrics}
                figure={figure}
                onCostMetricsChange={setCostMetrics}
                onFigureChange={setFigure}
            />

            {/* The strip reads the day as it happened whatever the toggle says — it is the map, and
                the chart above it is the territory. */}
            <SparklineStrip points={points} selected={[...costMetrics, figure]} onSelect={selectFromStrip} />
        </SectionCard>
    );
}

// Everything below the geo row, which is a chart only once there is a trajectory to draw.
//
// The three states are exclusive on purpose. A screen that stacks "no reports for this period" under
// a comparison panel already saying the same thing, or that prints the day's eight figures twice at
// two sizes, reads as broken — which is the one thing these states exist to prevent.
function ChartArea({ points, mode }: { points: SeriesPoint[]; mode: DynamicsMode }) {
    const only = points.length === 1 ? points[0] : null;

    // Nobody pushed this market today. Said once, plainly: an empty frame reads as a page that failed
    // rather than as a day that has not started.
    if (points.length === 0) {
        return <p className="text-muted-foreground text-sm">No reports for this period.</p>;
    }

    // One push is a dot, not a trajectory: the chart hides entirely and the day so far is shown at
    // the size it deserves, graded, so a bad first report is still visibly bad. The tiles carry the
    // comparison panel's one-push job too — same figures, larger, with the zone colouring the panel
    // has no room for — so the panel stands down rather than repeating them above.
    if (only !== null) {
        return <MetricTiles point={only} />;
    }

    return (
        <>
            <ComparisonPanel points={points} />
            <TrajectorySection points={points} mode={mode} />
        </>
    );
}

function BuyerDay({ buyerId, reportDate, geo, onSelectGeo, mode }: BuyerDayProps) {
    const { data: snapshots } = useSuspenseQuery(dynamicsDayQueryOptions({ buyerId, reportDate }));

    const tabs = geoTabs(snapshots);
    const geos = tabs.map((tab) => {
        return tab.geo;
    });
    // A stale geo in a shared link falls back to the first market rather than throwing — the same
    // call the detailed report makes, and the same reason (spec story 28).
    const selected = activeGeo(geos, geo);

    const spendByGeo: Record<string, number> = {};

    for (const tab of tabs) {
        spendByGeo[tab.geo] = tab.spendPlus;
    }

    // Two different silences, and they must not be told apart wrongly. Nothing was pushed at all is
    // the period being empty; something was pushed but no market carried spend is a buyer who has not
    // started spending yet, which is a fact about them rather than about the day.
    if (snapshots.length === 0) {
        return <p className="text-muted-foreground text-sm">No reports for this period.</p>;
    }

    if (!selected) {
        return <p className="text-muted-foreground text-sm">No market with spend was reported for this day.</p>;
    }

    // The selected market's trajectory: every active push that froze it, oldest first. The panel
    // reads the last two points of it; the chart reads all of them.
    const series = buildSeries(snapshots, selected);
    // The tables read the latest push of the day and compare it against the one before — the same two
    // points the comparison panel above them reads, so the arrows and the panel cannot disagree.
    const latest = series.at(-1) ?? null;
    const beforeLatest = series.at(-2) ?? null;

    return (
        <div className="flex flex-col gap-4">
            <GeoTabs geos={geos} active={selected} spendByGeo={spendByGeo} onSelect={onSelectGeo} />
            <ChartArea points={series} mode={mode} />

            {latest && (
                <Suspense
                    // Keyed on the push so switching market or buyer starts the second read cleanly
                    // rather than showing the previous market's offers while this one loads.
                    key={`${latest.snapshotId}:${selected}`}
                    fallback={<PendingArea label="Working out the tables…" />}
                >
                    <DetailTables
                        snapshotId={latest.snapshotId}
                        previousSnapshotId={beforeLatest?.snapshotId ?? null}
                        geo={selected}
                    />
                </Suspense>
            )}
        </div>
    );
}

export { BuyerDay };
