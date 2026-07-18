import { cpSync, existsSync, readdirSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);

// @node-rs/argon2 is a native addon: rollup can't parse its .node binary, so it MUST stay external
// (rollupConfig.external below). But keeping it external means nitro's file tracer skips it, so the
// package never lands in the deployed function's node_modules → runtime ERR_MODULE_NOT_FOUND. This
// hook copies the main package + whichever platform binary package is installed on the build host
// (darwin-arm64 locally, linux-x64-gnu on Vercel) into every emitted Vercel Function's node_modules.
type Argon2Source = { name: string; dir: string };

function copyArgon2IntoFunctions(nitro: { options: { output: { dir: string } } }) {
    const argon2Pkg = path.dirname(require.resolve('@node-rs/argon2/package.json'));
    const argon2Require = createRequire(path.join(argon2Pkg, 'index.js'));
    const optionalDeps = Object.keys(require('@node-rs/argon2/package.json').optionalDependencies ?? {});

    // Only the host-matching platform package is actually installed; the rest throw and are skipped.
    const installed = optionalDeps
        .map((name): Argon2Source | null => {
            try {
                return { name, dir: path.dirname(argon2Require.resolve(`${name}/package.json`)) };
            } catch {
                return null;
            }
        })
        .filter((source): source is Argon2Source => {
            return source !== null;
        });

    const sources = [{ name: '@node-rs/argon2', dir: argon2Pkg }, ...installed];

    const functionsDir = path.join(nitro.options.output.dir, 'functions');
    if (!existsSync(functionsDir)) {
        return;
    }

    const funcs = readdirSync(functionsDir).filter((entry) => {
        return entry.endsWith('.func');
    });
    for (const func of funcs) {
        for (const { name, dir } of sources) {
            cpSync(dir, path.join(functionsDir, func, 'node_modules', name), { recursive: true });
        }
    }
}

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
            // @node-rs/argon2 stays external (its .node binary is unparseable by rollup); the compiled
            // hook then copies the package + platform binary into the function output. See
            // copyArgon2IntoFunctions. traceDeps can't do this: it doesn't externalize, so nitro inlines
            // argon2 and rollup crashes on the .node.
            nitro({
                rollupConfig: {
                    external: [/@node-rs[\\/]argon2/],
                },
                hooks: {
                    compiled: copyArgon2IntoFunctions,
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
