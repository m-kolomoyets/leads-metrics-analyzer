import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

// Every analysis section is one of these. There is no per-section colour any more: a section is a
// place on the page, not a judgement, and colour is spent on Zone alone (ADR-0019). What separates
// one card from the page is a hairline and one surface step (ADR-0021).
type SectionCardProps = {
    // Optional lead glyph + uppercase dim caption. Omit `title` for a bare card.
    title?: ReactNode;
    // Accessible name for a card that carries no visible heading — without it a title-less section is
    // an unnamed landmark in the a11y tree.
    label?: string;
    // Right-aligned header slot (copy buttons, preset controls).
    actions?: ReactNode;
    className?: string;
    children: ReactNode;
};

function SectionCard({ title, label, actions, className, children }: SectionCardProps) {
    return (
        <section className={cn('bg-surface border-border rounded-md border p-4', className)} aria-label={label}>
            {(title || actions) && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    {title && (
                        <h3 className="text-foreground text-xs font-semibold tracking-widest uppercase">{title}</h3>
                    )}
                    {actions}
                </div>
            )}
            {children}
        </section>
    );
}

export { SectionCard };
