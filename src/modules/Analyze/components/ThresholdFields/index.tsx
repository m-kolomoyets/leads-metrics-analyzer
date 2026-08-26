import type { Locale, ThresholdMetric } from '@/components/report/utils/i18n';
import type { PresetThresholds } from '@/services/presets/types';
import { metricLabel, THRESHOLD_METRICS, ui, zoneLabel } from '@/components/report/utils/i18n';
import { Label } from '@/components/ui/Label';
import { clampBound } from '../../utils/zoneBounds';
import { ZoneRangeInput } from '../ZoneRangeInput';

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

// The five green→yellow / yellow→red bands as a labelled grid, one row per metric. Presentation
// only — draft state and save live in the parent (ThresholdEditor edits a version, PresetCreator
// mints v1).
//
// No meter under these rows. A meter earns its place where it shows how much room a bound leaves on
// a rail the reader knows the length of; these metrics are costs with no ceiling, so every rail here
// would have to invent its own end and five invented ends stacked at equal width invite exactly the
// comparison they cannot support. The tolerated-loss band keeps its meter — that one runs 0–100.
function ThresholdFields({ draft, idPrefix, disabled, locale, onChange }: ThresholdFieldsProps) {
    // A bound that was typed past its neighbour is pulled back to it once the field is left.
    function commitBound(metric: ThresholdMetric, bound: 'gy' | 'yr') {
        const pair = draft[metric];
        const clamped = clampBound(bound, pair[bound], bound === 'gy' ? pair.yr : pair.gy);

        if (clamped !== pair[bound]) {
            onChange(metric, bound, clamped);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {THRESHOLD_METRICS.map((metric) => {
                return (
                    <div key={metric} className="flex flex-wrap items-center gap-2.5">
                        <Label htmlFor={`${idPrefix}-${metric}-gy`} className="w-24 text-sm font-normal">
                            {metricLabel(metric, locale)}
                        </Label>
                        <ZoneRangeInput
                            idPrefix={`${idPrefix}-${metric}`}
                            green={draft[metric].gy}
                            yellow={draft[metric].yr}
                            greenLabel={zoneLabel('green', locale)}
                            yellowLabel={zoneLabel('yellow', locale)}
                            redLabel={zoneLabel('red', locale)}
                            greenAriaLabel={`${metricLabel(metric, locale)} ${ui('gy', locale)}`}
                            yellowAriaLabel={`${metricLabel(metric, locale)} ${ui('yr', locale)}`}
                            disabled={disabled}
                            onChange={(bound, value) => {
                                onChange(metric, bound, value);
                            }}
                            onCommit={(bound) => {
                                commitBound(metric, bound);
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export { ThresholdFields };
