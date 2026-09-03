import { motion } from "motion/react";
import { stripHtml } from "../../../../utils/htmlParser";
import AnimeCardButtons from "./AnimeCardButtons";
import {
    overlayBackdropVariants,
    overlayPanelVariants,
    panelStaggerVariants,
    panelItemVariants,
} from "./animeCardMotion";

export default function AnimeCardPanel({ anime, isDark, onPlay, reducedMotion = false }) {
    const synopsis = stripHtml(anime.synopsis) || "Sinopsis belum tersedia.";

    return (
        <motion.div
            className="absolute inset-0 z-30 flex flex-col justify-end"
            variants={overlayBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0610] via-black/80 to-black/30 pointer-events-none" />

            {/* Glass panel */}
            <motion.div
                variants={overlayPanelVariants}
                className={`relative mx-2 mb-2 rounded-xl border backdrop-blur-xl overflow-hidden max-sm:max-h-[calc(100%_-_1rem)] max-sm:overflow-y-auto max-sm:overscroll-contain ${
                    isDark
                        ? "bg-[#120a10]/85 border-white/[0.1]"
                        : "bg-black/75 border-white/[0.12]"
                }`}
                style={{
                    boxShadow: "0 -8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
            >
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

                <motion.div
                    className="p-3 space-y-2.5"
                    variants={panelStaggerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.p
                        variants={panelItemVariants}
                        className="text-[10px] sm:text-[11px] leading-relaxed line-clamp-3 text-white/80"
                    >
                        {synopsis}
                    </motion.p>

                    <motion.div variants={panelItemVariants} className="flex flex-wrap gap-1.5">
                        {anime.genre && <MetaPill accent="red">{anime.genre}</MetaPill>}
                        {anime.year && <MetaPill>{anime.year}</MetaPill>}
                        {anime.studio && <MetaPill>{anime.studio}</MetaPill>}
                        {anime.duration && <MetaPill>{anime.duration}</MetaPill>}
                    </motion.div>

                    <motion.div variants={panelItemVariants}>
                        <AnimeCardButtons
                            anime={anime}
                            isDark={isDark}
                            onPlay={onPlay}
                            reducedMotion={reducedMotion}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function MetaPill({ children, accent }) {
    return (
        <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-block max-w-full truncate rounded-md border px-2 py-0.5 text-[9px] font-semibold ${
                accent === "red"
                    ? "bg-red-500/15 border-red-400/25 text-red-200"
                    : "bg-white/[0.06] border-white/[0.1] text-white/75"
            }`}
        >
            {children}
        </motion.span>
    );
}
