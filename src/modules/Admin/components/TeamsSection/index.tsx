import type { TeamsSectionProps } from './types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTeamMutationOptions } from '@/services/admin/queries';
import { createTeamInputSchema } from '@/services/admin/schemas';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, FieldGroup } from '@/components/ui/Field';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
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

            <Card>
                {/* table-fixed + explicit column widths: a row toggling to rename / delete-confirm must
                    not resize columns (no layout shift). Actions column is sized for its widest state. */}
                <Table className="min-w-3xl table-fixed">
                    <colgroup>
                        <col />
                        <col className="w-72" />
                        <col className="w-64" />
                    </colgroup>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Team</TableHead>
                            <TableHead>Lead</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teams.length === 0 && (
                            <TableRow>
                                <TableCell className="text-muted-foreground" colSpan={3}>
                                    No teams yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {teams.map((team) => {
                            return <TeamRow key={team.id} team={team} leadOptions={leadOptions} />;
                        })}
                    </TableBody>
                </Table>
            </Card>
        </section>
    );
}

export { TeamsSection };
