import type { FrozenGeoRollup } from './snapshot';
import type { GeoThresholds } from './types';

// The Dynamics page's arithmetic (ADR-0010): a day's Frozen Geo Rollups in, one buyer's trajectory
// through that day out. Pure — no services, no DB, no React (ADR-0004, ADR-0005).
//
// Snapshots are cumulative: each push restates the day so far. A Trajectory is therefore drawn from
// the pushes themselves (the Series) and read from what changed between them (the Deltas).
//
// Two rules the whole module rests on:
//  - Ordering is `taken_at`, never a date inside the file, ties broken on id (ADR-0017).
//  - Every derived metric in a Delta is recomputed from the subtracted bases — never averaged and
//    never subtracted (CONTEXT.md roll-up rule). Cost-per divides Spend⁺; Profit and ROI include
//    commission. SPEC §4.2's commission-free ROI contradicts CONTEXT.md and is not implemented.
//
// Null discipline throughout: an undefined figure is `null`, never `0` — a zero denominator means
// "not shown", and `0` is a claim about the world (CONTEXT.md).

// The metrics the panel, the arrows, the chart and the sparklines all speak in. `spend` is Spend⁺:
// a frozen rollup never stored raw Spend, and every cost figure is built on Spend⁺ anyway.
export type DynamicsMetric = 'spend' | 'revenue' | 'profit' | 'roi' | 'cpc' | 'cpi' | 'cpr' | 'cps';

// Which way is better for a metric. `neutral` is not "we didn't decide" — it is the claim that the
// metric carries no verdict alone.
export type MetricDirection = 'up-good' | 'down-good' | 'neutral';

// The single source the panel, the arrows and the sparklines colour from, so an arrow can follow
// arithmetic while the colour follows meaning: a CPI falling is a green ▼, an ROI falling a red ▼.
// Spend is neutral in every direction — spending more is neither good nor bad on its own; the ROI
// beside it is what judges it.
export const METRIC_MEANING: Record<DynamicsMetric, MetricDirection> = {
    spend: 'neutral',
    revenue: 'up-good',
    profit: 'up-good',
    roi: 'up-good',
    cpc: 'down-good',
    cpi: 'down-good',
    cpr: 'down-good',
    cps: 'down-good',
};

export function meaningOf(metric: DynamicsMetric): MetricDirection {
    return METRIC_MEANING[metric];
}

// The counts and money a delta subtracts. Everything else on this page is derived from these.
export type DynamicsBases = {
    // Spend⁺ — the commission-inclusive cost, the numerator of every cost-per metric.
    spendPlus: number;
    // The Geo Total: revenue including untagged rows (ADR-0003).
    revenue: number;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
};

// Everything computed from the bases. Null wherever the denominator is zero — and, for a corrected
// segment, everywhere, because the bases it would divide are not a real interval.
export type DynamicsDerived = {
    profit: number | null;
    roi: number | null;
    cpc: number | null;
    cpi: number | null;
    cpr: number | null;
    cps: number | null;
};

export type DynamicsFigures = DynamicsBases & DynamicsDerived;

// One active Snapshot, as the day read hands it over: its frozen per-Geo headline figures plus the
// thresholds its Ruleset Version copied, per Geo. Nothing below the Fact Grain — a whole day is a
// handful of `snapshot_geo` rows.
export type DynamicsSnapshot = {
    id: string;
    // When the buyer pushed it — the X axis (ADR-0017). ISO instant.
    takenAt: string;
    geoRollups: FrozenGeoRollup[];
    // Per-Geo copied thresholds. A Geo whose copy is missing or unparseable is ungraded, not graded
    // by the reader's live ruleset (ADR-0002, spec story 32).
    thresholds: Record<string, GeoThresholds | null>;
};

// One point on the trajectory: a single Snapshot's figures for a single Geo, carrying the thresholds
// that Snapshot copied, so the point grades against the buyer's own ruleset and never the reader's.
export type SeriesPoint = {
    snapshotId: string;
    takenAt: string;
    geo: string;
    figures: DynamicsFigures;
    thresholds: GeoThresholds | null;
};

// The three edge cases, all of which occur in production.
export type DeltaFlags = {
    // No previous point: the delta IS the snapshot (SPEC `first_of_day`).
    firstOfDay: boolean;
    // A base went backwards because Facebook restated the day. Counters clamp to zero, every derived
    // metric goes null, and the segment reads grey (SPEC `corrected`).
    corrected: boolean;
    // Money moved and nothing installed: Δinstalls is 0 while ΔSpend⁺ is positive. CPI is null —
    // never Infinity, never 0 (SPEC `spend_without_conversions`).
    spendWithoutConversions: boolean;
};

// What changed between two consecutive pushes.
export type DynamicsDelta = {
    // Null on the first push of the day — there is nothing before it to subtract.
    from: SeriesPoint | null;
    to: SeriesPoint;
    bases: DynamicsBases;
    derived: DynamicsDerived;
    flags: DeltaFlags;
};

const ZERO_BASES: DynamicsBases = {
    spendPlus: 0,
    revenue: 0,
    linkClicks: 0,
    installs: 0,
    regs: 0,
    sales: 0,
};

const BASE_KEYS = ['spendPlus', 'revenue', 'linkClicks', 'installs', 'regs', 'sales'] as const;

const NULL_DERIVED: DynamicsDerived = {
    profit: null,
    roi: null,
    cpc: null,
    cpi: null,
    cpr: null,
    cps: null,
};

// A ratio, or null when the denominator is zero or below — "not shown", never Infinity, never NaN.
function ratio(numerator: number, denominator: number): number | null {
    if (denominator <= 0) {
        return null;
    }
    return numerator / denominator;
}

// Every derived metric, recomputed from bases. The only place in this module that divides.
export function deriveFrom(bases: DynamicsBases): DynamicsDerived {
    const { spendPlus, revenue, linkClicks, installs, regs, sales } = bases;
    return {
        profit: revenue - spendPlus,
        roi: spendPlus <= 0 ? null : ((revenue - spendPlus) / spendPlus) * 100,
        cpc: ratio(spendPlus, linkClicks),
        cpi: ratio(spendPlus, installs),
        cpr: ratio(spendPlus, regs),
        cps: ratio(spendPlus, sales),
    };
}

export function figuresFrom(bases: DynamicsBases): DynamicsFigures {
    return { ...bases, ...deriveFrom(bases) };
}

// A frozen rollup's bases. Read off the Geo Total line — its revenue and funnel include untagged
// rows, which is the whole reason the rollup was frozen rather than recomputed (ADR-0003/0015).
function basesOf(rollup: FrozenGeoRollup): DynamicsBases {
    return {
        spendPlus: rollup.spendPlus,
        revenue: rollup.geoTotal,
        linkClicks: rollup.linkClicks,
        installs: rollup.installs,
        regs: rollup.regs,
        sales: rollup.sales,
    };
}

// Order two Snapshots on the axis: `taken_at`, ties broken on id. Two pushes in the same minute are
// still two points and nothing merges them (ADR-0017). Compared as instants, not as text: the same
// moment can be written `...T09:00:00Z` or `...T12:00:00+03:00`, and those two sort the wrong way
// round as strings. An unparseable stamp sorts last rather than poisoning every comparison with NaN.
function instantOf(takenAt: string): number {
    const parsed = Date.parse(takenAt);
    return Number.isNaN(parsed) ? Infinity : parsed;
}

function byTakenAt(a: DynamicsSnapshot, b: DynamicsSnapshot): number {
    const gap = instantOf(a.takenAt) - instantOf(b.takenAt);
    if (gap !== 0 && Number.isFinite(gap)) {
        return gap;
    }
    if (a.id === b.id) {
        return 0;
    }
    return a.id < b.id ? -1 : 1;
}

// One Geo's trajectory: a point per active Snapshot that froze that Geo, ordered by `taken_at`.
// A Snapshot with no rollup for the Geo contributes no point — the buyer did not report that market
// in that push, which is not the same as reporting zero.
//
// The caller passes active Snapshots only: a replaced one contributes to no number anywhere
// (ADR-0018), and this module has no way to tell the difference.
export function buildSeries(snapshots: DynamicsSnapshot[], geo: string): SeriesPoint[] {
    const points: SeriesPoint[] = [];
    for (const snapshot of [...snapshots].sort(byTakenAt)) {
        const rollup = snapshot.geoRollups.find((candidate) => {
            return candidate.geo === geo;
        });
        if (!rollup) {
            continue;
        }
        points.push({
            snapshotId: snapshot.id,
            takenAt: snapshot.takenAt,
            geo,
            // Derived from the frozen bases rather than copied off the rollup's own stored cost line:
            // a rollup written before the Geo Total's counts were frozen (#54) carries a cost-per that
            // its own counts can no longer explain, and a point whose figures disagree with the delta
            // beneath it is worse than one that reads `—`.
            figures: figuresFrom(basesOf(rollup)),
            thresholds: snapshot.thresholds[geo] ?? null,
        });
    }
    return points;
}

// Subtract consecutive bases. Any base going backwards means Facebook restated the day: the interval
// is not a real one, so counters clamp to zero and the caller is told via `corrected`.
function subtract(from: DynamicsBases, to: DynamicsBases): { bases: DynamicsBases; corrected: boolean } {
    const bases: DynamicsBases = { ...ZERO_BASES };
    let corrected = false;
    for (const key of BASE_KEYS) {
        const change = to[key] - from[key];
        if (change < 0) {
            corrected = true;
        }
        bases[key] = Math.max(change, 0);
    }
    return { bases, corrected };
}

function basesOfPoint(point: SeriesPoint): DynamicsBases {
    const { spendPlus, revenue, linkClicks, installs, regs, sales } = point.figures;
    return { spendPlus, revenue, linkClicks, installs, regs, sales };
}

// The delta between two consecutive points. `previous` is null for the first push of the day, where
// the delta is the snapshot itself — the whole day so far arrived in one push.
export function deltaBetween(previous: SeriesPoint | null, current: SeriesPoint): DynamicsDelta {
    const firstOfDay = previous === null;
    const { bases, corrected } = firstOfDay
        ? { bases: basesOfPoint(current), corrected: false }
        : subtract(basesOfPoint(previous), basesOfPoint(current));

    return {
        from: previous,
        to: current,
        bases,
        // A corrected segment measures nothing: the bases under it are a clamped remainder of a
        // restatement, not an interval anyone traded through. Every derived metric goes null and the
        // segment reads grey rather than showing a cost nobody paid.
        derived: corrected ? { ...NULL_DERIVED } : deriveFrom(bases),
        flags: {
            firstOfDay,
            corrected,
            spendWithoutConversions: !corrected && bases.installs === 0 && bases.spendPlus > 0,
        },
    };
}

// Every delta along a Series, one per point. The first is `first_of_day`; the rest are consecutive.
export function deltasFor(points: SeriesPoint[]): DynamicsDelta[] {
    return points.map((point, index) => {
        return deltaBetween(index === 0 ? null : points[index - 1], point);
    });
}

// Roll a set of deltas (or figures) back up into one line — a day summary, or an "all geos" total.
// Bases sum; every derived metric is recomputed from those sums. Averaging the rows' own CPIs would
// weight a 2-install segment like a 2000-install one and answer a question nobody asked.
export function summarize(parts: Iterable<DynamicsBases>): DynamicsFigures {
    const bases: DynamicsBases = { ...ZERO_BASES };
    for (const part of parts) {
        for (const key of BASE_KEYS) {
            bases[key] += part[key];
        }
    }
    return figuresFrom(bases);
}

// The comparison panel's arithmetic (SPEC §6.5): the two most recent pushes of a Geo, read side by
// side. Unlike a Delta, this subtracts the DISPLAYED figures — a CPI that went 22.50 → 18.40 changed
// by −4.10, which is what a buyer means by "it got cheaper since last time". A Delta answers a
// different question (what the interval itself cost) and the two must not be confused.
export type MetricTone = 'good' | 'bad' | 'neutral';

// The panel's row for one metric: the figure now, the figure before, what moved, and how to read it.
export type MetricComparison = {
    metric: DynamicsMetric;
    current: number | null;
    previous: number | null;
    // Null when either side is unmeasurable — a change against `—` is not a change of zero.
    change: number | null;
    tone: MetricTone;
};

// Where each metric's figure lives on a `DynamicsFigures`. `spend` is Spend⁺ (see `DynamicsMetric`).
function figureOf(figures: DynamicsFigures, metric: DynamicsMetric): number | null {
    switch (metric) {
        case 'spend':
            return figures.spendPlus;
        case 'revenue':
            return figures.revenue;
        default:
            return figures[metric];
    }
}

// The arrow follows arithmetic; the tone follows meaning. A metric that is `neutral` in the map is
// neutral in every direction — spend alone is neither good nor bad, and the ROI beside it judges it.
// No movement is no verdict either.
export function toneOf(metric: DynamicsMetric, change: number | null): MetricTone {
    const meaning = meaningOf(metric);

    if (change === null || change === 0 || meaning === 'neutral') {
        return 'neutral';
    }

    const rising = change > 0;

    return rising === (meaning === 'up-good') ? 'good' : 'bad';
}

// Every metric the panel renders, in reading order: the money first, then the verdict, then the
// costs the verdict is made of. `previous` is null on the day's first push — there is nothing to
// compare against, and every change is null rather than "up from zero".
const COMPARISON_METRICS: DynamicsMetric[] = ['spend', 'revenue', 'profit', 'roi', 'cpi', 'cpr', 'cps', 'cpc'];

export function compareFigures(previous: DynamicsFigures | null, current: DynamicsFigures): MetricComparison[] {
    return COMPARISON_METRICS.map((metric): MetricComparison => {
        const now = figureOf(current, metric);
        const before = previous === null ? null : figureOf(previous, metric);
        const change = now === null || before === null ? null : now - before;

        return { metric, current: now, previous: before, change, tone: toneOf(metric, change) };
    });
}
