// PosterCard.jsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";

export default function PosterCard({ poster, rank, title = "Anime" }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const hasPoster = poster && poster.trim() !== "";
    const cardRef = useRef(null);

    // 3D Tilt with Framer Motion Springs
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 280, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 280, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="w-full flex justify-center lg:justify-start select-none">
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative group cursor-pointer w-full max-w-[200px] xs:max-w-[220px] sm:max-w-[230px] lg:max-w-[240px] xl:max-w-[250px] perspective-1000"
            >
                {/* Layer 1: Ambient Glow Aura */}
                <div
                    className={`absolute -inset-2 rounded-3xl blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none ${isDark
                        ? "bg-gradient-to-br from-[#ff1e56]/40 via-red-900/15 to-transparent"
                        : "bg-gradient-to-br from-rose-400/25 via-rose-200/15 to-transparent"
                        }`}
                />

                {/* Layer 2: Neon Border Frame */}
                <div
                    className={`absolute -inset-[1.5px] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 ${isDark
                        ? "bg-gradient-to-br from-[#ff1e56] via-red-700/60 to-[#8b0a1e]"
                        : "bg-gradient-to-br from-rose-400 via-rose-300 to-rose-500"
                        }`}
                />

                {/* Main 3D Card Surface */}
                <div
                    className={`relative rounded-[15px] overflow-hidden aspect-[3/4] w-full shadow-2xl ${isDark ? "bg-[#0a0a0f]" : "bg-slate-100"
                        }`}
                >
                    {/* Poster Image */}
                    {hasPoster ? (
                        <img
                            src={poster}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
                            loading="eager"
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-[#1a0a0f]" : "bg-slate-200"}`}>
                            <i className={`fa-solid fa-image text-2xl ${isDark ? "text-slate-700" : "text-slate-400"}`} />
                        </div>
                    )}

                    {/* Gradient Depth Overlays */}
                    <div
                        className={`absolute inset-0 opacity-70 group-hover:opacity-45 transition-opacity duration-500 ${isDark
                            ? "bg-gradient-to-t from-black/90 via-transparent to-black/25"
                            : "bg-gradient-to-t from-black/60 via-transparent to-black/10"
                            }`}
                    />

                    {/* 3D Specular Glare Reflection */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
                        style={{
                            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)",
                            left: glareX,
                            top: glareY,
                            transform: "translate(-50%, -50%)",
                            width: "200%",
                            height: "200%",
                        }}
                    />

                    {/* Shimmer Light Bar */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>

                    {/* Rank Badge */}
                    {rank != null && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                            <div className="relative">
                                <div className={`absolute -inset-1 rounded-lg blur-sm opacity-70 ${isDark ? "bg-[#ff1e56]" : "bg-rose-500"}`} />
                                <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-[#ff1e56] to-[#e11d48] text-white text-[8px] sm:text-[9px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase shadow-lg border border-white/20">
                                    <i className="fa-solid fa-fire-flame-curved text-[8px] animate-pulse" />
                                    POPULAR #{rank}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HD Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                        <div className="backdrop-blur-md bg-black/60 border border-white/15 text-white text-[8px] font-black px-2 py-0.5 rounded-md tracking-widest shadow-sm">
                            HD
                        </div>
                    </div>

                    {/* Bottom Title & Play Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                        <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-5 h-5 rounded-full bg-[#ff1e56] flex items-center justify-center shadow-[0_0_10px_#ff1e56]">
                                    <i className="fa-solid fa-play text-white text-[7px] ml-0.5" />
                                </div>
                                <span className="text-[8px] font-black text-white/90 tracking-widest uppercase">
                                    Tonton Sekarang
                                </span>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-gradient-to-r from-[#ff1e56]/80 via-[#ff1e56]/20 to-transparent mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <h3 className="font-black text-xs text-white drop-shadow-md leading-tight group-hover:text-[#ff1e56] transition-colors duration-300 line-clamp-2">
                            {title}
                        </h3>
                    </div>

                    {/* Corner Accent Ornaments */}
                    {[
                        "top-1.5 left-1.5 border-l-2 border-t-2 rounded-tl-sm",
                        "top-1.5 right-1.5 border-r-2 border-t-2 rounded-tr-sm",
                        "bottom-1.5 left-1.5 border-l-2 border-b-2 rounded-bl-sm",
                        "bottom-1.5 right-1.5 border-r-2 border-b-2 rounded-br-sm",
                    ].map((pos, i) => (
                        <div
                            key={i}
                            className={`absolute w-2.5 h-2.5 ${pos} ${isDark ? "border-[#ff1e56]/50" : "border-rose-400/50"} pointer-events-none`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}