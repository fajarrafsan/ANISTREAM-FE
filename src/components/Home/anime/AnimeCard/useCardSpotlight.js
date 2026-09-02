import { useState, useCallback, useRef } from "react";

export function useCardSpotlight() {
    const ref = useRef(null);
    const [spot, setSpot] = useState({ x: 50, y: 50 });
    const [active, setActive] = useState(false);

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setSpot({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const handleMouseEnter = useCallback(() => setActive(true), []);
    const handleMouseLeave = useCallback(() => {
        setActive(false);
        setSpot({ x: 50, y: 50 });
    }, []);

    return { ref, spot, active, handleMouseMove, handleMouseEnter, handleMouseLeave };
}
