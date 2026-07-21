import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@react-hookz/web';
import { useBackground } from '@/context/BackgroundContext';
import { useTheme } from '@/context/ThemeContext';

// Live gradient background ported from references/analizator-kampaniy-blue: nine drifting blue blobs
// drawn on a canvas, plus a static masked grid overlay. Theme-aware, toggleable, motion-safe.

type Blob = { hue: number; sat: number; base: number };

const BLOBS: Blob[] = [
    { hue: 210, sat: 90, base: 0.13 },
    { hue: 218, sat: 100, base: 0.1 },
    { hue: 240, sat: 60, base: 0.08 },
    { hue: 200, sat: 85, base: 0.1 },
];

type ThemeConfig = {
    grad: [string, string, string];
    composite: GlobalCompositeOperation;
    light: number;
    alphaMul: number;
};

const DARK_CONFIG: ThemeConfig = {
    grad: ['#070a12', '#080b14', '#0a0e18'],
    composite: 'lighter',
    light: 60,
    alphaMul: 1,
};

// Light theme: additive blending blows out on a pale canvas, so darken with `multiply` instead.
const LIGHT_CONFIG: ThemeConfig = {
    grad: ['#f4f8ff', '#eef4ff', '#e8f1ff'],
    composite: 'multiply',
    light: 62,
    alphaMul: 2.4,
};

// Perf budget (mirrors the reference): render into a half-res buffer that CSS stretches back up, and
// cap to 30fps. The blobs are soft gradients, so neither is visible — but together they cut the
// per-second fill work ~30× vs. full-DPR/60fps, which is what was heating the GPU.
const SCALE = 0.5;
const FPS = 30;
const FRAME_MS = 1000 / FPS;
// Drift step per rendered frame. Doubled to offset the halved frame rate → same on-screen speed.
const T_STEP = 0.6;

export function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isDarkTheme } = useTheme();
    const { isAnimated } = useBackground();
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)') ?? false;

    const active = isAnimated && !prefersReducedMotion;

    useEffect(
        function runBackgroundAnimation() {
            const canvas = canvasRef.current;

            if (!canvas || !active) {
                return;
            }

            // Opaque context: the gradient fills every pixel each frame, so we never need alpha
            // compositing against the page — cheaper to composite.
            const ctx = canvas.getContext('2d', { alpha: false });

            if (!ctx) {
                return;
            }

            const config = isDarkTheme ? DARK_CONFIG : LIGHT_CONFIG;
            let width = 0;
            let height = 0;
            let raf = 0;
            let t = 0;
            let last = 0;

            function resize() {
                // Half-res internal buffer; the CSS `w-screen h-screen` on the element stretches it.
                width = Math.round(canvas!.clientWidth * SCALE);
                height = Math.round(canvas!.clientHeight * SCALE);
                canvas!.width = width;
                canvas!.height = height;
            }

            const paths = BLOBS.map((blob, i) => {
                return {
                    ...blob,
                    ax: 0.24 + 0.16 * Math.sin(i * 1.7),
                    ay: 0.22 + 0.18 * Math.cos(i * 2.3),
                    fx: 0.02 + i * 0.0042,
                    fy: 0.017 + i * 0.0051,
                    px: i * 1.3,
                    py: i * 2.1,
                    cx: 0.5 + 0.3 * Math.sin(i * 2.1),
                    cy: 0.5 + 0.3 * Math.cos(i * 1.5),
                    r: 0.62 + 0.3 * ((i * 0.53) % 1),
                };
            });

            function draw() {
                t += T_STEP;
                const bg = ctx!.createLinearGradient(0, 0, width, height);
                bg.addColorStop(0, config.grad[0]);
                bg.addColorStop(0.5, config.grad[1]);
                bg.addColorStop(1, config.grad[2]);
                ctx!.fillStyle = bg;
                ctx!.fillRect(0, 0, width, height);
                ctx!.globalCompositeOperation = config.composite;
                const minWH = Math.min(width, height);

                for (const p of paths) {
                    const x = (p.cx + p.ax * Math.sin(t * p.fx + p.px)) * width;
                    const y = (p.cy + p.ay * Math.cos(t * p.fy + p.py)) * height;
                    const rad = p.r * minWH;
                    const alpha = Math.min(1, p.base * config.alphaMul * (0.75 + 0.25 * Math.sin(t * 0.004 + p.px)));
                    const g = ctx!.createRadialGradient(x, y, 0, x, y, rad);
                    g.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${config.light}%, ${alpha})`);
                    g.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${config.light}%, 0)`);
                    ctx!.fillStyle = g;
                    ctx!.beginPath();
                    ctx!.arc(x, y, rad, 0, Math.PI * 2);
                    ctx!.fill();
                }

                ctx!.globalCompositeOperation = 'source-over';
            }

            function loop(now: number) {
                raf = window.requestAnimationFrame(loop);

                // Throttle to FPS: skip frames the monitor offers beyond our budget.
                if (now - last < FRAME_MS) {
                    return;
                }

                last = now;
                draw();
            }

            function handleVisibility() {
                // Freeze on hidden tabs (0% CPU in the background); resume on return.
                if (document.hidden) {
                    window.cancelAnimationFrame(raf);
                    raf = 0;
                } else if (raf === 0) {
                    last = 0;
                    raf = window.requestAnimationFrame(loop);
                }
            }

            resize();
            window.addEventListener('resize', resize);
            document.addEventListener('visibilitychange', handleVisibility);
            raf = window.requestAnimationFrame(loop);

            return function cleanup() {
                window.cancelAnimationFrame(raf);
                window.removeEventListener('resize', resize);
                document.removeEventListener('visibilitychange', handleVisibility);
            };
        },
        [active, isDarkTheme]
    );

    return (
        <>
            <canvas
                ref={canvasRef}
                aria-hidden={true}
                className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen transition-opacity duration-500"
                style={{ opacity: active ? 1 : 0 }}
            />
            <div
                aria-hidden={true}
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    backgroundImage:
                        'linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)',
                    backgroundSize: '42px 42px',
                    maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, #000 55%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, #000 55%, transparent 100%)',
                }}
            />
        </>
    );
}
