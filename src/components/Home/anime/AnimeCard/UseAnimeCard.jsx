import { useState, useRef, useCallback, useEffect } from "react";

const TRANSITION_DURATION = 320;

export function useAnimeCard() {
    const [isHovered, setIsHovered] = useState(false);
    const [isElevated, setIsElevated] = useState(false);
    const wrapperRef = useRef(null);
    const timeoutRef = useRef(null);

    const clearPendingTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const handleMouseEnter = useCallback(() => {
        clearPendingTimeout();
        setIsHovered(true);
        setIsElevated(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        timeoutRef.current = setTimeout(() => {
            setIsElevated(false);
        }, TRANSITION_DURATION);
    }, []);

    useEffect(() => () => clearPendingTimeout(), []);

    return {
        isHovered,
        isElevated,
        wrapperRef,
        handleMouseEnter,
        handleMouseLeave,
        transitionDuration: TRANSITION_DURATION,
    };
}
