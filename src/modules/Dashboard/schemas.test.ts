import { describe, expect, it } from 'vitest';
import { archiveSearchSchema, reportSearchSchema } from './schemas';

// The two Report surfaces share a param vocabulary and differ only in what "no range asked for"
// means. That is what lets a link between them carry the current range verbatim (spec story 21), so
// it is worth pinning rather than leaving to two hand-kept object literals.

describe('report search params', () => {
    it('opens the feed on today and the archive on a week', () => {
        expect(reportSearchSchema.parse({}).range).toBe('1d');
        expect(archiveSearchSchema.parse({}).range).toBe('7d');
    });

    it('carries an explicit token through both surfaces unchanged', () => {
        const search = { range: '30d', from: undefined, to: undefined };

        expect(reportSearchSchema.parse(search).range).toBe('30d');
        expect(archiveSearchSchema.parse(search).range).toBe('30d');
    });

    it('carries a custom window through both surfaces unchanged', () => {
        const search = { range: 'custom', from: '2026-06-01', to: '2026-06-12' };

        expect(reportSearchSchema.parse(search)).toEqual(search);
        expect(archiveSearchSchema.parse(search)).toEqual(search);
    });

    it('falls back to its own default rather than throwing a shared link away', () => {
        expect(archiveSearchSchema.parse({ range: 'yesterday' }).range).toBe('7d');
        expect(archiveSearchSchema.parse({ range: '7d', from: '12/06/2026' }).from).toBeUndefined();
    });
});
