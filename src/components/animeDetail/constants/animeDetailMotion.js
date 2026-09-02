import { useState, useEffect } from "react";

export const DETAIL_EASE = [0.16, 1, 0.3, 1];

export const detailSpring = {
    type: "spring",
    stiffness: 400,
    damping: 32,
    mass: 0.8,
};

export const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};

export const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: DETAIL_EASE },
    },
};

export const sidebarItemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: DETAIL_EASE },
    },
};

export const episodeGridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.02 },
    },
};

export const episodeCardVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: DETAIL_EASE },
    },
};

export function useMotionSafe() {
    const [reduced, setReduced] = useState(() =>
        typeof window !== "undefined"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false
    );

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = (e) => setReduced(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return reduced;
}

export function motionProps(reduced, variants, initial = "hidden", animate = "visible") {
    if (reduced) {
        return {};
    }
    return { variants, initial, animate };
}
