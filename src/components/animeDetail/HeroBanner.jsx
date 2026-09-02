import { motion, useScroll, useTransform } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useMotionSafe, DETAIL_EASE } from "./constants/animeDetailMotion";
import { useRef } from "react";

export default function HeroBanner({ bannerImage, title = "Anime" }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const reduced = useMotionSafe();
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    const hasBanner = bannerImage && bannerImage.trim() !== "";

    return (
        <div ref={ref} className="relative w-full h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden select-none">
            {/* Layer 0: Blurred backdrop layer — deep cinematic atmosphere */}
            {hasBanner && (
                <motion.div 
                    style={{ y: bgY, opacity }}
                    className="absolute inset-0 z-0 scale-125 blur-3xl opacity-50 pointer-events-none"
                >
                    <img
                        src={bannerImage}
                        alt=""
                        aria-hidden
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                </motion.div>
            )}

            {/* Layer 1: Animated ambient particles */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {[...Array(14)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#ff1e56]/40 shadow-[0_0_10px_#ff1e56]" : "bg-rose-400/30 shadow-[0_0_8px_#fb7185]"}`}
                        initial={{
                            x: (i * 97) % 1200,
                            y: (i * 63) % 500,
                            opacity: 0.2,
                            scale: 0.8,
                        }}
                        animate={{
                            y: [null, -150],
                            opacity: [0.2, 0.7, 0],
                            scale: [0.8, 1.4, 0.6],
                        }}
                        transition={{
                            duration: 7 + (i % 5) * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: (i % 4) * 1.2,
                        }}
                    />
                ))}
            </div>

            {/* Layer 2: Main Banner Image with Parallax */}
            {hasBanner ? (
                <motion.div
                    style={{ y: bgY }}
                    className="absolute inset-0 z-[1]"
                    initial={reduced ? false : { scale: 1.08, filter: "blur(6px)" }}
                    animate={{ scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: DETAIL_EASE }}
                >
                    <img
                        src={bannerImage}
                        alt={title}
                        className={`w-full h-full object-cover object-center transition-all duration-700 ${isDark
                            ? "opacity-65 contrast-[1.1] brightness-[0.9]"
                            : "opacity-85 contrast-[1.05] saturate-[1.15]"
                            }`}
                        loading="eager"
                    />
                </motion.div>
            ) : (
                <div
                    className={`absolute inset-0 z-[1] ${isDark
                        ? "bg-gradient-to-br from-[#1a0a0f] via-[#0a0a0f] to-[#08080e]"
                        : "bg-gradient-to-br from-rose-50 via-white to-slate-100"
                        }`}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            opacity: isDark ? 0.04 : 0.08,
                            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "#ff1e56" : "#f43f5e"} 1px, transparent 0)`,
                            backgroundSize: "40px 40px",
                        }}
                    />
                </div>
            )}

            {/* Layer 3: Top Navigation Shadow Vignette */}
            <div className={`absolute top-0 left-0 right-0 h-32 sm:h-44 z-10 bg-gradient-to-b ${isDark ? "from-[#08080e]/95 via-[#08080e]/50 to-transparent" : "from-white/95 via-white/40 to-transparent"} pointer-events-none`} />

            {/* Layer 4: Left Side Soft Vignette */}
            <div className={`absolute inset-y-0 left-0 w-1/3 sm:w-1/2 z-10 bg-gradient-to-r ${isDark ? "from-[#08080e]/80 via-[#08080e]/30 to-transparent" : "from-white/70 via-white/20 to-transparent"} pointer-events-none`} />

            {/* Layer 5: Right Side Soft Vignette */}
            <div className={`absolute inset-y-0 right-0 w-1/4 sm:w-1/3 z-10 bg-gradient-to-l ${isDark ? "from-[#08080e]/70 to-transparent" : "from-white/60 to-transparent"} pointer-events-none`} />

            {/* Layer 6: CRITICAL SEAMLESS BOTTOM TRANSITION (Fades completely into page background) */}
            {/* 6A: Broad bottom gradient covering the lower 65% */}
            <div 
                className={`absolute bottom-0 left-0 right-0 h-[65%] z-10 pointer-events-none bg-gradient-to-t ${isDark
                    ? "from-[#08080e] via-[#08080e]/85 via-45% to-transparent"
                    : "from-white via-white/85 via-45% to-transparent"
                    }`}
            />
            {/* 6B: Solid bottom blend to guarantee 100% pure background color at the container boundary */}
            <div 
                className={`absolute bottom-0 left-0 right-0 h-28 sm:h-36 z-10 pointer-events-none bg-gradient-to-t ${isDark
                    ? "from-[#08080e] from-40% via-[#08080e]/95 to-transparent"
                    : "from-white from-40% via-white/95 to-transparent"
                    }`}
            />

            {/* Layer 7: Subtle glowing accent orb (Positioned safely above bottom so it never clips) */}
            <motion.div
                style={{ opacity }}
                className={`absolute top-1/3 left-1/4 -translate-x-1/2 w-96 h-64 blur-[110px] rounded-full z-10 pointer-events-none ${isDark ? "bg-[#ff1e56]/12" : "bg-rose-400/8"
                    }`}
            />

            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
                <div
                    className={`h-[1.5px] bg-gradient-to-r from-transparent ${isDark
                        ? "via-[#ff1e56] to-transparent shadow-[0_0_25px_rgba(255,30,86,1)]"
                        : "via-rose-400/80 to-transparent shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                        }`}
                />
            </div>
        </div>
    );
}
