import type { LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import type { RolePermissionsKeys } from '@/lib/utils/auth/permissions';
import {
    ChartColumnBigIcon,
    LayoutDashboardIcon,
    ShieldUserIcon,
    SlidersHorizontalIcon,
    TrendingUpIcon,
} from 'lucide-react';

export type SidebarNavigationLinkItem = {
    label: string;
    Icon: LucideIcon;
    linkProps: LinkProps;
    rolePermissionKey?: RolePermissionsKeys;
};

export const SIDEBAR_NAVIGATION_LINK_LIST: SidebarNavigationLinkItem[] = [
    {
        label: 'Dashboard',
        Icon: LayoutDashboardIcon,
        linkProps: {
            to: '/dashboard',
        },
    },
    {
        label: 'Dynamics',
        Icon: TrendingUpIcon,
        linkProps: {
            to: '/dashboard/dynamics',
        },
        rolePermissionKey: 'dynamics.view',
    },
    {
        label: 'Analyze',
        Icon: ChartColumnBigIcon,
        linkProps: {
            to: '/analyze',
        },
        rolePermissionKey: 'analyze.view',
    },
    {
        label: 'Presets',
        Icon: SlidersHorizontalIcon,
        linkProps: {
            to: '/presets',
        },
        rolePermissionKey: 'presets.manage',
    },
];

// Kept out of the main list on purpose: Admin is not another view onto the same work, it is a
// different job, and most roles cannot open it at all. It rides at the foot of the sidebar, just
// above the account card, where the reader looks for "settings"-shaped things rather than for
// navigation.
export const SIDEBAR_FOOTER_NAVIGATION_LINK_LIST: SidebarNavigationLinkItem[] = [
    {
        label: 'Admin',
        Icon: ShieldUserIcon,
        linkProps: {
            to: '/admin',
        },
        rolePermissionKey: 'admin.view',
    },
];
