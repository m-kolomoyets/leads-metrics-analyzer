import type { CountryPanelProps } from './types';
import { useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ZONE_TEXT_CLASS } from '@/components/report/constants';
import { flagEmoji, pct, usd, usdSigned } from '@/components/report/utils/format';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { dayLabel } from '../../utils/format';

// One market, opened from the map (offers-and-home/14, PRD story 50): the period's totals — the very
// figures the hover card shows, read off the same rollup — and one row per buyer the viewer may see,
// best profit first. A buyer opens it on themself alone, because the rows arrive row-scoped and no
// one else's push is in them. Escape and the close button hand the selection back to the page,
// which owns it as a URL param.
function CountryPanel({ geo, name, market, buyers, isLoading = false, onClose }: CountryPanelProps) {
    useEffect(
        function closeOnEscape() {
            function handleKeyDown(event: KeyboardEvent) {
                // An open popover or dialog takes its own Escape first; this one is for the map.
                if (event.key === 'Escape' && !event.defaultPrevented) {
                    onClose();
                }
            }

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        },
        [onClose]
    );

    // A single buyer's total would restate their row (CONTEXT.md, Total / avg footer).
    const showsFooter = buyers.length > 1;

    return (
        <section
            aria-label={`${name} in this period`}
            className="border-border bg-surface flex min-w-0 flex-col gap-3 rounded-md border p-3"
        >
            <header className="flex items-start justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                    <span aria-hidden="true">{flagEmoji(geo)}</span>
                    {name}
                </h2>
                <Button variant="ghost" size="icon-sm" onClick={onClose} className="-mt-1 -mr-1">
                    <XIcon />
                    <span className="sr-only">Close</span>
                </Button>
            </header>

            {isLoading && <Loader />}

            {!isLoading && !market && (
                <p className="text-muted-foreground text-xs">No reports for {name} in this period.</p>
            )}

            {market && (
                <>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-4 lg:grid-cols-2">
                        <Stat label="Spend⁺" value={usd(market.spend)} />
                        <Stat label="Revenue" value={usd(market.revenue)} />
                        <Stat label="Profit" value={usdSigned(market.profit)} />
                        <Stat
                            label="ROI"
                            value={pct(market.roi)}
                            className={ZONE_TEXT_CLASS[market.zone]}
                            hint={market.isThin ? 'too little data' : undefined}
                        />
                    </dl>

                    <Table density="compact" className="text-xs">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Buyer</TableHead>
                                <TableHead isNumeric>Spend</TableHead>
                                <TableHead isNumeric>Rev</TableHead>
                                <TableHead isNumeric>Profit</TableHead>
                                <TableHead isNumeric>ROI</TableHead>
                                <TableHead isNumeric>Last report</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {buyers.map((row) => {
                                return (
                                    <TableRow key={row.buyerUserId}>
                                        <TableCell className="max-w-40 truncate font-medium" title={row.nickname}>
                                            {row.nickname}
                                        </TableCell>
                                        <TableCell isNumeric className="text-muted-foreground">
                                            {usd(row.spend)}
                                        </TableCell>
                                        <TableCell isNumeric>{usd(row.revenue)}</TableCell>
                                        <TableCell isNumeric className="font-medium">
                                            {usdSigned(row.profit)}
                                        </TableCell>
                                        <TableCell isNumeric className={cn('font-medium', ZONE_TEXT_CLASS[row.zone])}>
                                            {pct(row.roi)}
                                        </TableCell>
                                        <TableCell isNumeric className="text-muted-foreground whitespace-nowrap">
                                            {dayLabel(row.lastReportDate)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        {showsFooter && (
                            <TableFooter>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell isNumeric>{usd(market.spend)}</TableCell>
                                    <TableCell isNumeric>{usd(market.revenue)}</TableCell>
                                    <TableCell isNumeric>{usdSigned(market.profit)}</TableCell>
                                    <TableCell isNumeric>{pct(market.roi)}</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </>
            )}
        </section>
    );
}

type StatProps = {
    label: string;
    value: string;
    className?: string;
    hint?: string;
};

function Stat({ label, value, className, hint }: StatProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className={cn('text-sm font-semibold tabular-nums', className)}>
                {value}
                {hint && <span className="text-muted-foreground ml-1 text-xs font-normal">({hint})</span>}
            </dd>
        </div>
    );
}

export { CountryPanel };
