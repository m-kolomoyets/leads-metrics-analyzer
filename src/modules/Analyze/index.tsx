import type { UploadedFile } from './types';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { analyze } from '@/lib/domain';
import { presetsQueryOptions, sharedSettingsQueryOptions } from '@/services/presets/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { toRuleset } from './utils/toRuleset';
import { CampaignTable } from './components/CampaignTable';
import { FileDropzones } from './components/FileDropzones';

function Analyze() {
    const { data: presets } = useSuspenseQuery(presetsQueryOptions());
    const { data: shared } = useSuspenseQuery(sharedSettingsQueryOptions());
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [selectedGeo, setSelectedGeo] = useState<string | null>(null);

    const ruleset = toRuleset(presets, shared);
    const result = files.length
        ? analyze(
              files.map((file) => {
                  return file.text;
              }),
              ruleset
          )
        : null;

    const geos = result?.geos ?? [];
    const activeGeo = geos.some((geo) => {
        return geo.geo === selectedGeo;
    })
        ? selectedGeo
        : (geos[0]?.geo ?? null);

    const facts =
        result?.facts.filter((fact) => {
            return fact.geo === activeGeo;
        }) ?? [];

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">Analyze</h1>
            </MainLayoutHeader>

            <div className="flex flex-col gap-6">
                <FileDropzones files={files} onChange={setFiles} />

                {result && geos.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No campaigns parsed. Check the uploaded files are FB + Keitaro exports.
                    </p>
                )}

                {activeGeo && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <label htmlFor="geo-select">Geo</label>
                            <select
                                id="geo-select"
                                className="rounded border px-2 py-1"
                                value={activeGeo}
                                onChange={(event) => {
                                    setSelectedGeo(event.target.value);
                                }}
                            >
                                {geos.map((geo) => {
                                    return (
                                        <option key={geo.geo} value={geo.geo}>
                                            {geo.geo}
                                        </option>
                                    );
                                })}
                            </select>
                            {!ruleset.thresholds[activeGeo] && (
                                <span className="text-muted-foreground">no preset — ungraded</span>
                            )}
                        </div>

                        <CampaignTable facts={facts} thresholds={ruleset.thresholds[activeGeo]} />

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
