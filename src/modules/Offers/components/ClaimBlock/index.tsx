import type { ClaimBlockProps } from './types';
import { useState } from 'react';
import { PencilIcon } from 'lucide-react';
import { claimRates, hasClaim } from '@/lib/domain/claim';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { ClaimForm } from '../ClaimForm';

// What a missing figure or rate reads as (PRD story 20): the input was not declared, the Payout is
// not fixed yet, or a denominator is zero — never a 0 the reader might take for a measurement.
const NOT_AVAILABLE = 'N/A';

const countFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const rateFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});
const usdFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const count = (value: number | null): string => {
    return value === null ? NOT_AVAILABLE : countFormat.format(value);
};

// Rates arrive in percent points (30 ⇒ 30.0%).
const rate = (value: number | null): string => {
    return value === null ? NOT_AVAILABLE : rateFormat.format(value / 100);
};

const money = (value: number | null): string => {
    return value === null ? NOT_AVAILABLE : usdFormat.format(value);
};

// The Advertiser Claim on a card (offers-and-home/07): the declared installs / registrations /
// sales and the rates they imply against the fixed Payout. Labelled as the advertiser's figures so
// nobody reads a promise as a measurement (PRD story 21). Editing is bdm/head's; everyone else
// reads.
function ClaimBlock({ card, canEdit }: ClaimBlockProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const declared = hasClaim(card.claim);
    const rates = claimRates(card.claim, card.payoutUsd);

    const figures = [
        { label: 'Installs', value: count(card.claim.installs) },
        { label: 'Regs', value: count(card.claim.regs) },
        { label: 'Sales', value: count(card.claim.sales) },
        { label: 'I2R', value: rate(rates.i2r) },
        { label: 'R2S', value: rate(rates.r2s) },
        { label: 'I2S', value: rate(rates.i2s) },
        { label: 'EPC', value: money(rates.epc), title: 'Claimed EPC: sales × payout ÷ installs' },
    ];

    return (
        <section aria-label="Advertiser's data" className="bg-muted/40 flex flex-col gap-2 rounded-md p-3">
            <header className="flex items-center justify-between gap-2">
                <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Advertiser&apos;s data
                </h4>
                {canEdit && (
                    <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                            setIsEditOpen(true);
                        }}
                    >
                        <PencilIcon className="size-3" />
                        {declared ? 'Edit claim' : 'Enter claim'}
                    </Button>
                )}
            </header>

            {declared ? (
                <dl className="grid grid-cols-4 gap-x-4 gap-y-2 text-xs sm:grid-cols-7">
                    {figures.map((figure) => {
                        return (
                            <div key={figure.label} className="flex flex-col gap-0.5" title={figure.title}>
                                <dt className="text-muted-foreground">{figure.label}</dt>
                                <dd className="text-foreground font-medium tabular-nums">{figure.value}</dd>
                            </div>
                        );
                    })}
                </dl>
            ) : (
                <p className="text-muted-foreground text-xs">No advertiser claim entered yet.</p>
            )}

            {canEdit && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Advertiser claim · #{card.offerId}</DialogTitle>
                            <DialogDescription>
                                What the advertiser declared for this offer. Saving overwrites the previous claim.
                            </DialogDescription>
                        </DialogHeader>
                        <ClaimForm
                            card={card}
                            onSuccess={() => {
                                setIsEditOpen(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}

export { ClaimBlock };
