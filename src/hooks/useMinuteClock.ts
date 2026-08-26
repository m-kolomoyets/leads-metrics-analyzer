import { useEffect, useState } from 'react';

// A `Date` that re-reads itself once a minute. The Dynamics page ages two things while nobody
// touches it — the header's "data as of" label and the buyer tabs' missing/stale states — and both
// must move without a fetch: a client timer only, no polling and no automatic refresh (SPEC §6.4).
//
// A minute is the resolution of everything reading it; ticking faster would only re-render.
const TICK_MS = 60_000;

export const useMinuteClock = (): Date => {
    const [now, setNow] = useState(() => {
        return new Date();
    });

    useEffect(function tickWhileMounted() {
        const timer = setInterval(() => {
            setNow(new Date());
        }, TICK_MS);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return now;
};
