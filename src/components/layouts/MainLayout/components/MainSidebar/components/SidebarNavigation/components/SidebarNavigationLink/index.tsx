import type { SidebarNavigationLinkProps } from './types';
import { Link } from '@tanstack/react-router';
import { SidebarMenuButton } from '@/components/Sidebar';

function SidebarNavigationLink({ activeProps, activeOptions, tooltipText, ...props }: SidebarNavigationLinkProps) {
    return (
        <SidebarMenuButton
            tooltip={tooltipText}
            render={
                <Link
                    activeOptions={{
                        exact: true,
                        ...activeOptions,
                    }}
                    activeProps={{
                        // The one accent in the sidebar: the route the reader is on. Hover and press
                        // stay achromatic so this is the only thing painted.
                        className: 'bg-hover-strong text-foreground font-medium',
                        ...activeProps,
                    }}
                    {...props}
                />
            }
        />
    );
}

export { SidebarNavigationLink };
