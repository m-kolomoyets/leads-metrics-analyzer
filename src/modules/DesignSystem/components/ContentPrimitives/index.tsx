import { FileSearchIcon } from 'lucide-react';
import { noop } from '@/lib/utils/noop';
import { Figure } from '@/components/Figure';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/Accordion';
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Card } from '@/components/ui/Card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/Empty';
import { Loader } from '@/components/ui/Loader';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';
import { Specimen } from '../Specimen';

// A fixed day, not "today": the page is a comparison surface and a month that changes underfoot makes
// two screenshots disagree for the wrong reason.
const SAMPLE_DAY = new Date(2026, 7, 3);

function ContentPrimitives() {
    return (
        <>
            <Specimen label="Figure — the three-line readout: label, figure + demoted unit, meta">
                <Figure label="Spend" value="$12,480.55" unit="USD" size="lg" />
                <Figure label="ROI" value="+42.1 %" size="lg" className="text-zone-green" />
                <Figure
                    label="CPI"
                    value="1.84"
                    size="lg"
                    className="text-zone-yellow"
                    meta="green < 1.20 · red > 2.00"
                />
                <Figure label="Installs" value="6,204" size="md" />
            </Specimen>

            <Specimen label="Accordion — one panel open, one closed, one disabled">
                <Accordion defaultValue={['open']} className="w-full max-w-md gap-2">
                    <AccordionItem value="open" className="border-border rounded-md border p-2">
                        <AccordionHeader>
                            <AccordionTrigger>Open by default</AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel>
                            <p className="text-muted-foreground pt-2 text-sm">
                                The panel animates its height, and nothing else.
                            </p>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem value="closed" className="border-border rounded-md border p-2">
                        <AccordionHeader>
                            <AccordionTrigger>Closed</AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel>
                            <p className="text-muted-foreground pt-2 text-sm">Opened on click.</p>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem value="disabled" disabled={true} className="border-border rounded-md border p-2">
                        <AccordionHeader>
                            <AccordionTrigger>Disabled</AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel>
                            <p className="text-muted-foreground pt-2 text-sm">Unreachable.</p>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Specimen>

            <Specimen label="Avatar — sizes, image, fallback, badge, group">
                <Avatar size="sm">
                    <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                    <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage src="/icon.svg" alt="" />
                    <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarFallback>MK</AvatarFallback>
                    <AvatarBadge />
                </Avatar>
                <AvatarGroup>
                    <Avatar>
                        <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                    <Avatar>
                        <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount>+3</AvatarGroupCount>
                </AvatarGroup>
            </Specimen>

            <Specimen label="Card — one card, no variants">
                <Card className="w-56 p-3">
                    <p className="text-sm font-medium">Card</p>
                    <p className="text-muted-foreground text-xs">
                        Inline surface: one hairline border, a lightness step, no shadow.
                    </p>
                </Card>
                <Card className="w-56 gap-2 p-3">
                    <p className="text-sm font-medium">Nested</p>
                    <Card className="p-2">
                        <p className="text-muted-foreground text-xs">Two hairlines, one step — a subsection.</p>
                    </Card>
                </Card>
            </Specimen>

            <Specimen label="Calendar — a selected day, an outside month, today">
                <Calendar mode="single" required={true} selected={SAMPLE_DAY} month={SAMPLE_DAY} onSelect={noop} />
            </Specimen>

            <Specimen label="Empty">
                <Empty className="border-border w-full max-w-md rounded-md border">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FileSearchIcon />
                        </EmptyMedia>
                        <EmptyTitle>No snapshots yet</EmptyTitle>
                        <EmptyDescription>Import a Keitaro export to see a report here.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button variant="outline">Import</Button>
                    </EmptyContent>
                </Empty>
            </Specimen>

            <Specimen label="Loader">
                <Loader />
                <Loader className="size-3" />
            </Specimen>

            <Specimen label="Separator — horizontal and vertical">
                <div className="w-40">
                    <Separator />
                </div>
                <div className="flex h-8 items-center">
                    <Separator orientation="vertical" />
                </div>
            </Specimen>

            <Specimen label="Skeleton">
                <div className="flex w-56 flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="size-8 rounded-full" />
                </div>
            </Specimen>
        </>
    );
}

export { ContentPrimitives };
