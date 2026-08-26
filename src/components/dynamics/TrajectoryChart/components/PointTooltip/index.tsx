import type { SeriesPoint } from '@/lib/domain/dynamics';
import type { DynamicsMode } from '../../../types';
import type { ChartMetric } from '../../types';
import { Link } from '@tanstack/react-router';
import { compareFigures, hasZone, thresholdPairOf, zoneOfPoint } from '@/lib/domain/dynamics';
import { kyivClock } from '@/lib/utils/kyivDay';
import { cost, DASH, int, usd } from '@/components/report/utils/format';
import { ZONE_LABEL, ZONE_STROKE } from '../../constants';
import { METRIC_FORMAT, METRIC_LABEL } from '../../../utils/metrics';

// The tooltip exists for one reason: PLAN BESIDE FACT. A figure on its own says how the day went; a
// figure beside the thresholds that graded it and the bases it was divided from says why, and says
// it without anybody opening the report. The report is one click below, at THIS push.
//
// In between-reports mode every figure here is an interval rather than a total, and the tooltip says
// so in words and marks each figure with a Δ. A tooltip reading "Spend⁺ $200" beside a chart quietly
// showing intervals is the exact confusion the mode toggle was added to remove.

function clockOf(takenAt: string): string | null {
    const instant = new Date(takenAt);

    return Number.isNaN(instant.getTime()) ? null : kyivClock(instant);
}

type PointTooltipProps = {
    point: SeriesPoint;
    // The push before it, or null on the first of the day — where every "since last time" comes from.
    previous: SeriesPoint | null;
    metric: ChartMetric;
    mode: DynamicsMode;
    // Which push of how many, so the tooltip can say where in the day this is.
    position: number;
    total: number;
};

function PointTooltip({ point, previous, metric, mode, position, total }: PointTooltipProps) {
    const format = METRIC_FORMAT[metric];
    const isDelta = mode === 'delta';
    // A Δ in front of every figure, so a screenshot of this tooltip still says which question it
    // answered.
    const prefix = isDelta ? 'Δ' : '';
    const value = metric === 'spend' ? point.figures.spendPlus : point.figures[metric];
    // Money and ROI take no zone: there are no thresholds for them, and a green Revenue would be a
    // verdict nobody wrote.
    const graded = hasZone(metric);
    const zone = graded ? zoneOfPoint(point, metric) : null;
    const pair = graded ? thresholdPairOf(metric, point.thresholds) : null;
    const change =
        compareFigures(previous?.figures ?? null, point.figures).find((row) => {
            return row.metric === metric;
        })?.change ?? null;
    const clock = clockOf(point.takenAt);
    const replacedClock = point.replacedAt === null ? null : clockOf(point.replacedAt);

    return (
        <div className="border-border bg-popover text-popover-foreground flex w-56 flex-col gap-2 rounded-lg border p-3 text-xs shadow-lg">
            <p className="text-muted-foreground">
                {point.geo} · {isDelta ? 'interval ending ' : ''}
                {clock ?? DASH} · push {position} of {total}
            </p>

            <p className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">
                    {prefix}
                    {METRIC_LABEL[metric]}
                </span>
                <span className="font-mono text-base font-bold">{format.value(value)}</span>
            </p>

            {zone !== null && (
                <p className="flex items-center gap-1.5" style={{ color: ZONE_STROKE[zone] }}>
                    <span aria-hidden={true} className="size-2 rounded-full" style={{ background: 'currentcolor' }} />
                    {ZONE_LABEL[zone]}
                </p>
            )}

            {/* The plan the fact was graded against — this Snapshot's own frozen copy, never the
                reader's live preset (ADR-0002). Absent when the copy was missing or unreadable, which
                is exactly when the point above reads "ungraded". */}
            {pair !== null && (
                <p className="text-muted-foreground font-mono">
                    green &lt; {cost(pair.gy)} · red &gt; {cost(pair.yr)}
                </p>
            )}

            <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-3 font-mono">
                <dt>{prefix}Spend⁺</dt>
                <dd className="text-right">{usd(point.figures.spendPlus)}</dd>
                <dt>{prefix}Installs</dt>
                <dd className="text-right">{int(point.figures.installs)}</dd>
                <dt>{prefix}Revenue</dt>
                <dd className="text-right">{usd(point.figures.revenue)}</dd>
            </dl>

            <p className="text-muted-foreground">
                {previous === null
                    ? 'first push today'
                    : `${format.change(change)} since ${clockOf(previous.takenAt) ?? 'the previous push'}`}
            </p>

            {/* Only this point is badged; the badge does not cascade forward (ADR-0018). */}
            {replacedClock !== null && (
                <p className="text-muted-foreground">This push corrected one replaced at {replacedClock}.</p>
            )}

            {/* At THIS Snapshot, never the latest: a lead who sees CPI spike at 15:00 and is handed
                the 17:00 report has been shown exactly the wrong thing. */}
            <Link
                to="/dashboard/report/$snapshotId"
                params={{ snapshotId: point.snapshotId }}
                search={{ geo: point.geo }}
                className="border-border hover:bg-secondary rounded-md border px-2 py-1 text-center font-medium"
            >
                Open this report
            </Link>
        </div>
    );
}

export { PointTooltip };
