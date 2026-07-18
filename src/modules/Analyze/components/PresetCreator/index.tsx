import type { Locale, ThresholdMetric } from '../../utils/i18n';
import type { ThresholdDraft } from '../ThresholdFields';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createPresetMutationOptions } from '@/services/presets/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ui } from '../../utils/i18n';
import { EMPTY_THRESHOLD_DRAFT, parseThresholdDraft, ThresholdFields } from '../ThresholdFields';

type PresetCreatorProps = {
    geo: string;
    locale: Locale;
};

// Create the first preset for an ungraded Geo (S9/S15, #30): name + the five threshold pairs. Only
// mounted for a viewer authorised to own presets (dollar-dimension role). `createPresetFn` stamps the
// creator as owner + their team, mints v1 and sets it active; the list query invalidates, `toRuleset`
// re-derives, and grading immediately runs against the new preset. Parent keys this on the Geo, so
// switching Geo resets the draft.
function PresetCreator({ geo, locale }: PresetCreatorProps) {
    const [name, setName] = useState('');
    const [draft, setDraft] = useState<ThresholdDraft>(EMPTY_THRESHOLD_DRAFT);
    const { mutateAsync: create, isPending } = useMutation(createPresetMutationOptions());

    function setPair(metric: ThresholdMetric, bound: 'gy' | 'yr', value: string) {
        setDraft((current) => {
            return { ...current, [metric]: { ...current[metric], [bound]: value } };
        });
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
                    setName('');
                    setDraft(EMPTY_THRESHOLD_DRAFT);
                },
                onError() {
                    toast.error('Failed to create preset');
                },
            }
        );
    }

    return (
        <section className="border-border flex flex-col gap-3 rounded-lg border border-dashed p-4">
            <h3 className="text-sm font-medium">
                {ui('createPreset', locale)} · {geo}
            </h3>

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

            <div>
                <Button type="button" size="sm" disabled={!canCreate || isPending} onClick={handleCreate}>
                    {isPending ? ui('creating', locale) : ui('create', locale)}
                </Button>
            </div>
        </section>
    );
}

export { PresetCreator };
