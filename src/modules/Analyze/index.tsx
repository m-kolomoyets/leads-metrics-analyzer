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
import { teamsQueryOptions } from '@/services/admin/queries';
import { presetsQueryOptions, sharedSettingsQueryOptions } from '@/services/presets/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
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
import { ModelTable } from './components/ModelTable';
import { PresetCreator } from './components/PresetCreator';
import { ProblemAccounts } from './components/ProblemAccounts';
import { SectionCard } from './components/SectionCard';
import { SharedSettingsEditor } from './components/SharedSettingsEditor';
import { TeamScopePicker } from './components/TeamScopePicker';
import { ThresholdEditor } from './components/ThresholdEditor';

// Roles that hold the Geo dollar dimension and so may own presets (designer/bdm see none).
const PRESET_WRITE_ROLES = ['buyer', 'team_lead', 'head'];

// The GeoThresholds the active geo grades against: the focused preset's four pairs (dropping the
// slice-4 `wasteZones` the verdict engine ignores), or the ruleset's first-wins fallback.
function thresholdsFor(
    activePreset: PresetView | undefined,
    fallback: GeoThresholds | undefined
): GeoThresholds | undefined {
    if (!activePreset?.thresholds) {
        return fallback;
    }
    const { installs, regs, sales, clicks } = activePreset.thresholds;
    return { installs, regs, sales, clicks };
}

const routeApi = getRouteApi('/_authenticated');

function Analyze() {
    const { data: presets } = useSuspenseQuery(presetsQueryOptions());
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });
    const isHead = role === 'head';
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
    // Which shared-settings scope a Head is viewing/editing: null = the global row, a UUID = that
    // team's. Ignored for every other role (server pins them to their own team).
    const [sharedTeamId, setSharedTeamId] = useState<string | null>(null);
    // Non-suspense so a Head switching teams re-fetches without a suspense boundary; the default
    // (null) scope shares the loader-preloaded key, so first render is already warm.
    const { data: sharedData } = useQuery(sharedSettingsQueryOptions(isHead ? sharedTeamId : null));
    const shared = sharedData ?? null;
    // Team list backs the Head-only scope picker (head-gated query, so only enabled for a Head).
    const { data: teams } = useQuery({ ...teamsQueryOptions(), enabled: isHead });
    // Which preset drives grading for a Geo that carries several — owner's pick, keyed by Geo.
    const [selectedPresetByGeo, setSelectedPresetByGeo] = useState<Record<string, string>>({});
    // Shared tunables lifted from an imported file, with a bump counter so each import re-seeds the
    // shared-settings editor even when the values repeat.
    const [importedShared, setImportedShared] = useState<{ seed: ImportedShared; n: number } | null>(null);
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
        spendByGeo[geo.geo] = geo.metrics.spend;
    }
    const activeGeo = geos.includes(selectedGeo ?? '') ? selectedGeo : (geos[0] ?? null);
    // The very preset that fed this geo's grading — the inline editor mutates it so edits and
    // verdicts stay in lock-step. When the geo carries several, the owner's pick wins (else first
    // active). Team Leads own the team-global shared-settings write.
    const geoPresets = activeGeo ? presetsForGeo(presets, activeGeo) : [];
    const activePreset = activeGeo ? presetForGeo(presets, activeGeo, selectedPresetByGeo[activeGeo]) : undefined;
    // Grade against the focused preset's thresholds (dropping `wasteZones`), overriding the ruleset's
    // first-wins pick when the owner selected a different one; else fall back to that first-wins pick.
    const thresholds = thresholdsFor(activePreset, activeGeo ? ruleset.thresholds[activeGeo] : undefined);
    const canEditShared = PRESET_WRITE_ROLES.includes(role);
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

    // Geo waste = Σ each account's Spend⁺ wasted over the line — in lock-step with the shown verdicts.
    const geoWaste = accounts.reduce((sum, account) => {
        return sum + account.waste;
    }, 0);
    // Waste Zone band (% of Spend⁺) from the focused preset; verdict engine ignores it (S4-only).
    const wasteZone = activePreset?.thresholds?.wasteZones;

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

    // Zone-metrics header: title · geo plus the preset picker. It heads the left (thresholds) column
    // only — the shared-settings column on the right is its own panel — and the threshold save button
    // joins this row inside ThresholdEditor.
    const zoneHeader = activeGeo && (
        <>
            <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">
                {ui('zoneMetrics', locale)} · {activeGeo}
            </h3>
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

                        {(activePreset || canWritePresets || shared || canEditShared) && (
                            <SectionCard tone="blue">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                                    <div className="flex flex-1 flex-col gap-4">
                                        {activePreset ? (
                                            <ThresholdEditor
                                                key={`${activePreset.id}:${activePreset.activeVersionId}:${activePreset.name}`}
                                                preset={activePreset}
                                                locale={locale}
                                                header={zoneHeader}
                                            />
                                        ) : (
                                            <div className="flex flex-wrap items-center gap-3">{zoneHeader}</div>
                                        )}
                                        {canWritePresets && (
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
                                        )}
                                    </div>
                                    {(shared || canEditShared) && (
                                        <div className="border-border/60 flex flex-1 flex-col gap-2 border-t pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
                                            {isHead && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground text-xs">
                                                        {ui('team', locale)}
                                                    </span>
                                                    <TeamScopePicker
                                                        teams={teams ?? []}
                                                        value={sharedTeamId}
                                                        locale={locale}
                                                        onChange={setSharedTeamId}
                                                    />
                                                </div>
                                            )}
                                            <SharedSettingsEditor
                                                key={`${sharedTeamId ?? 'global'}:${shared?.activeVersionId ?? 'new'}:${importedShared?.n ?? 0}`}
                                                shared={shared}
                                                canEdit={canEditShared}
                                                locale={locale}
                                                seed={importedShared?.seed}
                                                saveTeamId={isHead ? sharedTeamId : undefined}
                                            />
                                        </div>
                                    )}
                                </div>
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
                                    <ModelTable
                                        title={`📦 ${ui('offers', locale)} · ${activeGeo}`}
                                        firstCol={ui('offers', locale)}
                                        rows={geoRollup.allocation.offers}
                                        thresholds={thresholds}
                                        locale={locale}
                                        copiedKey={copied ?? ''}
                                        onCopy={copy}
                                        copyKey={`offers:${activeGeo}`}
                                    />
                                </SectionCard>
                                <SectionCard tone="blue">
                                    <ModelTable
                                        title={`💻 ${ui('osTable', locale)} · ${activeGeo}`}
                                        firstCol={ui('osTable', locale)}
                                        rows={geoRollup.allocation.os}
                                        thresholds={thresholds}
                                        locale={locale}
                                        showCpc
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
