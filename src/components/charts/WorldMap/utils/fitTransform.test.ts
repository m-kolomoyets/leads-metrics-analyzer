import { fitTransform } from './fitTransform';

// A continent preset is a camera move, never a data filter: it is the zoom transform that frames a
// projected bounding box inside the viewport, with some air around it, capped at the zoom ceiling.

const viewport = { width: 960, height: 500 };

describe('fitTransform', () => {
    it('frames a box in the middle of the viewport', () => {
        const transform = fitTransform(
            [
                [100, 100],
                [200, 150],
            ],
            viewport,
            { padding: 1, maxScale: 8 }
        );

        // Width-bound: 960 / 100 = 9.6, capped at 8.
        expect(transform.k).toBe(8);
        // The box centre (150, 125) lands on the viewport centre (480, 250).
        expect(transform.x).toBe(480 - 8 * 150);
        expect(transform.y).toBe(250 - 8 * 125);
    });

    it('scales to the tighter axis and leaves the padding', () => {
        const transform = fitTransform(
            [
                [0, 0],
                [480, 500],
            ],
            viewport,
            { padding: 0.9, maxScale: 8 }
        );

        // Height-bound: 0.9 × 500 / 500 = 0.9 — a box taller than the viewport zooms OUT to fit.
        expect(transform.k).toBeCloseTo(0.9);
    });

    it('never zooms out past the identity', () => {
        const transform = fitTransform(
            [
                [-100, -100],
                [1060, 600],
            ],
            viewport,
            { padding: 0.9, maxScale: 8, minScale: 1 }
        );

        expect(transform.k).toBe(1);
    });
});
