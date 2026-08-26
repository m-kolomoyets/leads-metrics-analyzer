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

type SidebarNavigationLinkItem = {
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
        rolePermissionKey: 'report.view',
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
    {
        label: 'Admin',
        Icon: ShieldUserIcon,
        linkProps: {
            to: '/admin',
        },
        rolePermissionKey: 'admin.view',
    },
];
