import path from 'path';
import { defineConfig } from 'vitest/config';

// Domain-layer tests only (ADR-0005): pure functions, no DOM, no server plugins. We deliberately do
// NOT reuse vite.config.ts — the TanStack Start plugin owns server-entry generation and is needless
// weight for node unit tests. Just the `@` alias so domain modules resolve their imports.
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
