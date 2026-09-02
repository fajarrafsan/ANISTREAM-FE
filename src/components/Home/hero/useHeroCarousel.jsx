import { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion, useMotionValue } from "motion/react";

const ANIMATION_DURATION = 900;
export const AUTO_INTERVAL = 6000;

export default function useHeroCarousel(total) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [hasTransitioned, setHasTransitioned] = useState(false);

    // Progres 0..1 menuju slide berikutnya, digerakkan rAF dari jam yang sama
    // dengan auto-advance — bar progres tidak bisa lepas sinkron dari timer.
    // MotionValue, bukan state: menulis tiap frame ke state akan me-render
    // ulang seluruh hero 60x per detik.
    const progress = useMotionValue(0);
    const [userPaused, setUserPaused] = useState(false);
    const [hoverPaused, setHoverPaused] = useState(false);

    const reduced = useReducedMotion();

    const isAnimating = useRef(false);
    const animatingTimerRef = useRef(null);
    const touchStartX = useRef(null);
    const slideRef = useRef(0);

    const elapsedRef = useRef(0);
    const lastTickRef = useRef(0);
    const rafRef = useRef(null);

    slideRef.current = currentSlide;

    // Auto-play berhenti total saat pengguna meminta reduced motion: konten
    // yang bergerak sendiri adalah hal pertama yang ingin mereka hentikan.
    const isPaused = userPaused || hoverPaused || reduced;

    const armAnimating = useCallback(() => {
        isAnimating.current = true;
        clearTimeout(animatingTimerRef.current);
        animatingTimerRef.current = setTimeout(() => {
            isAnimating.current = false;
        }, ANIMATION_DURATION);
    }, []);

    const resetClock = useCallback(() => {
        elapsedRef.current = 0;
        lastTickRef.current = 0;
        progress.set(0);
    }, [progress]);

    const goTo = useCallback((index, dir = 1) => {
        if (isAnimating.current || total === 0) return;
        armAnimating();
        setDirection(dir);
        setCurrentSlide(((index % total) + total) % total);
        setAnimationKey((prev) => prev + 1);
        setHasTransitioned(true);
        resetClock();
    }, [total, armAnimating, resetClock]);

    const goToRef = useRef(null);
    goToRef.current = goTo;

    // Satu jam rAF menggerakkan progres sekaligus memicu pergantian slide.
    useEffect(() => {
        if (total <= 1 || isPaused || !isLoaded) {
            cancelAnimationFrame(rafRef.current);
            lastTickRef.current = 0;
            return;
        }

        const tick = (now) => {
            if (!lastTickRef.current) lastTickRef.current = now;
            elapsedRef.current += now - lastTickRef.current;
            lastTickRef.current = now;

            if (elapsedRef.current >= AUTO_INTERVAL) {
                isAnimating.current = false;
                clearTimeout(animatingTimerRef.current);
                goToRef.current(slideRef.current + 1, 1);
            } else {
                progress.set(elapsedRef.current / AUTO_INTERVAL);
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [total, isPaused, isLoaded, currentSlide, progress]);

    // Tab tersembunyi: jangan habiskan slide di balik layar.
    useEffect(() => {
        const onVisibility = () => setHoverPaused(document.hidden);
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    useEffect(() => () => {
        clearTimeout(animatingTimerRef.current);
        cancelAnimationFrame(rafRef.current);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const pauseAuto = useCallback(() => setHoverPaused(true), []);
    const resumeAuto = useCallback(() => setHoverPaused(false), []);
    const togglePause = useCallback(() => setUserPaused((p) => !p), []);

    const handlePrev = useCallback(() => goToRef.current(slideRef.current - 1, -1), []);
    const handleNext = useCallback(() => goToRef.current(slideRef.current + 1, 1), []);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handlePrev, handleNext]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) {
            if (dx < 0) handleNext();
            else handlePrev();
        }
        touchStartX.current = null;
    };

    return {
        currentSlide,
        direction,
        isLoaded,
        animationKey,
        hasTransitioned,
        progress,
        isPaused,
        userPaused,
        reduced,
        goTo,
        togglePause,
        pauseAuto,
        resumeAuto,
        handlePrev,
        handleNext,
        handleTouchStart,
        handleTouchEnd,
    };
}
