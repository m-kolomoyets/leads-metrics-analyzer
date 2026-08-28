import type { NavbarAvatarProps } from './types';
import { cn } from '@/lib/utils/cn';
import { getNameInitials } from '@/lib/utils/getNameInitials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

function NavbarAvatar({ className, name, avatarUrl }: NavbarAvatarProps) {
    const userInitials = getNameInitials(name);

    return (
        <Avatar className={cn('size-7 rounded-sm', className)}>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="rounded-sm text-xs">{userInitials}</AvatarFallback>
        </Avatar>
    );
}

export { NavbarAvatar };
