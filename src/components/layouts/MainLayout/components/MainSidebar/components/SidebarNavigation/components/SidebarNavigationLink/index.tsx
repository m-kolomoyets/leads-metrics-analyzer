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
                        // Where the reader IS, said three ways and in no colour at all: the wash one
                        // step up from hover, the weight, and a marker down the row's leading edge.
                        // The accent is spent on the focus ring and nothing else here (ADR-0019), so
                        // "where I am" and "what I am pointing at" differ in weight, not in hue.
                        className:
                            'bg-hover-strong text-foreground relative font-medium before:bg-foreground before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full',
                        ...activeProps,
                    }}
                    {...props}
                />
            }
        />
    );
}

export { SidebarNavigationLink };
