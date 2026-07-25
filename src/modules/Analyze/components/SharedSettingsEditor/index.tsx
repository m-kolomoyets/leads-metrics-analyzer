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
    // Review-multiplier / default-commission / waste zones lifted from an imported preset file. Seeds
    // the initial draft (over the saved payload); the parent remounts on a fresh import so this
    // re-seeds. Still needs an explicit Save to mint a version.
    seed?: ImportedShared;
    // Fired once a save lands, so the parent can drop the `seed` it is holding. Without this the seed
    // outlives the save: the parent remounts this editor on the new `activeVersionId`, the stale seed
    // wins over the payload just written, and the next save re-writes the imported values — the edit
    // reads as "nothing was saved".
    onSaved?: () => void;
};

type SellerDraft = { rate: string; accountIds: string };

type Draft = {
    reviewMultiplier: string;
    defaultCommission: string;
    wasteZones: { gy: string; yr: string };
    sellers: SellerDraft[];
};

const DEFAULTS: SharedSettingsPayload = {
    reviewMultiplier: 1,
    defaultCommission: 0,
    wasteZones: { gy: 0, yr: 0 },
    sellers: [],
};

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
        wasteZones: { gy: String(payload.wasteZones.gy), yr: String(payload.wasteZones.yr) },
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
function SharedSettingsEditor({ shared, canEdit, locale, seed, onSaved }: SharedSettingsEditorProps) {
    const [draft, setDraft] = useState<Draft>(() => {
        const base = shared?.payload ?? DEFAULTS;
        return toDraft(seed ? { ...base, ...seed } : base);
    });
    const { mutateAsync: saveShared, isPending } = useMutation(saveSharedSettingsMutationOptions());

    const reviewMultiplier = toNumber(draft.reviewMultiplier);
    const defaultCommission = toNumber(draft.defaultCommission);
    const wasteGy = toNumber(draft.wasteZones.gy);
    const wasteYr = toNumber(draft.wasteZones.yr);
    const sellerRates = draft.sellers.map((seller) => {
        return toNumber(seller.rate);
    });
    const isValid =
        reviewMultiplier !== null &&
        defaultCommission !== null &&
        wasteGy !== null &&
        wasteYr !== null &&
        sellerRates.every((rate) => {
            return rate !== null;
        });

    function setField(field: 'reviewMultiplier' | 'defaultCommission', value: string) {
        setDraft((current) => {
            return { ...current, [field]: value };
        });
    }

    function setWasteBound(bound: 'gy' | 'yr', value: string) {
        setDraft((current) => {
            return { ...current, wasteZones: { ...current.wasteZones, [bound]: value } };
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
            wasteZones: { gy: wasteGy ?? 0, yr: wasteYr ?? 0 },
            sellers: draft.sellers.map((seller, index) => {
                return { rate: sellerRates[index] ?? 0, accountIds: parseAccountIds(seller.accountIds) };
            }),
        };

        await saveShared(
            { payload },
            {
                onSuccess() {
                    toast.success(ui('sharedSettings', locale));
                    onSaved?.();
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

            {/* Tolerated-loss band (% of Spend⁺). Same green→yellow→red shape as a threshold pair, but a
                team-global policy, so it saves with the shared settings rather than a preset version. */}
            <div className="border-border/60 flex flex-col gap-2 border-t pt-3">
                <h5 className="text-muted-foreground text-[11px] font-normal tracking-wider uppercase">
                    {ui('wasteRange', locale)}
                </h5>
                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-success text-[11px]">{ui('zGreen', locale)}</span>
                    <Input
                        id="ss-waste-gy"
                        type="number"
                        inputMode="decimal"
                        className="h-8 w-16 font-mono text-[13px]"
                        aria-label={`${ui('wasteRange', locale)} ${ui('gy', locale)}`}
                        disabled={!canEdit || isPending}
                        value={draft.wasteZones.gy}
                        onChange={(event) => {
                            setWasteBound('gy', event.target.value);
                        }}
                    />
                    <span className="text-warning text-[11px]">{ui('zYellow', locale)}</span>
                    <Input
                        id="ss-waste-yr"
                        type="number"
                        inputMode="decimal"
                        className="h-8 w-16 font-mono text-[13px]"
                        aria-label={`${ui('wasteRange', locale)} ${ui('yr', locale)}`}
                        disabled={!canEdit || isPending}
                        value={draft.wasteZones.yr}
                        onChange={(event) => {
                            setWasteBound('yr', event.target.value);
                        }}
                    />
                    <span className="text-danger text-[11px]">{ui('zRed', locale)}</span>
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
