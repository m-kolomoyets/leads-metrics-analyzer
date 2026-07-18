import type { ChangeEvent } from 'react';
import type { Locale, ThresholdMetric } from '../../utils/i18n';
import type { ImportedPreset } from '../../utils/importPresets';
import type { ThresholdDraft } from '../ThresholdFields';
import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createPresetMutationOptions } from '@/services/presets/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ui } from '../../utils/i18n';
import { importedPresetsForGeo, parseImportPresetsFile } from '../../utils/importPresets';
import { EMPTY_THRESHOLD_DRAFT, parseThresholdDraft, ThresholdFields, toThresholdDraft } from '../ThresholdFields';

type PresetCreatorProps = {
    geo: string;
    locale: Locale;
};

// A preset for one Geo (S9/S15, #30): mint a fresh one or import from the prototype export
// (references/presets.json) and save it to the DB. Collapsed to a button row until the owner opens
// the form via New / Import; `createPresetFn` stamps them as owner + their team, mints v1 and sets it
// active, so grading immediately runs against it. Only mounted for a viewer authorised to own presets
// (dollar-dimension role). Parent keys this on the Geo, so switching Geo resets it.
function PresetCreator({ geo, locale }: PresetCreatorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [draft, setDraft] = useState<ThresholdDraft>(EMPTY_THRESHOLD_DRAFT);
    // Set only when an imported file holds several presets for this Geo — the owner picks one.
    const [candidates, setCandidates] = useState<ImportedPreset[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutateAsync: create, isPending } = useMutation(createPresetMutationOptions());

    function setPair(metric: ThresholdMetric, bound: 'gy' | 'yr', value: string) {
        setDraft((current) => {
            return { ...current, [metric]: { ...current[metric], [bound]: value } };
        });
    }

    function reset() {
        setIsOpen(false);
        setCandidates(null);
        setName('');
        setDraft(EMPTY_THRESHOLD_DRAFT);
    }

    function prefill(preset: ImportedPreset) {
        setName(preset.name);
        setDraft(toThresholdDraft(preset.thresholds));
        setCandidates(null);
        setIsOpen(true);
    }

    function openManual() {
        setName('');
        setDraft(EMPTY_THRESHOLD_DRAFT);
        setCandidates(null);
        setIsOpen(true);
    }

    async function handleFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        // Reset the input so re-selecting the same file fires change again.
        event.target.value = '';
        if (!file) {
            return;
        }

        const parsed = parseImportPresetsFile(await file.text());
        if (!parsed) {
            toast.error('Invalid preset file');
            return;
        }

        const imported = importedPresetsForGeo(parsed, geo);
        if (imported.length === 0) {
            toast.error(`No preset for ${geo} in file`);
            return;
        }

        if (imported.length === 1) {
            prefill(imported[0]);
            return;
        }

        setCandidates(imported);
        setIsOpen(true);
    }

    const { isValid, thresholds } = parseThresholdDraft(draft);
    const trimmedName = name.trim();
    const canCreate = trimmedName !== '' && isValid;

    async function handleCreate() {
        if (!canCreate) {
            return;
        }

        await create(
            { geo, name: trimmedName, thresholds },
            {
                onSuccess() {
                    toast.success(`${geo} · ${trimmedName}`);
                    reset();
                },
                onError() {
                    toast.error('Failed to create preset');
                },
            }
        );
    }

    return (
        <section className="border-border flex flex-col gap-3 rounded-lg border border-dashed p-4">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">
                    {ui('createPreset', locale)} · {geo}
                </h3>
            </div>

            <input ref={fileInputRef} type="file" accept="application/json,.json" hidden onChange={handleFile} />

            {!isOpen && (
                <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={openManual}>
                        {ui('newPreset', locale)}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            fileInputRef.current?.click();
                        }}
                    >
                        {ui('importPreset', locale)}
                    </Button>
                </div>
            )}

            {isOpen && candidates && (
                <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground text-xs">{ui('chooseImport', locale)}</span>
                    {candidates.map((candidate, index) => {
                        return (
                            <div key={`${candidate.name}-${index}`}>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        prefill(candidate);
                                    }}
                                >
                                    {candidate.name}
                                </Button>
                            </div>
                        );
                    })}
                    <div>
                        <Button type="button" size="sm" variant="ghost" onClick={reset}>
                            {ui('cancel', locale)}
                        </Button>
                    </div>
                </div>
            )}

            {isOpen && !candidates && (
                <>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor={`create-${geo}-name`}>{ui('presetName', locale)}</Label>
                        <Input
                            id={`create-${geo}-name`}
                            type="text"
                            className="w-48"
                            disabled={isPending}
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                        />
                    </div>

                    <ThresholdFields
                        draft={draft}
                        idPrefix={`create-${geo}`}
                        disabled={isPending}
                        locale={locale}
                        onChange={setPair}
                    />

                    <div className="flex gap-2">
                        <Button type="button" size="sm" disabled={!canCreate || isPending} onClick={handleCreate}>
                            {isPending ? ui('creating', locale) : ui('create', locale)}
                        </Button>
                        <Button type="button" size="sm" variant="ghost" disabled={isPending} onClick={reset}>
                            {ui('cancel', locale)}
                        </Button>
                    </div>
                </>
            )}
        </section>
    );
}

export { PresetCreator };
