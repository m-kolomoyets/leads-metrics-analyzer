import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@react-hookz/web';
import { useBackground } from '@/context/BackgroundContext';
import { useTheme } from '@/context/ThemeContext';

// Live gradient background ported from references/analizator-kampaniy-blue: nine drifting blue blobs
// drawn on a canvas, plus a static masked grid overlay. Theme-aware, toggleable, motion-safe.

type Blob = { hue: number; sat: number; base: number };

const BLOBS: Blob[] = [
    { hue: 214, sat: 100, base: 0.18 },
    { hue: 214, sat: 100, base: 0.14 },
    { hue: 224, sat: 90, base: 0.15 },
    { hue: 205, sat: 95, base: 0.12 },
    { hue: 230, sat: 80, base: 0.11 },
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

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return;
            }

            const config = isDarkTheme ? DARK_CONFIG : LIGHT_CONFIG;
            let width = 0;
            let height = 0;
            let raf = 0;
            let t = 0;

            function resize() {
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                width = canvas!.clientWidth;
                height = canvas!.clientHeight;
                canvas!.width = width * dpr;
                canvas!.height = height * dpr;
                ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
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
                t += 0.3;
                ctx!.clearRect(0, 0, width, height);
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
                raf = window.requestAnimationFrame(draw);
            }

            resize();
            window.addEventListener('resize', resize);
            draw();

            return function cleanup() {
                window.cancelAnimationFrame(raf);
                window.removeEventListener('resize', resize);
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
