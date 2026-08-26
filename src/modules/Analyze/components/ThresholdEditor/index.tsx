import type { ReactNode } from 'react';
import type { Locale, ThresholdMetric } from '@/components/report/utils/i18n';
import type { PresetView } from '@/services/presets/types';
import type { ThresholdDraft } from '../ThresholdFields';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    deletePresetMutationOptions,
    renamePresetMutationOptions,
    savePresetVersionMutationOptions,
} from '@/services/presets/queries';
import { THRESHOLD_METRICS, ui } from '@/components/report/utils/i18n';
import { AccordionPanel } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { EMPTY_THRESHOLD_DRAFT, parseThresholdDraft, ThresholdFields, toThresholdDraft } from '../ThresholdFields';

type ThresholdEditorProps = {
    preset: PresetView;
    locale: Locale;
    // Header slot (accordion trigger + preset picker). When given, the save button joins it on the same
    // row so the header reads "title · geo … preset … save", and everything below moves into an
    // `AccordionPanel` — i.e. passing `header` means "I am the header row of an enclosing AccordionItem".
    // Without it (the Presets page) the editor renders flat, as before.
    header?: ReactNode;
    // Panel slots, rendered only in accordion mode: `panelLeft` sits under the threshold fields in the
    // left column, `panelRight` is the second column. They live here rather than beside the editor
    // because the panel must be a descendant of the same AccordionItem as the header.
    panelLeft?: ReactNode;
    panelRight?: ReactNode;
    // Drives the unsaved marker: a collapsed panel must not look clean while a draft is pending.
    collapsed?: boolean;
};

// Inline threshold-pair + rename editor for one Geo's active preset (S3, #23/#30). Anyone who can see
// the preset may edit it (`presetAccessFor` → 'edit'); a read viewer sees the values disabled. Saving
// thresholds mints a new immutable preset version and moves the active pointer; rename touches
// identity only (no version). Either invalidates the list query, `toRuleset` re-derives, grading
// re-runs. Parent remounts this on `activeVersionId`/name change, so local drafts reset with no effect.
function ThresholdEditor({ preset, locale, header, panelLeft, panelRight, collapsed }: ThresholdEditorProps) {
    const canEdit = preset.access === 'edit';
    const saved = preset.thresholds ? toThresholdDraft(preset.thresholds) : EMPTY_THRESHOLD_DRAFT;
    const [draft, setDraft] = useState<ThresholdDraft>(() => {
        return saved;
    });
    const [name, setName] = useState(preset.name);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const { mutateAsync: saveVersion, isPending: isSaving } = useMutation(savePresetVersionMutationOptions());
    const { mutateAsync: rename, isPending: isRenaming } = useMutation(renamePresetMutationOptions());
    const { mutateAsync: remove, isPending: isDeleting } = useMutation(deletePresetMutationOptions());

    function setPair(metric: ThresholdMetric, bound: 'gy' | 'yr', value: string) {
        setDraft((current) => {
            return { ...current, [metric]: { ...current[metric], [bound]: value } };
        });
    }

    const { isValid, thresholds } = parseThresholdDraft(draft);
    // Ruleset Versions are immutable (ADR-0002/0011), so saving an unchanged draft would mint a version
    // identical to the last one — cheap to do by accident now that the fields can be collapsed away.
    const isDirty = THRESHOLD_METRICS.some((metric) => {
        return draft[metric].gy !== saved[metric].gy || draft[metric].yr !== saved[metric].yr;
    });
    const trimmedName = name.trim();
    const canRename = trimmedName !== '' && trimmedName !== preset.name;

    async function handleSave() {
        if (!isValid) {
            return;
        }

        await saveVersion(
            { presetId: preset.id, thresholds },
            {
                onSuccess() {
                    toast.success(`${preset.geo} · ${preset.name}`);
                },
                onError() {
                    toast.error('Failed to save thresholds');
                },
            }
        );
    }

    async function handleRename() {
        if (!canRename) {
            return;
        }

        await rename(
            { presetId: preset.id, name: trimmedName },
            {
                onSuccess() {
                    toast.success(`${preset.geo} · ${trimmedName}`);
                },
                onError() {
                    toast.error('Failed to rename preset');
                },
            }
        );
    }

    async function handleDelete() {
        await remove(
            { presetId: preset.id },
            {
                onSuccess() {
                    toast.success(`${preset.geo} · ${preset.name}`);
                },
                onError() {
                    toast.error('Failed to delete preset');
                },
            }
        );
    }

    const saveButton = canEdit && (
        <Button type="button" size="sm" disabled={!isValid || !isDirty || isSaving} onClick={handleSave}>
            {isSaving ? ui('saving', locale) : ui('save', locale)}
        </Button>
    );

    const body = (
        <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                    {ui('thresholds', locale)} · {preset.name}
                </h4>
                {!canEdit && <span className="text-muted-foreground text-xs">{ui('readonly', locale)}</span>}
            </div>

            {canEdit && (
                <div className="flex items-end gap-2">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor={`th-${preset.id}-name`}>{ui('presetName', locale)}</Label>
                        <Input
                            id={`th-${preset.id}-name`}
                            type="text"
                            className="w-48"
                            disabled={isRenaming}
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                        />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={!canRename || isRenaming}
                        onClick={handleRename}
                    >
                        {isRenaming ? ui('renaming', locale) : ui('rename', locale)}
                    </Button>
                </div>
            )}

            <ThresholdFields
                draft={draft}
                idPrefix={`th-${preset.id}`}
                disabled={!canEdit || isSaving}
                locale={locale}
                onChange={setPair}
            />

            {canEdit && (
                <div className="flex items-center gap-2 justify-start">
                    {!header && saveButton}
                    {!isConfirmingDelete && (
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => {
                                setIsConfirmingDelete(true);
                            }}
                        >
                            {ui('delete', locale)}
                        </Button>
                    )}
                    {isConfirmingDelete && (
                        <>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={handleDelete}
                            >
                                {isDeleting ? ui('deleting', locale) : ui('confirmDelete', locale)}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={isDeleting}
                                onClick={() => {
                                    setIsConfirmingDelete(false);
                                }}
                            >
                                {ui('cancel', locale)}
                            </Button>
                        </>
                    )}
                </div>
            )}
        </section>
    );

    if (!header) {
        return body;
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-3">
                {header}
                {canEdit && isDirty && collapsed && (
                    <span
                        className="bg-primary size-1.5 shrink-0 rounded-full"
                        role="status"
                        aria-label={ui('unsaved', locale)}
                    />
                )}
                {saveButton}
            </div>
            <AccordionPanel>
                <div className="flex flex-col gap-4 pt-4 lg:flex-row lg:items-start">
                    <div className="flex flex-1 flex-col gap-4">
                        {body}
                        {panelLeft}
                    </div>
                    {panelRight}
                </div>
            </AccordionPanel>
        </>
    );
}

export { ThresholdEditor };
