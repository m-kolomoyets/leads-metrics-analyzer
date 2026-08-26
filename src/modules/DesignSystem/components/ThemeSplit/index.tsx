import type { ThemeName } from '../../constants';
import { cn } from '@/lib/utils/cn';
import { THEMES } from '../../constants';

type ThemeSplitProps = {
    // A render prop, not `children`: the subtree is mounted twice and anything with an `id` needs the
    // theme in its key to stay unique across the two panes.
    children: (theme: ThemeName) => React.ReactNode;
    className?: string;
};

// Both themes at once, neither behind the switcher. `.light` and `.dark` pin their own subtree's
// tokens (see the `@custom-variant dark` note in src/styles/index.css), so the pane on the right is
// the real dark theme even while the app around it is light.
function ThemeSplit({ children, className }: ThemeSplitProps) {
    return (
        <div className="border-border grid gap-px overflow-hidden rounded-md border md:grid-cols-2">
            {THEMES.map((theme) => {
                return (
                    <div key={theme} className={cn(theme, 'bg-background text-foreground flex flex-col')}>
                        <p className="text-muted-foreground border-border border-b px-3 py-1.5 text-xs font-medium">
                            {theme}
                        </p>
                        <div className={cn('flex flex-1 flex-col gap-4 p-4', className)}>{children(theme)}</div>
                    </div>
                );
            })}
        </div>
    );
}

export { ThemeSplit };
