import { motion, AnimatePresence } from "motion/react";
import { useAnimeCard } from "./useAnimeCard";
import { useCanHover } from "./useCanHover";
import { useMotionSafe, cardShellVariants, mobileBackdropVariants, motionTransition, cardSpring } from "./animeCardMotion";
import AnimeCardImage from "./AnimeCardImage";
import AnimeCardPanel from "./AnimeCardPanel";
import { useTheme } from "../../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function AnimeCards({
    anime,
    index,
    activeCardId,
    setActiveCardId,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const isOngoing = anime.status === "ONGOING";
    const navigate = useNavigate();
    const canHover = useCanHover();
    const reducedMotion = useMotionSafe();

    const {
        isHovered,
        isElevated,
        wrapperRef,
        handleMouseEnter,
        handleMouseLeave,
    } = useAnimeCard();

    const animeKey = anime.id ?? anime.animeId ?? index;
    const isTappedOpen = activeCardId === animeKey;
    const isExpanded = canHover ? isHovered : isTappedOpen;

    const handlePlay = () => {
        navigate(`/anime/detail/${anime.animeId}`);
    };

    const handleToggleTap = (e) => {
        if (canHover) return;
        e.stopPropagation();
        setActiveCardId(isTappedOpen ? null : animeKey);
    };

    const shellState = isExpanded ? "expanded" : "rest";

    return (
        <div
            ref={wrapperRef}
            className="relative overflow-visible"
            style={{ zIndex: isElevated || isExpanded ? 80 : 1 }}
            onMouseEnter={canHover ? handleMouseEnter : undefined}
            onMouseLeave={canHover ? handleMouseLeave : undefined}
        >
            <AnimatePresence>
                {!canHover && isExpanded && (
                    <motion.div
                        key="backdrop"
                        variants={mobileBackdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[3px]"
                        onClick={() => setActiveCardId(null)}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Ambient glow */}
            <motion.div
                className="pointer-events-none absolute -inset-2 rounded-[1.25rem] blur-2xl"
                animate={{
                    opacity: isExpanded ? 0.85 : 0,
                    scale: isExpanded ? 1 : 0.92,
                }}
                transition={motionTransition(reducedMotion, cardSpring)}
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 80%, rgba(255,30,86,0.28) 0%, transparent 65%)",
                }}
            />

            <motion.article
                layout={!reducedMotion}
                variants={cardShellVariants}
                initial="rest"
                animate={shellState}
                transition={motionTransition(reducedMotion, cardSpring)}
                className={`relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer group/card ${isExpanded ? "max-sm:z-[80]" : ""} ${
                    isDark ? "bg-[#08080d]" : "bg-zinc-100"
                }`}
                style={{
                    border: isExpanded
                        ? "1px solid rgba(255,30,86,0.4)"
                        : isDark
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(0,0,0,0.07)",
                }}
                onClick={!canHover ? handleToggleTap : undefined}
                aria-label={`${anime.title}${isExpanded ? ", detail terbuka" : ""}`}
            >
                {/* Premium edge shine */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl z-[1]"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,30,86,0.06) 100%)",
                    }}
                />

                {/* Corner accents */}
                <div className="pointer-events-none absolute top-0 left-0 w-5 h-5 border-l border-t border-white/15 rounded-tl-2xl z-[2]" />
                <div className="pointer-events-none absolute top-0 right-0 w-5 h-5 border-r border-t border-white/15 rounded-tr-2xl z-[2]" />

                <AnimeCardImage
                    anime={anime}
                    isExpanded={isExpanded}
                    isOngoing={isOngoing}
                    isDark={isDark}
                    canHover={canHover}
                    reducedMotion={reducedMotion}
                />

                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <AnimeCardPanel
                            key="panel"
                            anime={anime}
                            isDark={isDark}
                            onPlay={handlePlay}
                            reducedMotion={reducedMotion}
                        />
                    )}
                </AnimatePresence>
            </motion.article>
        </div>
    );
}
