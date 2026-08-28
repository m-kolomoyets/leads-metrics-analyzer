import { describe, expect, it } from 'vitest';
import { daysInMonth, monthDays, monthRange } from './calendarMonth';

describe('calendarMonth', () => {
    it('counts the days of short, long and leap months', () => {
        expect(daysInMonth('2026-09-15')).toBe(30);
        expect(daysInMonth('2026-01-31')).toBe(31);
        expect(daysInMonth('2026-02-01')).toBe(28);
        expect(daysInMonth('2028-02-01')).toBe(29);
    });

    it('bounds the month a date sits in', () => {
        expect(monthRange('2026-09-15')).toEqual({ from: '2026-09-01', to: '2026-09-30' });
    });

    it('lists every day of the month, zero-padded and in order', () => {
        const days = monthDays('2026-09-15');

        expect(days).toHaveLength(30);
        expect(days[0]).toBe('2026-09-01');
        expect(days[8]).toBe('2026-09-09');
        expect(days.at(-1)).toBe('2026-09-30');
    });
});
