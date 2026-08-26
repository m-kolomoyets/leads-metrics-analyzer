type SectionProps = {
    id: string;
    title: string;
    description?: string;
    children: React.ReactNode;
};

function Section({ id, title, description, children }: SectionProps) {
    return (
        <section id={id} className="flex scroll-mt-4 flex-col gap-3">
            <header className="flex flex-col gap-1">
                <h2 className="text-base font-semibold">{title}</h2>
                {!!description && <p className="text-muted-foreground max-w-3xl text-sm">{description}</p>}
            </header>
            {children}
        </section>
    );
}

export { Section };
