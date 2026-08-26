import type { ThemeName } from '../../constants';
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
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Specimen } from '../Specimen';

type FormPrimitivesProps = {
    // The tree is mounted once per theme, so every `id` is suffixed or the two panes fight over
    // which input a label points at.
    theme: ThemeName;
};

const SELECT_ITEMS = [
    { value: 'buyer', label: 'Buyer' },
    { value: 'designer', label: 'Designer' },
    { value: 'bdm', label: 'BDM' },
];

const COMBOBOX_ITEMS = ['Ukraine', 'Poland', 'Germany', 'Kazakhstan'];

function FormPrimitives({ theme }: FormPrimitivesProps) {
    return (
        <>
            <Specimen label="Input — resting, placeholder, disabled, invalid, read-only">
                <Input defaultValue="Filled" className="max-w-40" aria-label="Filled input" />
                <Input placeholder="Placeholder" className="max-w-40" aria-label="Empty input" />
                <Input defaultValue="Disabled" disabled={true} className="max-w-40" aria-label="Disabled input" />
                <Input defaultValue="Invalid" aria-invalid={true} className="max-w-40" aria-label="Invalid input" />
                <Input defaultValue="Read-only" readOnly={true} className="max-w-40" aria-label="Read-only input" />
            </Specimen>

            <Specimen label="PasswordInput — resting, disabled, invalid">
                <PasswordInput defaultValue="hunter2" className="max-w-40" aria-label="Password" />
                <PasswordInput
                    defaultValue="hunter2"
                    disabled={true}
                    className="max-w-40"
                    aria-label="Password, disabled"
                />
                <PasswordInput
                    defaultValue="hunter2"
                    aria-invalid={true}
                    className="max-w-40"
                    aria-label="Password, invalid"
                />
            </Specimen>

            <Specimen label="Label">
                <Label htmlFor={`label-demo-${theme}`}>Campaign name</Label>
                <Input id={`label-demo-${theme}`} placeholder="FB · UA · lead" className="max-w-40" />
            </Specimen>

            <Specimen label="Field — vertical, horizontal, invalid, disabled">
                <FieldGroup className="max-w-md">
                    <Field>
                        <FieldLabel htmlFor={`field-vertical-${theme}`}>Vertical</FieldLabel>
                        <Input id={`field-vertical-${theme}`} placeholder="Value" />
                        <FieldDescription>A description sits under the control.</FieldDescription>
                    </Field>
                    <Field orientation="horizontal">
                        <FieldLabel htmlFor={`field-horizontal-${theme}`}>Horizontal</FieldLabel>
                        <Input id={`field-horizontal-${theme}`} placeholder="Value" />
                    </Field>
                    <FieldSeparator />
                    <Field data-invalid={true}>
                        <FieldLabel htmlFor={`field-invalid-${theme}`}>Invalid</FieldLabel>
                        <Input id={`field-invalid-${theme}`} aria-invalid={true} defaultValue="-12" />
                        <FieldError>Spend cannot be negative.</FieldError>
                    </Field>
                    <Field data-disabled={true}>
                        <FieldLabel htmlFor={`field-disabled-${theme}`}>Disabled</FieldLabel>
                        <Input id={`field-disabled-${theme}`} disabled={true} defaultValue="Locked" />
                    </Field>
                </FieldGroup>
            </Specimen>

            <Specimen label="FieldSet — legend, title, content">
                <FieldSet className="max-w-md">
                    <FieldLegend>Thresholds</FieldLegend>
                    <FieldGroup>
                        <Field orientation="horizontal">
                            <FieldContent className="flex-1">
                                <FieldTitle>Warn above CPL</FieldTitle>
                                <FieldDescription>Amber starts here.</FieldDescription>
                            </FieldContent>
                            <Input
                                id={`fieldset-cpl-${theme}`}
                                defaultValue="3.50"
                                className="w-24 shrink-0 tabular-nums"
                                aria-label="Warn above CPL"
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </Specimen>

            <Specimen label="Select — value, placeholder, disabled, invalid">
                <Select items={SELECT_ITEMS} defaultValue="buyer">
                    <SelectTrigger className="max-w-40" aria-label="Role">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {SELECT_ITEMS.map((item) => {
                            return (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <Select items={SELECT_ITEMS}>
                    <SelectTrigger className="max-w-40" aria-label="Role, empty">
                        <SelectValue placeholder="Pick a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {SELECT_ITEMS.map((item) => {
                            return (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <Select items={SELECT_ITEMS} disabled={true}>
                    <SelectTrigger className="max-w-40" aria-label="Role, disabled">
                        <SelectValue placeholder="Disabled" />
                    </SelectTrigger>
                    <SelectContent>
                        {SELECT_ITEMS.map((item) => {
                            return (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <Select items={SELECT_ITEMS}>
                    <SelectTrigger className="max-w-40" aria-invalid={true} aria-label="Role, invalid">
                        <SelectValue placeholder="Invalid" />
                    </SelectTrigger>
                    <SelectContent>
                        {SELECT_ITEMS.map((item) => {
                            return (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </Specimen>

            <Specimen label="Combobox — resting and disabled (the popup portals to the page theme)">
                <Combobox items={COMBOBOX_ITEMS}>
                    <ComboboxInputGroup className="max-w-40">
                        <ComboboxInput placeholder="Geo" aria-label="Geo" />
                        <ComboboxTrigger aria-label="Open geo list" />
                    </ComboboxInputGroup>
                    <ComboboxContent>
                        <ComboboxEmpty>No geo found.</ComboboxEmpty>
                        <ComboboxList>
                            {COMBOBOX_ITEMS.map((item) => {
                                return (
                                    <ComboboxItem key={item} value={item}>
                                        {item}
                                    </ComboboxItem>
                                );
                            })}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
                <Combobox items={COMBOBOX_ITEMS} disabled={true}>
                    <ComboboxInputGroup className="max-w-40">
                        <ComboboxInput placeholder="Disabled" aria-label="Geo, disabled" />
                        <ComboboxTrigger aria-label="Open geo list, disabled" />
                    </ComboboxInputGroup>
                </Combobox>
            </Specimen>
        </>
    );
}

export { FormPrimitives };
