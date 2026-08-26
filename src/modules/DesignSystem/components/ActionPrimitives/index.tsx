import { PlusIcon, TrashIcon } from 'lucide-react';
import { noop } from '@/lib/utils/noop';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';
import { Toggle, ToggleGroup } from '@/components/ui/ToggleGroup';
import { Specimen } from '../Specimen';

const BUTTON_VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const;
const BUTTON_SIZES = ['xs', 'sm', 'default', 'lg'] as const;
const ICON_SIZES = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const;
const BADGE_VARIANTS = [
    'default',
    'secondary',
    'destructive',
    'green',
    'yellow',
    'red',
    'neutral',
    'outline',
    'ghost',
    'link',
] as const;

// Button, Badge, the toggle tray and the row-of-choices control. Hover and focus-visible are the two
// states no static render can show — reach for them with the pointer and the Tab key; everything else
// is on the page.
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
                            <PlusIcon />
                        </Button>
                    );
                })}
            </Specimen>

            <Specimen label="Button — with icons">
                <Button variant="outline">
                    <PlusIcon data-icon="inline-start" />
                    Leading
                </Button>
                <Button variant="destructive">
                    <TrashIcon data-icon="inline-start" />
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
                    <PlusIcon />
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

            <Specimen label="Segmented — tabs, second selected">
                <Segmented label="Geo">
                    <SegmentedItem selected={false} onSelect={noop}>
                        🇺🇦 UA
                    </SegmentedItem>
                    <SegmentedItem selected={true} onSelect={noop}>
                        🇩🇪 DE
                    </SegmentedItem>
                    <SegmentedItem selected={false} onSelect={noop}>
                        🇵🇱 PL
                        <span className="text-muted-foreground text-xs tabular-nums">$1.2k</span>
                    </SegmentedItem>
                </Segmented>
            </Specimen>

            <Specimen label="Segmented — tabs carrying a Zone in their own text">
                <Segmented label="Buyer">
                    <SegmentedItem selected={true} onSelect={noop} className="text-zone-red">
                        kolya <span className="text-xs tabular-nums opacity-80">−$412</span>
                    </SegmentedItem>
                    <SegmentedItem selected={false} onSelect={noop} className="text-zone-green">
                        dima <span className="text-xs tabular-nums opacity-80">+$1,204</span>
                    </SegmentedItem>
                    <SegmentedItem selected={false} onSelect={noop} className="text-zone-yellow">
                        ⚠ sasha
                    </SegmentedItem>
                </Segmented>
            </Specimen>

            <Specimen label="Segmented — toggle (aria-pressed), first pressed">
                <Segmented label="Chart mode" mode="toggle">
                    <SegmentedItem selected={true} onSelect={noop} className="text-xs">
                        Cumulative
                    </SegmentedItem>
                    <SegmentedItem selected={false} onSelect={noop} className="text-xs">
                        Between reports
                    </SegmentedItem>
                </Segmented>
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
