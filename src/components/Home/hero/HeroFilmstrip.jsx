import { memo } from "react";
import { motion, LayoutGroup } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHeroAccent } from "./heroAccents";

const spring = { type: "spring", stiffness: 380, damping: 32 };

function FilmstripCard({ anime, index, isActive, isDark, onSelect }) {
    const accent = getHeroAccent(index, anime?.status);
    const image = anime?.poster || anime?.image || anime?.banner;

    return (
        <motion.button
            layout
            onClick={() => onSelect(index)}
            aria-label={`Pilih ${anime?.title}`}
            aria-current={isActive ? "true" : undefined}
            className={`relative shrink-0 overflow-hidden rounded-lg sm:rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 border transition-colors ${
                isActive
                    ? "border-red-500/50 shadow-2xl"
                    : isDark
                        ? "border-white/10 opacity-60 hover:opacity-90"
                        : "border-black/10 opacity-60 hover:opacity-90"
            }`}
            style={{
                boxShadow: isActive ? `0 8px 32px rgba(${accent.rgb},0.35)` : undefined,
            }}
            animate={{
                width: isActive ? 88 : 56,
                height: isActive ? 112 : 56,
            }}
            transition={spring}
            whileHover={!isActive ? { scale: 1.04, opacity: 0.85 } : {}}
            whileTap={{ scale: 0.97 }}
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

            {/* Active overlay with title */}
            <motion.div
                className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
            {isActive && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 p-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                >
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/90 line-clamp-2 leading-tight">
                        {anime?.title}
                    </p>
                </motion.div>
            )}

            {/* Active progress bar */}
            {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                    <motion.div
                        key={`progress-${index}`}
                        className="h-full w-full origin-left"
                        style={{ background: accent.color }}
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: 6, ease: "linear" }}
                    />
                </div>
            )}
        </motion.button>
    );
}

export default memo(function HeroFilmstrip({
    items,
    currentIndex,
    isDark,
    onSelect,
    onPrev,
    onNext,
}) {
    if (!items?.length) return null;

    return (
        <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 pb-3 sm:pb-4 md:pb-5">
                <div className="flex items-end gap-3 sm:gap-4">
                    {/* Slide counter */}
                    <div className={`hidden sm:flex flex-col items-start shrink-0 pb-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                        <span className="font-mono text-2xl sm:text-3xl font-black tracking-tighter bg-linear-to-b from-red-400 to-red-600 bg-clip-text text-transparent">
                            {String(currentIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[10px] tracking-widest opacity-50">
                            / {String(items.length).padStart(2, "0")}
                        </span>
                    </div>

                    {/* Filmstrip — overflow visible so cards aren't clipped */}
                    <LayoutGroup>
                        <div className="flex items-end gap-2 overflow-visible flex-1 justify-center sm:justify-end min-w-0">
                            {items.map((anime, i) => (
                                <FilmstripCard
                                    key={anime.id ?? anime.animeId ?? i}
                                    anime={anime}
                                    index={i}
                                    isActive={i === currentIndex}
                                    isDark={isDark}
                                    onSelect={onSelect}
                                />
                            ))}
                        </div>
                    </LayoutGroup>

                    {/* Nav arrows */}
                    {items.length > 1 && (
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0 pb-1">
                            <motion.button
                                onClick={onPrev}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                aria-label="Slide sebelumnya"
                                className={`w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
                                    isDark
                                        ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                                        : "bg-black/5 border-black/10 text-gray-600 hover:bg-black/10"
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                onClick={onNext}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                aria-label="Slide berikutnya"
                                className={`w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
                                    isDark
                                        ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                                        : "bg-black/5 border-black/10 text-gray-600 hover:bg-black/10"
                                }`}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
