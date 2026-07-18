import type { PresetView } from '@/services/presets/types';
import type { Locale, ThresholdMetric } from '../../utils/i18n';
import type { ThresholdDraft } from '../ThresholdFields';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { renamePresetMutationOptions, savePresetVersionMutationOptions } from '@/services/presets/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ui } from '../../utils/i18n';
import { EMPTY_THRESHOLD_DRAFT, parseThresholdDraft, ThresholdFields, toThresholdDraft } from '../ThresholdFields';

type ThresholdEditorProps = {
    preset: PresetView;
    locale: Locale;
};

// Inline threshold-pair + rename editor for one Geo's active preset (S3, #23/#30). Owner-only edit
// (`presetAccessFor` → 'edit'); a read viewer sees the values disabled and no rename. Saving
// thresholds mints a new immutable preset version and moves the active pointer; rename touches
// identity only (no version). Either invalidates the list query, `toRuleset` re-derives, grading
// re-runs. Parent remounts this on `activeVersionId`/name change, so local drafts reset with no effect.
function ThresholdEditor({ preset, locale }: ThresholdEditorProps) {
    const canEdit = preset.access === 'edit';
    const [draft, setDraft] = useState<ThresholdDraft>(() => {
        return preset.thresholds ? toThresholdDraft(preset.thresholds) : EMPTY_THRESHOLD_DRAFT;
    });
    const [name, setName] = useState(preset.name);
    const { mutateAsync: saveVersion, isPending: isSaving } = useMutation(savePresetVersionMutationOptions());
    const { mutateAsync: rename, isPending: isRenaming } = useMutation(renamePresetMutationOptions());

    function setPair(metric: ThresholdMetric, bound: 'gy' | 'yr', value: string) {
        setDraft((current) => {
            return { ...current, [metric]: { ...current[metric], [bound]: value } };
        });
    }

    const { isValid, thresholds } = parseThresholdDraft(draft);
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

    return (
        <section className="border-border flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">
                    {ui('thresholds', locale)} · {preset.name}
                </h3>
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
                <div>
                    <Button type="button" size="sm" disabled={!isValid || isSaving} onClick={handleSave}>
                        {isSaving ? ui('saving', locale) : ui('save', locale)}
                    </Button>
                </div>
            )}
        </section>
    );
}

export { ThresholdEditor };
