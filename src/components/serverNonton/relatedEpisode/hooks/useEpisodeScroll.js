import { useRef, useState, useEffect, useCallback } from "react";

export default function useEpisodeScroll(episodes, effectiveEpisodeId) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 4);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        const ro = new ResizeObserver(() => checkScroll());
        ro.observe(el);
        Array.from(el.children).forEach(c => ro.observe(c));
        el.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
        const t = setTimeout(checkScroll, 300);
        return () => {
            ro.disconnect();
            el.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
            clearTimeout(t);
        };
    }, [episodes, checkScroll]);

    useEffect(() => {
        if (!episodes.length || !effectiveEpisodeId || !scrollRef.current) return;
        const scrollToActive = () => {
            const container = scrollRef.current;
            if (!container) return;
            const activeCard = container.querySelector('[data-active="true"]');
            if (!activeCard) return;
            const targetLeft = activeCard.offsetLeft - ((container.clientWidth - activeCard.clientWidth) / 2);
            container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
            setTimeout(checkScroll, 300);
        };
        const t1 = setTimeout(scrollToActive, 100);
        const t2 = setTimeout(scrollToActive, 450);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [episodes, effectiveEpisodeId, checkScroll]);

    const scrollBy = useCallback((dir) => {
        const el = scrollRef.current;
        if (!el) return;
        const firstCard = el.firstElementChild;
        if (!firstCard) return;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(el).columnGap)
            || parseFloat(window.getComputedStyle(el).gap)
            || 20;
        const itemStep = cardWidth + gap;
        const currentIndex = Math.round(el.scrollLeft / itemStep);
        const targetIndex = Math.max(0, Math.min(currentIndex + dir, el.children.length - 1));
        el.scrollTo({ left: targetIndex * itemStep, behavior: "smooth" });
    }, []);

    return { scrollRef, canScrollLeft, canScrollRight, checkScroll, scrollBy };
}
