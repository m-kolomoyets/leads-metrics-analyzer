type SwatchProps = {
    name: string;
    value: string;
    usage?: string;
    // Filled in for Zone and accent colours, where the ratio against the swatch's own surface is the
    // thing being checked rather than a nicety.
    ratio?: string;
};

function Swatch({ name, value, usage, ratio }: SwatchProps) {
    return (
        <div className="flex min-w-0 items-center gap-2.5">
            <span
                aria-hidden={true}
                style={{ backgroundColor: value }}
                className="border-border size-9 shrink-0 rounded-md border"
            />
            <span className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-medium">{name}</span>
                <span className="text-muted-foreground truncate text-xs tabular-nums">
                    {value}
                    {!!ratio && ` · ${ratio}`}
                </span>
                {!!usage && <span className="text-faint truncate text-xs">{usage}</span>}
            </span>
        </div>
    );
}

export { Swatch };
