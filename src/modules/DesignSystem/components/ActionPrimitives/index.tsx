import { PlusIcon, TrashIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Toggle, ToggleGroup } from '@/components/ui/ToggleGroup';
import { Specimen } from '../Specimen';

const BUTTON_VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const;
const BUTTON_SIZES = ['xs', 'sm', 'default', 'lg'] as const;
const ICON_SIZES = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const;
const BADGE_VARIANTS = [
    'default',
    'secondary',
    'destructive',
    'success',
    'warning',
    'danger',
    'outline',
    'ghost',
    'link',
] as const;

// Button, Badge and the toggle tray. Hover and focus-visible are the two states no static render can
// show — reach for them with the pointer and the Tab key; everything else is on the page.
function ActionPrimitives() {
    return (
        <>
            <Specimen label="Button — variants">
                {BUTTON_VARIANTS.map((variant) => {
                    return (
                        <Button key={variant} variant={variant}>
                            {variant}
                        </Button>
                    );
                })}
            </Specimen>

            <Specimen label="Button — sizes">
                {BUTTON_SIZES.map((size) => {
                    return (
                        <Button key={size} variant="outline" size={size}>
                            {size}
                        </Button>
                    );
                })}
            </Specimen>

            <Specimen label="Button — icon sizes, strokeWidth 1.5">
                {ICON_SIZES.map((size) => {
                    return (
                        <Button key={size} variant="outline" size={size} aria-label={`Add (${size})`}>
                            <PlusIcon strokeWidth={1.5} />
                        </Button>
                    );
                })}
            </Specimen>

            <Specimen label="Button — with icons">
                <Button variant="outline">
                    <PlusIcon data-icon="inline-start" strokeWidth={1.5} />
                    Leading
                </Button>
                <Button variant="destructive">
                    <TrashIcon data-icon="inline-start" strokeWidth={1.5} />
                    Delete
                </Button>
            </Specimen>

            <Specimen label="Button — disabled, loading, invalid">
                <Button disabled={true}>disabled</Button>
                <Button variant="outline" disabled={true}>
                    disabled
                </Button>
                <Button isLoading={true}>loading</Button>
                <Button variant="outline" aria-invalid={true}>
                    invalid
                </Button>
            </Specimen>

            <Specimen label="Badge — variants">
                {BADGE_VARIANTS.map((variant) => {
                    return (
                        <Badge key={variant} variant={variant}>
                            {variant}
                        </Badge>
                    );
                })}
            </Specimen>

            <Specimen label="Badge — with icon, invalid">
                <Badge variant="outline">
                    <PlusIcon strokeWidth={1.5} />
                    with icon
                </Badge>
                <Badge variant="outline" aria-invalid={true}>
                    invalid
                </Badge>
            </Specimen>

            <Specimen label="ToggleGroup — single select, one pressed">
                <ToggleGroup aria-label="Figure" defaultValue={['leads']}>
                    <Toggle value="leads">Leads</Toggle>
                    <Toggle value="spend">Spend</Toggle>
                    <Toggle value="cpl">CPL</Toggle>
                </ToggleGroup>
            </Specimen>

            <Specimen label="ToggleGroup — multiple, disabled member">
                <ToggleGroup multiple={true} aria-label="Cost metrics" defaultValue={['cpl', 'cpa']}>
                    <Toggle value="cpl">CPL</Toggle>
                    <Toggle value="cpa">CPA</Toggle>
                    <Toggle value="cpc" disabled={true}>
                        CPC
                    </Toggle>
                </ToggleGroup>
            </Specimen>

            <Specimen label="ToggleGroup — whole group disabled">
                <ToggleGroup aria-label="Disabled group" disabled={true} defaultValue={['leads']}>
                    <Toggle value="leads">Leads</Toggle>
                    <Toggle value="spend">Spend</Toggle>
                </ToggleGroup>
            </Specimen>
        </>
    );
}

export { ActionPrimitives };
