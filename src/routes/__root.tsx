import type { RouterContext } from '@/router';
import { lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { queryClient } from '@/lib/@queryClient';
import { noopReturnNull } from '@/lib/utils/noopReturnNull';
import { BackgroundProvider } from '@/context/BackgroundContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useRemoveInitialStyle } from '@/hooks/useRemoveInitialStyle';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import { Toast } from '@/components/ui/Toast';
import { TooltipProvider } from '@/components/ui/Tooltip';
import '@/styles/index.css';

// No-flash theme script: runs synchronously in <head> before paint, mirroring ThemeContext. The
// storage key is inlined because this runs before any module loads (keep it in sync with
// LS_THEME_KEY in src/lib/constants.ts).
const THEME_SCRIPT = `
(() => {
    const themeLocalStorageValue = window.localStorage.getItem("<appName>_ADMIN_Theme");
    const isPrefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (
        themeLocalStorageValue === "system" ||
        (themeLocalStorageValue !== "dark" && themeLocalStorageValue !== "light")
    ) {
        root.classList.add(isPrefersDarkTheme ? "dark" : "light");
    } else {
        root.classList.add(themeLocalStorageValue);
    }
})();
`;

// Paints the background before Tailwind loads, avoiding a flash; removed after mount
// (useRemoveInitialStyle).
const INITIAL_STYLE = `
:root { --initial-bg: #fafafa; }
html.dark { --initial-bg: #101010; }
html { font-family: "Inter", sans-serif; }
body { background-color: var(--initial-bg); margin: 0; position: relative; }
`;

const TanStackRouterDevtools = import.meta.env.DEV
    ? lazy(async () => {
          const res = await import('@tanstack/react-router-devtools');
          return {
              default: res.TanStackRouterDevtools,
          };
      })
    : noopReturnNull;

const TanStackQueryDevtools = import.meta.env.DEV
    ? lazy(async () => {
          const res = await import('@tanstack/react-query-devtools');
          return {
              default: res.ReactQueryDevtools,
          };
      })
    : noopReturnNull;

export const Route = createRootRouteWithContext<RouterContext>()({
    head() {
        return {
            meta: [
                { charSet: 'utf-8' },
                { name: 'format-detection', content: 'telephone=no' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
                { name: 'color-scheme', content: 'light dark' },
                { name: 'theme-color', content: '#fafafa', media: '(prefers-color-scheme: light)' },
                { name: 'theme-color', content: '#101010', media: '(prefers-color-scheme: dark)' },
                { title: 'Adjoin' },
            ],
            links: [
                { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
                { rel: 'apple-touch-icon', href: '/apple-icon.png' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400..600&display=swap',
                },
            ],
        };
    },
    shellComponent: RootDocument,
    component: RootComponent,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="font-sans">
            <head>
                <HeadContent />
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
                <style id="initial-style" dangerouslySetInnerHTML={{ __html: INITIAL_STYLE }} />
            </head>
            <body className="text-foreground bg-background antialiased relative">
                <div id="root" className="flex flex-col h-dvh isolate">
                    {children}
                </div>
                <Scripts />
            </body>
        </html>
    );
}

function RootComponent() {
    useRemoveInitialStyle();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark">
                <BackgroundProvider>
                    <TooltipProvider>
                        <BackgroundCanvas />
                        <Outlet />
                        <Toast richColors={true} closeButton={true} swipeDirections={['bottom']} />
                    </TooltipProvider>
                </BackgroundProvider>
                <Suspense>
                    <TanStackRouterDevtools position="bottom-right" />
                    <TanStackQueryDevtools position="bottom" />
                </Suspense>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
