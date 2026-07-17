import type { TeamsSectionProps } from './types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTeamMutationOptions } from '@/services/admin/queries';
import { createTeamInputSchema } from '@/services/admin/schemas';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup } from '@/components/ui/Field';
import { buildLeadOptions } from '../../utils/teamOptions';
import { TeamRow } from '../TeamRow';

// Teams management (T4b, #6): create a team and designate its lead. Setting a lead also places that
// user on the team server-side (single transaction), so the users list is invalidated alongside.
function TeamsSection({ users, teams }: TeamsSectionProps) {
    const { mutateAsync: createTeam } = useMutation(createTeamMutationOptions());
    const leadOptions = buildLeadOptions(users);

    const form = useAppForm({
        defaultValues: { name: '' },
        validators: { onSubmit: createTeamInputSchema },
        async onSubmit({ value, formApi }) {
            await createTeam(value, {
                onSuccess() {
                    toast.success('Team created');
                    formApi.reset();
                },
                onError(error) {
                    if (error instanceof Error && error.message) {
                        formApi.setErrorMap({ onSubmit: { fields: { name: { message: error.message } } } });
                    } else {
                        toast.error('Failed to create team');
                    }
                },
            });
        },
    });

    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Teams</h2>

            <form
                className="flex items-start gap-2"
                noValidate={true}
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FieldGroup className="flex-1">
                    <form.AppField
                        name="name"
                        children={(field) => {
                            return (
                                <field.FormFieldWrapper label="New team">
                                    <field.InputField placeholder="Team name" />
                                </field.FormFieldWrapper>
                            );
                        }}
                    />
                </FieldGroup>
                <Field className="w-auto mt-6.5">
                    <form.Subscribe
                        selector={(state) => {
                            return [state.canSubmit, state.isSubmitting];
                        }}
                        children={([canSubmit, isSubmitting]) => {
                            return (
                                <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting}>
                                    Create team
                                </Button>
                            );
                        }}
                    />
                </Field>
            </form>

            <div className="overflow-x-auto rounded-lg border">
                {/* table-fixed + explicit column widths: a row toggling to rename / delete-confirm must
                    not resize columns (no layout shift). Actions column is sized for its widest state. */}
                <table className="w-full min-w-3xl table-fixed text-sm">
                    <colgroup>
                        <col />
                        <col className="w-72" />
                        <col className="w-64" />
                    </colgroup>
                    <thead className="text-muted-foreground border-b">
                        <tr>
                            <th className="px-3 py-2 text-left font-medium">Team</th>
                            <th className="px-3 py-2 text-left font-medium">Lead</th>
                            <th className="px-3 py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        {teams.length === 0 && (
                            <tr>
                                <td className="text-muted-foreground px-3 py-4" colSpan={3}>
                                    No teams yet.
                                </td>
                            </tr>
                        )}
                        {teams.map((team) => {
                            return <TeamRow key={team.id} team={team} leadOptions={leadOptions} />;
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export { TeamsSection };
