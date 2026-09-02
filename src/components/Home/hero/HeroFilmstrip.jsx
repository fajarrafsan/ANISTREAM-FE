import { memo } from "react";
import { motion, LayoutGroup, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { getHeroAccent } from "./heroAccents";

const spring = { type: "spring", stiffness: 380, damping: 32 };

function FilmstripCard({ anime, index, isActive, isDark, distance, progress, onSelect }) {
    const accent = getHeroAccent(index, anime?.status);
    const image = anime?.poster || anime?.image || anime?.banner;
    const reduced = useReducedMotion();

    // Kedalaman ala coverflow: makin jauh dari slide aktif, makin surut.
    const depth = Math.min(distance, 3);
    const restOpacity = isActive ? 1 : Math.max(0.32, 0.72 - depth * 0.13);

    return (
        <motion.button
            layout={!reduced}
            onClick={() => onSelect(index)}
            aria-label={`Tampilkan ${anime?.title ?? `slide ${index + 1}`}`}
            aria-current={isActive ? "true" : undefined}
            className={`relative shrink-0 overflow-hidden rounded-lg sm:rounded-xl cursor-pointer border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                isDark ? "focus-visible:ring-offset-[#07020a]" : "focus-visible:ring-offset-[#f0f2f5]"
            } ${
                isActive
                    ? "border-red-500/50 shadow-2xl"
                    : isDark ? "border-white/10" : "border-black/10"
            }`}
            style={{ boxShadow: isActive ? `0 8px 32px rgba(${accent.rgb},0.35)` : undefined }}
            /* Ukuran diterapkan saat render, bukan lewat animasi masuk: kalau
               rAF ditahan (tab latar, motion gagal), kartu tetap punya dimensi. */
            initial={false}
            animate={{
                width: isActive ? 88 : 56,
                height: isActive ? 112 : 56,
                opacity: restOpacity,
                scale: isActive ? 1 : 1 - depth * 0.03,
            }}
            transition={reduced ? { duration: 0 } : spring}
            whileHover={!isActive && !reduced ? { scale: 1.05, opacity: 0.95 } : {}}
            whileTap={reduced ? {} : { scale: 0.97 }}
        >
            <div className={`absolute inset-0 ${isDark ? "bg-zinc-900" : "bg-gray-200"}`} />
            {image && (
                <img
                    src={image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: "center top" }}
                    loading="lazy"
                    onError={(e) => { e.target.style.opacity = "0"; }}
                />
            )}

            <motion.div
                className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
            />

            {isActive && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 p-2"
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                >
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/90 line-clamp-2 leading-tight">
                        {anime?.title}
                    </p>
                </motion.div>
            )}

            {/* Bar progres dibaca langsung dari MotionValue jam auto-play:
                ikut berhenti saat di-pause, tanpa render ulang React tiap frame. */}
            {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-black/40">
                    <motion.div
                        data-hero-progress
                        className="h-full w-full origin-left will-change-transform"
                        style={{ background: accent.color, scaleX: progress }}
                    />
                </div>
            )}
        </motion.button>
    );
}

const arrowClass = (isDark) =>
    `grid size-11 place-items-center rounded-full border backdrop-blur-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
        isDark
            ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-offset-[#07020a]"
            : "bg-black/5 border-black/10 text-gray-700 hover:bg-black/10 focus-visible:ring-offset-[#f0f2f5]"
    }`;

export default memo(function HeroFilmstrip({
    items,
    currentIndex,
    isDark,
    progress,
    userPaused,
    onTogglePause,
    onSelect,
    onPrev,
    onNext,
}) {
    if (!items?.length) return null;

    return (
        <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 pb-3 sm:pb-4 md:pb-5">
                <div className="flex items-end gap-3 sm:gap-4">
                    <div className={`hidden sm:flex flex-col items-start shrink-0 pb-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                        <span className="font-mono text-2xl sm:text-3xl font-black tracking-tighter bg-linear-to-b from-red-400 to-red-600 bg-clip-text text-transparent">
                            {String(currentIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[10px] tracking-widest opacity-50">
                            / {String(items.length).padStart(2, "0")}
                        </span>
                    </div>

                    <LayoutGroup>
                        <div className="flex items-end gap-2 overflow-visible flex-1 justify-center sm:justify-end min-w-0">
                            {items.map((anime, i) => (
                                <FilmstripCard
                                    key={anime.id ?? anime.animeId ?? i}
                                    anime={anime}
                                    index={i}
                                    isActive={i === currentIndex}
                                    distance={Math.abs(i - currentIndex)}
                                    progress={progress}
                                    isDark={isDark}
                                    onSelect={onSelect}
                                />
                            ))}
                        </div>
                    </LayoutGroup>

                    {items.length > 1 && (
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0 pb-1">
                            <button
                                type="button"
                                onClick={onTogglePause}
                                aria-label={userPaused ? "Lanjutkan putar otomatis" : "Jeda putar otomatis"}
                                className={arrowClass(isDark)}
                            >
                                {userPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </button>
                            <button type="button" onClick={onPrev} aria-label="Slide sebelumnya" className={arrowClass(isDark)}>
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={onNext} aria-label="Slide berikutnya" className={arrowClass(isDark)}>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
