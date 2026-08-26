import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { toast } from 'sonner';
import { focusFirstError } from '@/lib/utils/focusFirstError';
import { resetPasswordMutationOptions } from '@/services/auth/queries';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/Field';
import { resetPasswordFormSchema } from '../../schemas';

const routeApi = getRouteApi('/_unauthenticated/reset-password/');

function ResetPasswordForm() {
    const navigate = routeApi.useNavigate();
    const token = routeApi.useSearch({
        select({ token: value }) {
            return value;
        },
    });
    const { mutateAsync: resetPassword } = useMutation(resetPasswordMutationOptions());

    const form = useAppForm({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        validators: {
            onSubmit: resetPasswordFormSchema,
        },
        async onSubmit({ value, formApi }) {
            await resetPassword(
                { token: token ?? '', password: value.password },
                {
                    onSuccess() {
                        // Reset creates no session — bounce to /login to sign in fresh.
                        toast.success('Password reset. Sign in with your new password.');
                        navigate({ to: '/login', replace: true });
                    },
                    onError(error) {
                        if (error instanceof Error && error.message) {
                            formApi.setErrorMap({
                                onSubmit: { fields: { password: { message: error.message } } },
                            });
                        } else {
                            toast.error('Password reset failed');
                        }
                    },
                }
            );
        },
        onSubmitInvalid({ formApi }) {
            focusFirstError('#reset-password-form', formApi.state.errorMap.onSubmit);
        },
    });

    if (!token) {
        return (
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold">Invalid reset link</h1>
                <p className="text-muted-foreground mt-2 text-balance">
                    This reset link is invalid or has expired. Ask your Head to send you a new one.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md p-6 md:p-8">
            <div className="mb-6 flex flex-col items-center text-center">
                <h1 className="text-2xl font-semibold">Reset your password</h1>
                <p className="text-muted-foreground text-balance">Choose a new password for your account</p>
            </div>
            <form
                id="reset-password-form"
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
                                    <field.FormFieldWrapper label="New password">
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
                                            Reset password
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

export { ResetPasswordForm };
