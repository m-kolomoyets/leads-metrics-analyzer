import type { ReactNode } from 'react';
import type { Locale } from '@/components/report/utils/i18n';
import type { GeoRollup } from '@/lib/domain';
import type { GeoThresholds, ThresholdPair, Zone } from '@/lib/domain/types';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { Figure } from '@/components/Figure';
import { ZONE_CARD_CLASS, ZONE_TEXT_CLASS } from '@/components/report/constants';
import { DASH, flagEmoji, pct, percent, ratioPct, usd, usdSigned } from '@/components/report/utils/format';
import { ui, zoneLabel } from '@/components/report/utils/i18n';
import { roiZone } from '@/components/report/utils/zones';
import { ZoneBands } from '@/components/ZoneBands';

type GeoStatProps = {
    geo: string;
    rollup: GeoRollup;
    // Grades the header CPC/CPI/CPR/CPS line by band; undefined (no preset) → plain neutral.
    thresholds: GeoThresholds | undefined;
    // Σ each account's waste. Mixed-grain by design: a Problem Account contributes its Account Waste,
    // everyone else the sum of their red campaigns' Waste (ADR-0014). Null for a Snapshot that froze
    // no Geo Rollup — its waste was never recorded and is not re-derivable (ADR-0015).
    waste: number | null;
    // The active preset's Waste Zones band (% of Spend⁺), or undefined when the geo has no preset.
    wasteZone: ThresholdPair | undefined;
    // An optional control for this market, rendered at the end of the header row — the feed and the
    // archive put their "open this geo" link here. A slot rather than a `to` prop: the panel knows
    // where its own header ends, and nothing else about where a caller wants to send the reader.
    action?: ReactNode;
    locale: Locale;
};

// Waste as a share of Spend⁺. Null only when the waste itself is unknowable (no Frozen Geo Rollup);
// a zero denominator still reads 0 %, as it did before a Snapshot could arrive without one.
function wasteShare(waste: number | null, spendPlus: number): number | null {
    if (waste === null) {
        return null;
    }
    return spendPlus > 0 ? (waste / spendPlus) * 100 : 0;
}

// A band-graded CPC/CPI/CPR/CPS value.
function Metric({ value, pair }: { value: number | null; pair: ThresholdPair | undefined }) {
    const graded = value !== null && pair;
    const tone: Zone = graded ? zoneFor(value, pair) : 'neutral';
    return (
        <span className={cn('tabular-nums', graded ? ZONE_TEXT_CLASS[tone] : 'text-muted-foreground')}>
            {value === null ? '—' : usd(value)}
        </span>
    );
}

// The market-level hero (S4): the geo label + graded cost line, then two stat panels — Spend /
// Revenue / Profit / ROI, bordered by the ROI band, and the waste readout, bordered by its
// Waste-Zone band. Attributed / untagged gap (ADR-0003) rides under the first panel.
function GeoStat({ geo, rollup, thresholds, waste, wasteZone, action, locale }: GeoStatProps) {
    const { metrics, attributed } = rollup;
    // A Snapshot pushed before ADR-0015 froze no Geo Rollup, so its Untagged Revenue is gone: `metrics`
    // has fallen back to the Attributed roll-up and only Spend⁺ and the cost-per line are still Geo
    // figures. The Geo Total, Profit and ROI read `—` rather than an Attributed sum wearing their name.
    const hasTotal = rollup.total !== null;
    const wastePct = wasteShare(waste, metrics.spendPlus);
    const wasteTone: Zone = wasteZone && wastePct !== null ? zoneFor(wastePct, wasteZone) : 'neutral';
    const roi = hasTotal ? roiZone(metrics.roi) : 'neutral';
    const profitClass = metrics.profit >= 0 ? ZONE_TEXT_CLASS.green : ZONE_TEXT_CLASS.red;
    // The Geo-Total gap (ADR-0003/0012): revenue on rows with no usable Sub ID. A growing share is a
    // tracking-health signal, so it is shown rather than folded in silently — but only when it is
    // non-zero, since most reports have none and an always-on 0 would be noise.
    const untaggedRevenue = metrics.revenue - attributed.revenue;
    const untaggedPct = metrics.revenue > 0 ? (untaggedRevenue / metrics.revenue) * 100 : 0;

    return (
        <section className="bg-surface border-border flex flex-col gap-4 rounded-md border p-4">
            <div className="flex flex-wrap items-center gap-4">
                <span className="text-xl font-semibold">
                    {flagEmoji(geo)} {geo}
                </span>
                <span className="bg-border h-9 w-px" />
                <span className="text-muted-foreground text-sm">
                    CPC <Metric value={metrics.cpc} pair={thresholds?.clicks} /> · CPI{' '}
                    <Metric value={metrics.cpi} pair={thresholds?.installs} /> · CPR{' '}
                    <Metric value={metrics.cpr} pair={thresholds?.regs} /> · CPS{' '}
                    <Metric value={metrics.cps} pair={thresholds?.sales} />
                </span>
                {action && (
                    <>
                        <span className="flex-1" />
                        {action}
                    </>
                )}
            </div>

            <div className="flex flex-wrap gap-4">
                <div
                    className={cn(
                        'flex min-w-64 flex-1 flex-col gap-3 rounded-md border px-5 py-4',
                        ZONE_CARD_CLASS[roi]
                    )}
                >
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                        {/* Spend and the Geo Total are facts, not judgements, so neither is
                            painted: they read `--foreground` and the currency is demoted beside the
                            figure rather than folded into it. Profit and ROI are graded, and are the
                            only two here entitled to a colour. */}
                        <Figure label="Spend" value={usd(metrics.spendPlus)} unit="USD" size="md" />
                        <Figure
                            label={ui('geoTotal', locale)}
                            value={hasTotal ? usd(metrics.revenue) : DASH}
                            unit={hasTotal ? 'USD' : undefined}
                            size="md"
                            className={hasTotal ? undefined : 'text-muted-foreground'}
                        />
                        <Figure
                            label="Profit"
                            value={hasTotal ? usdSigned(metrics.profit) : DASH}
                            unit={hasTotal ? 'USD' : undefined}
                            size="lg"
                            className={hasTotal ? profitClass : 'text-muted-foreground'}
                        />
                        <Figure
                            label="ROI"
                            value={hasTotal ? pct(metrics.roi) : DASH}
                            size="lg"
                            className={ZONE_TEXT_CLASS[roi]}
                        />
                    </div>

                    {hasTotal && untaggedRevenue > 0.005 && (
                        <p
                            className="text-muted-foreground text-xs leading-relaxed"
                            title={ui('divergenceNote', locale)}
                        >
                            {ui('attributed', locale)} {usd(attributed.revenue)} · {ui('untaggedGap', locale)}{' '}
                            <span className="tabular-nums">
                                {usd(untaggedRevenue)} ({percent(untaggedPct)})
                            </span>
                        </p>
                    )}
                </div>

                <div
                    className={cn(
                        'flex min-w-64 flex-1 flex-wrap items-center gap-x-8 gap-y-3 rounded-md border px-5 py-4',
                        ZONE_CARD_CLASS[wasteTone]
                    )}
                >
                    <Figure
                        label={ui('wasteTitle', locale)}
                        value={waste === null ? DASH : usd(waste)}
                        unit={waste === null ? undefined : 'USD'}
                        size="lg"
                        className={ZONE_TEXT_CLASS[wasteTone]}
                    />

                    {/* The share is a judgement, so it is written big and in its zone's colour —
                        the panel's border says the same thing from the outside and the figure is
                        what the reader actually lands on. The band beside it is the plan that figure
                        was graded against, written in the same dots the zone editors use and sat on
                        the same line, pushed to the panel's right edge so the figure and its plan
                        bracket the row rather than crowding each other. */}
                    <div className="flex min-w-56 flex-1 flex-wrap items-end gap-x-4 gap-y-1">
                        <Figure
                            label={ui('wastePctOfSpend', locale)}
                            value={wastePct === null ? DASH : percent(wastePct)}
                            size="lg"
                            className={wastePct === null ? 'text-muted-foreground' : ZONE_TEXT_CLASS[wasteTone]}
                        />
                        {wasteZone && (
                            <ZoneBands
                                greenBelow={wasteZone.gy}
                                redAbove={wasteZone.yr}
                                format={ratioPct}
                                greenLabel={zoneLabel('green', locale)}
                                yellowLabel={zoneLabel('yellow', locale)}
                                redLabel={zoneLabel('red', locale)}
                                className="ml-auto pb-1"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export { GeoStat };
