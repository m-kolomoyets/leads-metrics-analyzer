import type { ChangeAssignmentFormProps } from './types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changeOfferAssignmentMutationOptions, offerAssigneesQueryOptions } from '@/services/offers/queries';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldDescription, FieldGroup, FieldSet } from '@/components/ui/Field';
import { Loader } from '@/components/ui/Loader';

// Select values must be non-empty, so "whole team" travels as this sentinel and goes out as `null`.
// Ids are uuids, so it collides with nothing.
const WHOLE_TEAM = 'whole-team';

// Fix an Unresolved Assignment or reassign a card (offers-and-home/06, PRD story 8): a team from the
// list, then optionally one of its members. The buyer list narrows to the picked team so the two
// fields cannot contradict each other; the server re-checks the pick against the roster anyway and
// answers a stale one as data, which lands under the field that went wrong.
function ChangeAssignmentForm({ card, onSuccess }: ChangeAssignmentFormProps) {
    // `useQuery`, not suspense: the form sits in a dialog and must not tear it down while loading.
    const { data: assignees, isPending: isLoadingAssignees } = useQuery(offerAssigneesQueryOptions());
    const { mutateAsync: changeAssignment } = useMutation(changeOfferAssignmentMutationOptions());

    const form = useAppForm({
        defaultValues: {
            teamId: card.teamId ?? '',
            buyerUserId: card.buyerUserId ?? WHOLE_TEAM,
        },
        async onSubmit({ value, formApi }) {
            if (value.teamId === '') {
                formApi.setErrorMap({ onSubmit: { fields: { teamId: { message: 'Pick a team' } } } });

                return;
            }

            await changeAssignment(
                {
                    offerCardId: card.id,
                    teamId: value.teamId,
                    buyerUserId: value.buyerUserId === WHOLE_TEAM ? null : value.buyerUserId,
                },
                {
                    onSuccess(result) {
                        if (result.ok) {
                            toast.success('Assignment updated');
                            onSuccess(result.card);

                            return;
                        }

                        formApi.setErrorMap({
                            onSubmit: {
                                fields:
                                    result.reason === 'team'
                                        ? { teamId: { message: 'This team no longer exists' } }
                                        : { buyerUserId: { message: 'This user is not in the picked team' } },
                            },
                        });
                    },
                    onError(error) {
                        toast.error(
                            error instanceof Error && error.message ? error.message : 'Failed to change assignment'
                        );
                    },
                }
            );
        },
    });

    if (isLoadingAssignees || !assignees) {
        return (
            <div className="flex justify-center py-6">
                <Loader />
            </div>
        );
    }

    const teamItems = assignees.teams.map((team) => {
        return { value: team.id, label: team.name };
    });

    return (
        <form
            id="change-assignment-form"
            noValidate={true}
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldSet>
                <FieldGroup>
                    <form.AppField
                        name="teamId"
                        listeners={{
                            onChange() {
                                // A member belongs to one team: a new team drops the old buyer.
                                form.setFieldValue('buyerUserId', WHOLE_TEAM);
                            },
                        }}
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Team">
                                    <field.SelectField items={teamItems} placeholder="Pick a team" />
                                </field.FormFieldWrapper>
                            );
                        }}
                    />
                    <form.Subscribe
                        selector={(state) => {
                            return state.values.teamId;
                        }}
                        children={(teamId) => {
                            const buyerItems = [
                                { value: WHOLE_TEAM, label: 'Whole team' },
                                ...assignees.users
                                    .filter((member) => {
                                        return member.teamId === teamId;
                                    })
                                    .map((member) => {
                                        return { value: member.id, label: member.nickname };
                                    }),
                            ];

                            return (
                                <form.AppField
                                    name="buyerUserId"
                                    children={(field) => {
                                        return (
                                            <field.FormFieldWrapper label="Recipient">
                                                <field.SelectField items={buyerItems} disabled={teamId === ''} />
                                                <FieldDescription>
                                                    The string named &ldquo;{card.assignedTeamText} ·{' '}
                                                    {card.assignedRecipientText}&rdquo;; that text stays on the card.
                                                </FieldDescription>
                                            </field.FormFieldWrapper>
                                        );
                                    }}
                                />
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
                                        Save assignment
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

export { ChangeAssignmentForm };
