import type { CreateUserFormProps } from './types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createUserMutationOptions } from '@/services/admin/queries';
import { createUserInputSchema } from '@/services/admin/schemas';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/Field';
import { NO_TEAM_VALUE, ROLE_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { buildTeamOptions } from '../../utils/teamOptions';
import { InviteLink } from '../InviteLink';

// Create-user form (T4b, #6). Consumes the Head-only admin API. The team Select carries a sentinel
// for "no team" (teamless roles / pre-placement buyers) which maps back to null on submit. An invited
// user returns a one-time activation token (T4c) — surfaced as a copyable link before the sheet closes.
function CreateUserForm({ teams, onSuccess }: CreateUserFormProps) {
    const { mutateAsync: createUser } = useMutation(createUserMutationOptions());
    const teamOptions = buildTeamOptions(teams);
    const [activationToken, setActivationToken] = useState<string | null>(null);

    const form = useAppForm({
        defaultValues: {
            email: '',
            role: 'buyer',
            status: 'invited',
            teamId: NO_TEAM_VALUE,
        },
        async onSubmit({ value, formApi }) {
            const parsed = createUserInputSchema.safeParse({
                email: value.email,
                role: value.role,
                status: value.status,
                teamId: value.teamId === NO_TEAM_VALUE ? null : value.teamId,
            });

            if (!parsed.success) {
                const emailIssue = parsed.error.issues.find((issue) => {
                    return issue.path[0] === 'email';
                });
                formApi.setErrorMap({
                    onSubmit: { fields: { email: { message: emailIssue?.message ?? 'Invalid input' } } },
                });

                return;
            }

            await createUser(parsed.data, {
                onSuccess(created) {
                    toast.success('User created');

                    // Invited user → keep the sheet open to reveal the activation link. An active
                    // create has no token, so close straight away.
                    if (created.activationToken) {
                        setActivationToken(created.activationToken);
                    } else {
                        onSuccess();
                    }
                },
                onError(error) {
                    if (error instanceof Error && error.message) {
                        formApi.setErrorMap({ onSubmit: { fields: { email: { message: error.message } } } });
                    } else {
                        toast.error('Failed to create user');
                    }
                },
            });
        },
    });

    if (activationToken) {
        return (
            <div className="flex flex-col gap-4">
                <InviteLink token={activationToken} />
                <Button
                    className="w-full"
                    onClick={() => {
                        onSuccess();
                    }}
                >
                    Done
                </Button>
            </div>
        );
    }

    return (
        <form
            id="create-user-form"
            noValidate={true}
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldSet>
                <FieldGroup>
                    <form.AppField
                        name="email"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Email">
                                    <field.InputField type="email" placeholder="you@example.com" />
                                </field.FormFieldWrapper>
                            );
                        }}
                    />
                    <form.AppField
                        name="role"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Role">
                                    <field.SelectField items={ROLE_OPTIONS} placeholder="Select role" />
                                </field.FormFieldWrapper>
                            );
                        }}
                    />
                    <form.AppField
                        name="teamId"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Team">
                                    <field.SelectField items={teamOptions} placeholder="Select team" />
                                </field.FormFieldWrapper>
                            );
                        }}
                    />
                    <form.AppField
                        name="status"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Status">
                                    <field.SelectField items={STATUS_OPTIONS} placeholder="Select status" />
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
                                        Create user
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

export { CreateUserForm };
