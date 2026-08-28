import { useEffect, useState } from 'react';

// Which way the window last moved, sampled on a frame rather than on every scroll event: a scroll
// fires far more often than the screen repaints, and this drives a transition.
//
// Any movement counts. There is no minimum distance to travel before the answer flips — a reader who
// nudges the page up by four pixels has asked for the bar back, and a dead zone made that nudge do
// nothing until the next one crossed the line, which is what the stutter was. `lastY` is refreshed
// every frame for the same reason: measuring against a stale anchor turns a slow drift upward into a
// run of deltas that never add up to a direction.
function useScrollDirection() {
    const [direction, setDirection] = useState<'up' | 'down'>('up');

    useEffect(function trackScrollDirection() {
        let lastY = window.scrollY;
        let frame = 0;

        const read = () => {
            frame = 0;

            const y = Math.max(window.scrollY, 0);
            const delta = y - lastY;

            lastY = y;

            // The top of the page always reads as 'up': nothing is gained by folding the bar away
            // over a page the reader has barely moved.
            if (y === 0) {
                setDirection('up');

                return;
            }

            if (delta === 0) {
                return;
            }

            setDirection(delta > 0 ? 'down' : 'up');
        };

        const onScroll = () => {
            if (frame) {
                return;
            }

            frame = window.requestAnimationFrame(read);
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);

            if (frame) {
                window.cancelAnimationFrame(frame);
            }
        };
    }, []);

    return direction;
}

export { useScrollDirection };
