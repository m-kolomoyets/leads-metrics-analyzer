import type { SidebarNavigationLinkItem } from './constants';

export type SidebarNavigationProps = {
    items: SidebarNavigationLinkItem[];
    // The group's column head — what these rows have in common, said the way the tables say it.
    label: string;
    className?: string;
};
