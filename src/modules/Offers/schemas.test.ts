import { describe, expect, it } from 'vitest';
import { offersSearchSchema } from './schemas';

describe('offers search params', () => {
    it('opens on the live list with nothing asked', () => {
        expect(offersSearchSchema.parse({})).toEqual({ archived: false });
    });

    it('carries every filter through unchanged', () => {
        const search = { q: '13002', team: 't1', buyer: 'u1', deadline: 'any', claim: 'no', archived: true };

        expect(offersSearchSchema.parse(search)).toEqual(search);
    });

    it('drops a malformed filter rather than throwing the link away', () => {
        const parsed = offersSearchSchema.parse({ q: '   ', deadline: 'soon', claim: 'maybe', archived: 'yes' });

        expect(parsed).toEqual({ archived: false });
    });
});
