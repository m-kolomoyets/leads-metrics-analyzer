import { CopyIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/Dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/Sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { Specimen } from '../Specimen';

const SHEET_SIDES = ['right', 'left', 'top', 'bottom'] as const;

// Everything here portals to `document.body`, which sits outside both panes — an opened dialog wears
// the app's own theme, not the pane's. Flip the switcher in the header to check the other one.
function OverlayPrimitives() {
    function showSuccessToast() {
        toast.success('Snapshot archived');
    }

    function showErrorToast() {
        toast.error('Import failed');
    }

    function showInfoToast() {
        toast('Recalculating uniques', { description: 'This runs against the whole period.' });
    }

    return (
        <>
            <Specimen label="Dialog — closed trigger, opens on click">
                <Dialog>
                    <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Archive this snapshot?</DialogTitle>
                            <DialogDescription>
                                It stays readable at its permalink; it stops appearing in the dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose render={<Button variant="ghost">Cancel</Button>} />
                            <DialogClose render={<Button>Archive</Button>} />
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Specimen>

            <Specimen label="Sheet — one trigger per side">
                {SHEET_SIDES.map((side) => {
                    return (
                        <Sheet key={side}>
                            <SheetTrigger render={<Button variant="outline">{side}</Button>} />
                            <SheetContent side={side}>
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                    <SheetDescription>Opened from the {side}.</SheetDescription>
                                </SheetHeader>
                                <SheetFooter>
                                    <SheetClose render={<Button variant="ghost">Close</Button>} />
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    );
                })}
            </Specimen>

            <Specimen label="Popover">
                <Popover>
                    <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
                    <PopoverContent className="w-64">
                        <p className="text-sm">
                            Uniques do not sum. A period total is its own query, never a column added up.
                        </p>
                    </PopoverContent>
                </Popover>
            </Specimen>

            <Specimen label="DropdownMenu — item, destructive item, checkbox, radio, submenu, shortcut">
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                            {/* The label lives inside the group: Base UI reads it through
                                MenuGroupContext and throws outside one. */}
                            <DropdownMenuLabel>Snapshot</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <CopyIcon />
                                Duplicate
                                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={true}>Disabled item</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                                <TrashIcon />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem defaultChecked={true}>Show dollar columns</DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup defaultValue="day">
                            <DropdownMenuRadioItem value="day">Day</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="week">Week</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>CSV</DropdownMenuItem>
                                <DropdownMenuItem>PDF</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Specimen>

            <Specimen label="Tooltip — hover or focus the trigger">
                <Tooltip>
                    <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
                    <TooltipContent>Spend⁺ includes fees.</TooltipContent>
                </Tooltip>
            </Specimen>

            <Specimen label="Toast — fired into the app's Toaster">
                <Button variant="outline" onClick={showSuccessToast}>
                    success
                </Button>
                <Button variant="outline" onClick={showErrorToast}>
                    error
                </Button>
                <Button variant="outline" onClick={showInfoToast}>
                    with description
                </Button>
            </Specimen>
        </>
    );
}

export { OverlayPrimitives };
