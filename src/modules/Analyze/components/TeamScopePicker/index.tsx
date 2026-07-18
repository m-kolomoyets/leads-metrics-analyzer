import type { AdminTeam } from '@/services/admin/types';
import type { Locale } from '../../utils/i18n';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxInputGroup,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from '@/components/ui/Combobox';
import { ui } from '../../utils/i18n';

type TeamScopeItem = {
    id: string | null;
    name: string;
};

type TeamScopePickerProps = {
    teams: AdminTeam[];
    value: string | null;
    locale: Locale;
    onChange: (teamId: string | null) => void;
};

// Head-only picker for which shared-settings scope to view/edit: the global (null-team) row or any
// team's. Searchable Combobox — the global row leads the list. Non-Head roles never render this (the
// server pins them to their own team regardless).
function TeamScopePicker({ teams, value, locale, onChange }: TeamScopePickerProps) {
    const items: TeamScopeItem[] = [{ id: null, name: ui('globalSettings', locale) }, ...teams];
    // Derive the selected item from the same array instance so it is reference-equal to a list item.
    const selected =
        items.find((item) => {
            return item.id === value;
        }) ?? items[0];

    return (
        <Combobox
            items={items}
            value={selected}
            onValueChange={(item) => {
                onChange(item?.id ?? null);
            }}
            itemToStringLabel={(item) => {
                return item.name;
            }}
        >
            <ComboboxInputGroup className="w-64">
                <ComboboxInput placeholder={ui('team', locale)} />
                <ComboboxTrigger />
            </ComboboxInputGroup>
            <ComboboxContent>
                <ComboboxEmpty>{ui('noResults', locale)}</ComboboxEmpty>
                <ComboboxList>
                    {(item) => {
                        return (
                            <ComboboxItem key={item.id ?? 'global'} value={item}>
                                {item.name}
                            </ComboboxItem>
                        );
                    }}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

export { TeamScopePicker };
