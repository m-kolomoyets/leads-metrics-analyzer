import {
    C as DialogBackdrop,
    u as DialogClose,
    w as DialogDescription,
    t as DialogPopup,
    z as DialogPortal,
    D as DialogRoot,
    v as DialogTitle,
    y as mergeProps,
    x as useRender,
} from '../_libs/base-ui__react.mjs';
import { c as cva } from '../_libs/class-variance-authority.mjs';
import { P as PanelLeft, X } from '../_libs/lucide-react.mjs';
import { b as useEventListener, u as useMediaQuery } from '../_libs/react-hookz__web.mjs';
import { j as jsxRuntimeExports, r as reactExports } from '../_libs/react.mjs';
import {
    B as Button,
    c as cn,
    n as Tooltip,
    o as TooltipContent,
    T as TooltipTrigger,
    m as useSafeContext,
} from './router-BqEFGHsP.mjs';

function Sheet({ ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRoot, { 'data-slot': 'sheet', ...props });
}
function SheetPortal({ ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal, { 'data-slot': 'sheet-portal', ...props });
}
function SheetOverlay({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogBackdrop, {
        'data-slot': 'sheet-overlay',
        className: cn(
            'bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 motion-safe:transition-opacity motion-safe:duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
            className
        ),
        ...props,
    });
}
function SheetContent({ className, children, side = 'right', showCloseButton = true, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, {
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPopup, {
                'data-slot': 'sheet-content',
                'data-side': side,
                className: cn(
                    'bg-background fixed flex flex-col gap-4 bg-clip-padding text-sm shadow-lg motion-safe:transition motion-safe:duration-200 motion-safe:ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:data-ending-style:translate-y-10 data-[side=bottom]:data-starting-style:translate-y-1 data-[side=left]:data-ending-style:-translate-x-1 data-[side=left]:data-starting-style:-translate-x-1 data-[side=right]:data-ending-style:translate-x-1 data-[side=right]:data-starting-style:translate-x-10 data-[side=top]:data-ending-style:-translate-y-10 data-[side=top]:data-starting-style:-translate-y-1',
                    className
                ),
                ...props,
                children: [
                    children,
                    showCloseButton &&
                        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, {
                            'data-slot': 'sheet-close',
                            render: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                                variant: 'ghost',
                                className: 'absolute top-3 right-3',
                                size: 'icon-sm',
                                children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                                        className: 'sr-only',
                                        children: 'Close',
                                    }),
                                ],
                            }),
                        }),
                ],
            }),
        ],
    });
}
function SheetHeader({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        'data-slot': 'sheet-header',
        className: cn('gap-0.5 p-4 flex flex-col', className),
        ...props,
    });
}
function SheetTitle({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, {
        'data-slot': 'sheet-title',
        className: cn('text-foreground text-base font-medium', className),
        ...props,
    });
}
function SheetDescription({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, {
        'data-slot': 'sheet-description',
        className: cn('text-muted-foreground text-sm', className),
        ...props,
    });
}
function Skeleton({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        className: cn('motion-safe:animate-pulse rounded-md bg-muted', className),
        ...props,
    });
}
const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
const sidebarMenuButtonVariants = cva(
    'ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm motion-safe:transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
    {
        variants: {
            variant: {
                default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                outline:
                    'bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
            },
            size: {
                default: 'h-8 text-sm',
                sm: 'h-7 text-xs',
                lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
    const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    return isMobile ?? false;
}
const SidebarContext = reactExports.createContext({});
SidebarContext.displayName = 'SidebarContext';
function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}) {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = reactExports.useState(false);
    const [_open, _setOpen] = reactExports.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = (value) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
            setOpenProp(openState);
        } else {
            _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    };
    const toggleSidebar = () => {
        if (isMobile) {
            setOpenMobile((open2) => {
                return !open2;
            });
        } else {
            setOpen((open2) => {
                return !open2;
            });
        }
    };
    useEventListener(window, 'keydown', (e) => {
        if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            toggleSidebar();
        }
    });
    const state = open ? 'expanded' : 'collapsed';
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContext, {
        value: {
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
            style: {
                '--sidebar-width': SIDEBAR_WIDTH,
                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                ...style,
            },
            className: cn(
                'group/sidebar-wrapper flex flex-col md:flex-row h-full w-full has-data-[variant=inset]:bg-sidebar',
                className
            ),
            ...props,
            children,
        }),
    });
}
const useSidebarContext = () => {
    const context = useSafeContext(SidebarContext);
    return context;
};
function Sidebar({ side = 'left', variant = 'sidebar', collapsible = 'offcanvas', className, children, ...props }) {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebarContext();
    if (collapsible === 'none') {
        return /* @__PURE__ */ jsxRuntimeExports.jsx('aside', {
            'data-slot': 'sidebar',
            className: cn('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', className),
            ...props,
            children,
        });
    }
    if (isMobile) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, {
            open: openMobile,
            onOpenChange: setOpenMobile,
            ...props,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, {
                'data-sidebar': 'sidebar',
                'data-slot': 'sidebar',
                'data-mobile': 'true',
                className: 'bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden',
                style: {
                    '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
                },
                side,
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, {
                        className: 'sr-only',
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: 'Sidebar' }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, {
                                children: 'Displays the mobile sidebar.',
                            }),
                        ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                        className: 'flex h-full w-full flex-col',
                        children,
                    }),
                ],
            }),
        });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('aside', {
        className: 'group peer text-sidebar-foreground hidden md:block',
        'data-state': state,
        'data-collapsible': state === 'collapsed' ? collapsible : '',
        'data-variant': variant,
        'data-side': side,
        'data-slot': 'sidebar',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                'data-slot': 'sidebar-gap',
                className: cn(
                    'relative w-(--sidebar-width) bg-transparent motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-linear',
                    'group-data-[collapsible=offcanvas]:w-0',
                    'group-data-[side=right]:rotate-180',
                    variant === 'floating' || variant === 'inset'
                        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
                        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
                ),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                'data-slot': 'sidebar-container',
                className: cn(
                    'fixed inset-y-0 z-10 hidden h-full w-(--sidebar-width) motion-safe:transition-[left,right,width] motion-safe:duration-200 motion-safe:ease-linear md:flex',
                    side === 'left'
                        ? 'left-0 group-data-[collapsible=offcanvas]:-left-(--sidebar-width)'
                        : 'right-0 group-data-[collapsible=offcanvas]:-right-(--sidebar-width)',
                    // Adjust the padding for floating and inset variants.
                    variant === 'floating' || variant === 'inset'
                        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
                    className
                ),
                ...props,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                    'data-sidebar': 'sidebar',
                    'data-slot': 'sidebar-inner',
                    className:
                        'bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm',
                    children,
                }),
            }),
        ],
    });
}
function SidebarContent({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        'data-slot': 'sidebar-content',
        'data-sidebar': 'content',
        className: cn(
            'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
            className
        ),
        ...props,
    });
}
function SidebarGroup({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        'data-slot': 'sidebar-group',
        'data-sidebar': 'group',
        className: cn('relative flex w-full min-w-0 flex-col p-2', className),
        ...props,
    });
}
function SidebarHeader({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('header', {
        'data-slot': 'sidebar-header',
        'data-sidebar': 'header',
        className: cn('flex flex-col gap-2 p-2', className),
        ...props,
    });
}
function SidebarFooter({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('footer', {
        'data-slot': 'sidebar-footer',
        'data-sidebar': 'footer',
        className: cn('flex flex-col gap-2 p-2', className),
        ...props,
    });
}
function SidebarInset({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('main', {
        'data-slot': 'sidebar-inset',
        className: cn(
            'bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
            className
        ),
        ...props,
    });
}
function SidebarMenu({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('ul', {
        'data-slot': 'sidebar-menu',
        'data-sidebar': 'menu',
        className: cn('flex w-full min-w-0 flex-col gap-1', className),
        ...props,
    });
}
function SidebarMenuButton({
    render,
    isActive = false,
    variant = 'default',
    size = 'default',
    tooltip,
    className,
    ...props
}) {
    const { isMobile, state } = useSidebarContext();
    const comp = useRender({
        defaultTagName: 'button',
        props: mergeProps(
            {
                className: cn(sidebarMenuButtonVariants({ variant, size }), className),
            },
            props
        ),
        render: !tooltip ? render : /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { render }),
        state: {
            slot: 'sidebar-menu-button',
            sidebar: 'menu-button',
            size,
            active: isActive,
        },
    });
    if (!tooltip) {
        return comp;
    }
    if (typeof tooltip === 'string') {
        tooltip = {
            children: tooltip,
        };
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, {
        disableHoverablePopup: true,
        children: [
            comp,
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, {
                side: 'right',
                align: 'center',
                hidden: state !== 'collapsed' || isMobile,
                ...tooltip,
            }),
        ],
    });
}
function SidebarMenuItem({ className, ...rest }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('li', {
        'data-slot': 'sidebar-menu-item',
        'data-sidebar': 'menu-item',
        className: cn('group/menu-item relative', className),
        ...rest,
    });
}
function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
    const [width] = reactExports.useState(() => {
        return `${Math.floor(Math.random() * 40) + 50}%`;
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
        'data-slot': 'sidebar-menu-skeleton',
        'data-sidebar': 'menu-skeleton',
        className: cn('h-8 group-data-[state=expanded]:gap-2 rounded-md px-2 flex items-center', className),
        ...props,
        children: [
            showIcon &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                    className: 'size-4 rounded-md',
                    'data-sidebar': 'menu-skeleton-icon',
                }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: 'h-4 flex-1 max-w-(--skeleton-width)',
                'data-sidebar': 'menu-skeleton-text',
                style: {
                    '--skeleton-width': width,
                },
            }),
        ],
    });
}
function SidebarRail({ className, ...props }) {
    const { toggleSidebar } = useSidebarContext();
    return /* @__PURE__ */ jsxRuntimeExports.jsx('button', {
        'data-sidebar': 'rail',
        'data-slot': 'sidebar-rail',
        'aria-label': 'Toggle Sidebar',
        tabIndex: -1,
        onClick: toggleSidebar,
        className: cn(
            'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 motion-safe:transition-all motion-safe:ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 sm:flex in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
            className
        ),
        ...props,
    });
}
function SidebarTrigger({ className, onClick, ...props }) {
    const { toggleSidebar } = useSidebarContext();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
        'data-sidebar': 'trigger',
        'data-slot': 'sidebar-trigger',
        variant: 'ghost',
        size: 'icon-sm',
        className: cn('size-7', className),
        onClick: (event) => {
            onClick?.(event);
            toggleSidebar();
        },
        ...props,
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeft, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx('span', { className: 'sr-only', children: 'Toggle Sidebar' }),
        ],
    });
}
export {
    SidebarProvider as S,
    SidebarInset as a,
    Sidebar as b,
    SidebarHeader as c,
    SidebarContent as d,
    SidebarFooter as e,
    SidebarRail as f,
    SidebarMenu as g,
    SidebarMenuItem as h,
    SidebarMenuButton as i,
    SidebarGroup as j,
    SidebarMenuSkeleton as k,
    Skeleton as l,
    SIDEBAR_COOKIE_NAME as m,
    SidebarTrigger as n,
    Sheet as o,
    SheetContent as p,
    SheetHeader as q,
    SheetTitle as r,
    SheetDescription as s,
    useSidebarContext as u,
};
