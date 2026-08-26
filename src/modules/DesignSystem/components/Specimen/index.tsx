type SpecimenProps = {
    // The state being shown — `disabled`, `invalid`, `open`. One specimen per state, labelled, so a
    // half-migrated primitive has nowhere to hide.
    label: string;
    children: React.ReactNode;
};

function Specimen({ label, children }: SpecimenProps) {
    return (
        <div className="flex min-w-0 flex-col gap-1.5">
            <p className="text-muted-foreground text-xs">{label}</p>
            <div className="flex flex-wrap items-center gap-2">{children}</div>
        </div>
    );
}

export { Specimen };
