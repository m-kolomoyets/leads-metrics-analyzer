import type { ChangeEvent } from 'react';
import type { Locale, ThresholdMetric } from '@/components/report/utils/i18n';
import type { ImportedPreset, ImportedShared, ImportPresetsFile } from '../../utils/importPresets';
import type { ThresholdDraft } from '../ThresholdFields';
import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createPresetMutationOptions } from '@/services/presets/queries';
import { ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
    importedPresetsForGeo,
    importedSharedFor,
    importedSharedFrom,
    parseImportPresetsFile,
} from '../../utils/importPresets';
import { EMPTY_THRESHOLD_DRAFT, parseThresholdDraft, ThresholdFields, toThresholdDraft } from '../ThresholdFields';

type PresetCreatorProps = {
    geo: string;
    locale: Locale;
    // Invoked when an import carries team-global tunables (review multiplier, commission, waste zones),
    // so the page can seed the shared-settings editor with them — from the file's Geo-independent shared
    // block, or from the picked preset's own waste band. Optional — the presets manager reuses this
    // component but has no shared-settings surface to seed.
    onImportShared?: (shared: ImportedShared) => void;
};

// A preset for one Geo (S9/S15, #30): mint a fresh one or import from the prototype export
// (references/presets.json) and save it to the DB. Collapsed to a button row until the owner opens
// the form via New / Import; `createPresetFn` stamps them as owner + their team, mints v1 and sets it
// active, so grading immediately runs against it. Only mounted for a viewer authorised to own presets
// (dollar-dimension role). Parent keys this on the Geo, so switching Geo resets it.
function PresetCreator({ geo, locale, onImportShared }: PresetCreatorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [draft, setDraft] = useState<ThresholdDraft>(EMPTY_THRESHOLD_DRAFT);
    // Set only when an imported file holds several presets for this Geo — the owner picks one.
    const [candidates, setCandidates] = useState<ImportedPreset[] | null>(null);
    // The file behind those candidates, kept so the pick can resolve the shared tunables to seed.
    const [file, setFile] = useState<ImportPresetsFile | null>(null);
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
        setFile(null);
        setName('');
        setDraft(EMPTY_THRESHOLD_DRAFT);
    }

    // `source` defaults to the stored file (a candidate click); the single-preset path passes the file
    // it just parsed, before state has caught up.
    function prefill(preset: ImportedPreset, source = file) {
        setName(preset.name);
        setDraft(toThresholdDraft(preset.thresholds));
        setCandidates(null);
        setIsOpen(true);
        // Waste zones are a shared setting, so a band on the imported preset lands in that editor.
        const shared = source && importedSharedFor(source, preset);
        if (shared) {
            onImportShared?.(shared);
        }
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
        // One preset for this Geo → prefill straight away; that also seeds the shared tunables, letting
        // the preset's own waste band win over the file's shared one.
        if (imported.length === 1) {
            prefill(imported[0], parsed);
            return;
        }

        // Nothing picked yet, so only the Geo-independent shared block can be seeded — surfaced even
        // when this Geo has no preset in the file at all.
        const shared = importedSharedFrom(parsed);
        if (shared) {
            onImportShared?.(shared);
        }

        if (imported.length === 0) {
            toast.error(`No preset for ${geo} in file`);
            return;
        }

        setFile(parsed);
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
        <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <h4 className="text-muted-foreground text-xs font-normal tracking-wider uppercase">
                    {ui('createPreset', locale)} · {geo}
                </h4>
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
