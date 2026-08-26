import type { SeriesPoint } from '@/lib/domain/dynamics';
import type { DynamicsMode } from '../../../types';
import type { ChartMetric } from '../../types';
import { Link } from '@tanstack/react-router';
import { ArrowUpRightIcon } from 'lucide-react';
import { compareFigures, hasZone, thresholdPairOf, zoneOfPoint } from '@/lib/domain/dynamics';
import { kyivClock } from '@/lib/utils/kyivDay';
import { DASH, int, usd } from '@/components/report/utils/format';
import { Button } from '@/components/ui/Button';
import { ZONE_LABEL, ZONE_STROKE } from '../../../constants';
import { METRIC_FORMAT, METRIC_LABEL } from '../../../utils/metrics';
import { ThresholdMeter } from '../../../ThresholdMeter';

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
        // Two columns, because the card answers two questions and they are not the same question:
        // the verdict on the left (what this metric did and what it was judged against), the bases it
        // was computed from on the right. Stacking all of it read as one long list where the plan and
        // the fact drifted apart.
        <div className="border-border bg-popover text-popover-foreground flex w-[22rem] flex-col gap-2.5 rounded-lg border p-3 text-xs shadow-lg">
            <p className="text-muted-foreground border-border flex items-baseline justify-between gap-2 border-b pb-2">
                <span>
                    {point.geo} · {isDelta ? 'interval ending ' : ''}
                    {clock ?? DASH}
                </span>
                <span>
                    push {position} of {total}
                </span>
            </p>

            <div className="grid grid-cols-2 gap-x-4">
                <div className="border-border flex flex-col gap-1.5 border-r pr-4">
                    <p className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold">
                            {prefix}
                            {METRIC_LABEL[metric]}
                        </span>
                        <span className="font-mono text-base font-bold">{format.value(value)}</span>
                    </p>

                    {zone !== null && (
                        <p className="flex items-center gap-1.5" style={{ color: ZONE_STROKE[zone] }}>
                            <span
                                aria-hidden={true}
                                className="size-2 rounded-full"
                                style={{ background: 'currentcolor' }}
                            />
                            {ZONE_LABEL[zone]}
                        </p>
                    )}
                </div>

                <dl className="text-muted-foreground grid grid-cols-[auto_1fr] content-start gap-x-3 font-mono">
                    <dt>{prefix}Spend⁺</dt>
                    <dd className="text-right">{usd(point.figures.spendPlus)}</dd>
                    <dt>{prefix}Installs</dt>
                    <dd className="text-right">{int(point.figures.installs)}</dd>
                    <dt>{prefix}Revenue</dt>
                    <dd className="text-right">{usd(point.figures.revenue)}</dd>
                </dl>
            </div>

            {/* The plan the fact was graded against — this Snapshot's own frozen copy, never the
                reader's live preset (ADR-0002). Full width, because it is a measurement and a
                measurement needs a run: squeezed into the left column the mark had nowhere to sit. */}
            {pair !== null && <ThresholdMeter value={value} greenBelow={pair.gy} redAbove={pair.yr} />}

            {/* The movement gets a row of its own across the whole card: squeezed into the right
                column it wrapped onto a second line, and half a number under the other half is the
                one thing a figure must never do. */}
            <p className="text-muted-foreground border-border flex items-baseline justify-between gap-3 border-t pt-2 font-mono whitespace-nowrap">
                <span>{isDelta ? 'Δ vs previous' : 'since last push'}</span>
                <span className="text-foreground font-semibold">
                    {previous === null
                        ? 'first push today'
                        : `${format.change(change)} · ${clockOf(previous.takenAt) ?? DASH}`}
                </span>
            </p>

            {/* Only this point is badged; the badge does not cascade forward (ADR-0018). */}
            {replacedClock !== null && (
                <p className="text-muted-foreground">This push corrected one replaced at {replacedClock}.</p>
            )}

            {/* At THIS Snapshot, never the latest: a lead who sees CPI spike at 15:00 and is handed
                the 17:00 report has been shown exactly the wrong thing. Accented, because it is the
                one action on the card and the card is opened to take it. */}
            <Button
                size="sm"
                className="w-full"
                render={
                    <Link
                        to="/dashboard/report/$snapshotId"
                        params={{ snapshotId: point.snapshotId }}
                        search={{ geo: point.geo }}
                    >
                        Open this report
                        <ArrowUpRightIcon data-icon="inline-end" />
                    </Link>
                }
            />
        </div>
    );
}

export { PointTooltip };
