import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { LogoutItem } from './components/LogoutItem';
import { NavbarUserCard } from './components/NavbarUserCard';
import { ThemeItem } from './components/ThemeItem';

// The account sits at the trailing end of the bar, where every admin tool in the reader's day keeps
// it. Collapsed to the avatar alone below `lg` — the address is the first thing a narrow bar can
// afford to drop, and the dropdown says it in full the moment it opens.
function NavbarProfile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" size="lg" className="gap-2 pl-1.5">
                        <NavbarUserCard withDetails={false} />
                        <ChevronDownIcon className="text-muted-foreground" />
                    </Button>
                }
            />
            <DropdownMenuContent className="min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
                <NavbarUserCard className="px-2 py-1.5" />
                <DropdownMenuSeparator />
                <ThemeItem />
                <DropdownMenuSeparator />
                <LogoutItem />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export { NavbarProfile };
