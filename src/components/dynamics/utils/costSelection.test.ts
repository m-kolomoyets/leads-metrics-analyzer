import { describe, expect, it } from 'vitest';
import { toggleCostMetric } from './costSelection';

describe('toggleCostMetric', () => {
    it('adds a metric that was off', () => {
        expect(toggleCostMetric(['cpi'], 'cps')).toEqual(['cpi', 'cps']);
    });

    it('draws the lines in the canonical order however they were picked', () => {
        // The dash a line wears is fixed to the metric, so the order the reader clicked in must not
        // reorder the plot under them.
        expect(toggleCostMetric(['cps'], 'cpi')).toEqual(['cpi', 'cps']);
    });

    it('removes a metric that was on', () => {
        expect(toggleCostMetric(['cpi', 'cps'], 'cpi')).toEqual(['cps']);
    });

    it('refuses to switch off the last one', () => {
        // A left axis with nothing on it is a chart that answers no question at all, and the reader
        // who did it has no way of knowing which toggle brings the day back.
        expect(toggleCostMetric(['cpi'], 'cpi')).toEqual(['cpi']);
    });

    it('puts a line back on an emptied selection', () => {
        expect(toggleCostMetric([], 'cpr')).toEqual(['cpr']);
    });
});
