import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// TanStack Start in SPA mode (ADR-0008): the Start plugin replaces the standalone router plugin and
// owns route generation + client/server entries. `react()` must come after it. See docs/adr/0008.
export default defineConfig(() => {
    return {
        plugins: [
            tanstackStart({
                spa: {
                    enabled: true,
                },
            }),
            // Nitro owns the deployable server output. Vercel zero-config detects the nitro build
            // and deploys server functions (auth/admin) as Vercel Functions. Without it the build
            // emits a bare dist/ that Vercel can't run → root 404.
            // traceDeps full-traces the @node-rs/argon2 native addon (+ its platform binary package)
            // so nitro keeps it external and copies the .node file instead of trying to bundle it
            // (rollup can't parse a .node). On Vercel's linux build the linux binary is copied.
            nitro({
                traceDeps: ['@node-rs/argon2*'],
                rollupConfig: {
                    external: [/@node-rs[\\/]argon2/],
                },
            }),
            react({
                babel: {
                    plugins: [['babel-plugin-react-compiler', {}]],
                },
            }),
            tailwindcss(),
            visualizer({
                filename: './tmp/bundle-visualizer.html',
                gzipSize: true,
                brotliSize: true,
            }),
        ],
        build: {
            target: 'baseline-widely-available',
            chunkSizeWarningLimit: 500,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (/[\\/]node_modules[\\/](react|react-dom|scheduler|use-sync-external-store)[\\/]/.test(id)) {
                            return 'vendor-react';
                        }

                        if (/[\\/]node_modules[\\/]@tanstack[\\/]/.test(id)) {
                            return 'vendor-tanstack';
                        }

                        if (/[\\/]node_modules[\\/]zod[\\/]/.test(id)) {
                            return 'vendor-zod';
                        }
                    },
                },
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        // @node-rs/argon2 is a native module used only inside server functions. Keep the client dep
        // optimizer from following it (its wasm fallback has no resolvable entry) and keep it
        // external to the server bundle so the native binding loads at runtime.
        optimizeDeps: {
            exclude: ['@node-rs/argon2'],
        },
        ssr: {
            external: ['@node-rs/argon2'],
        },
        // Extra free PORTS if you need them (9199, 9889, 9521, 9836, 9713, 9407, 9491)
        server: {
            port: 9777,
        },
        preview: {
            port: 9111,
        },
    };
});
