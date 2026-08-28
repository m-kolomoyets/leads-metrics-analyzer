import { Skeleton } from '@/components/ui/Skeleton';

function NavbarProfileFallback() {
    return (
        <div className="flex h-9 items-center gap-2 pr-2.5 pl-1.5">
            <Skeleton className="size-7 shrink-0 rounded-sm" />
            <Skeleton className="hidden h-3 w-32 lg:block" />
        </div>
    );
}

export { NavbarProfileFallback };
