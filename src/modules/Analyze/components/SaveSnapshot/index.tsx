import type { Locale } from '@/components/report/utils/i18n';
import type { GeoRollup, Ruleset } from '@/lib/domain';
import type { CampaignCreatives, CampaignModel } from '@/lib/domain/join';
import type { Fact } from '@/lib/domain/types';
import type { PresetView, SharedSettingsView } from '@/services/presets/types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseISODate } from '@/lib/utils/isoDate';
import { kyivDay } from '@/lib/utils/kyivDay';
import { createSnapshotMutationOptions } from '@/services/snapshots/queries';
import { DatePicker } from '@/components/DatePicker';
import { longDate, ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { needsReportDateConfirmation } from '../../utils/reportDateConfirm';
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
    // Today is Kyiv's today (ADR-0017) — the same day the confirmation below compares against.
    const reportDate = picked ?? defaultReportDate(facts, kyivDay());
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { mutate: createSnapshot, isPending } = useMutation(createSnapshotMutationOptions());

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

    function push() {
        if (!plan.ok) {
            return;
        }
        createSnapshot(plan.input, {
            onSuccess() {
                toast.success(ui('snapshotSaved', locale));
            },
            onError(error) {
                toast.error(error.message);
            },
        });
    }

    // Any day but today rewrites a closed day, so the push waits for an explicit "yes" (ADR-0017).
    // Today goes straight through — the common case stays one click.
    function handleSave() {
        if (needsReportDateConfirmation(reportDate)) {
            setIsConfirmOpen(true);
            return;
        }
        push();
    }

    function handleConfirm() {
        setIsConfirmOpen(false);
        push();
    }

    const parsedDate = parseISODate(reportDate);
    const dateLabel = parsedDate ? longDate(parsedDate, locale) : reportDate;

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
                <Label htmlFor="snap-date">{ui('reportDate', locale)}</Label>
                <DatePicker
                    id="snap-date"
                    className="w-52 justify-start font-normal"
                    locale={locale}
                    disabled={isPending}
                    value={reportDate}
                    onChange={setPicked}
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
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{ui('snapshotDateConfirmTitle', locale)}</DialogTitle>
                        <DialogDescription>
                            {ui('snapshotDateConfirmBody', locale).replace('{date}', dateLabel)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose
                            render={
                                <Button type="button" variant="outline">
                                    {ui('cancel', locale)}
                                </Button>
                            }
                        />
                        <Button type="button" onClick={handleConfirm}>
                            {ui('snapshotDateConfirmYes', locale).replace('{date}', dateLabel)}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export { SaveSnapshot };
