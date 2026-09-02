export const FOOTER_EASE = [0.16, 1, 0.3, 1];

export const footerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};

export const footerItemVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.55, ease: FOOTER_EASE },
    },
};

export const quoteVariants = {
    enter: { opacity: 0, y: 10, filter: "blur(4px)" },
    center: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.45, ease: FOOTER_EASE },
    },
    exit: {
        opacity: 0,
        y: -8,
        filter: "blur(4px)",
        transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
    },
};

export const statCardSpring = {
    type: "spring",
    stiffness: 400,
    damping: 28,
};
