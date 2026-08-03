// Which Geo tab a detailed report opens on. The `geo` search param is a request, not an instruction:
// it wins only when the Snapshot covers that market, so a stale or hand-typed link still opens the
// report rather than an empty page (spec story 28). Geo is ISO-2 upper-case everywhere in the domain,
// so a lower-case request is normalized rather than missed.
export function activeGeo(geos: string[], requested: string | undefined): string | null {
    const wanted = requested?.trim().toUpperCase();
    const match = geos.find((geo) => {
        return geo === wanted;
    });
    return match ?? geos[0] ?? null;
}
