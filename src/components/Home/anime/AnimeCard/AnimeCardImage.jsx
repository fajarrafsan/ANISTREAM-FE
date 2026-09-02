import { motion } from "motion/react";
import { useCardSpotlight } from "./useCardSpotlight";
import {
    imageVariants,
    titleBarVariants,
    motionTransition,
    CARD_EASE,
} from "./animeCardMotion";

export default function AnimeCardImage({
    anime,
    isExpanded,
    isOngoing,
    isDark,
    canHover = true,
    reducedMotion = false,
}) {
    const {
        ref: spotRef,
        spot,
        active: spotActive,
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
    } = useCardSpotlight();

    const imgState = isExpanded ? "expanded" : "rest";

    return (
        <div
            ref={spotRef}
            className="absolute inset-0 overflow-hidden"
            onMouseMove={canHover ? handleMouseMove : undefined}
            onMouseEnter={canHover ? handleMouseEnter : undefined}
            onMouseLeave={canHover ? handleMouseLeave : undefined}
        >
            <motion.img
                src={anime.image}
                alt={anime.title}
                loading="lazy"
                draggable={false}
                variants={imageVariants}
                initial="rest"
                animate={imgState}
                transition={motionTransition(reducedMotion, { duration: 0.65, ease: CARD_EASE })}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Cursor spotlight */}
            <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ opacity: spotActive && canHover && !isExpanded ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                style={{
                    background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,30,86,0.22) 0%, transparent 52%)`,
                }}
            />

            {/* Film grain */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay z-[1]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/5"
                animate={{ opacity: isExpanded ? 0.35 : 1 }}
                transition={{ duration: 0.35, ease: CARD_EASE }}
            />

            {/* Badges */}
            <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-start justify-between gap-1.5">
                <StatusBadge isOngoing={isOngoing} reducedMotion={reducedMotion} />
                {anime.rating && (
                    <motion.span
                        initial={false}
                        whileHover={reducedMotion ? {} : { scale: 1.04 }}
                        className="inline-flex items-center gap-0.5 rounded-lg border px-2 py-0.5 text-[8px] sm:text-[9px] font-bold backdrop-blur-xl bg-black/55 border-amber-400/25 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                    >
                        {anime.rating}
                        <span className="text-amber-400/80">★</span>
                    </motion.span>
                )}
            </div>

            {isOngoing && anime.episode && (
                <motion.div
                    className="absolute top-10 right-2.5 z-10"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={motionTransition(reducedMotion, { delay: 0.1, duration: 0.35 })}
                >
                    <span className="rounded-lg border px-2 py-0.5 text-[8px] font-bold backdrop-blur-xl bg-black/55 border-white/12 text-white/90">
                        {anime.episode}
                    </span>
                </motion.div>
            )}

            {/* Title bar */}
            <motion.div
                className="absolute inset-x-0 bottom-0 z-10 p-3 pt-10"
                variants={titleBarVariants}
                initial="visible"
                animate={isExpanded ? "hidden" : "visible"}
            >
                <h3 className="font-display font-bold leading-tight line-clamp-2 text-sm sm:text-[15px] text-white tracking-wide drop-shadow-lg">
                    {anime.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 min-w-0 text-[10px] sm:text-[11px]">
                    {anime.genre && (
                        <span className="truncate font-medium text-white/60">{anime.genre}</span>
                    )}
                    {anime.year && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-red-400/60 shrink-0" />
                            <span className="shrink-0 font-semibold text-white/50">{anime.year}</span>
                        </>
                    )}
                </div>
                {/* Accent line */}
                <motion.div
                    className="mt-2 h-[2px] rounded-full origin-left bg-gradient-to-r from-red-500/80 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={motionTransition(reducedMotion, { duration: 0.5, ease: CARD_EASE })}
                />
            </motion.div>

            {/* Hover hint — desktop only */}
            {canHover && !isExpanded && (
                <motion.div
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wide text-white/70 backdrop-blur-md bg-black/30 border border-white/10"
                    initial={{ opacity: 0, y: 6 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    Hover untuk detail
                </motion.div>
            )}
        </div>
    );
}

function StatusBadge({ isOngoing, reducedMotion }) {
    return (
        <motion.span
            initial={false}
            animate={
                isOngoing && !reducedMotion
                    ? { boxShadow: ["0 0 0 rgba(239,68,68,0)", "0 0 14px rgba(239,68,68,0.35)", "0 0 0 rgba(239,68,68,0)"] }
                    : {}
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.12em] backdrop-blur-xl ${
                isOngoing
                    ? "bg-red-500/15 text-red-300 border-red-400/30"
                    : "bg-emerald-500/12 text-emerald-300 border-emerald-400/25"
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? "bg-red-400" : "bg-emerald-400"}`} />
            {isOngoing ? "Ongoing" : "Selesai"}
        </motion.span>
    );
}
