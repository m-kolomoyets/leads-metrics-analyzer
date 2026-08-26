import type { Locale, ThresholdMetric } from '@/components/report/utils/i18n';
import type { PresetThresholds } from '@/services/presets/types';
import { metricLabel, THRESHOLD_METRICS, ui } from '@/components/report/utils/i18n';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

// One draft threshold pair, held as strings so a half-typed / empty field survives without collapsing
// to NaN. Shared by the inline editor (edit a version) and the creator (mint v1).
export type ThresholdDraft = Record<ThresholdMetric, { gy: string; yr: string }>;

export const EMPTY_THRESHOLD_DRAFT: ThresholdDraft = Object.fromEntries(
    THRESHOLD_METRICS.map((metric) => {
        return [metric, { gy: '', yr: '' }];
    })
) as ThresholdDraft;

export function toThresholdDraft(thresholds: PresetThresholds): ThresholdDraft {
    return Object.fromEntries(
        THRESHOLD_METRICS.map((metric) => {
            return [metric, { gy: String(thresholds[metric].gy), yr: String(thresholds[metric].yr) }];
        })
    ) as ThresholdDraft;
}

// A pair edit is empty or non-numeric → keep the field, block save. The server validates too.
function toNumber(value: string): number | null {
    const trimmed = value.trim();
    if (trimmed === '') {
        return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
}

// Folds a draft into typed thresholds plus a validity flag; unparseable pairs fall back to 0 so the
// shape is always complete, but `isValid` gates the save so the 0s never reach the server.
export function parseThresholdDraft(draft: ThresholdDraft): { isValid: boolean; thresholds: PresetThresholds } {
    let isValid = true;
    const thresholds = Object.fromEntries(
        THRESHOLD_METRICS.map((metric) => {
            const gy = toNumber(draft[metric].gy);
            const yr = toNumber(draft[metric].yr);
            if (gy === null || yr === null) {
                isValid = false;
            }
            return [metric, { gy: gy ?? 0, yr: yr ?? 0 }];
        })
    ) as PresetThresholds;

    return { isValid, thresholds };
}

type ThresholdFieldsProps = {
    draft: ThresholdDraft;
    idPrefix: string;
    disabled: boolean;
    locale: Locale;
    onChange: (metric: ThresholdMetric, bound: 'gy' | 'yr', value: string) => void;
};

// The five green→yellow / yellow→red pairs as a labelled grid. Presentation only — draft state and
// save live in the parent (ThresholdEditor edits a version, PresetCreator mints v1).
function ThresholdFields({ draft, idPrefix, disabled, locale, onChange }: ThresholdFieldsProps) {
    return (
        <div className="flex flex-col gap-2">
            {THRESHOLD_METRICS.map((metric) => {
                return (
                    <div key={metric} className="flex flex-wrap items-center gap-2.5">
                        <Label htmlFor={`${idPrefix}-${metric}-gy`} className="w-24 text-sm font-normal">
                            {metricLabel(metric, locale)}
                        </Label>
                        <span className="text-zone-green text-xs">{ui('zGreen', locale)}</span>
                        <Input
                            id={`${idPrefix}-${metric}-gy`}
                            type="number"
                            inputMode="decimal"
                            className="h-8 w-16 text-sm tabular-nums"
                            disabled={disabled}
                            value={draft[metric].gy}
                            onChange={(event) => {
                                onChange(metric, 'gy', event.target.value);
                            }}
                        />
                        <span className="text-warning text-xs">{ui('zYellow', locale)}</span>
                        <Input
                            id={`${idPrefix}-${metric}-yr`}
                            type="number"
                            inputMode="decimal"
                            className="h-8 w-16 text-sm tabular-nums"
                            aria-label={`${metricLabel(metric, locale)} ${ui('yr', locale)}`}
                            disabled={disabled}
                            value={draft[metric].yr}
                            onChange={(event) => {
                                onChange(metric, 'yr', event.target.value);
                            }}
                        />
                        <span className="text-zone-red text-xs">{ui('zRed', locale)}</span>
                    </div>
                );
            })}
        </div>
    );
}

export { ThresholdFields };
