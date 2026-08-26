import { useEffect, useState } from 'react';

// The rail's END follows the numbers with a beat of delay. Typing 275 passes through 2 and 27, and
// an end that tracked every keystroke would fling both notches across the rail three times per
// edit. The notches move live inside whatever end is current; the end itself settles once the
// typing stops, so the picture reads as motion rather than as flicker.
function useSettledMax(target: number): number {
    const [settled, setSettled] = useState(target);

    useEffect(
        function settleAfterTypingStops() {
            if (target === settled) {
                return;
            }

            const timer = setTimeout(() => {
                setSettled(target);
            }, 200);

            return () => {
                clearTimeout(timer);
            };
        },
        [target, settled]
    );

    return settled;
}

export { useSettledMax };
