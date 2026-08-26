import type { ToastProps } from './types';
import { Toaster as Sonner } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/context/ThemeContext';

// Sonner wearing the app's tokens. It is an overlay (ADR-0021): the overlay surface, a hairline
// border and the one shadow. Its rich colours are a whole second palette, so the three semantic
// variants are re-pointed at --zone-* — the same paint the charts and the Zone badges use — rather
// than left at sonner's own greens and reds.
function Toast({ className, style, toastOptions, ...props }: ToastProps) {
    const { theme } = useTheme();

    return (
        <Sonner
            {...props}
            theme={theme}
            className={cn('group/toast', className)}
            toastOptions={{ ...toastOptions, className: cn('rounded-lg shadow-overlay', toastOptions?.className) }}
            style={
                {
                    ...style,
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--success-bg': 'var(--popover)',
                    '--success-text': 'var(--zone-green)',
                    '--success-border': 'var(--border)',
                    '--warning-bg': 'var(--popover)',
                    '--warning-text': 'var(--zone-yellow)',
                    '--warning-border': 'var(--border)',
                    '--error-bg': 'var(--popover)',
                    '--error-text': 'var(--zone-red)',
                    '--error-border': 'var(--border)',
                    '--info-bg': 'var(--popover)',
                    '--info-text': 'var(--muted-foreground)',
                    '--info-border': 'var(--border)',
                } as React.CSSProperties
            }
        />
    );
}

export { Toast };
