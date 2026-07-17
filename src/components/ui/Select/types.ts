import type { Select as SelectPrimitive } from '@base-ui/react/select';

export type SelectTriggerProps = SelectPrimitive.Trigger.Props;
export type SelectValueProps = SelectPrimitive.Value.Props;
export type SelectContentProps = SelectPrimitive.Popup.Props & {
    positionerProps?: SelectPrimitive.Positioner.Props;
};
export type SelectItemProps = SelectPrimitive.Item.Props;
