import type { EditUserFormProps } from './types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUserMutationOptions } from '@/services/admin/queries';
import { updateUserInputSchema } from '@/services/admin/schemas';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/Field';
import { NO_TEAM_VALUE, ROLE_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { buildUpdateUserPayload } from '../../utils/buildUpdateUserPayload';
import { buildTeamOptions } from '../../utils/teamOptions';

// Edit a user's nickname / role / team / status (T4b, #6). Email is immutable here. Only changed fields are
// sent (buildUpdateUserPayload) — an unchanged submit is a no-op that skips the request.
function EditUserForm({ user, teams, onSuccess }: EditUserFormProps) {
    const { mutateAsync: updateUser } = useMutation(updateUserMutationOptions());
    const teamOptions = buildTeamOptions(teams);

    const form = useAppForm({
        defaultValues: {
            nickname: user.nickname,
            role: user.role,
            status: user.status,
            teamId: user.teamId ?? NO_TEAM_VALUE,
        },
        async onSubmit({ value, formApi }) {
            const payload = buildUpdateUserPayload(user, value, NO_TEAM_VALUE);

            // Nothing changed — no PATCH to send (the API rejects an empty update).
            if (Object.keys(payload).length === 1) {
                onSuccess();

                return;
            }

            // Nickname is required; a cleared field must not reach the API as a blank handle.
            const parsed = updateUserInputSchema.safeParse(payload);

            if (!parsed.success) {
                const message = parsed.error.issues.find((issue) => {
                    return issue.path[0] === 'nickname';
                })?.message;

                formApi.setErrorMap({
                    onSubmit: { fields: { nickname: { message: message ?? 'Invalid input' } } },
                });

                return;
            }

            await updateUser(payload, {
                onSuccess() {
                    toast.success('User updated');
                    onSuccess();
                },
                onError(error) {
                    if (error instanceof Error && error.message) {
                        formApi.setErrorMap({ onSubmit: { fields: { role: { message: error.message } } } });
                    } else {
                        toast.error('Failed to update user');
                    }
                },
            });
        },
    });

    return (
        <form
            id="edit-user-form"
            noValidate={true}
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                    </Field>
                    <form.AppField
                        name="nickname"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="Nickname">
                                    <field.InputField placeholder="How the team calls them" />
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
                                        Save changes
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

export { EditUserForm };
