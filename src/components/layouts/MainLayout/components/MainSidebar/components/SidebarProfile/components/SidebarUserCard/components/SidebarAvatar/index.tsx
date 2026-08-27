import type { SidebarAvatarProps } from './types';
import { cn } from '@/lib/utils/cn';
import { getNameInitials } from '@/lib/utils/getNameInitials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

function SidebarAvatar({ className, name, avatarUrl }: SidebarAvatarProps) {
    const userInitials = getNameInitials(name);

    return (
        <Avatar className={cn('size-7 rounded-sm', className)}>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="rounded-sm text-xs">{userInitials}</AvatarFallback>
        </Avatar>
    );
}

export { SidebarAvatar };
