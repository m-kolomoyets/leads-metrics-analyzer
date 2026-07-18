import {
    c as createTeamInputSchema,
    a as createUserInputSchema,
    U as USER_ROLES,
    g as USER_STATUSES,
} from './schemas-BFwg8Iyq.mjs';
import { c as cva } from '../_libs/class-variance-authority.mjs';
import { j as jsxRuntimeExports, r as reactExports } from '../_libs/react.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { b as useMutation, c as useSuspenseQuery } from '../_libs/tanstack__react-query.mjs';
import { g as getRouteApi } from '../_libs/tanstack__react-router.mjs';
import {
    o as Sheet,
    p as SheetContent,
    s as SheetDescription,
    q as SheetHeader,
    r as SheetTitle,
} from './index-B7V87wvP.mjs';
import { M as MainLayoutHeader, S as Separator } from './index-DPHvIaWY.mjs';
import { b as Field, a as FieldGroup, F as FieldSet, I as Input, u as useAppForm } from './index-WZO7W8P4.mjs';
import {
    B as Button,
    c as cn,
    f as createTeamMutationOptions,
    g as createUserMutationOptions,
    e as deleteTeamMutationOptions,
    j as deleteUserMutationOptions,
    r as resendInvitationMutationOptions,
    R as ROLES_CONFIG,
    s as setTeamLeadMutationOptions,
    t as teamsQueryOptions,
    d as updateTeamMutationOptions,
    i as updateUserMutationOptions,
    k as usersQueryOptions,
} from './router-BqEFGHsP.mjs';
import './index.mjs';
import './schemas-ELPmZsuS.mjs';
import {
    Z as ComboboxEmpty,
    V as ComboboxIcon,
    U as ComboboxInput,
    R as ComboboxInputGroup,
    $ as ComboboxItem,
    a0 as ComboboxItemIndicator,
    _ as ComboboxList,
    Y as ComboboxPopup,
    W as ComboboxPortal,
    X as ComboboxPositioner,
    Q as ComboboxRoot,
    y as mergeProps,
    x as useRender,
} from '../_libs/base-ui__react.mjs';
import { h as Check, C as ChevronsUpDown, j as Copy, i as Plus } from '../_libs/lucide-react.mjs';
import { c as useDebouncedState } from '../_libs/react-hookz__web.mjs';
import '../_libs/tanstack__query-core.mjs';
import '../_libs/tanstack__router-core.mjs';
import '../_libs/tanstack__history.mjs';
import 'node:stream/web';
import 'node:stream';
import '../_libs/react-dom.mjs';
import 'util';
import 'async_hooks';
import 'crypto';
import 'stream';
import '../_libs/isbot.mjs';
import '../_libs/clsx.mjs';
import '../_libs/tailwind-merge.mjs';
import '../_libs/ky.mjs';
import '../_libs/zod.mjs';
import 'node:async_hooks';
import '../_libs/base-ui__utils.mjs';
import '../_libs/use-sync-external-store.mjs';
import '../_libs/floating-ui__utils.mjs';
import '../_libs/floating-ui__dom.mjs';
import '../_libs/floating-ui__core.mjs';
import '../_libs/floating-ui__react-dom.mjs';
import '../_libs/tanstack__react-form.mjs';
import '../_libs/tanstack__form-core.mjs';
import '../_libs/tanstack__store.mjs';
import '../_libs/tanstack__pacer-lite.mjs';
import '../_libs/@tanstack/devtools-event-client+[...].mjs';
import '../_libs/tanstack__react-store.mjs';

const NO_TEAM_VALUE = '__none__';
const ROLE_OPTIONS = USER_ROLES.map((role) => {
    return { value: role, label: ROLES_CONFIG[role].label };
});
const STATUS_LABELS = {
    active: 'Active',
    invited: 'Invited',
    disabled: 'Disabled',
};
const STATUS_OPTIONS = USER_STATUSES.map((status) => {
    return { value: status, label: STATUS_LABELS[status] };
});
const buildTeamOptions = (teams) => {
    return [
        { value: NO_TEAM_VALUE, label: 'No team' },
        ...teams.map((team) => {
            return { value: team.id, label: team.name };
        }),
    ];
};
const getTeamName = (teamId, teams) => {
    if (!teamId) {
        return '—';
    }
    return (
        teams.find((team) => {
            return team.id === teamId;
        })?.name ?? '—'
    );
};
const buildLeadOptions = (users) => {
    return [
        { value: NO_TEAM_VALUE, label: 'No lead' },
        ...users.map((user) => {
            return { value: user.id, label: user.email };
        }),
    ];
};
const SEARCH_DEBOUNCE_MS = 300;
const itemToLabel = (item) => {
    return item?.label ?? '';
};
const isItemEqualToValue = (item, value) => {
    return item.value === value.value;
};
function LeadCombobox({ value, options, onChange, disabled }) {
    const [query, setQuery] = useDebouncedState('', SEARCH_DEBOUNCE_MS);
    const normalized = query.trim().toLowerCase();
    const filtered = normalized
        ? options.filter((option) => {
              return option.label.toLowerCase().includes(normalized);
          })
        : options;
    const selected =
        options.find((option) => {
            return option.value === value;
        }) ?? null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ComboboxRoot, {
        items: filtered,
        value: selected,
        filter: null,
        disabled,
        itemToStringLabel: itemToLabel,
        isItemEqualToValue,
        onValueChange: (next) => {
            onChange(next ? next.value : NO_TEAM_VALUE);
        },
        onInputValueChange: (text) => {
            setQuery(text);
        },
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(ComboboxInputGroup, {
                className: cn(
                    'dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 flex h-8 w-full max-w-64 items-center gap-2 rounded-lg border bg-transparent px-2.5 py-1 motion-safe:transition-colors'
                ),
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ComboboxInput, {
                        placeholder: 'Search lead…',
                        className:
                            'placeholder:text-muted-foreground w-full min-w-0 bg-transparent text-sm outline-none',
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ComboboxIcon, {
                        className: 'text-muted-foreground shrink-0',
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: 'size-3.5' }),
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ComboboxPortal, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComboboxPositioner, {
                    sideOffset: 4,
                    className: 'z-50 outline-none',
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ComboboxPopup, {
                        className:
                            'bg-popover px-2 py-1.5 text-popover-foreground border-border max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border p-1 shadow-md outline-none',
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ComboboxEmpty, {
                                className: 'text-muted-foreground  text-sm',
                                children: 'No users found',
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ComboboxList, {
                                children: (item) => {
                                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        ComboboxItem,
                                        {
                                            value: item,
                                            className:
                                                'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1.5 pl-2 pr-8 text-sm outline-none',
                                            children: [
                                                item.label,
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(ComboboxItemIndicator, {
                                                    className: 'absolute right-2 flex items-center',
                                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, {
                                                        className: 'size-4',
                                                    }),
                                                }),
                                            ],
                                        },
                                        item.value
                                    );
                                },
                            }),
                        ],
                    }),
                }),
            }),
        ],
    });
}
function TeamRow({ team, leadOptions }) {
    const { mutate: setTeamLead } = useMutation(setTeamLeadMutationOptions());
    const { mutateAsync: updateTeam, isPending: isRenaming } = useMutation(updateTeamMutationOptions());
    const { mutate: deleteTeam, isPending: isDeleting } = useMutation(deleteTeamMutationOptions());
    const [isEditing, setIsEditing] = reactExports.useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = reactExports.useState(false);
    const [name, setName] = reactExports.useState(team.name);
    const handleRename = async () => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === team.name) {
            setIsEditing(false);
            setName(team.name);
            return;
        }
        await updateTeam(
            { id: team.id, name: trimmed },
            {
                onSuccess() {
                    toast.success('Team renamed');
                    setIsEditing(false);
                },
                onError(error) {
                    toast.error(error instanceof Error ? error.message : 'Failed to rename team');
                },
            }
        );
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('tr', {
        className: 'border-b last:border-b-0',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx('td', {
                className: 'px-3 py-2',
                children: isEditing
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                                  className: 'min-w-0 flex-1',
                                  value: name,
                                  onChange: (e) => {
                                      setName(e.target.value);
                                  },
                                  'aria-label': 'Team name',
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  className: 'shrink-0',
                                  onClick: handleRename,
                                  isLoading: isRenaming,
                                  children: 'Save',
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  variant: 'ghost',
                                  className: 'shrink-0',
                                  onClick: () => {
                                      setIsEditing(false);
                                      setName(team.name);
                                  },
                                  children: 'Cancel',
                              }),
                          ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                          className: 'block truncate',
                          children: team.name,
                      }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('td', {
                className: 'px-3 py-2',
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeadCombobox, {
                    options: leadOptions,
                    value: team.leadId ?? NO_TEAM_VALUE,
                    onChange: (value) => {
                        setTeamLead({
                            id: team.id,
                            leadId: value === NO_TEAM_VALUE ? null : value,
                        });
                    },
                }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('td', {
                className: 'px-3 py-2 text-right',
                children: isConfirmingDelete
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                          className: 'flex items-center justify-end gap-2 whitespace-nowrap',
                          children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                                  className: 'text-muted-foreground text-xs',
                                  children: 'Delete team?',
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  variant: 'destructive',
                                  isLoading: isDeleting,
                                  onClick: () => {
                                      deleteTeam(
                                          { id: team.id },
                                          {
                                              onSuccess() {
                                                  toast.success('Team deleted');
                                              },
                                              onError(error) {
                                                  toast.error(
                                                      error instanceof Error ? error.message : 'Failed to delete team'
                                                  );
                                              },
                                          }
                                      );
                                  },
                                  children: 'Confirm',
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  variant: 'ghost',
                                  onClick: () => {
                                      setIsConfirmingDelete(false);
                                  },
                                  children: 'Cancel',
                              }),
                          ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                          className: 'flex items-center justify-end gap-2',
                          children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  variant: 'ghost',
                                  disabled: isEditing,
                                  onClick: () => {
                                      setIsEditing(true);
                                  },
                                  children: 'Rename',
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  variant: 'ghost',
                                  onClick: () => {
                                      setIsConfirmingDelete(true);
                                  },
                                  children: 'Delete',
                              }),
                          ],
                      }),
            }),
        ],
    });
}
function TeamsSection({ users, teams }) {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('section', {
        className: 'flex flex-col gap-4',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx('h2', { className: 'text-lg font-medium', children: 'Teams' }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs('form', {
                className: 'flex items-start gap-2',
                noValidate: true,
                onSubmit: (e) => {
                    e.preventDefault();
                    form.handleSubmit();
                },
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, {
                        className: 'flex-1',
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                            name: 'name',
                            children: (field) => {
                                return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                    label: 'New team',
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.InputField, {
                                        placeholder: 'Team name',
                                    }),
                                });
                            },
                        }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                        className: 'w-auto mt-6.5',
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(form.Subscribe, {
                            selector: (state) => {
                                return [state.canSubmit, state.isSubmitting];
                            },
                            children: ([canSubmit, isSubmitting]) => {
                                return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                    type: 'submit',
                                    disabled: !canSubmit,
                                    isLoading: isSubmitting,
                                    children: 'Create team',
                                });
                            },
                        }),
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                className: 'overflow-x-auto rounded-lg border',
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs('table', {
                    className: 'w-full min-w-3xl table-fixed text-sm',
                    children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs('colgroup', {
                            children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx('col', {}),
                                /* @__PURE__ */ jsxRuntimeExports.jsx('col', { className: 'w-72' }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx('col', { className: 'w-64' }),
                            ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx('thead', {
                            className: 'text-muted-foreground border-b',
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs('tr', {
                                children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('th', {
                                        className: 'px-3 py-2 text-left font-medium',
                                        children: 'Team',
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('th', {
                                        className: 'px-3 py-2 text-left font-medium',
                                        children: 'Lead',
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('th', { className: 'px-3 py-2' }),
                                ],
                            }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs('tbody', {
                            children: [
                                teams.length === 0 &&
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('tr', {
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx('td', {
                                            className: 'text-muted-foreground px-3 py-4',
                                            colSpan: 3,
                                            children: 'No teams yet.',
                                        }),
                                    }),
                                teams.map((team) => {
                                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        TeamRow,
                                        { team, leadOptions },
                                        team.id
                                    );
                                }),
                            ],
                        }),
                    ],
                }),
            }),
        ],
    });
}
const buildActivationUrl = (token) => {
    return `${window.location.origin}/activate?token=${encodeURIComponent(token)}`;
};
function InviteLink({ token }) {
    const url = buildActivationUrl(token);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied');
        } catch {
            toast.error('Could not copy — select and copy manually');
        }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
        className: 'flex flex-col gap-2',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx('p', {
                className: 'text-muted-foreground text-sm',
                children: 'Share this one-time link so they can set a password. It expires and works once.',
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                        className: 'min-w-0 flex-1',
                        value: url,
                        readOnly: true,
                        'aria-label': 'Activation link',
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                        size: 'sm',
                        variant: 'outline',
                        className: 'shrink-0',
                        onClick: handleCopy,
                        children: [/* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: 'size-4' }), 'Copy'],
                    }),
                ],
            }),
        ],
    });
}
function CreateUserForm({ teams, onSuccess }) {
    const { mutateAsync: createUser } = useMutation(createUserMutationOptions());
    const teamOptions = buildTeamOptions(teams);
    const [activationToken, setActivationToken] = reactExports.useState(null);
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
        return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
            className: 'flex flex-col gap-4',
            children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(InviteLink, { token: activationToken }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                    className: 'w-full',
                    onClick: () => {
                        onSuccess();
                    },
                    children: 'Done',
                }),
            ],
        });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx('form', {
        id: 'create-user-form',
        noValidate: true,
        onSubmit: (e) => {
            e.preventDefault();
            form.handleSubmit();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSet, {
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldGroup, {
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                        name: 'email',
                        children: (field) => {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                label: 'Email',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.InputField, {
                                    type: 'email',
                                    placeholder: 'you@example.com',
                                }),
                            });
                        },
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                        name: 'role',
                        children: (field) => {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                label: 'Role',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.SelectField, {
                                    items: ROLE_OPTIONS,
                                    placeholder: 'Select role',
                                }),
                            });
                        },
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                        name: 'teamId',
                        children: (field) => {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                label: 'Team',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.SelectField, {
                                    items: teamOptions,
                                    placeholder: 'Select team',
                                }),
                            });
                        },
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                        name: 'status',
                        children: (field) => {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                label: 'Status',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.SelectField, {
                                    items: STATUS_OPTIONS,
                                    placeholder: 'Select status',
                                }),
                            });
                        },
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(form.Subscribe, {
                            selector: (state) => {
                                return [state.canSubmit, state.isSubmitting];
                            },
                            children: ([canSubmit, isSubmitting]) => {
                                return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                    type: 'submit',
                                    className: 'w-full',
                                    disabled: !canSubmit,
                                    isLoading: isSubmitting,
                                    children: 'Create user',
                                });
                            },
                        }),
                    }),
                ],
            }),
        }),
    });
}
const buildUpdateUserPayload = (current, values, noTeamValue) => {
    const payload = { id: current.id };
    if (values.role !== current.role) {
        payload.role = values.role;
    }
    if (values.status !== current.status) {
        payload.status = values.status;
    }
    const nextTeamId = values.teamId === noTeamValue ? null : values.teamId;
    if (nextTeamId !== current.teamId) {
        payload.teamId = nextTeamId;
    }
    return payload;
};
function EditUserForm({ user, teams, onSuccess }) {
    const { mutateAsync: updateUser } = useMutation(updateUserMutationOptions());
    const teamOptions = buildTeamOptions(teams);
    const form = useAppForm({
        defaultValues: {
            role: user.role,
            status: user.status,
            teamId: user.teamId ?? NO_TEAM_VALUE,
        },
        async onSubmit({ value, formApi }) {
            const payload = buildUpdateUserPayload(user, value, NO_TEAM_VALUE);
            if (Object.keys(payload).length === 1) {
                onSuccess();
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx('form', {
        id: 'edit-user-form',
        noValidate: true,
        onSubmit: (e) => {
            e.preventDefault();
            form.handleSubmit();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSet, {
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldGroup, {
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx('p', {
                            className: 'text-muted-foreground text-sm',
                            children: user.email,
                        }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                        name: 'role',
                        children: (field) => {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                label: 'Role',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.SelectField, {
                                    items: ROLE_OPTIONS,
                                    placeholder: 'Select role',
                                }),
                            });
                        },
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                        name: 'teamId',
                        children: (field) => {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                label: 'Team',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.SelectField, {
                                    items: teamOptions,
                                    placeholder: 'Select team',
                                }),
                            });
                        },
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                        name: 'status',
                        children: (field) => {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                label: 'Status',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.SelectField, {
                                    items: STATUS_OPTIONS,
                                    placeholder: 'Select status',
                                }),
                            });
                        },
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(form.Subscribe, {
                            selector: (state) => {
                                return [state.canSubmit, state.isSubmitting];
                            },
                            children: ([canSubmit, isSubmitting]) => {
                                return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                    type: 'submit',
                                    className: 'w-full',
                                    disabled: !canSubmit,
                                    isLoading: isSubmitting,
                                    children: 'Save changes',
                                });
                            },
                        }),
                    }),
                ],
            }),
        }),
    });
}
function InvitePanel({ userId }) {
    const { mutate, data, isPending, isError } = useMutation(resendInvitationMutationOptions());
    const handleGenerate = () => {
        mutate({ id: userId });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
        className: 'flex flex-col gap-4',
        children: [
            !!data?.activationToken &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(InviteLink, { token: data.activationToken }),
            isError &&
                /* @__PURE__ */ jsxRuntimeExports.jsx('p', {
                    className: 'text-destructive text-sm',
                    children: 'Could not generate a link. Try again.',
                }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                variant: 'outline',
                onClick: handleGenerate,
                isLoading: isPending,
                children: data ? 'Generate new link' : 'Generate invite link',
            }),
        ],
    });
}
const badgeVariants = cva(
    'h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium motion-safe:transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
                secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
                destructive:
                    'bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20',
                outline: 'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
                ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
                link: 'text-primary underline-offset-4 hover:underline',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);
function Badge({ className, variant = 'default', render, ...props }) {
    return useRender({
        defaultTagName: 'span',
        props: mergeProps(
            {
                className: cn(badgeVariants({ variant }), className),
            },
            props
        ),
        render,
        state: {
            slot: 'badge',
            variant,
        },
    });
}
const STATUS_VARIANT = {
    active: 'default',
    invited: 'secondary',
    disabled: 'destructive',
};
function UserRow({ user, teams, currentUserId, onEdit, onInvite }) {
    const { mutate: deleteUser, isPending: isDeleting } = useMutation(deleteUserMutationOptions());
    const [isConfirmingDelete, setIsConfirmingDelete] = reactExports.useState(false);
    const isSelf = user.id === currentUserId;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('tr', {
        className: 'border-b last:border-b-0',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx('td', { className: 'px-3 py-2', children: user.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('td', {
                className: 'px-3 py-2',
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: 'outline', children: user.role }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('td', {
                className: 'px-3 py-2',
                children: getTeamName(user.teamId, teams),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('td', {
                className: 'px-3 py-2',
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                    variant: STATUS_VARIANT[user.status],
                    children: user.status,
                }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('td', {
                className: 'px-3 py-2 text-right whitespace-nowrap',
                children: isConfirmingDelete
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                          className: 'flex items-center justify-end gap-2',
                          children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                                  className: 'text-muted-foreground text-xs',
                                  children: 'Delete user?',
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  variant: 'destructive',
                                  isLoading: isDeleting,
                                  onClick: () => {
                                      deleteUser(
                                          { id: user.id },
                                          {
                                              onSuccess() {
                                                  toast.success('User deleted');
                                              },
                                              onError(error) {
                                                  toast.error(
                                                      error instanceof Error ? error.message : 'Failed to delete user'
                                                  );
                                                  setIsConfirmingDelete(false);
                                              },
                                          }
                                      );
                                  },
                                  children: 'Confirm',
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  variant: 'ghost',
                                  onClick: () => {
                                      setIsConfirmingDelete(false);
                                  },
                                  children: 'Cancel',
                              }),
                          ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                          children: [
                              user.status === 'invited' &&
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                      size: 'sm',
                                      variant: 'ghost',
                                      onClick: () => {
                                          onInvite(user);
                                      },
                                      children: 'Invite link',
                                  }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  size: 'sm',
                                  variant: 'ghost',
                                  onClick: () => {
                                      onEdit(user);
                                  },
                                  children: 'Edit',
                              }),
                              !isSelf &&
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                      size: 'sm',
                                      variant: 'ghost',
                                      onClick: () => {
                                          setIsConfirmingDelete(true);
                                      },
                                      children: 'Delete',
                                  }),
                          ],
                      }),
            }),
        ],
    });
}
function UsersSection({ users, teams, currentUserId }) {
    const [isCreateOpen, setIsCreateOpen] = reactExports.useState(false);
    const [editingUser, setEditingUser] = reactExports.useState(null);
    const [invitingUser, setInvitingUser] = reactExports.useState(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('section', {
        className: 'flex flex-col gap-4',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx('h2', {
                        className: 'text-lg font-medium',
                        children: 'Users',
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                        size: 'sm',
                        onClick: () => {
                            setIsCreateOpen(true);
                        },
                        children: [/* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: 'size-4' }), 'New user'],
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                className: 'overflow-x-auto rounded-lg border',
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs('table', {
                    className: 'w-full text-sm',
                    children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx('thead', {
                            className: 'text-muted-foreground border-b',
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs('tr', {
                                children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('th', {
                                        className: 'px-3 py-2 text-left font-medium',
                                        children: 'Email',
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('th', {
                                        className: 'px-3 py-2 text-left font-medium',
                                        children: 'Role',
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('th', {
                                        className: 'px-3 py-2 text-left font-medium',
                                        children: 'Team',
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('th', {
                                        className: 'px-3 py-2 text-left font-medium',
                                        children: 'Status',
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('th', { className: 'px-3 py-2' }),
                                ],
                            }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx('tbody', {
                            children: users.map((user) => {
                                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    UserRow,
                                    {
                                        user,
                                        teams,
                                        currentUserId,
                                        onEdit: setEditingUser,
                                        onInvite: setInvitingUser,
                                    },
                                    user.id
                                );
                            }),
                        }),
                    ],
                }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, {
                open: isCreateOpen,
                onOpenChange: setIsCreateOpen,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, {
                    className: 'gap-0',
                    children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, {
                            children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: 'New user' }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, {
                                    children: 'Invite a user and assign their role, team, and status.',
                                }),
                            ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                            className: 'p-4',
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreateUserForm, {
                                teams,
                                onSuccess: () => {
                                    setIsCreateOpen(false);
                                },
                            }),
                        }),
                    ],
                }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, {
                open: !!editingUser,
                onOpenChange: (open) => {
                    if (!open) {
                        setEditingUser(null);
                    }
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, {
                    className: 'gap-0',
                    children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, {
                            children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: 'Edit user' }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, {
                                    children: "Change this user's role, team, or status.",
                                }),
                            ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                            className: 'p-4',
                            children:
                                !!editingUser &&
                                /* @__PURE__ */ jsxRuntimeExports.jsx(EditUserForm, {
                                    user: editingUser,
                                    teams,
                                    onSuccess: () => {
                                        setEditingUser(null);
                                    },
                                }),
                        }),
                    ],
                }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, {
                open: !!invitingUser,
                onOpenChange: (open) => {
                    if (!open) {
                        setInvitingUser(null);
                    }
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, {
                    className: 'gap-0',
                    children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, {
                            children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: 'Invite link' }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, {
                                    children: invitingUser
                                        ? `Generate a one-time activation link for ${invitingUser.email}.`
                                        : null,
                                }),
                            ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                            className: 'p-4',
                            children:
                                !!invitingUser &&
                                /* @__PURE__ */ jsxRuntimeExports.jsx(InvitePanel, { userId: invitingUser.id }),
                        }),
                    ],
                }),
            }),
        ],
    });
}
const routeApi = getRouteApi('/_authenticated');
function Admin() {
    const { data: users } = useSuspenseQuery(usersQueryOptions());
    const { data: teams } = useSuspenseQuery(teamsQueryOptions());
    const currentUserId = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.id;
        },
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MainLayoutHeader, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsx('h1', { className: 'text-xl', children: 'Admin' }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'flex flex-col gap-8',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UsersSection, { users, teams, currentUserId }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TeamsSection, { users, teams }),
                ],
            }),
        ],
    });
}
const SplitComponent = Admin;
export { SplitComponent as component };
