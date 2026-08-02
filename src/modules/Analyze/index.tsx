import type { GeoThresholds } from '@/lib/domain/types';
import type { PresetView } from '@/services/presets/types';
import type { UploadedFile } from './types';
import type { Locale } from './utils/i18n';
import type { ImportedShared } from './utils/importPresets';
import { useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { analyzeParsed } from '@/lib/domain';
import { accountsFor } from '@/lib/domain/accounts';
import { creativesFor } from '@/lib/domain/creatives';
import { mergeParsed } from '@/lib/domain/parse';
import { presetsQueryOptions, sharedSettingsQueryOptions } from '@/services/presets/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxInputGroup,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from '@/components/ui/Combobox';
import { LOCALES, ui } from './utils/i18n';
import { presetForGeo, presetsForGeo } from './utils/presetForGeo';
import { toRuleset } from './utils/toRuleset';
import { useClipboard } from './hooks/useClipboard';
import { AccountBlock } from './components/AccountBlock';
import { AccountSummary } from './components/AccountSummary';
import { CreativeTable } from './components/CreativeTable';
import { FileDropzones } from './components/FileDropzones';
import { GeoStat } from './components/GeoStat';
import { GeoTabs } from './components/GeoTabs';
import { OffersTable } from './components/OffersTable';
import { OsTable } from './components/OsTable';
import { PresetCreator } from './components/PresetCreator';
import { ProblemAccounts } from './components/ProblemAccounts';
import { SaveSnapshot } from './components/SaveSnapshot';
import { SectionCard } from './components/SectionCard';
import { SharedSettingsEditor } from './components/SharedSettingsEditor';
import { ThresholdEditor } from './components/ThresholdEditor';

// Roles that hold the Geo dollar dimension and so may own presets (designer/bdm see none).
const PRESET_WRITE_ROLES = ['buyer', 'team_lead', 'head'];

// The zone-metrics accordion holds a single item; its value is arbitrary but must be stable.
const ZONE_ITEM = 'zone-metrics';

// The GeoThresholds the active geo grades against: the focused preset's four pairs, or the ruleset's
// first-wins fallback.
function thresholdsFor(
    activePreset: PresetView | undefined,
    fallback: GeoThresholds | undefined
): GeoThresholds | undefined {
    return activePreset?.thresholds ?? fallback;
}

const routeApi = getRouteApi('/_authenticated');

function Analyze() {
    const { data: presets } = useSuspenseQuery(presetsQueryOptions());
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
    // The server picks the scope: the viewer's own team, or the global (null-team) row when they are
    // on no team. Non-suspense, sharing the route loader's preloaded key, so first render is warm.
    const { data: sharedData } = useQuery(sharedSettingsQueryOptions());
    const shared = sharedData ?? null;
    // Which preset drives grading for a Geo that carries several — owner's pick, keyed by Geo.
    const [selectedPresetByGeo, setSelectedPresetByGeo] = useState<Record<string, string>>({});
    // Shared tunables lifted from an imported file, with a bump counter so each import re-seeds the
    // shared-settings editor even when the values repeat.
    const [importedShared, setImportedShared] = useState<{ seed: ImportedShared; n: number } | null>(null);
    // Zone-metrics disclosure, tagged with the geo it was taken for so switching geo falls back to the
    // default rather than carrying the previous geo's choice across.
    const [zoneOpen, setZoneOpen] = useState<{ geo: string; open: boolean } | null>(null);
    const [locale, setLocale] = useState<Locale>('uk');
    // Muted campaigns, keyed `${geo}:${campaign}` so the same id in two geos toggles independently.
    const [excluded, setExcluded] = useState<ReadonlySet<string>>(new Set());
    // AccountBlocks whose open state is *flipped from its default*, keyed `${geo}:${account}`. Stored as
    // a flip rather than "is collapsed" because the default differs per account — Problem Accounts start
    // collapsed (their campaign tables are noise until the account itself is checked by hand), everything
    // else starts open. Lifted so the summary nav table can open a block on row click (#36).
    const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
    // Accounts the analyst has triaged this session, keyed `${geo}:${account}`. Pure view state — it
    // changes no figure (unlike `excluded`), only the pulse and the tint.
    const [reviewed, setReviewed] = useState<ReadonlySet<string>>(new Set());
    const { copied, copy } = useClipboard();

    const ruleset = toRuleset(presets, shared);
    // Files are parsed once at ingest; here we only merge their rows (cheap) and grade. A preset/shared
    // edit re-runs `analyzeParsed` but never Papa.parse — the reference's parse-once, grade-many split.
    const parsed = mergeParsed(
        files.map((file) => {
            return file.parsed;
        })
    );
    const result = files.length ? analyzeParsed(parsed, ruleset) : null;

    const geos = (result?.geos ?? []).map((geo) => {
        return geo.geo;
    });
    // Spend⁺ per geo, stamped on each nav tab (reference).
    const spendByGeo: Record<string, number> = {};
    for (const geo of result?.geos ?? []) {
        spendByGeo[geo.geo] = geo.metrics.spendPlus;
    }
    const activeGeo = geos.includes(selectedGeo ?? '') ? selectedGeo : (geos[0] ?? null);
    // The very preset that fed this geo's grading — the inline editor mutates it so edits and
    // verdicts stay in lock-step. When the geo carries several, the owner's pick wins (else first
    // active). Team Leads own the team-global shared-settings write.
    const geoPresets = activeGeo ? presetsForGeo(presets, activeGeo) : [];
    const activePreset = activeGeo ? presetForGeo(presets, activeGeo, selectedPresetByGeo[activeGeo]) : undefined;
    // Grade against the focused preset's thresholds, overriding the ruleset's first-wins pick when the
    // owner selected a different one; else fall back to that first-wins pick.
    const thresholds = thresholdsFor(activePreset, activeGeo ? ruleset.thresholds[activeGeo] : undefined);
    const canEditShared = PRESET_WRITE_ROLES.includes(role);
    // Freezing a Snapshot is a dollar-dimension action, so it rides the same role set as preset
    // writes (`createSnapshotFn` gates on the campaign dimension server-side).
    const canWritePresets = PRESET_WRITE_ROLES.includes(role);

    const geoFacts =
        result?.facts.filter((fact) => {
            return fact.geo === activeGeo;
        }) ?? [];
    const excludedInGeo = new Set(
        geoFacts
            .filter((fact) => {
                return excluded.has(`${activeGeo}:${fact.campaign}`);
            })
            .map((fact) => {
                return fact.campaign;
            })
    );
    const accounts = accountsFor(geoFacts, thresholds, ruleset.reviewMultiplier, excludedInGeo);
    // Per-creative table for the active geo (#35): FB Spend/Impressions real, funnel allocated. Graded
    // against the same focused thresholds as the campaign tables; empty geo → the table renders nothing.
    const creatives = result ? creativesFor(geoFacts, result.campaignCreatives, thresholds) : [];
    // The active geo's market-level roll-up (Geo Total + Attributed + allocation, doc 06 / ADR-0003).
    const geoRollup = result?.geos.find((geo) => {
        return geo.geo === activeGeo;
    });
    // Triage state, view-only — the account order stays exactly as the compute layer returns it (Spend⁺
    // desc) in both the summary table and the block list, so a review never moves a row under the cursor.
    const isReviewed = (account: string) => {
        return reviewed.has(`${activeGeo}:${account}`);
    };

    // Problem Accounts start collapsed — the alarm strip and the red header already say what is wrong,
    // and their campaign tables only matter once the account itself has been checked by hand.
    const startsOpen = (account: string) => {
        return (
            accounts.find((rollup) => {
                return rollup.account === account;
            })?.problem === null
        );
    };
    const isOpen = (account: string) => {
        const flipped = collapsed.has(`${activeGeo}:${account}`);
        return flipped ? !startsOpen(account) : startsOpen(account);
    };

    // Geo waste = Σ each account's waste, whichever grain that account is measured at (ADR-0014).
    const geoWaste = accounts.reduce((sum, account) => {
        return sum + account.waste;
    }, 0);
    // Waste Zone band (% of Spend⁺) — a team-global shared setting, so one band across every geo; the
    // verdict engine ignores it (S4-only, colouring the waste readout).
    const wasteZone = shared?.payload?.wasteZones;

    function toggleExcluded(campaign: string) {
        const key = `${activeGeo}:${campaign}`;
        setExcluded((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }

    function toggleCollapsed(account: string) {
        const key = `${activeGeo}:${account}`;
        setCollapsed((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }

    function toggleReviewed(account: string) {
        const key = `${activeGeo}:${account}`;
        setReviewed((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }

    // A new upload replaces the facts, so every per-campaign / per-account toggle taken against the old
    // ones is void. `excluded` matters most: a stale mute silently drops campaigns from account metrics,
    // counts, waste and the Problem rules with no visible cue.
    function replaceFiles(next: UploadedFile[]) {
        setFiles(next);
        setExcluded(new Set());
        setCollapsed(new Set());
        setReviewed(new Set());
    }

    // Summary-row click: force the target block open, then scroll its anchor into view. "Open" is the
    // flipped state for a Problem Account and the default one for everything else.
    function jumpToAccount(account: string) {
        const key = `${activeGeo}:${account}`;
        setCollapsed((current) => {
            const next = new Set(current);
            if (startsOpen(account)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
        document.getElementById(`acc-${account}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }

    // Collapsed by default, but a geo with no active preset opens itself: without thresholds every table
    // below is hidden, and this block holds the only remedy — hiding it behind a chevron would read as a
    // broken page. Storing the geo alongside the flag makes a geo switch fall back to the default again.
    const isZoneOpen = zoneOpen?.geo === activeGeo ? zoneOpen.open : !thresholds;

    const presetCreator = canWritePresets && activeGeo && (
        <div className="border-border/60 border-t pt-4">
            <PresetCreator
                key={activeGeo}
                geo={activeGeo}
                locale={locale}
                onImportShared={(seed) => {
                    setImportedShared((current) => {
                        return { seed, n: (current?.n ?? 0) + 1 };
                    });
                }}
            />
        </div>
    );

    const sharedColumn = (shared || canEditShared) && (
        <div className="border-border/60 flex flex-1 flex-col gap-2 border-t pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
            <SharedSettingsEditor
                key={`${shared?.activeVersionId ?? 'new'}:${importedShared?.n ?? 0}`}
                shared={shared}
                canEdit={canEditShared}
                locale={locale}
                seed={importedShared?.seed}
                onSaved={() => {
                    // The import has landed in a version — drop the seed so it stops overriding the
                    // saved payload on every later remount of the editor.
                    setImportedShared(null);
                }}
            />
        </div>
    );

    // Zone-metrics header: the accordion trigger (title · geo) plus the preset picker. The picker and
    // the threshold save button sit *outside* the trigger — they are buttons themselves, so nesting them
    // would be invalid markup and every click would toggle the panel. Save joins this row inside
    // ThresholdEditor, which owns the draft.
    const zoneHeader = activeGeo && (
        <>
            <AccordionHeader>
                <AccordionTrigger className="text-[13px] font-normal tracking-widest uppercase">
                    {ui('zoneMetrics', locale)} · {activeGeo}
                </AccordionTrigger>
            </AccordionHeader>
            {geoPresets.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{ui('preset', locale)}</span>
                    <Combobox
                        items={geoPresets}
                        value={activePreset ?? null}
                        onValueChange={(preset) => {
                            if (preset) {
                                setSelectedPresetByGeo((current) => {
                                    return { ...current, [activeGeo]: preset.id };
                                });
                            }
                        }}
                        itemToStringLabel={(preset) => {
                            return preset.name;
                        }}
                    >
                        <ComboboxInputGroup className="w-56">
                            <ComboboxInput placeholder={ui('preset', locale)} />
                            <ComboboxTrigger />
                        </ComboboxInputGroup>
                        <ComboboxContent>
                            <ComboboxEmpty>{ui('noResults', locale)}</ComboboxEmpty>
                            <ComboboxList>
                                {(preset) => {
                                    return (
                                        <ComboboxItem key={preset.id} value={preset}>
                                            {preset.name}
                                        </ComboboxItem>
                                    );
                                }}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </div>
            )}
        </>
    );

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">Analyze</h1>
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

            <div className="flex flex-col gap-6">
                <FileDropzones files={files} onChange={replaceFiles} />

                {result && geos.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No campaigns parsed. Check the uploaded files are FB + Keitaro exports.
                    </p>
                )}

                {activeGeo && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <GeoTabs geos={geos} active={activeGeo} spendByGeo={spendByGeo} onSelect={setSelectedGeo} />
                            {!thresholds && (
                                <span className="text-muted-foreground text-xs">{ui('noPreset', locale)}</span>
                            )}
                        </div>

                        {result && canWritePresets && (
                            <SectionCard tone="violet">
                                <div className="flex flex-col gap-2">
                                    <SaveSnapshot
                                        facts={result.facts}
                                        geos={geos}
                                        presets={presets}
                                        shared={shared}
                                        selectedPresetByGeo={selectedPresetByGeo}
                                        excluded={excluded}
                                        locale={locale}
                                    />
                                    <p className="text-muted-foreground text-xs">{ui('snapshotHint', locale)}</p>
                                </div>
                            </SectionCard>
                        )}

                        {(activePreset || canWritePresets || shared || canEditShared) && (
                            <SectionCard tone="blue">
                                <Accordion
                                    value={isZoneOpen ? [ZONE_ITEM] : []}
                                    onValueChange={(value) => {
                                        setZoneOpen({ geo: activeGeo, open: value.length > 0 });
                                    }}
                                >
                                    <AccordionItem value={ZONE_ITEM}>
                                        {activePreset ? (
                                            <ThresholdEditor
                                                key={`${activePreset.id}:${activePreset.activeVersionId}:${activePreset.name}`}
                                                preset={activePreset}
                                                locale={locale}
                                                header={zoneHeader}
                                                collapsed={!isZoneOpen}
                                                panelLeft={presetCreator}
                                                panelRight={sharedColumn}
                                            />
                                        ) : (
                                            <>
                                                <div className="flex flex-wrap items-center gap-3">{zoneHeader}</div>
                                                <AccordionPanel>
                                                    <div className="flex flex-col gap-4 pt-4 lg:flex-row lg:items-start">
                                                        <div className="flex flex-1 flex-col gap-4">
                                                            {presetCreator}
                                                        </div>
                                                        {sharedColumn}
                                                    </div>
                                                </AccordionPanel>
                                            </>
                                        )}
                                    </AccordionItem>
                                </Accordion>
                            </SectionCard>
                        )}

                        {geoRollup && (
                            <GeoStat
                                geo={activeGeo}
                                rollup={geoRollup}
                                thresholds={thresholds}
                                waste={geoWaste}
                                wasteZone={wasteZone}
                                locale={locale}
                            />
                        )}

                        <ProblemAccounts accounts={accounts} locale={locale} isReviewed={isReviewed} />

                        {geoRollup && thresholds && (
                            <div className="flex flex-col gap-6">
                                <SectionCard tone="violet">
                                    <OffersTable
                                        title={`📦 ${ui('offers', locale)} · ${activeGeo}`}
                                        firstCol={ui('offers', locale)}
                                        rows={geoRollup.allocation.offers}
                                        unallocated={geoRollup.allocation.unallocated}
                                        thresholds={thresholds}
                                        locale={locale}
                                    />
                                </SectionCard>
                                <SectionCard tone="blue">
                                    <OsTable
                                        title={`💻 ${ui('osTable', locale)} · ${activeGeo}`}
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
                                        geo={activeGeo}
                                    />
                                </SectionCard>
                            </div>
                        )}

                        <AccountSummary
                            accounts={accounts}
                            thresholds={thresholds}
                            locale={locale}
                            isReviewed={isReviewed}
                            onJump={jumpToAccount}
                        />

                        <div className="flex flex-col gap-4">
                            {accounts.map((account) => {
                                return (
                                    <AccountBlock
                                        key={account.account}
                                        account={account}
                                        thresholds={thresholds}
                                        locale={locale}
                                        copiedKey={copied ?? ''}
                                        onCopy={copy}
                                        isExcluded={(campaign) => {
                                            return excluded.has(`${activeGeo}:${campaign}`);
                                        }}
                                        onToggleExcluded={toggleExcluded}
                                        open={isOpen(account.account)}
                                        onToggleOpen={() => {
                                            toggleCollapsed(account.account);
                                        }}
                                        reviewed={isReviewed(account.account)}
                                        onToggleReviewed={() => {
                                            toggleReviewed(account.account);
                                        }}
                                    />
                                );
                            })}
                        </div>
                        {result && result.unclaimedAccounts.length > 0 && (
                            <p className="text-muted-foreground text-xs">
                                Unclaimed accounts (default commission): {result.unclaimedAccounts.join(', ')}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export { Analyze };
