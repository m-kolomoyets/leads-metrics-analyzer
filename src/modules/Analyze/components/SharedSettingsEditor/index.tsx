import type { SharedSettingsPayload, SharedSettingsView } from '@/services/presets/types';
import type { Locale } from '../../utils/i18n';
import type { ImportedShared } from '../../utils/importPresets';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { saveSharedSettingsMutationOptions } from '@/services/presets/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { ui } from '../../utils/i18n';

type SharedSettingsEditorProps = {
    shared: SharedSettingsView | null;
    canEdit: boolean;
    locale: Locale;
    // Review-multiplier / default-commission lifted from an imported preset file. Seeds the initial
    // draft (over the saved payload); the parent remounts on a fresh import so this re-seeds.
    seed?: ImportedShared;
};

type SellerDraft = { rate: string; accountIds: string };

type Draft = {
    reviewMultiplier: string;
    defaultCommission: string;
    sellers: SellerDraft[];
};

const DEFAULTS: SharedSettingsPayload = { reviewMultiplier: 1, defaultCommission: 0, sellers: [] };

function toNumber(value: string): number | null {
    const trimmed = value.trim();
    if (trimmed === '') {
        return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
}

function toDraft(payload: SharedSettingsPayload): Draft {
    return {
        reviewMultiplier: String(payload.reviewMultiplier),
        defaultCommission: String(payload.defaultCommission),
        sellers: payload.sellers.map((seller) => {
            return { rate: String(seller.rate), accountIds: seller.accountIds.join(', ') };
        }),
    };
}

function parseAccountIds(value: string): string[] {
    return value
        .split(',')
        .map((id) => {
            return id.trim();
        })
        .filter((id) => {
            return id !== '';
        });
}

// Team-global tunables editor (S3, #23): review multiplier, default commission, and per-seller
// commission rules. Team-Lead-only write (`saveSharedSettingsFn` gates on role) — a non-lead sees the
// values disabled. Saving mints a new immutable shared-settings version; the query invalidates,
// `toRuleset` re-derives, and grading (Problem-Account escalation + Spend⁺) re-runs. Parent remounts
// on `activeVersionId` change to reset drafts to the saved values.
function SharedSettingsEditor({ shared, canEdit, locale, seed }: SharedSettingsEditorProps) {
    const [draft, setDraft] = useState<Draft>(() => {
        const base = shared?.payload ?? DEFAULTS;
        return toDraft(seed ? { ...base, ...seed } : base);
    });
    const { mutateAsync: saveShared, isPending } = useMutation(saveSharedSettingsMutationOptions());

    const reviewMultiplier = toNumber(draft.reviewMultiplier);
    const defaultCommission = toNumber(draft.defaultCommission);
    const sellerRates = draft.sellers.map((seller) => {
        return toNumber(seller.rate);
    });
    const isValid =
        reviewMultiplier !== null &&
        defaultCommission !== null &&
        sellerRates.every((rate) => {
            return rate !== null;
        });

    function setField(field: 'reviewMultiplier' | 'defaultCommission', value: string) {
        setDraft((current) => {
            return { ...current, [field]: value };
        });
    }

    function setSeller(index: number, field: keyof SellerDraft, value: string) {
        setDraft((current) => {
            return {
                ...current,
                sellers: current.sellers.map((seller, i) => {
                    return i === index ? { ...seller, [field]: value } : seller;
                }),
            };
        });
    }

    function addSeller() {
        setDraft((current) => {
            return { ...current, sellers: [...current.sellers, { rate: '', accountIds: '' }] };
        });
    }

    function removeSeller(index: number) {
        setDraft((current) => {
            return {
                ...current,
                sellers: current.sellers.filter((_seller, i) => {
                    return i !== index;
                }),
            };
        });
    }

    async function handleSave() {
        if (!isValid || reviewMultiplier === null || defaultCommission === null) {
            return;
        }
        const payload: SharedSettingsPayload = {
            reviewMultiplier,
            defaultCommission,
            sellers: draft.sellers.map((seller, index) => {
                return { rate: sellerRates[index] ?? 0, accountIds: parseAccountIds(seller.accountIds) };
            }),
        };

        await saveShared(
            { payload },
            {
                onSuccess() {
                    toast.success(ui('sharedSettings', locale));
                },
                onError() {
                    toast.error('Failed to save shared settings');
                },
            }
        );
    }

    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <h4 className="text-muted-foreground text-[11px] font-normal tracking-wider uppercase">
                    {ui('sharedSettings', locale)}
                </h4>
                {!canEdit && <span className="text-muted-foreground text-xs">{ui('readonly', locale)}</span>}
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                    <Tooltip>
                        {/* Whole label row is the trigger so hovering the text (not just the icon) opens the
                            tooltip; the inner button keeps it keyboard-reachable (focus bubbles to the trigger). */}
                        <TooltipTrigger
                            render={
                                <div className="flex w-fit items-center gap-1">
                                    <Label htmlFor="ss-review" className="cursor-help">
                                        {ui('reviewMultiplier', locale)}
                                    </Label>
                                    <button
                                        type="button"
                                        className="text-muted-foreground hover:text-foreground mb-1.5"
                                        aria-label={ui('reviewMultiplier', locale)}
                                    >
                                        <InfoIcon className="size-3.5" />
                                    </button>
                                </div>
                            }
                        />
                        <TooltipContent>
                            Коефіцієнт показує у скільки разів метрики акаунту більші за встановленні пороги
                        </TooltipContent>
                    </Tooltip>
                    <Input
                        id="ss-review"
                        type="number"
                        inputMode="decimal"
                        className="w-32"
                        disabled={!canEdit || isPending}
                        value={draft.reviewMultiplier}
                        onChange={(event) => {
                            setField('reviewMultiplier', event.target.value);
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="ss-commission">{ui('defaultCommission', locale)}</Label>
                    <Input
                        id="ss-commission"
                        type="number"
                        inputMode="decimal"
                        className="w-32"
                        disabled={!canEdit || isPending}
                        value={draft.defaultCommission}
                        onChange={(event) => {
                            setField('defaultCommission', event.target.value);
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs">{ui('sellers', locale)}</span>
                {draft.sellers.map((seller, index) => {
                    return (
                        // Sellers have no id; index is the stable key for these transient draft rows.
                        <div key={index} className="flex flex-wrap items-end gap-2">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor={`ss-seller-${index}-rate`}>{ui('rate', locale)}</Label>
                                <Input
                                    id={`ss-seller-${index}-rate`}
                                    type="number"
                                    inputMode="decimal"
                                    className="w-24"
                                    disabled={!canEdit || isPending}
                                    value={seller.rate}
                                    onChange={(event) => {
                                        setSeller(index, 'rate', event.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex flex-1 flex-col gap-1">
                                <Label htmlFor={`ss-seller-${index}-ids`}>{ui('accountIds', locale)}</Label>
                                <Input
                                    id={`ss-seller-${index}-ids`}
                                    type="text"
                                    disabled={!canEdit || isPending}
                                    value={seller.accountIds}
                                    onChange={(event) => {
                                        setSeller(index, 'accountIds', event.target.value);
                                    }}
                                />
                            </div>
                            {canEdit && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    disabled={isPending}
                                    onClick={() => {
                                        removeSeller(index);
                                    }}
                                >
                                    {ui('remove', locale)}
                                </Button>
                            )}
                        </div>
                    );
                })}
                {canEdit && (
                    <div>
                        <Button type="button" size="xs" variant="ghost" disabled={isPending} onClick={addSeller}>
                            + {ui('addSeller', locale)}
                        </Button>
                    </div>
                )}
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

export { SharedSettingsEditor };
