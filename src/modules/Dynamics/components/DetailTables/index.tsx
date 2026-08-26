import type { SnapshotBundleView } from '@/services/snapshots/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { creativesFor } from '@/lib/domain/creatives';
import { analyzeSnapshot } from '@/lib/domain/snapshot';
import { snapshotBundleQueryOptions } from '@/services/snapshots/queries';
import { bundleFromSnapshot } from '@/services/snapshots/toBundle';
import { CreativeTable } from '@/components/report/CreativeTable';
import { OffersTable } from '@/components/report/OffersTable';
import { OsTable } from '@/components/report/OsTable';
import { SectionCard } from '@/components/report/SectionCard';
import { ui } from '@/components/report/utils/i18n';

// The Offers / OS / Creatives tables under the trajectory (SPEC §6.7). They are the expensive half of
// the page — they read the whole Snapshot bundle, facts included — so they hang behind their own
// Suspense boundary and load as a SECOND request, after the comparison panel and the chart have
// painted off the cheap day read (SPEC §8).
//
// Nothing here is rebuilt. The bundle goes through the same `analyzeSnapshot` the detailed report
// uses, and the same three table components render it, with the same column orders, the same Geo
// Unit Cost allocation (ADR-0013), the same Spend⁺ column, the same OS filter, the same creative key
// parse and the same "Why". What this page adds is the arrows, and it adds them by handing each table
// the previous Snapshot's rows — never by re-deriving anything the tables already know how to do.

// The page is written in English; the tables' own strings come from the report's i18n table, which
// the detailed report switches per reader. There is no language control here, so `en` is fixed rather
// than left to a default that would read Ukrainian under an English heading.
const LOCALE = 'en';

type DetailTablesProps = {
    // The Snapshot the tables read: the latest active push of the day for this buyer. The "Why"
    // column comes from it too, which is what SPEC §6.7 asks for.
    snapshotId: string;
    // The push before it, or null on the day's first — with nothing behind it, no row moved and no
    // arrow is drawn anywhere.
    previousSnapshotId: string | null;
    geo: string;
};

// One Snapshot's tables, rebuilt through the shared compute layer and narrowed to one market.
function tablesOf(view: SnapshotBundleView, geo: string) {
    const { bundle, ruleset } = bundleFromSnapshot(view);
    const result = analyzeSnapshot(bundle, ruleset);
    // A Snapshot that never froze this Geo has no tables to show — not empty ones.
    const geoRollup =
        result.geos.find((rollup) => {
            return rollup.geo === geo;
        }) ?? null;
    // The thresholds this Snapshot copied, never the reader's live preset (ADR-0002, ADR-0015).
    const thresholds = ruleset.thresholds[geo];
    const geoFacts = result.facts.filter((fact) => {
        return fact.geo === geo;
    });

    return {
        geoRollup,
        thresholds,
        creatives: creativesFor(geoFacts, result.campaignCreatives, thresholds),
    };
}

function DetailTables({ snapshotId, previousSnapshotId, geo }: DetailTablesProps) {
    // Both bundles in one suspending read, in parallel. The previous one is deliberately NOT loaded
    // separately and folded in late: arrows appearing after the tables have painted would reflow five
    // columns under a reader already scanning them, and a table screenshotted mid-way would be a
    // table that quietly understated what moved.
    const ids = previousSnapshotId === null ? [snapshotId] : [snapshotId, previousSnapshotId];
    const bundles = useSuspenseQueries({
        queries: ids.map((id) => {
            return snapshotBundleQueryOptions(id);
        }),
    });

    const current = tablesOf(bundles[0].data, geo);
    const previousView = bundles[1]?.data ?? null;
    const previous = previousView === null ? null : tablesOf(previousView, geo);

    // No rollup, or a Geo whose Preset carried no thresholds: the report page draws no tables in
    // either case, because every cost cell would be ungraded and every zone stripe blank. Said out
    // loud rather than rendered as nothing — a gap where three tables were about to appear reads as
    // a page that failed (SPEC §6.6).
    if (!current.geoRollup || !current.thresholds) {
        return (
            <p className="text-muted-foreground text-sm">
                This push saved no thresholds for this market, so its offers, OS and creatives cannot be graded.
            </p>
        );
    }

    const { allocation } = current.geoRollup;
    const previousAllocation = previous?.geoRollup?.allocation ?? null;

    return (
        <div className="flex flex-col gap-6">
            <SectionCard>
                <OffersTable
                    title={`📦 ${ui('offers', LOCALE)} · ${geo}`}
                    firstCol={ui('offers', LOCALE)}
                    rows={allocation.offers}
                    unallocated={allocation.unallocated}
                    thresholds={current.thresholds}
                    locale={LOCALE}
                    previous={
                        previousAllocation === null
                            ? undefined
                            : { rows: previousAllocation.offers, unallocated: previousAllocation.unallocated }
                    }
                />
            </SectionCard>
            <SectionCard>
                <OsTable
                    title={`💻 ${ui('osTable', LOCALE)} · ${geo}`}
                    firstCol={ui('osTable', LOCALE)}
                    rows={allocation.os}
                    unallocated={allocation.unallocated}
                    thresholds={current.thresholds}
                    locale={LOCALE}
                    previous={
                        previousAllocation === null
                            ? undefined
                            : { rows: previousAllocation.os, unallocated: previousAllocation.unallocated }
                    }
                />
            </SectionCard>
            <SectionCard>
                <CreativeTable
                    rows={current.creatives}
                    thresholds={current.thresholds}
                    locale={LOCALE}
                    geo={geo}
                    previous={previous?.creatives}
                />
            </SectionCard>
        </div>
    );
}

export { DetailTables };
