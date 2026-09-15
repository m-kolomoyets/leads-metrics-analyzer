import type { MyStatsProps } from './types';
import { cn } from '@/lib/utils/cn';
import { ZONE_TEXT_CLASS } from '@/components/report/constants';
import { flagEmoji, int, pct, usd, usdSigned } from '@/components/report/utils/format';
import { Loader } from '@/components/ui/Loader';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Stat } from '../Stat';

// A buyer's own period (offers-and-home/16, PRD story 57): totals and one row per market worked,
// in place of the rating — nobody is ranked in front of them (story 45). The figures are the
// viewer's single rating row, since the server hands a buyer no one else's pushes.
function MyStats({ stats, isLoading = false }: MyStatsProps) {
    // One market's total would restate its row (CONTEXT.md, Total / avg footer).
    const showsFooter = stats !== undefined && stats.geos.length > 1;

    function renderBody() {
        if (isLoading) {
            return <Loader />;
        }

        if (!stats) {
            return <p className="text-muted-foreground text-xs">You pushed no report in this period.</p>;
        }

        return (
            <>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-5">
                    <Stat label="Spend⁺" value={usd(stats.spend)} />
                    <Stat label="Revenue" value={usd(stats.revenue)} />
                    <Stat label="Profit" value={usdSigned(stats.profit)} />
                    <Stat
                        label="ROI"
                        value={pct(stats.roi)}
                        className={ZONE_TEXT_CLASS[stats.zone]}
                        hint={stats.isThin ? 'too little data' : undefined}
                    />
                    <Stat label="Active geos" value={int(stats.activeGeos)} />
                </dl>

                <Table density="compact" className="text-xs">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Geo</TableHead>
                            <TableHead isNumeric>Spend⁺</TableHead>
                            <TableHead isNumeric>Revenue</TableHead>
                            <TableHead isNumeric>Profit</TableHead>
                            <TableHead isNumeric>ROI</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stats.geos.map((market) => {
                            return (
                                <TableRow key={market.geo}>
                                    <TableCell className="font-medium">
                                        <span aria-hidden="true" className="mr-1">
                                            {flagEmoji(market.geo)}
                                        </span>
                                        {market.geo}
                                    </TableCell>
                                    <TableCell isNumeric className="text-muted-foreground">
                                        {usd(market.spend)}
                                    </TableCell>
                                    <TableCell isNumeric>{usd(market.revenue)}</TableCell>
                                    <TableCell isNumeric className="font-medium">
                                        {usdSigned(market.profit)}
                                    </TableCell>
                                    <TableCell isNumeric className={cn('font-medium', ZONE_TEXT_CLASS[market.zone])}>
                                        {pct(market.roi)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    {showsFooter && (
                        <TableFooter>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell isNumeric>{usd(stats.spend)}</TableCell>
                                <TableCell isNumeric>{usd(stats.revenue)}</TableCell>
                                <TableCell isNumeric>{usdSigned(stats.profit)}</TableCell>
                                <TableCell isNumeric>{pct(stats.roi)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </>
        );
    }

    return (
        <section aria-label="My stats for the period" className="flex min-w-0 flex-col gap-3">
            <h2 className="text-sm font-semibold">My stats for the period</h2>
            {renderBody()}
        </section>
    );
}

export { MyStats };
