import type { PresetThresholds, PresetView } from '@/services/presets/types';
import type { Locale, ThresholdMetric } from '../../utils/i18n';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { savePresetVersionMutationOptions } from '@/services/presets/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { metricLabel, THRESHOLD_METRICS, ui } from '../../utils/i18n';

type ThresholdEditorProps = {
    preset: PresetView;
    locale: Locale;
};

type Draft = Record<ThresholdMetric, { gy: string; yr: string }>;

// A pair edit is empty or non-numeric → keep the field, but block save; the server also validates.
function toNumber(value: string): number | null {
    const trimmed = value.trim();
    if (trimmed === '') {
        return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
}

function toDraft(thresholds: PresetThresholds): Draft {
    return Object.fromEntries(
        THRESHOLD_METRICS.map((metric) => {
            return [metric, { gy: String(thresholds[metric].gy), yr: String(thresholds[metric].yr) }];
        })
    ) as Draft;
}

// Inline threshold-pair editor for one Geo's active preset (S3, #23). Owner-only edit
// (`presetAccessFor` → 'edit'); a read viewer sees the values disabled. Saving mints a new immutable
// preset version and moves the active pointer (`savePresetVersionFn`) — the list query invalidates,
// `toRuleset` re-derives, and grading re-runs. Parent remounts this on `activeVersionId` change, so
// local drafts reset to the freshly-saved values with no effect.
function ThresholdEditor({ preset, locale }: ThresholdEditorProps) {
    const canEdit = preset.access === 'edit';
    const [draft, setDraft] = useState<Draft>(() => {
        return toDraft(preset.thresholds ?? EMPTY);
    });
    const { mutateAsync: saveVersion, isPending } = useMutation(savePresetVersionMutationOptions());

    function setPair(metric: ThresholdMetric, bound: 'gy' | 'yr', value: string) {
        setDraft((current) => {
            return { ...current, [metric]: { ...current[metric], [bound]: value } };
        });
    }

    const numbers = THRESHOLD_METRICS.map((metric) => {
        return { metric, gy: toNumber(draft[metric].gy), yr: toNumber(draft[metric].yr) };
    });
    const isValid = numbers.every((row) => {
        return row.gy !== null && row.yr !== null;
    });

    async function handleSave() {
        if (!isValid) {
            return;
        }
        const thresholds = Object.fromEntries(
            numbers.map((row) => {
                return [row.metric, { gy: row.gy, yr: row.yr }];
            })
        ) as PresetThresholds;

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

    return (
        <section className="border-border flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">
                    {ui('thresholds', locale)} · {preset.name}
                </h3>
                {!canEdit && <span className="text-muted-foreground text-xs">{ui('readonly', locale)}</span>}
            </div>

            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-2">
                <span />
                <span className="text-muted-foreground text-xs">{ui('gy', locale)}</span>
                <span className="text-muted-foreground text-xs">{ui('yr', locale)}</span>
                {THRESHOLD_METRICS.map((metric) => {
                    return (
                        <div key={metric} className="contents">
                            <Label htmlFor={`th-${preset.id}-${metric}-gy`}>{metricLabel(metric, locale)}</Label>
                            <Input
                                id={`th-${preset.id}-${metric}-gy`}
                                type="number"
                                inputMode="decimal"
                                className="w-24"
                                disabled={!canEdit || isPending}
                                value={draft[metric].gy}
                                onChange={(event) => {
                                    setPair(metric, 'gy', event.target.value);
                                }}
                            />
                            <Input
                                id={`th-${preset.id}-${metric}-yr`}
                                type="number"
                                inputMode="decimal"
                                className="w-24"
                                aria-label={`${metricLabel(metric, locale)} ${ui('yr', locale)}`}
                                disabled={!canEdit || isPending}
                                value={draft[metric].yr}
                                onChange={(event) => {
                                    setPair(metric, 'yr', event.target.value);
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {canEdit && (
                <div>
                    <Button type="button" size="sm" disabled={!isValid || isPending} onClick={handleSave}>
                        {isPending ? ui('saving', locale) : ui('save', locale)}
                    </Button>
                </div>
            )}
        </section>
    );
}

const EMPTY: PresetThresholds = {
    installs: { gy: 0, yr: 0 },
    regs: { gy: 0, yr: 0 },
    sales: { gy: 0, yr: 0 },
    clicks: { gy: 0, yr: 0 },
    wasteZones: { gy: 0, yr: 0 },
};

export { ThresholdEditor };
