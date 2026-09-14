import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { toast } from 'sonner';
import { landingFor } from '@/lib/utils/auth/permissions';
import { focusFirstError } from '@/lib/utils/focusFirstError';
import { activateMutationOptions } from '@/services/auth/queries';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/Field';
import { activateFormSchema } from '../../schemas';

const routeApi = getRouteApi('/_unauthenticated/activate/');

function ActivateForm() {
    const navigate = routeApi.useNavigate();
    const token = routeApi.useSearch({
        select({ token: value }) {
            return value;
        },
    });
    const { mutateAsync: activate } = useMutation(activateMutationOptions());

    const form = useAppForm({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        validators: {
            onSubmit: activateFormSchema,
        },
        async onSubmit({ value, formApi }) {
            await activate(
                { token: token ?? '', password: value.password },
                {
                    onSuccess(me) {
                        navigate({ to: landingFor(me.role), replace: true });
                    },
                    onError(error) {
                        if (error instanceof Error && error.message) {
                            formApi.setErrorMap({
                                onSubmit: { fields: { password: { message: error.message } } },
                            });
                        } else {
                            toast.error('Activation failed');
                        }
                    },
                }
            );
        },
        onSubmitInvalid({ formApi }) {
            focusFirstError('#activate-form', formApi.state.errorMap.onSubmit);
        },
    });

    if (!token) {
        return (
            <div className="w-full max-w-md text-center">
                <h1 className="text-xl font-semibold">Invalid invitation</h1>
                <p className="text-muted-foreground mt-2 text-balance">
                    This invitation link is invalid or has expired. Ask the Head to send you a new one.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md p-6 md:p-8">
            <div className="mb-6 flex flex-col items-center text-center">
                <h1 className="text-xl font-semibold">Set your password</h1>
                <p className="text-muted-foreground text-balance">Choose a password to activate your account</p>
            </div>
            <form
                id="activate-form"
                noValidate={true}
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FieldSet>
                    <FieldGroup>
                        <form.AppField
                            name="password"
                            children={(field) => {
                                return (
                                    <field.FormFieldWrapper label="Password">
                                        <field.PasswordInputField
                                            placeholder="At least 8 characters"
                                            autoComplete="new-password"
                                        />
                                    </field.FormFieldWrapper>
                                );
                            }}
                        />
                        <form.AppField
                            name="confirmPassword"
                            children={(field) => {
                                return (
                                    <field.FormFieldWrapper label="Confirm password">
                                        <field.PasswordInputField
                                            placeholder="Re-enter password"
                                            autoComplete="new-password"
                                        />
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
                                            Activate account
                                        </Button>
                                    );
                                }}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>
        </div>
    );
}

export { ActivateForm };
