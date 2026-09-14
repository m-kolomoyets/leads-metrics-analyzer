import type { ClaimGapMetric } from '@/lib/domain/claim';
import type { ClaimGapBlockProps } from './types';
import { useQuery } from '@tanstack/react-query';
import { actualRates, claimGap, claimRates } from '@/lib/domain/claim';
import { offerFunnel } from '@/lib/domain/offerRating';
import { cn } from '@/lib/utils/cn';
import { offerRatingQueryOptions } from '@/services/offers/queries';
import { cost, ratioPct } from '@/components/report/utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { CLAIM_GAP_METRIC_LABELS, CLAIM_GAP_TONE_CLASS } from './constants';

const gapFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Rates are percent points; EPC is dollars per install.
const formatSide = (metric: ClaimGapMetric, value: number): string => {
    return metric === 'epc' ? `$${cost(value)}` : ratioPct(value);
};

// Promised vs actual (offers-and-home/12, PRD story 22): per rate, what the advertiser claimed, what
// the offer did all time across every buyer the viewer sees, and the Claim Gap = actual ÷ claimed.
// Reuses the rating's read on its open window (`all`), so the actual side is the same latest-per-day
// selection the rating counts. A rate missing on either side has no row; no row, no block — the
// component renders nothing, including while loading. Only mounted for `seeRating` roles.
function ClaimGapBlock({ card }: ClaimGapBlockProps) {
    const claimed = claimRates(card.claim, card.payoutUsd);
    // Nothing promised means nothing to measure — skip the read entirely.
    const hasClaimedRate = Object.values(claimed).some((value) => {
        return value !== null;
    });
    const { data } = useQuery({
        ...offerRatingQueryOptions({ offerId: card.offerId, period: 'all' }),
        enabled: hasClaimedRate,
    });
    const rows = data ? claimGap(claimed, actualRates(offerFunnel(data))) : [];

    if (rows.length === 0) {
        return null;
    }

    return (
        <section aria-label="Claim gap" className="flex flex-col gap-2">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Promised vs actual</h4>
            <Table density="compact">
                <TableHeader>
                    <TableRow>
                        <TableHead>Rate</TableHead>
                        <TableHead isNumeric>Claimed</TableHead>
                        <TableHead isNumeric>Actual</TableHead>
                        <TableHead isNumeric>
                            <abbr title="Actual ÷ claimed, all time" className="no-underline">
                                Claim gap
                            </abbr>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow key={row.metric}>
                                <TableCell className="font-medium">{CLAIM_GAP_METRIC_LABELS[row.metric]}</TableCell>
                                <TableCell isNumeric className="text-muted-foreground">
                                    {formatSide(row.metric, row.claimed)}
                                </TableCell>
                                <TableCell isNumeric>{formatSide(row.metric, row.actual)}</TableCell>
                                <TableCell isNumeric className={cn('font-semibold', CLAIM_GAP_TONE_CLASS[row.tone])}>
                                    ×{gapFormat.format(row.gap)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </section>
    );
}

export { ClaimGapBlock };
