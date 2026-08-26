import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

// Reference section colour → glass-tint classes (index.css). Blue panels sit at strength .5, the
// offers panel violet at .6, alarm panels red at full strength — matching glassTint(color, s).
type SectionTone = 'blue' | 'violet' | 'red';

const TONE_CLASS: Record<SectionTone, string> = {
    blue: 'glass-tint tint-blue tint-s5',
    violet: 'glass-tint tint-violet tint-s6',
    red: 'glass-tint tint-red',
};

type SectionCardProps = {
    // Optional lead glyph + uppercase dim caption (reference `S.h`). Omit `title` for a bare tinted card.
    title?: ReactNode;
    // Accessible name for a card that carries no visible heading — without it a title-less section is
    // an unnamed landmark in the a11y tree.
    label?: string;
    tone?: SectionTone;
    // Right-aligned header slot (copy buttons, preset controls).
    actions?: ReactNode;
    className?: string;
    children: ReactNode;
};

// The reference card: a colour-tinted glass panel (glassTint) with the small uppercase letter-spaced
// heading. Every analysis section is one of these, so the accent + glow read as one system.
function SectionCard({ title, label, tone = 'blue', actions, className, children }: SectionCardProps) {
    return (
        <section className={cn('rounded-lg p-4', TONE_CLASS[tone], className)} aria-label={label}>
            {(title || actions) && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    {title && (
                        <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">
                            {title}
                        </h3>
                    )}
                    {actions}
                </div>
            )}
            {children}
        </section>
    );
}

export { SectionCard };
