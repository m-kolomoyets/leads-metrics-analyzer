import type { UploadedFile } from './types';
import type { Locale } from './utils/i18n';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { analyze } from '@/lib/domain';
import { accountsFor } from '@/lib/domain/accounts';
import { presetsQueryOptions, sharedSettingsQueryOptions } from '@/services/presets/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { Button } from '@/components/ui/Button';
import { LOCALES, ui } from './utils/i18n';
import { presetForGeo } from './utils/presetForGeo';
import { toRuleset } from './utils/toRuleset';
import { useClipboard } from './hooks/useClipboard';
import { AccountBlock } from './components/AccountBlock';
import { FileDropzones } from './components/FileDropzones';
import { GeoTabs } from './components/GeoTabs';
import { ProblemAccounts } from './components/ProblemAccounts';
import { SharedSettingsEditor } from './components/SharedSettingsEditor';
import { ThresholdEditor } from './components/ThresholdEditor';

const routeApi = getRouteApi('/_authenticated');

function Analyze() {
    const { data: presets } = useSuspenseQuery(presetsQueryOptions());
    const { data: shared } = useSuspenseQuery(sharedSettingsQueryOptions());
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
    const [locale, setLocale] = useState<Locale>('uk');
    // Muted campaigns, keyed `${geo}:${campaign}` so the same id in two geos toggles independently.
    const [excluded, setExcluded] = useState<ReadonlySet<string>>(new Set());
    const { copied, copy } = useClipboard();

    const ruleset = toRuleset(presets, shared);
    const result = files.length
        ? analyze(
              files.map((file) => {
                  return file.text;
              }),
              ruleset
          )
        : null;

    const geos = (result?.geos ?? []).map((geo) => {
        return geo.geo;
    });
    const activeGeo = geos.includes(selectedGeo ?? '') ? selectedGeo : (geos[0] ?? null);
    const thresholds = activeGeo ? ruleset.thresholds[activeGeo] : undefined;
    // The very preset that fed this geo's grading — the inline editor mutates it so edits and
    // verdicts stay in lock-step. Team Leads own the team-global shared-settings write.
    const activePreset = activeGeo ? presetForGeo(presets, activeGeo) : undefined;
    const canEditShared = ['team_lead', 'head', 'buyer'].includes(role);

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
                <FileDropzones files={files} onChange={setFiles} />

                {result && geos.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No campaigns parsed. Check the uploaded files are FB + Keitaro exports.
                    </p>
                )}

                {activeGeo && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <GeoTabs geos={geos} active={activeGeo} onSelect={setSelectedGeo} />
                            {!thresholds && (
                                <span className="text-muted-foreground text-xs">{ui('noPreset', locale)}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                            {activePreset && (
                                <ThresholdEditor
                                    key={`${activePreset.id}:${activePreset.activeVersionId}`}
                                    preset={activePreset}
                                    locale={locale}
                                />
                            )}
                            {(shared || canEditShared) && (
                                <SharedSettingsEditor
                                    key={shared?.activeVersionId ?? 'new'}
                                    shared={shared}
                                    canEdit={canEditShared}
                                    locale={locale}
                                />
                            )}
                        </div>

                        <ProblemAccounts accounts={accounts} locale={locale} />

                        <div className="flex flex-col gap-4">
                            {accounts.map((account) => {
                                return (
                                    <AccountBlock
                                        key={account.account}
                                        account={account}
                                        locale={locale}
                                        copiedKey={copied ?? ''}
                                        onCopy={copy}
                                        isExcluded={(campaign) => {
                                            return excluded.has(`${activeGeo}:${campaign}`);
                                        }}
                                        onToggleExcluded={toggleExcluded}
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
