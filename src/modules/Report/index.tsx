import type { Locale } from '@/components/report/utils/i18n';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { accountsFor } from '@/lib/domain/accounts';
import { creativesFor } from '@/lib/domain/creatives';
import { analyzeSnapshot } from '@/lib/domain/snapshot';
import { snapshotBundleQueryOptions } from '@/services/snapshots/queries';
import { bundleFromSnapshot } from '@/services/snapshots/toBundle';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { AccountSummary } from '@/components/report/AccountSummary';
import { CreativeTable } from '@/components/report/CreativeTable';
import { GeoStat } from '@/components/report/GeoStat';
import { GeoTabs } from '@/components/report/GeoTabs';
import { OffersTable } from '@/components/report/OffersTable';
import { OsTable } from '@/components/report/OsTable';
import { ProblemAccounts } from '@/components/report/ProblemAccounts';
import { SectionCard } from '@/components/report/SectionCard';
import { LOCALES, ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { activeGeo } from './utils/activeGeo';

const routeApi = getRouteApi('/_authenticated/dashboard/report/$snapshotId');

// One saved Snapshot as the report the buyer saw (spec story 27). Everything below the Facts is
// recomputed through `analyzeSnapshot`, the second entry into the same compute layer Analyze uses, so
// the two screens cannot drift apart — but graded by the Ruleset the Snapshot itself pinned, never
// the reader's (story 32).
//
// Read-only in two specific ways, both deliberate: no per-account collapsibles (reconciliation is the
// buyer's surface, story 31) and no Reviewed control anywhere (an analyst's private progress mark,
// story 34). Nothing here mutes a campaign either — the buyer's mutes were applied before the save,
// and their count is surfaced instead.
function Report() {
    const { snapshotId } = routeApi.useParams();
    const search = routeApi.useSearch();
    const navigate = routeApi.useNavigate();
    const [locale, setLocale] = useState<Locale>('uk');

    const { data: view } = useSuspenseQuery(snapshotBundleQueryOptions(snapshotId));

    const { bundle, ruleset } = bundleFromSnapshot(view);
    const result = analyzeSnapshot(bundle, ruleset);

    const geos = result.geos.map((geo) => {
        return geo.geo;
    });
    // Spend⁺ per geo, stamped on each nav tab exactly as in Analyze.
    const spendByGeo: Record<string, number> = {};
    for (const geo of result.geos) {
        spendByGeo[geo.geo] = geo.metrics.spendPlus;
    }
    const geo = activeGeo(geos, search.geo);
    const geoRollup = result.geos.find((rollup) => {
        return rollup.geo === geo;
    });

    // The thresholds this Snapshot copied for the active geo (ADR-0015) — the buyer's grading, immune
    // to any later preset edit or delete. Undefined when the geo saved none: its rows grade neutral,
    // exactly as they did on the buyer's screen.
    const thresholds = geo ? ruleset.thresholds[geo] : undefined;
    const geoFacts = result.facts.filter((fact) => {
        return fact.geo === geo;
    });
    // No mute set: the campaigns the buyer muted never became Facts, so there is nothing left to
    // exclude here — only a count to disclose (story 33).
    const accounts = accountsFor(geoFacts, thresholds, ruleset.reviewMultiplier, new Set());
    const creatives = creativesFor(geoFacts, result.campaignCreatives, thresholds);
    // The frozen waste, not a recomputed one: it is mixed-grain by ADR-0014 and was measured against
    // the mute set in force at save. Null for a Snapshot that froze no Geo Rollup.
    const waste = geoRollup?.total?.waste ?? null;
    const wasteZone = view.settings?.wasteZones;

    function selectGeo(next: string) {
        navigate({ search: { geo: next }, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">
                    {ui('report', locale)} · {view.snapshot.reportDate}
                </h1>
                <span className="flex-1" />
                <div className="flex gap-1" role="group" aria-label="Language">
                    {LOCALES.map((code) => {
                        return (
                            <Button
                                key={code}
                                type="button"
                                size="xs"
                                variant={code === locale ? 'default' : 'ghost'}
                                onClick={() => {
                                    setLocale(code);
                                }}
                            >
                                {code.toUpperCase()}
                            </Button>
                        );
                    })}
                </div>
            </MainLayoutHeader>

            <div className="flex flex-col gap-4">
                {geo && <GeoTabs geos={geos} active={geo} spendByGeo={spendByGeo} onSelect={selectGeo} />}

                {view.mutedCampaigns > 0 && (
                    <p className="text-muted-foreground text-xs">
                        {ui('reportMuted', locale)}: {view.mutedCampaigns}. {ui('reportMutedNote', locale)}
                    </p>
                )}

                {geoRollup && (
                    <>
                        <GeoStat
                            geo={geoRollup.geo}
                            rollup={geoRollup}
                            thresholds={thresholds}
                            waste={waste}
                            wasteZone={wasteZone}
                            locale={locale}
                        />

                        {/* A Snapshot pushed before ADR-0015 can never produce these four figures, so the
                            page says why they read `—` instead of leaving an overseer to guess (story 35). */}
                        {geoRollup.total === null && (
                            <p className="text-muted-foreground text-xs">{ui('reportNoRollup', locale)}</p>
                        )}

                        <ProblemAccounts accounts={accounts} locale={locale} />

                        {thresholds && (
                            <div className="flex flex-col gap-6">
                                <SectionCard tone="violet">
                                    <OffersTable
                                        title={`📦 ${ui('offers', locale)} · ${geoRollup.geo}`}
                                        firstCol={ui('offers', locale)}
                                        rows={geoRollup.allocation.offers}
                                        unallocated={geoRollup.allocation.unallocated}
                                        thresholds={thresholds}
                                        locale={locale}
                                    />
                                </SectionCard>
                                <SectionCard tone="blue">
                                    <OsTable
                                        title={`💻 ${ui('osTable', locale)} · ${geoRollup.geo}`}
                                        firstCol={ui('osTable', locale)}
                                        rows={geoRollup.allocation.os}
                                        unallocated={geoRollup.allocation.unallocated}
                                        thresholds={thresholds}
                                        locale={locale}
                                    />
                                </SectionCard>
                                <SectionCard tone="blue">
                                    <CreativeTable
                                        rows={creatives}
                                        thresholds={thresholds}
                                        locale={locale}
                                        geo={geoRollup.geo}
                                    />
                                </SectionCard>
                            </div>
                        )}

                        <AccountSummary accounts={accounts} thresholds={thresholds} locale={locale} />
                    </>
                )}
            </div>
        </>
    );
}

export { Report };
