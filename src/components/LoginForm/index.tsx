import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { toast } from 'sonner';
import { landingFor } from '@/lib/utils/auth/permissions';
import { focusFirstError } from '@/lib/utils/focusFirstError';
import { loginMutationOptions } from '@/services/auth/queries';
import { loginInputSchema } from '@/services/auth/schemas';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/Field';
import { ForgotPasswordDialog } from './components/ForgotPasswordDialog';

const routeApi = getRouteApi('/_unauthenticated/login/');

function LoginForm() {
    const navigate = routeApi.useNavigate();
    const redirectSearch = routeApi.useSearch({
        select({ redirect }) {
            return redirect;
        },
    });
    const { mutateAsync: login } = useMutation(loginMutationOptions());

    const form = useAppForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onSubmit: loginInputSchema,
        },
        async onSubmit({ value, formApi }) {
            await login(value, {
                onSuccess(me) {
                    navigate({
                        to: redirectSearch || landingFor(me.role),
                        replace: true,
                    });
                },
                onError(error) {
                    // Server functions surface a thrown Error; show its message against both fields.
                    if (error instanceof Error && error.message) {
                        formApi.setErrorMap({
                            onSubmit: {
                                fields: {
                                    email: { message: error.message },
                                    password: { message: error.message },
                                },
                            },
                        });
                    } else {
                        toast.error('Login failed');
                    }
                },
            });
        },
        onSubmitInvalid({ formApi }) {
            focusFirstError('#login-form', formApi.state.errorMap.onSubmit);
        },
    });

    return (
        <div className="p-6 md:p-8 w-full max-w-md">
            <div className="flex flex-col items-center text-center mb-6">
                <h1 className="text-xl font-semibold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">Login to your account</p>
            </div>
            <form
                id="login-form"
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
                                        <field.InputField
                                            type="email"
                                            placeholder="you@example.com"
                                            autoComplete="username"
                                        />
                                    </field.FormFieldWrapper>
                                );
                            }}
                        />
                        <form.AppField
                            name="password"
                            children={(field) => {
                                return (
                                    <field.FormFieldWrapper
                                        labelClassName="flex items-center justify-between"
                                        label={
                                            <>
                                                Password <ForgotPasswordDialog />
                                            </>
                                        }
                                    >
                                        <field.PasswordInputField
                                            placeholder="Enter password"
                                            autoComplete="current-password"
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
                                            Login
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

export { LoginForm };
