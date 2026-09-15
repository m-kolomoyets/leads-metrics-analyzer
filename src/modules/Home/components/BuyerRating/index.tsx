import type { BuyerRatingProps, BuyerRatingRow } from './types';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { RATING_SORTS } from '@/lib/domain/periodRollup';
import { cn } from '@/lib/utils/cn';
import { ZONE_TEXT_CLASS } from '@/components/report/constants';
import { flagEmoji, int, pct, usd, usdSigned } from '@/components/report/utils/format';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { RATING_SORT_LABELS } from '../../constants';

// The period's people (offers-and-home/16, PRD stories 55–56): one row per buyer the viewer may see,
// off the same frozen rows the map was painted from, profit-first or weighted-ROI-first. A row
// opens into the buyer's markets in place — same columns, so the eye stays on one grid — and the
// name is a link to their Dynamics. Never rendered for a buyer: they get `MyStats` instead.
function BuyerRating({ rows, sort, onSortChange, isLoading = false }: BuyerRatingProps) {
    const [expanded, setExpanded] = useState<string[]>([]);
    // A single buyer's total would restate their row (CONTEXT.md, Total / avg footer).
    const showsFooter = rows.length > 1;

    function handleToggle(buyerUserId: string) {
        setExpanded((previous) => {
            return previous.includes(buyerUserId)
                ? previous.filter((id) => {
                      return id !== buyerUserId;
                  })
                : [...previous, buyerUserId];
        });
    }

    function renderBody() {
        if (isLoading) {
            return <Loader />;
        }

        if (rows.length === 0) {
            return <p className="text-muted-foreground text-xs">Nobody pushed a report in this period.</p>;
        }

        const total = totalOf(rows);

        return (
            <Table density="compact" className="text-xs">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-8">#</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead isNumeric>Spend⁺</TableHead>
                        <TableHead isNumeric>Revenue</TableHead>
                        <TableHead isNumeric>Profit</TableHead>
                        <TableHead isNumeric>ROI</TableHead>
                        <TableHead isNumeric>Geos</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => {
                        const isOpen = expanded.includes(row.buyerUserId);

                        return (
                            <RatingRow
                                key={row.buyerUserId}
                                row={row}
                                isOpen={isOpen}
                                onToggle={() => {
                                    handleToggle(row.buyerUserId);
                                }}
                            />
                        );
                    })}
                </TableBody>
                {showsFooter && (
                    <TableFooter>
                        <TableRow>
                            <TableCell />
                            <TableCell>Total</TableCell>
                            <TableCell isNumeric>{usd(total.spend)}</TableCell>
                            <TableCell isNumeric>{usd(total.revenue)}</TableCell>
                            <TableCell isNumeric>{usdSigned(total.profit)}</TableCell>
                            <TableCell isNumeric>{pct(total.roi)}</TableCell>
                            <TableCell isNumeric>{int(total.activeGeos)}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        );
    }

    return (
        <section aria-label="Buyer rating" className="flex min-w-0 flex-col gap-2">
            <header className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Buyer rating</h2>
                <Segmented label="Rating sort" mode="toggle">
                    {RATING_SORTS.map((option) => {
                        return (
                            <SegmentedItem
                                key={option}
                                selected={option === sort}
                                onSelect={() => {
                                    onSortChange(option);
                                }}
                                className="px-2 py-0.5 text-xs"
                            >
                                {RATING_SORT_LABELS[option]}
                            </SegmentedItem>
                        );
                    })}
                </Segmented>
            </header>

            {renderBody()}
        </section>
    );
}

type RatingRowProps = {
    row: BuyerRatingRow;
    isOpen: boolean;
    onToggle: () => void;
};

// The buyer's row, followed by their markets while open. The markets are rows of the same table,
// not a nested one, so their figures sit under the buyer's own.
function RatingRow({ row, isOpen, onToggle }: RatingRowProps) {
    return (
        <>
            <TableRow>
                <TableCell className="text-muted-foreground">{row.rank}</TableCell>
                <TableCell className="font-medium">
                    <span className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-expanded={isOpen}
                            aria-label={isOpen ? `Collapse ${row.nickname}` : `Expand ${row.nickname}`}
                            onClick={onToggle}
                            className="-ml-1 size-5"
                        >
                            <span aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
                        </Button>
                        <Link
                            to="/dashboard/dynamics"
                            search={{ buyer: row.buyerUserId }}
                            className="max-w-40 truncate underline-offset-2 hover:underline"
                            title={`${row.nickname} — open Dynamics`}
                        >
                            {row.nickname}
                        </Link>
                    </span>
                </TableCell>
                <TableCell isNumeric className="text-muted-foreground">
                    {usd(row.spend)}
                </TableCell>
                <TableCell isNumeric>{usd(row.revenue)}</TableCell>
                <TableCell isNumeric className="font-medium">
                    {usdSigned(row.profit)}
                </TableCell>
                <TableCell
                    isNumeric
                    className={cn('font-medium', ZONE_TEXT_CLASS[row.zone])}
                    title={row.isThin ? 'Too little data — revenue under $500' : undefined}
                >
                    {pct(row.roi)}
                    {row.isThin && <span className="text-muted-foreground ml-1 font-normal">(thin)</span>}
                </TableCell>
                <TableCell isNumeric>{int(row.activeGeos)}</TableCell>
            </TableRow>

            {isOpen &&
                row.geos.map((market) => {
                    return (
                        <TableRow key={market.geo} className="bg-muted/40">
                            <TableCell />
                            <TableCell className="pl-7">
                                <span aria-hidden="true" className="mr-1">
                                    {flagEmoji(market.geo)}
                                </span>
                                {market.geo}
                            </TableCell>
                            <TableCell isNumeric className="text-muted-foreground">
                                {usd(market.spend)}
                            </TableCell>
                            <TableCell isNumeric>{usd(market.revenue)}</TableCell>
                            <TableCell isNumeric>{usdSigned(market.profit)}</TableCell>
                            <TableCell isNumeric className={ZONE_TEXT_CLASS[market.zone]}>
                                {pct(market.roi)}
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    );
                })}
        </>
    );
}

type Total = {
    spend: number;
    revenue: number;
    profit: number;
    roi: number | null;
    activeGeos: number;
};

// The footer's roll-up: money summed, ROI re-derived from the sums (CONTEXT.md), the geo count the
// distinct markets anyone moved money in — a market two buyers ran is one market.
const totalOf = (rows: BuyerRatingRow[]): Total => {
    const spend = rows.reduce((sum, row) => {
        return sum + row.spend;
    }, 0);
    const revenue = rows.reduce((sum, row) => {
        return sum + row.revenue;
    }, 0);
    const profit = revenue - spend;
    const active = new Set(
        rows.flatMap((row) => {
            return row.geos
                .filter((market) => {
                    return market.spend > 0 || market.revenue > 0;
                })
                .map((market) => {
                    return market.geo;
                });
        })
    );

    return { spend, revenue, profit, roi: spend > 0 ? (profit / spend) * 100 : null, activeGeos: active.size };
};

export { BuyerRating };
