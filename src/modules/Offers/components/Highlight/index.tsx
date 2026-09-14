import type { HighlightProps } from './types';
import { splitHighlights } from '../../utils/highlight';

// Paints the search hits inside a card's id or caption (PRD story 13). `<mark>` is the semantic
// element for a highlighted match; the wash is the same accent-tinted `--hover-strong` the app spends
// on "where I am", so a hit reads as pointed-at rather than alarmed.
function Highlight({ text, query }: HighlightProps) {
    const runs = splitHighlights(text, query);

    return (
        <>
            {runs.map((run, index) => {
                // Runs never reorder — the index is the only identity a substring has.
                return run.matched ? (
                    <mark key={index} className="bg-hover-strong text-foreground rounded-xs">
                        {run.text}
                    </mark>
                ) : (
                    <span key={index}>{run.text}</span>
                );
            })}
        </>
    );
}

export { Highlight };
