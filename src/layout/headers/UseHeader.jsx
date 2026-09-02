import { useState, useEffect, useRef, useCallback } from "react";

export default function useHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const isScrolledRef = useRef(false);
    const ticking = useRef(false);

    useEffect(() => {
        const update = () => {
            const y = window.scrollY;

            if (!isScrolledRef.current && y > 12) {
                isScrolledRef.current = true;
                setIsScrolled(true);
            } else if (isScrolledRef.current && y < 2) {
                isScrolledRef.current = false;
                setIsScrolled(false);
            }

            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            setScrollProgress(height > 0 ? Math.min(100, (y / height) * 100) : 0);

            ticking.current = false;
        };

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(update);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        update();

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setMenuOpen(false);
    }, []);

    return {
        menuOpen,
        setMenuOpen,
        isScrolled,
        scrollProgress,
        scrollToTop,
    };
}
