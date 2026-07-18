import type { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';

export type ComboboxInputProps = ComboboxPrimitive.Input.Props;
export type ComboboxTriggerProps = ComboboxPrimitive.Trigger.Props;
export type ComboboxInputGroupProps = ComboboxPrimitive.InputGroup.Props;
export type ComboboxListProps = ComboboxPrimitive.List.Props;
export type ComboboxItemProps = ComboboxPrimitive.Item.Props;
export type ComboboxEmptyProps = ComboboxPrimitive.Empty.Props;
export type ComboboxContentProps = ComboboxPrimitive.Popup.Props & {
    positionerProps?: ComboboxPrimitive.Positioner.Props;
};
