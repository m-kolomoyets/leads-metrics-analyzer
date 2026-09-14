import { describe, expect, it } from 'vitest';
import { splitHighlights } from './highlight';

describe('splitHighlights', () => {
    it('returns the whole text unmatched for an empty query', () => {
        expect(splitHighlights('CL | Aldex', '')).toEqual([{ text: 'CL | Aldex', matched: false }]);
        expect(splitHighlights('CL | Aldex', '   ')).toEqual([{ text: 'CL | Aldex', matched: false }]);
    });

    it('marks every occurrence, case-insensitively, keeping the original casing', () => {
        expect(splitHighlights('Aldex | aldex', 'ALD')).toEqual([
            { text: 'Ald', matched: true },
            { text: 'ex | ', matched: false },
            { text: 'ald', matched: true },
            { text: 'ex', matched: false },
        ]);
    });

    it('treats the query as text, not a pattern', () => {
        expect(splitHighlights('27 USD | 5000', '|')).toEqual([
            { text: '27 USD ', matched: false },
            { text: '|', matched: true },
            { text: ' 5000', matched: false },
        ]);
        expect(splitHighlights('a.c', '.')).toEqual([
            { text: 'a', matched: false },
            { text: '.', matched: true },
            { text: 'c', matched: false },
        ]);
    });

    it('returns one unmatched run when nothing hits', () => {
        expect(splitHighlights('13002', '99')).toEqual([{ text: '13002', matched: false }]);
    });
});
