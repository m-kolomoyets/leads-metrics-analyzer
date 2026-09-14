import type { OfferCurrency } from '@/lib/domain/offerString';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { fxRate } from '@/lib/db/schema';
import { kyivDay } from '@/lib/utils/kyivDay';

// SERVER-ONLY. The EUR→USD rate an Offer Card's Payout is fixed at (ADR-0027). Fetched from
// frankfurter.app (ECB reference rates, no key) and cached per Kyiv calendar day in `fx_rate`, so
// every card created the same day shares one fetch — and one rate. A miss (network, timeout, odd
// payload) yields null: the caller saves the card as `fx_pending` rather than failing the create.

const FRANKFURTER_LATEST_URL = 'https://api.frankfurter.dev/v1/latest';
const FETCH_TIMEOUT_MS = 5_000;
const QUOTE_CURRENCY = 'USD';

export type FixedRate = {
    rate: number;
    fetchedAt: Date;
};

// `{ amount, base, date, rates: { USD } }` — only the rate is read; `date` is the ECB reference day,
// which lags on weekends and is deliberately not the cache key.
const frankfurterLatestSchema = z.object({
    rates: z.object({ [QUOTE_CURRENCY]: z.number().positive() }),
});

const fetchLatestRate = async (base: OfferCurrency): Promise<number | null> => {
    const url = new URL(FRANKFURTER_LATEST_URL);

    url.searchParams.set('base', base);
    url.searchParams.set('symbols', QUOTE_CURRENCY);

    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

        if (!response.ok) {
            return null;
        }

        const parsed = frankfurterLatestSchema.safeParse(await response.json());

        return parsed.success ? parsed.data.rates[QUOTE_CURRENCY] : null;
    } catch {
        return null;
    }
};

// Today's `base`→USD rate, from the day cache or freshly fetched and cached. A USD offer never gets
// here — its rate is 1 by definition (ADR-0027) — but the guard keeps the contract honest.
export const fixRateToUsd = async (base: OfferCurrency, now: Date = new Date()): Promise<FixedRate | null> => {
    if (base === QUOTE_CURRENCY) {
        return { rate: 1, fetchedAt: now };
    }

    const day = kyivDay(now);
    const [cached] = await db
        .select({ rate: fxRate.rate, fetchedAt: fxRate.fetchedAt })
        .from(fxRate)
        .where(and(eq(fxRate.day, day), eq(fxRate.base, base), eq(fxRate.quote, QUOTE_CURRENCY)))
        .limit(1);

    if (cached) {
        return cached;
    }

    const rate = await fetchLatestRate(base);

    if (rate === null) {
        return null;
    }

    // Two cards created in the same instant may both miss the cache; the second insert loses on the
    // primary key and simply keeps the rate it fetched — the same day's rate either way.
    const [written] = await db
        .insert(fxRate)
        .values({ day, base, quote: QUOTE_CURRENCY, rate, fetchedAt: now })
        .onConflictDoNothing()
        .returning({ rate: fxRate.rate, fetchedAt: fxRate.fetchedAt });

    return written ?? { rate, fetchedAt: now };
};
