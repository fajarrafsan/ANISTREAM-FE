import { useState, useEffect, useRef, useCallback } from "react";

const ANIMATION_DURATION = 900;
const AUTO_INTERVAL = 6000;

export default function useHeroCarousel(total) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [hasTransitioned, setHasTransitioned] = useState(false);

    const isAnimating = useRef(false);
    const animatingTimerRef = useRef(null);
    const autoTimerRef = useRef(null);
    const touchStartX = useRef(null);
    const slideRef = useRef(0);
    const hasStartedAutoRef = useRef(false);

    slideRef.current = currentSlide;

    const armAnimating = useCallback(() => {
        isAnimating.current = true;
        clearTimeout(animatingTimerRef.current);
        animatingTimerRef.current = setTimeout(() => {
            isAnimating.current = false;
        }, ANIMATION_DURATION);
    }, []);

    useEffect(() => {
        return () => clearTimeout(animatingTimerRef.current);
    }, []);

    const autoAdvance = useCallback(() => {
        if (total <= 1) return;
        armAnimating();
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % total);
        setAnimationKey((prev) => prev + 1);
        setHasTransitioned(true);
    }, [total, armAnimating]);

    const autoAdvanceRef = useRef(null);
    autoAdvanceRef.current = autoAdvance;

    const resetAuto = useCallback(() => {
        clearInterval(autoTimerRef.current);

        if (!hasStartedAutoRef.current) return;
        if (total <= 1) return;

        autoTimerRef.current = setInterval(() => {
            if (isAnimating.current) {
                isAnimating.current = false;
                clearTimeout(animatingTimerRef.current);
            }
            autoAdvanceRef.current();
        }, AUTO_INTERVAL);
    }, [total]);

    const resetAutoRef = useRef(null);
    resetAutoRef.current = resetAuto;

    const goTo = useCallback((index, dir = 1) => {
        if (isAnimating.current || total === 0) return;
        armAnimating();

        setDirection(dir);
        setCurrentSlide(((index % total) + total) % total);
        setAnimationKey((prev) => prev + 1);
        setHasTransitioned(true);

        resetAutoRef.current();
    }, [total, armAnimating]);

    const pauseAuto = useCallback(() => {
        clearInterval(autoTimerRef.current);
    }, []);

    const resumeAuto = useCallback(() => {
        if (total > 1) resetAutoRef.current();
    }, [total]);

    // Mark as loaded once, after initial mount delay.
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (total <= 1) return;
        hasStartedAutoRef.current = true;
        resetAutoRef.current();

        return () => {
            clearInterval(autoTimerRef.current);
        };
    }, [total]);

    useEffect(() => {
        const handleKey = (e) => {
            const s = slideRef.current;
            if (e.key === "ArrowLeft") goTo(s - 1, -1);
            if (e.key === "ArrowRight") goTo(s + 1, 1);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [goTo]);

    const handlePrev = useCallback(() => {
        goTo(slideRef.current - 1, -1);
    }, [goTo]);

    const handleNext = useCallback(() => {
        goTo(slideRef.current + 1, 1);
    }, [goTo]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) {
            dx < 0 ? handleNext() : handlePrev();
        }
        touchStartX.current = null;
    };

    return {
        currentSlide,
        direction,
        isLoaded,
        animationKey,
        hasTransitioned,
        goTo,
        resetAuto,
        pauseAuto,
        resumeAuto,
        handlePrev,
        handleNext,
        handleTouchStart,
        handleTouchEnd,
    };
}