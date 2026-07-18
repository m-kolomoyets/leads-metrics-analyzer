import { j as jsxRuntimeExports, r as reactExports } from '../_libs/react.mjs';
import { b as useMutation, a as useQueryClient } from '../_libs/tanstack__react-query.mjs';
import {
    g as getRouteApi,
    L as Link,
    O as Outlet,
    d as useNavigate,
    u as useRouter,
} from '../_libs/tanstack__react-router.mjs';
import {
    b as Sidebar,
    m as SIDEBAR_COOKIE_NAME,
    d as SidebarContent,
    e as SidebarFooter,
    j as SidebarGroup,
    c as SidebarHeader,
    a as SidebarInset,
    g as SidebarMenu,
    i as SidebarMenuButton,
    h as SidebarMenuItem,
    k as SidebarMenuSkeleton,
    S as SidebarProvider,
    f as SidebarRail,
    l as Skeleton,
    u as useSidebarContext,
} from './index-B7V87wvP.mjs';
import {
    c as cn,
    h as hasPermissions,
    l as logoutMutationOptions,
    R as ROLES_CONFIG,
    u as useTheme,
} from './router-BqEFGHsP.mjs';
import '../_libs/sonner.mjs';
import './schemas-BFwg8Iyq.mjs';
import './index.mjs';
import './schemas-ELPmZsuS.mjs';
import {
    s as AvatarFallback$1,
    r as AvatarImage$1,
    A as AvatarRoot,
    k as MenuGroup,
    q as MenuItem,
    i as MenuPopup,
    j as MenuPortal,
    h as MenuPositioner,
    n as MenuRadioGroup,
    o as MenuRadioItem,
    p as MenuRadioItemIndicator,
    M as MenuRoot,
    l as MenuSubmenuRoot,
    m as MenuSubmenuTrigger,
    g as MenuTrigger,
    S as Separator,
} from '../_libs/base-ui__react.mjs';
import {
    e as ChevronRight,
    C as ChevronsUpDown,
    f as Circle,
    a as LayoutDashboard,
    d as LogOut,
    b as ShieldUser,
    S as ShoppingBag,
    c as Sun,
    T as Tickets,
} from '../_libs/lucide-react.mjs';
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
import '../_libs/class-variance-authority.mjs';
import '../_libs/clsx.mjs';
import '../_libs/react-hookz__web.mjs';
import '../_libs/tanstack__query-core.mjs';
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

const getCookieByName = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
};
const SIDEBAR_NAVIGATION_LINK_LIST = [
    {
        label: 'Dashboard',
        Icon: LayoutDashboard,
        linkProps: {
            to: '/dashboard',
        },
    },
    {
        label: 'Merchants',
        Icon: ShoppingBag,
        linkProps: {
            to: '/merchants',
        },
        rolePermissionKey: 'merchants.view',
    },
    {
        label: 'Vouchers',
        Icon: Tickets,
        linkProps: {
            to: '/vouchers',
        },
        rolePermissionKey: 'vouchers.view',
    },
    {
        label: 'Admin',
        Icon: ShieldUser,
        linkProps: {
            to: '/admin',
        },
        rolePermissionKey: 'admin.view',
    },
];
function SidebarNavigationLink({ activeProps, activeOptions, tooltipText, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuButton, {
        tooltip: tooltipText,
        render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
            activeOptions: {
                exact: true,
                ...activeOptions,
            },
            activeProps: {
                className: 'bg-sidebar-accent text-sidebar-accent-foreground',
                ...activeProps,
            },
            ...props,
        }),
    });
}
const routeApi$1 = getRouteApi('/_authenticated');
function SidebarNavigation() {
    const { setOpenMobile } = useSidebarContext();
    const role = routeApi$1.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroup, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, {
            children: SIDEBAR_NAVIGATION_LINK_LIST.map((item) => {
                if (item?.rolePermissionKey && !hasPermissions(item.rolePermissionKey, role)) {
                    return null;
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SidebarMenuItem,
                    {
                        onClick: () => {
                            setOpenMobile(false);
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarNavigationLink, {
                            tooltipText: item.label,
                            ...item.linkProps,
                            children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(item.Icon, { className: 'size-4' }),
                                item.label,
                            ],
                        }),
                    },
                    item.label
                );
            }),
        }),
    });
}
function SidebarNavigationFallback() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroup, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, {
            children: Array.from({ length: 7 }).map((_, index) => {
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SidebarMenuItem,
                    { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuSkeleton, { showIcon: true }) },
                    index
                );
            }),
        }),
    });
}
function DropdownMenu(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRoot, { 'data-slot': 'dropdown-menu', ...props });
}
function DropdownMenuPortal(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuPortal, { 'data-slot': 'dropdown-menu-portal', ...props });
}
function DropdownMenuTrigger(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuTrigger, { 'data-slot': 'dropdown-menu-trigger', ...props });
}
function DropdownMenuContent({
    className,
    align = 'start',
    alignOffset = 0,
    side = 'bottom',
    sideOffset = 4,
    ...props
}) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuPortal, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuPositioner, {
            className: 'isolate outline-none',
            align,
            alignOffset,
            side,
            sideOffset,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuPopup, {
                'data-slot': 'dropdown-menu-content',
                className: cn(
                    'motion-safe:data-open:animate-in motion-safe:data-closed:animate-out motion-safe:data-closed:fade-out-0 motion-safe:data-open:fade-in-0 motion-safe:data-closed:zoom-out-95 motion-safe:data-open:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-32 rounded-lg p-1 shadow-md ring-1 motion-safe:duration-100 motion-safe:data-[side=inline-start]:slide-in-from-right-2 motion-safe:data-[side=inline-end]:slide-in-from-left-2 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden',
                    className
                ),
                ...props,
            }),
        }),
    });
}
function DropdownMenuGroup(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuGroup, { 'data-slot': 'dropdown-menu-group', ...props });
}
function DropdownMenuItem({ className, inset, variant = 'default', ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, {
        'data-slot': 'dropdown-menu-item',
        'data-inset': inset,
        'data-variant': variant,
        className: cn(
            `focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
            className
        ),
        ...props,
    });
}
function DropdownMenuRadioGroup(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRadioGroup, {
        'data-slot': 'dropdown-menu-radio-group',
        ...props,
    });
}
function DropdownMenuRadioItem({ className, children, inset, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(MenuRadioItem, {
        'data-slot': 'dropdown-menu-radio-item',
        'data-inset': inset,
        className: cn(
            `focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
            className
        ),
        ...props,
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                className: 'absolute right-2 flex items-center justify-center pointer-events-none',
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRadioItemIndicator, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: 'size-2 fill-current' }),
                }),
            }),
            children,
        ],
    });
}
function DropdownMenuSeparator({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {
        'data-slot': 'dropdown-menu-separator',
        className: cn('bg-border -mx-1 my-1 h-px', className),
        ...props,
    });
}
function DropdownMenuSub(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuSubmenuRoot, { 'data-slot': 'dropdown-menu-sub', ...props });
}
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(MenuSubmenuTrigger, {
        'data-slot': 'dropdown-menu-sub-trigger',
        'data-inset': inset,
        className: cn(
            `focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 flex cursor-default items-center outline-hidden select-none data-popup-open:bg-accent data-popup-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0`,
            className
        ),
        ...props,
        children: [children, /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: 'ml-auto size-4' })],
    });
}
function DropdownMenuSubContent({
    align = 'start',
    alignOffset = 0,
    side = 'right',
    sideOffset = 0,
    className,
    ...props
}) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuContent, {
        'data-slot': 'dropdown-menu-sub-content',
        className: cn(
            'motion-safe:data-open:animate-in motion-safe:data-closed:animate-out motion-safe:data-closed:fade-out-0 motion-safe:data-open:fade-in-0 motion-safe:data-closed:zoom-out-95 motion-safe:data-open:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-24 rounded-lg p-1 shadow-lg ring-1 motion-safe:duration-100 w-auto',
            className
        ),
        align,
        alignOffset,
        side,
        sideOffset,
        ...props,
    });
}
function LogoutItem() {
    const navigate = useNavigate();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: logout, isPending: isLogOutPending } = useMutation(logoutMutationOptions());
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, {
        onClick: () => {
            logout(void 0, {
                async onSuccess() {
                    queryClient.clear();
                    await router.invalidate();
                    navigate({
                        to: '/login',
                        ignoreBlocker: true,
                    });
                },
            });
        },
        disabled: isLogOutPending,
        children: [/* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, {}), 'Log out'],
    });
}
const getNameInitials = (name, maxLength = 2) => {
    return name
        .trim()
        .split(' ')
        .map((word) => {
            return word.charAt(0);
        })
        .join('')
        .toUpperCase()
        .slice(0, maxLength);
};
function Avatar({ className, size = 'default', ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarRoot, {
        'data-slot': 'avatar',
        'data-size': size,
        className: cn(
            'size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten',
            className
        ),
        ...props,
    });
}
function AvatarImage({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage$1, {
        'data-slot': 'avatar-image',
        className: cn('rounded-full aspect-square size-full object-cover', className),
        ...props,
    });
}
function AvatarFallback({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback$1, {
        'data-slot': 'avatar-fallback',
        className: cn(
            'bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs',
            className
        ),
        ...props,
    });
}
function SidebarAvatar({ className, name, avatarUrl }) {
    const userInitials = getNameInitials(name);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, {
        className: cn('h-8 w-8 rounded-lg', className),
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl, alt: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: 'rounded-lg', children: userInitials }),
        ],
    });
}
const routeApi = getRouteApi('/_authenticated');
function SidebarUserCard({ className }) {
    const me = routeApi.useRouteContext({
        select(context) {
            return context.auth.me;
        },
    });
    const roleLabel = ROLES_CONFIG[me.role].label;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
        className: cn('flex items-center gap-2 py-1.5 text-left text-sm', className),
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarAvatar, { name: me.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'grid flex-1 text-left text-sm leading-tight',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                        className: 'truncate font-semibold',
                        children: me.email,
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                        className: 'truncate text-xs mb-1 text-muted-foreground',
                        children: roleLabel,
                    }),
                ],
            }),
        ],
    });
}
function ThemeItem() {
    const { theme, setTheme } = useTheme();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuGroup, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuSub, {
            children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuSubTrigger, {
                    children: [/* @__PURE__ */ jsxRuntimeExports.jsx(Sun, {}), 'Toggle theme'],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuPortal, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSubContent, {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuRadioGroup, {
                            value: theme,
                            onValueChange: setTheme,
                            children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuRadioItem, {
                                    closeOnClick: true,
                                    value: 'light',
                                    children: 'Light',
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuRadioItem, {
                                    closeOnClick: true,
                                    value: 'dark',
                                    children: 'Dark',
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuRadioItem, {
                                    closeOnClick: true,
                                    value: 'system',
                                    children: 'System',
                                }),
                            ],
                        }),
                    }),
                }),
            ],
        }),
    });
}
function SidebarProfile() {
    const { isMobile } = useSidebarContext();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, {
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, {
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, {
                        render: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarMenuButton, {
                            size: 'lg',
                            className:
                                'h-auto data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground',
                            tooltip: 'Profile',
                            children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarUserCard, {}),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: 'ml-auto size-4' }),
                            ],
                        }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, {
                        className: 'w-(--anchor-width) min-w-56 rounded-lg',
                        side: isMobile ? 'bottom' : 'right',
                        align: 'end',
                        sideOffset: 4,
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeItem, {}),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LogoutItem, {}),
                        ],
                    }),
                ],
            }),
        }),
    });
}
function SidebarProfileFallback() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, {
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className:
                    'flex items-center group-data-[state=expanded]:gap-2 h-16 px-2 motion-safe:transition-[width,height,padding] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:px-0',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: 'size-8 rounded-full shrink-0' }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                        className: 'grid flex-1 text-left text-sm leading-tight gap-2',
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: 'w-1/2 h-3' }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: 'w-3/4 h-3' }),
                        ],
                    }),
                ],
            }),
        }),
    });
}
function SidebarTeam() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, {
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuButton, {
                size: 'lg',
                render: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                    to: '/dashboard',
                    children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                            className:
                                'flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar text-sidebar-primary-foreground',
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx('img', {
                                src: '/icon.svg',
                                className: 'size-8',
                                alt: '',
                                'aria-hidden': true,
                            }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                            className: 'grid flex-1 text-left text-sm leading-tight',
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                                className: 'truncate font-semibold',
                                children: 'Phenomenon admin panel',
                            }),
                        }),
                    ],
                }),
            }),
        }),
    });
}
function MainSidebar(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sidebar, {
        collapsible: 'icon',
        ...props,
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarHeader, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTeam, {}),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
                    fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarNavigationFallback, {}),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarNavigation, {}),
                }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarFooter, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
                    fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarProfileFallback, {}),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarProfile, {}),
                }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarRail, {}),
        ],
    });
}
function MainLayout(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarProvider, {
        defaultOpen: getCookieByName(SIDEBAR_COOKIE_NAME) === 'true',
        ...props,
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MainSidebar, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarInset, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                    className: 'flex flex-1 flex-col gap-4 p-6',
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
                }),
            }),
        ],
    });
}
const SplitComponent = MainLayout;
export { SplitComponent as component };
