import type { Locale } from '@/components/report/utils/i18n';
import type { GeoRollup } from '@/lib/domain';
import type { GeoThresholds, ThresholdPair, Zone } from '@/lib/domain/types';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { ZONE_TEXT_CLASS } from '@/components/report/constants';
import { DASH, flagEmoji, pct, percent, usd, usdSigned } from '@/components/report/utils/format';
import { ui } from '@/components/report/utils/i18n';

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
    locale: Locale;
};

// Reference ROI bands (fixed, unlike the tunable cost zones): loss → red, thin → yellow, healthy → green.
function roiTone(roi: number | null): Zone {
    if (roi === null) {
        return 'neutral';
    }
    if (roi < -20) {
        return 'red';
    }
    return roi <= 30 ? 'yellow' : 'green';
}

// Waste as a share of Spend⁺. Null only when the waste itself is unknowable (no Frozen Geo Rollup);
// a zero denominator still reads 0 %, as it did before a Snapshot could arrive without one.
function wasteShare(waste: number | null, spendPlus: number): number | null {
    if (waste === null) {
        return null;
    }
    return spendPlus > 0 ? (waste / spendPlus) * 100 : 0;
}

// The glass-tint classes for a zone (index.css). Neutral keeps the plain blue tint.
const TONE_TINT: Record<Zone, string> = {
    green: 'glass-tint tint-green',
    yellow: 'glass-tint tint-yellow',
    red: 'glass-tint tint-red',
    neutral: 'glass-tint tint-blue tint-s5',
};

// A band-tinted CPC/CPI/CPR/CPS value, mirroring the reference `<Metric>`.
function Metric({ value, pair }: { value: number | null; pair: ThresholdPair | undefined }) {
    const graded = value !== null && pair;
    const tone: Zone = graded ? zoneFor(value, pair) : 'neutral';
    return (
        <span className={cn('font-mono', graded ? ZONE_TEXT_CLASS[tone] : 'text-muted-foreground')}>
            {value === null ? '—' : usd(value)}
        </span>
    );
}

function Stat({
    label,
    value,
    size,
    className,
}: {
    label: string;
    value: string;
    size: 'md' | 'lg';
    className?: string;
}) {
    return (
        <div className="flex flex-col">
            <span className="text-muted-foreground text-[11px] tracking-widest uppercase">{label}</span>
            <span className={cn('font-mono font-bold', size === 'lg' ? 'text-2xl' : 'text-xl', className)}>
                {value}
            </span>
        </div>
    );
}

// The market-level hero (S4): a blue-tinted glass panel with the geo label + graded cost line, then two
// glowing stat pills — Spend/Revenue/Profit/ROI (glow tinted by the ROI band) and the waste readout
// (glow tinted by its Waste-Zone band). Attributed / untagged gap (ADR-0003) rides under the first pill.
function GeoStat({ geo, rollup, thresholds, waste, wasteZone, locale }: GeoStatProps) {
    const { metrics, attributed } = rollup;
    // A Snapshot pushed before ADR-0015 froze no Geo Rollup, so its Untagged Revenue is gone: `metrics`
    // has fallen back to the Attributed roll-up and only Spend⁺ and the cost-per line are still Geo
    // figures. The Geo Total, Profit and ROI read `—` rather than an Attributed sum wearing their name.
    const hasTotal = rollup.total !== null;
    const wastePct = wasteShare(waste, metrics.spendPlus);
    const wasteTone: Zone = wasteZone && wastePct !== null ? zoneFor(wastePct, wasteZone) : 'neutral';
    const roi = hasTotal ? roiTone(metrics.roi) : 'neutral';
    const profitClass = metrics.profit >= 0 ? 'text-success' : 'text-danger';
    // The Geo-Total gap (ADR-0003/0012): revenue on rows with no usable Sub ID. A growing share is a
    // tracking-health signal, so it is shown rather than folded in silently — but only when it is
    // non-zero, since most reports have none and an always-on 0 would be noise.
    const untaggedRevenue = metrics.revenue - attributed.revenue;
    const untaggedPct = metrics.revenue > 0 ? (untaggedRevenue / metrics.revenue) * 100 : 0;

    return (
        <section className="glass-tint tint-blue tint-s5 flex flex-col gap-4 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-4">
                <span className="text-2xl font-bold">
                    {flagEmoji(geo)} {geo}
                </span>
                <span className="bg-border h-9 w-px" />
                <span className="text-muted-foreground text-sm">
                    CPC <Metric value={metrics.cpc} pair={thresholds?.clicks} /> · CPI{' '}
                    <Metric value={metrics.cpi} pair={thresholds?.installs} /> · CPR{' '}
                    <Metric value={metrics.cpr} pair={thresholds?.regs} /> · CPS{' '}
                    <Metric value={metrics.cps} pair={thresholds?.sales} />
                </span>
            </div>

            <div className="flex flex-wrap gap-4">
                <div
                    className={cn(
                        'glow-soft flex min-w-64 flex-1 flex-col gap-3 rounded-2xl px-5 py-4',
                        TONE_TINT[roi]
                    )}
                >
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                        <Stat label="Spend" value={usd(metrics.spendPlus)} size="md" />
                        <Stat
                            label={ui('geoTotal', locale)}
                            value={hasTotal ? usd(metrics.revenue) : DASH}
                            size="md"
                            className={hasTotal && metrics.revenue > 0 ? 'text-success' : 'text-muted-foreground'}
                        />
                        <Stat
                            label="Profit"
                            value={hasTotal ? usdSigned(metrics.profit) : DASH}
                            size="lg"
                            className={hasTotal ? profitClass : 'text-muted-foreground'}
                        />
                        <Stat
                            label="ROI"
                            value={hasTotal ? pct(metrics.roi) : DASH}
                            size="lg"
                            className={ZONE_TEXT_CLASS[roi]}
                        />
                    </div>

                    {hasTotal && untaggedRevenue > 0.005 && (
                        <p
                            className="text-muted-foreground text-[10px] leading-relaxed"
                            title={ui('divergenceNote', locale)}
                        >
                            {ui('attributed', locale)} {usd(attributed.revenue)} · {ui('untaggedGap', locale)}{' '}
                            <span className="font-mono">
                                {usd(untaggedRevenue)} ({percent(untaggedPct)})
                            </span>
                        </p>
                    )}
                </div>

                <div
                    className={cn(
                        'glow-soft flex min-w-64 flex-1 items-center gap-6 rounded-2xl px-5 py-4',
                        TONE_TINT[wasteTone]
                    )}
                >
                    <Stat
                        label={ui('wasteTitle', locale)}
                        value={waste === null ? DASH : usd(waste)}
                        size="lg"
                        className={ZONE_TEXT_CLASS[wasteTone]}
                    />
                    <Stat
                        label={ui('wastePctOfSpend', locale)}
                        value={percent(wastePct)}
                        size="lg"
                        className={ZONE_TEXT_CLASS[wasteTone]}
                    />
                    <span className="flex-1" />
                    {wasteZone && (
                        <div className="text-muted-foreground text-right text-[10px] leading-relaxed">
                            {ui('wasteZone', locale)}:
                            <br />
                            <span className={ZONE_TEXT_CLASS.green}>&lt;{wasteZone.gy}%</span> ·{' '}
                            <span className={ZONE_TEXT_CLASS.yellow}>
                                {wasteZone.gy}–{wasteZone.yr}%
                            </span>{' '}
                            · <span className={ZONE_TEXT_CLASS.red}>&gt;{wasteZone.yr}%</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export { GeoStat };
