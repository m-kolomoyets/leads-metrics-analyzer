import type { Locale } from '@/components/report/utils/i18n';
import type { GeoRollup, Ruleset } from '@/lib/domain';
import type { CampaignCreatives, CampaignModel } from '@/lib/domain/join';
import type { Fact } from '@/lib/domain/types';
import type { PresetView, SharedSettingsView } from '@/services/presets/types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createSnapshotMutationOptions } from '@/services/snapshots/queries';
import { ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { defaultReportDate, planSnapshot } from '../../utils/toSnapshot';

type SaveSnapshotProps = {
    facts: Fact[];
    geos: string[];
    // Everything a saved report needs beyond the Facts (ADR-0015): the on-screen per-Geo roll-ups and
    // the sub-grain inputs the Creative / Offers / OS tables allocate over.
    rollups: GeoRollup[];
    campaignCreatives: Map<string, CampaignCreatives>;
    campaignModels: Map<string, CampaignModel>;
    ruleset: Ruleset;
    presets: PresetView[];
    shared: SharedSettingsView | null;
    selectedPresetByGeo: Record<string, string>;
    excluded: ReadonlySet<string>;
    locale: Locale;
};

// Today as a calendar date in the analyst's own timezone (`en-CA` renders ISO). `toISOString` would
// shift the day for anyone east of UTC late in the evening.
function today(): string {
    return new Date().toLocaleDateString('en-CA');
}

// Save as Snapshot (S5, #25). One click freezes what is on screen: the applied ruleset is assembled
// from each analyzed geo's ACTIVE preset version + the active shared-settings version, so the pinned
// rules are exactly the ones that graded these facts (ADR-0002) and the numbers reproduce forever.
// Every geo must already be saved — pinning some and skipping others would freeze a ruleset that
// never graded the report, so an unsaved geo blocks the save rather than silently narrowing it.
function SaveSnapshot({
    facts,
    geos,
    rollups,
    campaignCreatives,
    campaignModels,
    ruleset,
    presets,
    shared,
    selectedPresetByGeo,
    excluded,
    locale,
}: SaveSnapshotProps) {
    // Null until the analyst picks a day, so the default keeps tracking the facts: a fresh upload
    // covering another day re-defaults, while a hand-picked day survives every recompute. A
    // `useState` initializer would freeze the first upload's day and quietly stamp the wrong date.
    const [picked, setPicked] = useState<string | null>(null);
    const reportDate = picked ?? defaultReportDate(facts, today());
    const { mutateAsync: createSnapshot, isPending } = useMutation(createSnapshotMutationOptions());

    const plan = planSnapshot({
        facts,
        geos,
        rollups,
        campaignCreatives,
        campaignModels,
        ruleset,
        presets,
        shared,
        selectedPresetByGeo,
        excluded,
        reportDate,
    });
    // One reason at a time, most actionable first: an unsaved geo, then a cleared date, then an empty
    // fact set (everything muted).
    function blockedReason(): string | null {
        if (plan.ok) {
            return null;
        }
        if (plan.unpinnedGeos.length > 0) {
            return `${ui('snapshotNeedsPreset', locale)}: ${plan.unpinnedGeos.join(', ')}`;
        }
        if (!plan.validDate) {
            return ui('snapshotNeedsDate', locale);
        }
        return ui('snapshotNoFacts', locale);
    }

    const blocked = blockedReason();

    async function handleSave() {
        if (!plan.ok) {
            return;
        }
        await createSnapshot(plan.input, {
            onSuccess() {
                toast.success(ui('snapshotSaved', locale));
            },
            onError(error) {
                toast.error(error.message);
            },
        });
    }

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
                <Label htmlFor="snap-date">{ui('reportDate', locale)}</Label>
                <Input
                    id="snap-date"
                    type="date"
                    className="w-44"
                    disabled={isPending}
                    value={reportDate}
                    onChange={(event) => {
                        setPicked(event.target.value);
                    }}
                />
            </div>
            <Button type="button" size="sm" disabled={!plan.ok || isPending} onClick={handleSave}>
                {isPending ? ui('savingSnapshot', locale) : ui('saveSnapshot', locale)}
            </Button>
            {blocked && <span className="text-muted-foreground pb-2 text-xs">{blocked}</span>}
            {plan.ok && (
                <span className="text-muted-foreground pb-2 text-xs">
                    {plan.input.facts.length} {ui('rowsCount', locale)} · {plan.input.geos.length}{' '}
                    {ui('geoCount', locale)}
                </span>
            )}
        </div>
    );
}

export { SaveSnapshot };
