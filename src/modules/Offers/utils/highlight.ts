// Splits a text into runs so a search match can be painted (PRD story 13). Case-insensitive, every
// occurrence, no regex — the query is user text and must never be interpreted. An empty query (or
// no hit) yields the whole text as one unmatched run, so callers render unconditionally.

export type HighlightRun = {
    text: string;
    matched: boolean;
};

export const splitHighlights = (text: string, query: string): HighlightRun[] => {
    const needle = query.trim().toLowerCase();

    if (needle === '' || text === '') {
        return [{ text, matched: false }];
    }

    const haystack = text.toLowerCase();
    const runs: HighlightRun[] = [];
    let cursor = 0;
    let hit = haystack.indexOf(needle, cursor);

    while (hit !== -1) {
        if (hit > cursor) {
            runs.push({ text: text.slice(cursor, hit), matched: false });
        }

        runs.push({ text: text.slice(hit, hit + needle.length), matched: true });
        cursor = hit + needle.length;
        hit = haystack.indexOf(needle, cursor);
    }

    if (cursor < text.length) {
        runs.push({ text: text.slice(cursor), matched: false });
    }

    return runs;
};
