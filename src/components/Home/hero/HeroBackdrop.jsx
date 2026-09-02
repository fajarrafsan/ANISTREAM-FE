import { memo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getImageFilter } from "./HeroStyle";
import { getHeroAccent } from "./heroAccents";

const HeroBackdrop = memo(function HeroBackdrop({ anime, index, isDark, isActive }) {
    const accent = getHeroAccent(index, anime?.status);
    const src = anime?.banner || anime?.image;

    return (
        <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Full-bleed cover — matched to 3:1 banner ratio container */}
            <motion.div
                className="absolute inset-0"
                animate={{ scale: isActive ? 1.04 : 1 }}
                transition={{ duration: 12, ease: "linear" }}
            >
                {src ? (
                    <img
                        src={src}
                        alt=""
                        fetchPriority={isActive ? "high" : "low"}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            filter: getImageFilter(isDark),
                            objectPosition: "center center",
                        }}
                        onError={(e) => { e.target.style.opacity = "0"; }}
                    />
                ) : (
                    <div className={`absolute inset-0 ${isDark ? "bg-zinc-900" : "bg-gray-200"}`} />
                )}
            </motion.div>

            {/* Accent tint */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40"
                style={{
                    background: `radial-gradient(ellipse 60% 80% at 70% 50%, rgba(${accent.rgb},0.35), transparent)`,
                }}
            />

            {/* Bottom fade — text readability */}
            <div
                className={`absolute inset-0 pointer-events-none ${
                    isDark
                        ? "bg-linear-to-t from-[#07020a] via-[#07020a]/60 via-30% to-transparent"
                        : "bg-linear-to-t from-[#f0f2f5] via-[#f0f2f5]/70 via-30% to-transparent"
                }`}
            />

            {/* Left fade — text panel only, doesn't hide right-side art */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: isDark
                        ? "linear-gradient(to right, rgba(5,5,10,0.88) 0%, rgba(5,5,10,0.5) 28%, transparent 52%)"
                        : "linear-gradient(to right, rgba(240,242,245,0.92) 0%, rgba(240,242,245,0.55) 28%, transparent 52%)",
                }}
            />
        </motion.div>
    );
});

export default HeroBackdrop;

export function HeroBackdropLayer({ animeList, currentSlide, isDark }) {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="wait">
                {animeList.map((anime, i) =>
                    i === currentSlide ? (
                        <HeroBackdrop
                            key={anime.id ?? i}
                            anime={anime}
                            index={i}
                            isDark={isDark}
                            isActive
                        />
                    ) : null
                )}
            </AnimatePresence>

            {/* Subtle film grain */}
            <div
                className={`absolute inset-0 z-2 pointer-events-none mix-blend-overlay ${isDark ? "opacity-[0.025]" : "opacity-[0.012]"}`}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px 180px",
                }}
            />
        </div>
    );
}
