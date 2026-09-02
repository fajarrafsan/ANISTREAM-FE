import { useState, useEffect } from "react";

/** Cinematic ease — matches hero carousel */
export const CARD_EASE = [0.16, 1, 0.3, 1];

export const cardSpring = {
    type: "spring",
    stiffness: 440,
    damping: 34,
    mass: 0.75,
};

export const cardSpringSoft = {
    type: "spring",
    stiffness: 320,
    damping: 28,
};

export const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.04 },
    },
};

export const gridItemVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.55, ease: CARD_EASE },
    },
};

export const cardShellVariants = {
    rest: {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    },
    expanded: {
        scale: 1.05,
        y: -8,
        boxShadow:
            "0 28px 56px -14px rgba(0,0,0,0.85), 0 0 40px rgba(255,30,86,0.14)",
        transition: cardSpring,
    },
};

export const imageVariants = {
    rest: { scale: 1 },
    expanded: { scale: 1.1, transition: { duration: 0.65, ease: CARD_EASE } },
};

export const overlayBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.28, ease: CARD_EASE } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

export const overlayPanelVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.38, ease: CARD_EASE },
    },
    exit: {
        opacity: 0,
        y: 12,
        transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
    },
};

export const panelStaggerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.06 },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const panelItemVariants = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.38, ease: CARD_EASE },
    },
};

export const titleBarVariants = {
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: CARD_EASE } },
    hidden: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};

export const mobileBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
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

/** Returns instant transition when user prefers reduced motion */
export function motionTransition(reduced, transition) {
    return reduced ? { duration: 0.01 } : transition;
}
