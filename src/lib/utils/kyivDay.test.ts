import { afterEach, describe, expect, it } from 'vitest';
import { hoursSince, kyivClock, kyivDay, kyivHour } from './kyivDay';

// The zone is hardcoded, so every one of these must hold with the process pretending to sit
// anywhere else on the planet (SPEC I4). `TZ` moves Node's *local* zone; the helpers must not care.

const originalTz = process.env.TZ;

function inZone(tz: string, run: () => void) {
    process.env.TZ = tz;
    run();
}

afterEach(() => {
    process.env.TZ = originalTz;
});

describe('kyivDay', () => {
    it('returns the Kyiv calendar date whatever zone the process runs in', () => {
        // 2026-08-26 21:30 UTC is already the 27th in Kyiv (UTC+3 in summer).
        const instant = new Date('2026-08-26T21:30:00Z');

        for (const tz of ['UTC', 'America/Los_Angeles', 'Pacific/Kiritimati', 'Asia/Kolkata']) {
            inZone(tz, () => {
                expect(kyivDay(instant)).toBe('2026-08-27');
            });
        }
    });

    it('does not roll the day over before Kyiv midnight, even where it is already tomorrow', () => {
        // 22:00 UTC = 01:00 the next day in Kiritimati (UTC+14), but still the 26th in Kyiv.
        const instant = new Date('2026-08-26T20:59:00Z');

        inZone('Pacific/Kiritimati', () => {
            expect(kyivDay(instant)).toBe('2026-08-26');
        });
    });

    it('applies Kyiv daylight saving: the same UTC hour is a different Kyiv day in winter', () => {
        // UTC+3 in August, UTC+2 in January — so 21:30 UTC is the 27th in summer, the 26th in winter.
        expect(kyivDay(new Date('2026-08-26T21:30:00Z'))).toBe('2026-08-27');
        expect(kyivDay(new Date('2026-01-26T21:30:00Z'))).toBe('2026-01-26');
    });

    it('zero-pads to the `YYYY-MM-DD` shape report_date uses', () => {
        expect(kyivDay(new Date('2026-01-05T09:00:00Z'))).toBe('2026-01-05');
    });
});

describe('kyivHour', () => {
    it('returns the Kyiv wall-clock hour whatever zone the process runs in', () => {
        const instant = new Date('2026-08-26T07:15:00Z'); // 10:15 Kyiv

        for (const tz of ['UTC', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
            inZone(tz, () => {
                expect(kyivHour(instant)).toBe(10);
            });
        }
    });

    it('reports midnight as 0, never 24', () => {
        expect(kyivHour(new Date('2026-08-26T21:00:00Z'))).toBe(0);
    });

    it('follows Kyiv daylight saving', () => {
        expect(kyivHour(new Date('2026-08-26T12:00:00Z'))).toBe(15);
        expect(kyivHour(new Date('2026-01-26T12:00:00Z'))).toBe(14);
    });
});

describe('hoursSince', () => {
    it('measures the age of an instant in fractional hours', () => {
        const now = new Date('2026-08-26T12:00:00Z');

        expect(hoursSince(new Date('2026-08-26T09:00:00Z'), now)).toBe(3);
        expect(hoursSince(new Date('2026-08-26T11:30:00Z'), now)).toBe(0.5);
    });

    it('is negative for an instant in the future', () => {
        expect(hoursSince(new Date('2026-08-26T13:00:00Z'), new Date('2026-08-26T12:00:00Z'))).toBe(-1);
    });
});

describe('kyivClock', () => {
    it('reads the Kyiv wall clock, not the process one', () => {
        // 09:04 UTC is 12:04 in Kyiv in August (UTC+3) — the header's own example.
        const instant = new Date('2026-08-26T09:04:00Z');

        for (const tz of ['UTC', 'America/Los_Angeles', 'Asia/Kolkata']) {
            inZone(tz, () => {
                expect(kyivClock(instant)).toBe('12:04');
            });
        }
    });

    it('pads to a fixed HH:mm so the header does not jitter in width', () => {
        expect(kyivClock(new Date('2026-08-26T04:07:00Z'))).toBe('07:07');
    });
});
