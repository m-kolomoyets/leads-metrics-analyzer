import type { ReportRosterUser, ReportSnapshotView } from '@/services/reports/types';
import type {
    ReportCard,
    ReportDateGroup,
    ReportHeadline,
    ReportMode,
    ReportRange,
    ReportUserGroup,
    ReportView,
} from '../types';
import { resolveRange } from './range';

// The Report assembly seam (ADR-0016). Pure: roster + Snapshots + a range in, a grouped view out.
// `today` is an argument, never a clock read, so every grouping rule is testable with plain objects.

export type BuildReportInput = {
    users: ReportRosterUser[];
    snapshots: ReportSnapshotView[];
    range: ReportRange;
    // The viewer's local calendar day, YYYY-MM-DD. The only date this function does not derive.
    today: string;
    mode: ReportMode;
};

// The card headline: money SUMMED across the Snapshot's Geos, with ROI and the waste share
// re-derived from those sums rather than averaged from the per-Geo figures. No cost-per line — a
// blended CPI has no threshold pair to grade it against, and uniques do not sum across Geos.
function headlineFor(snapshot: ReportSnapshotView): ReportHeadline | null {
    // No frozen rollup means the figures were never recorded and cannot be reconstructed (ADR-0015).
    // Null rather than a zeroed headline, so the card reads `—` instead of claiming a flat day.
    if (snapshot.geos.length === 0) {
        return null;
    }

    let spendPlus = 0;
    let geoTotal = 0;
    let waste = 0;

    for (const geo of snapshot.geos) {
        spendPlus += geo.spendPlus;
        geoTotal += geo.geoTotal;
        waste += geo.waste;
    }

    const profit = geoTotal - spendPlus;

    return {
        spendPlus,
        geoTotal,
        profit,
        // Zero denominator means "not shown", never 0 — the same rule the compute layer applies.
        roi: spendPlus === 0 ? null : (profit / spendPlus) * 100,
        waste,
        // The waste share keeps the Geo header's convention instead: nothing spent is genuinely 0 %
        // wasted, and a `—` there would read as "unknown".
        wastePct: spendPlus === 0 ? 0 : (waste / spendPlus) * 100,
    };
}

function toCard(snapshot: ReportSnapshotView): ReportCard {
    return {
        snapshotId: snapshot.id,
        reportDate: snapshot.reportDate,
        takenAt: snapshot.takenAt,
        wasteZones: snapshot.wasteZones,
        geos: snapshot.geos,
        headline: headlineFor(snapshot),
    };
}

// Newest report date first, and within a day the newest push first.
function byRecency(a: ReportSnapshotView, b: ReportSnapshotView): number {
    if (a.reportDate !== b.reportDate) {
        return a.reportDate < b.reportDate ? 1 : -1;
    }
    if (a.takenAt !== b.takenAt) {
        return a.takenAt < b.takenAt ? 1 : -1;
    }
    // Two pushes stamped to the same instant still need a stable order, or the feed would reshuffle
    // between renders of identical data.
    return a.id < b.id ? 1 : -1;
}

// Feed rule: one Snapshot per (user × report date), the latest by push time — a correction replaces
// rather than duplicates (ADR-0016). The input is already ordered newest-first, so the first sighting
// of a slot wins.
function latestPerDate(snapshots: ReportSnapshotView[]): ReportSnapshotView[] {
    const seen = new Set<string>();
    const latest: ReportSnapshotView[] = [];

    for (const snapshot of snapshots) {
        const slot = `${snapshot.createdByUserId}:${snapshot.reportDate}`;
        if (seen.has(slot)) {
            continue;
        }
        seen.add(slot);
        latest.push(snapshot);
    }

    return latest;
}

// Overloaded on `mode` so a caller that names one gets that arm of the view back already narrowed —
// the feed page should not have to re-check a discriminant it just supplied.
export function buildReport(input: BuildReportInput & { mode: 'feed' }): Extract<ReportView, { mode: 'feed' }>;
export function buildReport(input: BuildReportInput & { mode: 'archive' }): Extract<ReportView, { mode: 'archive' }>;
export function buildReport(input: BuildReportInput): ReportView;
export function buildReport({ users, snapshots, range, today, mode }: BuildReportInput): ReportView {
    const { from, to } = resolveRange(range, today);

    // Filtering runs on the day the data DESCRIBES, never on the day it was pushed: a correction
    // pushed late belongs to the day it is about (ADR-0016).
    const inRange = snapshots
        .filter((snapshot) => {
            return snapshot.reportDate >= from && snapshot.reportDate <= to;
        })
        .sort(byRecency);

    // A Snapshot whose author is not on the roster (offboarded, or outside the viewer's scope) has no
    // group to hang under and is dropped rather than re-attributed to anyone.
    const roster = new Map(
        users.map((user) => {
            return [user.id, user];
        })
    );
    const visible = inRange.filter((snapshot) => {
        return roster.has(snapshot.createdByUserId);
    });

    if (mode === 'feed') {
        const byUser = new Map<string, ReportSnapshotView[]>();
        for (const snapshot of latestPerDate(visible)) {
            const list = byUser.get(snapshot.createdByUserId) ?? [];
            list.push(snapshot);
            byUser.set(snapshot.createdByUserId, list);
        }

        // Every roster user is emitted, in roster order — a user with nothing renders dimmed rather
        // than being absent, so "nobody reported today" is visible instead of blank (story 4).
        const grouped = users.map((user): ReportUserGroup => {
            return { user, cards: (byUser.get(user.id) ?? []).map(toCard) };
        });

        return { mode: 'feed', from, to, users: grouped };
    }

    // Archive: date → user → snapshot, every version. Only days and people that actually reported —
    // the archive answers "what happened on the 12th", so an empty day is not a row.
    const byDate = new Map<string, Map<string, ReportSnapshotView[]>>();
    for (const snapshot of visible) {
        const usersForDate = byDate.get(snapshot.reportDate) ?? new Map<string, ReportSnapshotView[]>();
        const list = usersForDate.get(snapshot.createdByUserId) ?? [];
        list.push(snapshot);
        usersForDate.set(snapshot.createdByUserId, list);
        byDate.set(snapshot.reportDate, usersForDate);
    }

    const dates = [...byDate.entries()]
        .sort(([a], [b]) => {
            return a < b ? 1 : -1;
        })
        .map(([reportDate, usersForDate]): ReportDateGroup => {
            return {
                reportDate,
                // Roster order inside a day, so the same person sits in the same place on every day.
                users: users.flatMap((user): ReportUserGroup[] => {
                    const list = usersForDate.get(user.id);
                    return list ? [{ user, cards: list.map(toCard) }] : [];
                }),
            };
        });

    return { mode: 'archive', from, to, dates };
}
