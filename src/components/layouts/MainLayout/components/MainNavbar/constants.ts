import type { LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import type { RolePermissionsKeys } from '@/lib/utils/auth/permissions';
import {
    ChartColumnBigIcon,
    FileTextIcon,
    HouseIcon,
    ShieldUserIcon,
    SlidersHorizontalIcon,
    TagIcon,
    TrendingUpIcon,
} from 'lucide-react';

export type NavbarLinkItem = {
    label: string;
    Icon: LucideIcon;
    linkProps: LinkProps;
    rolePermissionKey?: RolePermissionsKeys;
};

// Home · Offers · Reports · Dynamics · Analyze · Presets (offers-and-home PRD): the two new surfaces
// lead because they are where a session now starts, and the push feed is "Reports" from here on —
// one of several reports, not the dashboard the app opens on.
export const NAVBAR_LINK_LIST: NavbarLinkItem[] = [
    {
        label: 'Home',
        Icon: HouseIcon,
        linkProps: {
            to: '/home',
        },
        rolePermissionKey: 'home.view',
    },
    {
        label: 'Offers',
        Icon: TagIcon,
        linkProps: {
            to: '/offers',
        },
        rolePermissionKey: 'offers.view',
    },
    {
        label: 'Reports',
        Icon: FileTextIcon,
        linkProps: {
            to: '/dashboard',
        },
        rolePermissionKey: 'report.view',
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

// Kept out of the list above on purpose: Admin is not another view onto the same work, it is a
// different job, and most roles cannot open it at all. It rides at the trailing end of the same row,
// past a hairline, so the reader reads four reports and then one door out of them.
export const NAVBAR_SYSTEM_LINK_LIST: NavbarLinkItem[] = [
    {
        label: 'Admin',
        Icon: ShieldUserIcon,
        linkProps: {
            to: '/admin',
        },
        rolePermissionKey: 'admin.view',
    },
];
