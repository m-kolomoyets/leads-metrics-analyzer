import { createFileRoute, notFound } from '@tanstack/react-router';
import { DesignSystem } from '@/modules/DesignSystem';

// Dev-only, and outside `_authenticated` on purpose. It is a workbench, not a screen: it holds no
// data, answers to no permission, and a build that shipped it would be advertising the component
// library to anyone who guessed the URL. `import.meta.env.DEV` is a literal at build time, so the
// production bundle keeps the 404 and tree-shakes nothing important; running `pnpm dev` is the only
// way in.
export const Route = createFileRoute('/design')({
    beforeLoad() {
        if (!import.meta.env.DEV) {
            throw notFound();
        }
    },
    component: DesignSystem,
});
