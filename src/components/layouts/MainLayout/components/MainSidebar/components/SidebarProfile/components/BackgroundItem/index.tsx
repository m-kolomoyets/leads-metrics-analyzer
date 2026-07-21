import { SparklesIcon } from 'lucide-react';
import { useBackground } from '@/context/BackgroundContext';
import { DropdownMenuCheckboxItem, DropdownMenuGroup } from '@/components/ui/DropdownMenu';

function BackgroundItem() {
    const { isAnimated, setAnimated } = useBackground();

    return (
        <DropdownMenuGroup>
            <DropdownMenuCheckboxItem checked={isAnimated} onCheckedChange={setAnimated} closeOnClick={false}>
                <SparklesIcon />
                Animated background
            </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
    );
}

export { BackgroundItem };
