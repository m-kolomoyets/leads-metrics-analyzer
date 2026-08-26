// The two bounds of a zone band hold each other in place: green→yellow can never sit above
// yellow→red, so whichever one was just edited stops AT its neighbour rather than crossing it.
// Landing exactly on the neighbour is allowed — that is a band with no yellow in it, which is a
// plan someone can mean. Crossing is not: it grades every value red and draws the rail backwards.
//
// Applied when a field is done being typed into, never per keystroke — see `ZoneBoundInput.onCommit`.

function toNumber(value: string): number | null {
    const trimmed = value.trim();
    if (trimmed === '') {
        return null;
    }

    const parsed = Number(trimmed);

    return Number.isFinite(parsed) ? parsed : null;
}

export type BoundRange = { min: number; max: number };

// Returns the value the field should hold — unchanged when it is still half-typed or already legal,
// so a blur on an untouched field is a no-op rather than a rewrite.
export function clampBound(bound: 'gy' | 'yr', value: string, other: string, range?: BoundRange): string {
    const parsed = toNumber(value);
    if (parsed === null) {
        return value;
    }

    const neighbour = toNumber(other);
    let clamped = parsed;

    if (neighbour !== null) {
        clamped = bound === 'gy' ? Math.min(clamped, neighbour) : Math.max(clamped, neighbour);
    }

    if (range !== undefined) {
        clamped = Math.min(Math.max(clamped, range.min), range.max);
    }

    return clamped === parsed ? value : String(clamped);
}
