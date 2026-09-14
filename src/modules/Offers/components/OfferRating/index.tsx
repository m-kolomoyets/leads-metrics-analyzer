import type { RatingPeriod } from '@/lib/domain/offerRating';
import type { OfferRatingProps } from './types';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { offerRating, RATING_PERIODS } from '@/lib/domain/offerRating';
import { roiZone } from '@/lib/domain/roiZone';
import { cn } from '@/lib/utils/cn';
import { offerRatingQueryOptions } from '@/services/offers/queries';
import { int, pct, usd, usdSigned } from '@/components/report/utils/format';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/Accordion';
import { Loader } from '@/components/ui/Loader';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { DEFAULT_RATING_PERIOD, RATING_PERIOD_LABELS } from './constants';

const launchFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short' });

// ROI is a reference beside the revenue that leads (PRD story 40): coloured by its Zone, never the
// sort key. Neutral (no spend) stays grey.
const ROI_CLASS = {
    green: 'text-zone-green',
    yellow: 'text-zone-yellow',
    red: 'text-zone-red',
    neutral: 'text-muted-foreground',
} as const;

// The offer buyer rating (offers-and-home/11, PRD stories 38–45): collapsed under the card, opened
// on demand, one read per period. The server hands back frozen rows within the viewer's row-scope;
// `offerRating` picks each buyer's latest push per day and prices the offer's installs at the Geo
// Unit Cost, so the spend column is an estimate and says so (story 42). Rows past 30 days dim but
// keep their place (story 43). Only rendered for roles with `seeRating` — a buyer never sees it.
function OfferRating({ card }: OfferRatingProps) {
    const [open, setOpen] = useState<string[]>([]);
    const [period, setPeriod] = useState<RatingPeriod>(DEFAULT_RATING_PERIOD);
    const isOpen = open.length > 0;
    // `useQuery`, not suspense: the card must not tear down while the rating loads, and a closed
    // panel asks for nothing.
    const { data, isPending, isError } = useQuery({
        ...offerRatingQueryOptions({ offerId: card.offerId, period }),
        enabled: isOpen,
    });
    const rows = data ? offerRating(data, data.today) : [];

    function renderBody() {
        if (isError) {
            return <p className="text-zone-red text-sm">Failed to load the rating.</p>;
        }

        if (isPending || !data) {
            return (
                <div className="flex justify-center py-4">
                    <Loader />
                </div>
            );
        }

        if (rows.length === 0) {
            return <p className="text-muted-foreground text-sm">Nobody ran this offer in the period.</p>;
        }

        return (
            <Table density="compact">
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead isNumeric>Spend (est.)</TableHead>
                        <TableHead isNumeric>Revenue</TableHead>
                        <TableHead isNumeric>Profit</TableHead>
                        <TableHead isNumeric>ROI</TableHead>
                        <TableHead isNumeric>Sales</TableHead>
                        <TableHead isNumeric>Last launch</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, index) => {
                        return (
                            <TableRow
                                key={row.buyerUserId}
                                className={cn(row.isDimmed && 'opacity-60')}
                                title={row.isDimmed ? 'Last launch more than 30 days ago' : undefined}
                            >
                                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                                <TableCell className="font-medium">{row.nickname}</TableCell>
                                <TableCell isNumeric>{usd(row.spend)}</TableCell>
                                <TableCell isNumeric>{usd(row.revenue)}</TableCell>
                                <TableCell isNumeric>{usdSigned(row.profit)}</TableCell>
                                <TableCell isNumeric className={ROI_CLASS[roiZone(row.roi)]}>
                                    {pct(row.roi)}
                                </TableCell>
                                <TableCell isNumeric>{int(row.sales)}</TableCell>
                                <TableCell isNumeric>
                                    <time dateTime={row.lastLaunch}>
                                        {launchFormat.format(new Date(`${row.lastLaunch}T00:00:00Z`))}
                                    </time>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }

    return (
        <Accordion value={open} onValueChange={setOpen}>
            <AccordionItem value="rating">
                <AccordionHeader className="flex flex-wrap items-center justify-between gap-2">
                    <AccordionTrigger className="text-xs">Buyer rating</AccordionTrigger>
                    {isOpen && (
                        <Segmented label="Rating period">
                            {RATING_PERIODS.map((option) => {
                                return (
                                    <SegmentedItem
                                        key={option}
                                        selected={option === period}
                                        onSelect={() => {
                                            setPeriod(option);
                                        }}
                                        className="px-2 py-0.5 text-xs"
                                    >
                                        {RATING_PERIOD_LABELS[option]}
                                    </SegmentedItem>
                                );
                            })}
                        </Segmented>
                    )}
                </AccordionHeader>
                <AccordionPanel>
                    <div className="pt-2">{renderBody()}</div>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

export { OfferRating };
