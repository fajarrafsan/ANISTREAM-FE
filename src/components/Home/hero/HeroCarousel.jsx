import { useRef, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "motion/react";

import useHeroCarousel from "./useHeroCarousel";
import { getSectionStyle } from "./HeroStyle";
import { HeroBackdropLayer } from "./HeroBackdrop";
import HeroContent from "./HeroContent";
import HeroFilmstrip from "./HeroFilmstrip";

export default function HeroCarousel({ animeList = [] }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const total = animeList.length;
    const sectionRef = useRef(null);

    const {
        currentSlide,
        isLoaded,
        progress,
        userPaused,
        reduced,
        goTo,
        togglePause,
        handlePrev,
        handleNext,
        handleTouchStart,
        handleTouchEnd,
        pauseAuto,
        resumeAuto,
    } = useHeroCarousel(total);

    const current = animeList[currentSlide];

    const handleGoTo = useCallback((index) => {
        goTo(index, index > currentSlide ? 1 : -1);
    }, [currentSlide, goTo]);

    if (total === 0) return null;

    return (
        <section
            ref={sectionRef}
            aria-roledescription="carousel"
            aria-label="Anime unggulan"
            className="relative w-full overflow-hidden select-none
                aspect-[3/1] min-h-[420px] max-h-[680px]
                sm:min-h-[460px] sm:max-h-[720px]
                md:max-h-[760px]"
            style={getSectionStyle(isDark)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={pauseAuto}
            onMouseLeave={resumeAuto}
            onFocusCapture={pauseAuto}
            onBlurCapture={resumeAuto}
        >
            <HeroBackdropLayer
                animeList={animeList}
                currentSlide={currentSlide}
                isDark={isDark}
            />

            {/* Top fade for header */}
            <div
                className={`absolute top-0 inset-x-0 h-16 z-5 pointer-events-none ${
                    isDark
                        ? "bg-linear-to-b from-[#050508]/80 to-transparent"
                        : "bg-linear-to-b from-[#f8f9fa]/80 to-transparent"
                }`}
            />

            {/* Content overlay */}
            <motion.div
                className="relative z-10 h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <HeroContent
                    current={current}
                    currentIndex={currentSlide}
                    isDark={isDark}
                />
            </motion.div>

            {/* Perubahan slide diumumkan sekali, bukan tiap frame progres. */}
            <p className="sr-only" aria-live="polite" aria-atomic="true">
                {`Slide ${currentSlide + 1} dari ${total}: ${current?.title ?? ""}`}
            </p>

            <HeroFilmstrip
                items={animeList}
                currentIndex={currentSlide}
                isDark={isDark}
                progress={progress}
                userPaused={userPaused}
                onTogglePause={togglePause}
                onSelect={handleGoTo}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            {total > 1 && (
                <div className="absolute bottom-[108px] sm:bottom-[118px] left-1/2 -translate-x-1/2 z-20 flex sm:hidden">
                    {animeList.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleGoTo(i)}
                            aria-label={`Slide ${i + 1} dari ${total}`}
                            aria-current={i === currentSlide ? "true" : undefined}
                            /* Bar tetap tipis, tapi tombolnya diberi padding
                               supaya area sentuhnya mencapai 44px. */
                            className="grid place-items-center h-11 w-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
                        >
                            <span
                                className={`block rounded-full transition-all duration-400 h-[3px] ${
                                    i === currentSlide
                                        ? "w-6 bg-red-500"
                                        : isDark ? "w-1.5 bg-white/25" : "w-1.5 bg-black/20"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
