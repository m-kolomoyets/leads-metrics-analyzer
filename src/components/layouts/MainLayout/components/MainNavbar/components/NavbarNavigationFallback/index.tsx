import type { NavbarNavigationFallbackProps } from './types';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from '@/components/ui/Skeleton';

function NavbarNavigationFallback({ tabs = 4, className }: NavbarNavigationFallbackProps) {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            {Array.from({ length: tabs }).map((_, index) => {
                return (
                    <div key={index} className="flex h-9 items-center gap-2 px-3">
                        <Skeleton className="size-4 shrink-0 rounded-sm" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                );
            })}
        </div>
    );
}

export { NavbarNavigationFallback };
