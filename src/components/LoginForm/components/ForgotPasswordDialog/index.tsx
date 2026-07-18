import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { requestPasswordResetMutationOptions } from '@/services/auth/queries';
import { requestPasswordResetInputSchema } from '@/services/auth/schemas';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/Dialog';
import { FieldGroup, FieldSet } from '@/components/ui/Field';

// "Forgot your password?" on the login page (#42). Asks only for an email and always shows the same
// neutral confirmation — it never reveals whether the address has an account (mirrors login's
// anti-enumeration stance). The `active`-only flag is raised server-side.
function ForgotPasswordDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { mutateAsync: requestReset } = useMutation(requestPasswordResetMutationOptions());

    const form = useAppForm({
        defaultValues: {
            email: '',
        },
        validators: {
            onSubmit: requestPasswordResetInputSchema,
        },
        async onSubmit({ value }) {
            await requestReset(value, {
                onSuccess() {
                    setIsSubmitted(true);
                },
                onError() {
                    toast.error('Something went wrong. Please try again.');
                },
            });
        },
    });

    function handleOpenChange(open: boolean) {
        setIsOpen(open);

        if (!open) {
            // Reset to the pristine form the next time the dialog opens.
            setIsSubmitted(false);
            form.reset();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger
                render={
                    <button
                        type="button"
                        className="ml-auto text-sm underline-offset-2 hover:underline text-foreground rounded-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                        Forgot your password?
                    </button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset your password</DialogTitle>
                    <DialogDescription>
                        Enter your account email and your Head will be notified to help you regain access.
                    </DialogDescription>
                </DialogHeader>

                {isSubmitted ? (
                    <>
                        <p className="text-sm text-muted-foreground">
                            If an account exists, your Head has been notified.
                        </p>
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    handleOpenChange(false);
                                }}
                            >
                                Done
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <form
                        id="forgot-password-form"
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
                                <DialogFooter>
                                    <form.Subscribe
                                        selector={(state) => {
                                            return [state.canSubmit, state.isSubmitting];
                                        }}
                                        children={([canSubmit, isSubmitting]) => {
                                            return (
                                                <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting}>
                                                    Send request
                                                </Button>
                                            );
                                        }}
                                    />
                                </DialogFooter>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

export { ForgotPasswordDialog };
