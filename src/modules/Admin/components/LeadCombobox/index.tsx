import type { SelectFieldItem } from '@/components/Form/components/SelectField/types';
import type { LeadComboboxProps } from './types';
import { Combobox } from '@base-ui/react/combobox';
import { useDebouncedState } from '@react-hookz/web';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { NO_TEAM_VALUE } from '../../constants';

// Searchable, debounced lead picker (filters by user email). Base UI Combobox with client filtering
// disabled (`filter={null}`) so we control the visible set from a debounced query — the list narrows
// 300ms after the last keystroke, not on every one.
const SEARCH_DEBOUNCE_MS = 300;

const itemToLabel = (item: SelectFieldItem | null) => {
    return item?.label ?? '';
};

const isItemEqualToValue = (item: SelectFieldItem, value: SelectFieldItem) => {
    return item.value === value.value;
};

function LeadCombobox({ value, options, onChange, disabled }: LeadComboboxProps) {
    const [query, setQuery] = useDebouncedState('', SEARCH_DEBOUNCE_MS);

    const normalized = query.trim().toLowerCase();
    const filtered = normalized
        ? options.filter((option) => {
              return option.label.toLowerCase().includes(normalized);
          })
        : options;

    const selected =
        options.find((option) => {
            return option.value === value;
        }) ?? null;

    return (
        <Combobox.Root
            items={filtered}
            value={selected}
            filter={null}
            disabled={disabled}
            itemToStringLabel={itemToLabel}
            isItemEqualToValue={isItemEqualToValue}
            onValueChange={(next) => {
                onChange(next ? next.value : NO_TEAM_VALUE);
            }}
            onInputValueChange={(text) => {
                setQuery(text);
            }}
        >
            <Combobox.InputGroup
                className={cn(
                    'border-input focus-ring-within flex h-8 w-full max-w-64 items-center gap-2 rounded-md border bg-transparent px-2.5 py-1 motion-safe:transition-colors motion-safe:duration-150'
                )}
            >
                <Combobox.Input
                    placeholder="Search lead…"
                    className="placeholder:text-faint w-full min-w-0 bg-transparent text-sm outline-none"
                />
                <Combobox.Icon className="text-muted-foreground shrink-0">
                    <ChevronsUpDownIcon className="size-3.5" />
                </Combobox.Icon>
            </Combobox.InputGroup>
            <Combobox.Portal>
                <Combobox.Positioner sideOffset={4} className="z-50 outline-none">
                    <Combobox.Popup className="bg-popover px-2 py-1.5 text-popover-foreground border-border max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] shadow-overlay overflow-y-auto rounded-lg border p-1 outline-none">
                        <Combobox.Empty className="text-muted-foreground  text-sm">No users found</Combobox.Empty>
                        <Combobox.List>
                            {(item: SelectFieldItem) => {
                                return (
                                    <Combobox.Item
                                        key={item.value}
                                        value={item}
                                        className="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1.5 pl-2 pr-8 text-sm outline-none"
                                    >
                                        {item.label}
                                        <Combobox.ItemIndicator className="absolute right-2 flex items-center">
                                            <CheckIcon className="size-4" />
                                        </Combobox.ItemIndicator>
                                    </Combobox.Item>
                                );
                            }}
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    );
}

export { LeadCombobox };
