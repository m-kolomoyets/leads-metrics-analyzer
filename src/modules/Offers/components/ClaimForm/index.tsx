import type { ClaimFormValues } from './schemas';
import type { ClaimFormProps } from './types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateOfferClaimMutationOptions } from '@/services/offers/queries';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldDescription, FieldGroup, FieldSet } from '@/components/ui/Field';
import { claimFormSchema } from './schemas';

// The Advertiser Claim editor (offers-and-home/07). One set of three optional counts; saving
// overwrites whatever was there (PRD story 19) — an empty box clears that figure.
const toFieldValue = (figure: number | null): string => {
    return figure === null ? '' : String(figure);
};

const CLAIM_FIELDS = [
    { name: 'installs', label: 'Installs' },
    { name: 'regs', label: 'Registrations' },
    { name: 'sales', label: 'Sales' },
] as const satisfies readonly { name: keyof ClaimFormValues; label: string }[];

function ClaimForm({ card, onSuccess }: ClaimFormProps) {
    const { mutateAsync: updateClaim } = useMutation(updateOfferClaimMutationOptions());

    const form = useAppForm({
        defaultValues: {
            installs: toFieldValue(card.claim.installs),
            regs: toFieldValue(card.claim.regs),
            sales: toFieldValue(card.claim.sales),
        } satisfies ClaimFormValues,
        validators: {
            onSubmit: claimFormSchema,
        },
        async onSubmit({ value }) {
            // The submit validator above has already accepted the strings; this is the same schema
            // producing the counts.
            const claim = claimFormSchema.parse(value);

            await updateClaim(
                { offerCardId: card.id, ...claim },
                {
                    onSuccess() {
                        toast.success('Advertiser claim saved');
                        onSuccess();
                    },
                    onError(error) {
                        toast.error(
                            error instanceof Error && error.message ? error.message : 'Failed to save the claim'
                        );
                    },
                }
            );
        },
    });

    return (
        <form
            id={`claim-form-${card.id}`}
            noValidate={true}
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldSet>
                <FieldGroup>
                    {CLAIM_FIELDS.map((claimField) => {
                        return (
                            <form.AppField
                                key={claimField.name}
                                name={claimField.name}
                                children={(field) => {
                                    return (
                                        <field.FormFieldWrapper label={claimField.label}>
                                            <field.InputField
                                                inputMode="numeric"
                                                autoComplete="off"
                                                placeholder="not declared"
                                            />
                                        </field.FormFieldWrapper>
                                    );
                                }}
                            />
                        );
                    })}
                    <FieldDescription>
                        The advertiser&apos;s promised figures for this offer, not measured ones. Leave a box empty for
                        anything the advertiser did not state.
                    </FieldDescription>
                    <Field>
                        <form.Subscribe
                            selector={(state) => {
                                return [state.canSubmit, state.isSubmitting];
                            }}
                            children={([canSubmit, isSubmitting]) => {
                                return (
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={!canSubmit}
                                        isLoading={isSubmitting}
                                    >
                                        Save claim
                                    </Button>
                                );
                            }}
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

export { ClaimForm };
