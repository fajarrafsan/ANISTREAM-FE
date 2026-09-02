import { useState, useEffect } from "react";

/** True on devices that support hover (desktop/laptop with mouse). */
export function useCanHover() {
    const [canHover, setCanHover] = useState(() =>
        typeof window !== "undefined"
            ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
            : true
    );

    useEffect(() => {
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
        const handler = (e) => setCanHover(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return canHover;
}
