import type { Locale } from '@/components/report/utils/i18n';
import type { ReportOrigin } from '../../types';
import { Link, useCanGoBack, useRouter } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';

type BackButtonProps = {
    from: ReportOrigin | undefined;
    locale: Locale;
};

// Where each origin sits, and what it is called. The feed is the fallback: every role that may open a
// report may open it, and it is the surface a report link is most often pasted out of.
const ORIGIN = {
    dynamics: { to: '/dashboard/dynamics', label: 'backToDynamics' },
    archive: { to: '/dashboard/archive', label: 'backToArchive' },
    dashboard: { to: '/dashboard', label: 'backToFeed' },
} as const;

// The way out of a report, named after the surface it came from (`from` in the URL) rather than a bare
// "Back", so the reader knows where the click lands before taking it.
//
// Two paths on purpose. Within the app, history is walked back, because the origin carries state this
// route does not — the dynamics buyer and day, the archive's range — and re-navigating to the bare
// route would silently reset it. A report opened cold from a pasted link has no such entry to return
// to, so it gets a plain Link to the origin route instead.
function BackButton({ from, locale }: BackButtonProps) {
    const router = useRouter();
    const canGoBack = useCanGoBack();
    const origin = ORIGIN[from ?? 'dashboard'];
    const label = ui(origin.label, locale);

    if (canGoBack) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                    router.history.back();
                }}
            >
                <ArrowLeftIcon data-icon="inline-start" />
                {label}
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            render={
                <Link to={origin.to}>
                    <ArrowLeftIcon data-icon="inline-start" />
                    {label}
                </Link>
            }
        />
    );
}

export { BackButton };
