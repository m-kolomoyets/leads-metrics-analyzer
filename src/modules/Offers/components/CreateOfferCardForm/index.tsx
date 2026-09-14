import type { CreateOfferCardFormProps } from './types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { createOfferCardMutationOptions } from '@/services/offers/queries';
import { createOfferCardInputSchema } from '@/services/offers/schemas';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldSet } from '@/components/ui/Field';
import { offerCardAnchor, PARSE_FAILURE_MESSAGES } from '../../constants';

// Paste-the-string form (offers-and-home/04). The server parses; this form only routes its verdicts:
// a parse failure lands under the string field naming the fragment, a duplicate live `offer_id`
// under the id field with a link to the card that already exists. Both are outcomes, not errors —
// nothing was saved, the author edits and resubmits.
function CreateOfferCardForm({ onSuccess }: CreateOfferCardFormProps) {
    const { mutateAsync: createOfferCard } = useMutation(createOfferCardMutationOptions());
    const [duplicateCardId, setDuplicateCardId] = useState<string | null>(null);

    const form = useAppForm({
        defaultValues: {
            offerId: '',
            rawString: '',
        },
        async onSubmit({ value, formApi }) {
            setDuplicateCardId(null);

            const parsed = createOfferCardInputSchema.safeParse(value);

            if (!parsed.success) {
                const findIssue = (field: string) => {
                    return parsed.error.issues.find((issue) => {
                        return issue.path[0] === field;
                    })?.message;
                };

                formApi.setErrorMap({
                    onSubmit: {
                        fields: {
                            offerId: { message: findIssue('offerId') },
                            rawString: { message: findIssue('rawString') },
                        },
                    },
                });

                return;
            }

            await createOfferCard(parsed.data, {
                onSuccess(result) {
                    if (result.ok) {
                        toast.success('Offer card created');
                        onSuccess(result.card);

                        return;
                    }

                    if (result.reason === 'parse') {
                        formApi.setErrorMap({
                            onSubmit: { fields: { rawString: { message: PARSE_FAILURE_MESSAGES[result.fragment] } } },
                        });

                        return;
                    }

                    setDuplicateCardId(result.existingCardId);
                },
                onError(error) {
                    toast.error(
                        error instanceof Error && error.message ? error.message : 'Failed to create offer card'
                    );
                },
            });
        },
    });

    return (
        <form
            id="create-offer-card-form"
            noValidate={true}
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldSet>
                <FieldGroup>
                    <form.AppField
                        name="offerId"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Offer ID">
                                    <field.InputField placeholder="13002" autoComplete="off" />
                                    {duplicateCardId && (
                                        <FieldError>
                                            A live card for this offer already exists —{' '}
                                            <Link
                                                to="/offers"
                                                hash={offerCardAnchor(duplicateCardId)}
                                                className="underline underline-offset-4"
                                            >
                                                open it
                                            </Link>
                                            .
                                        </FieldError>
                                    )}
                                </field.FormFieldWrapper>
                            );
                        }}
                    />
                    <form.AppField
                        name="rawString"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Offer string">
                                    <field.InputField
                                        placeholder="CL | Aldex | CPA | 27 USD | 5000 CLP | … | Falcons | MbChips"
                                        autoComplete="off"
                                    />
                                    <FieldDescription>
                                        Pasted as is. The payout (first USD/EUR amount) and the assignment (last two
                                        segments: team, recipient) are read from it.
                                    </FieldDescription>
                                </field.FormFieldWrapper>
                            );
                        }}
                    />
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
                                        Create card
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

export { CreateOfferCardForm };
