import { useTheme } from "../../../context/ThemeContext";
import { useState, useEffect } from "react";
import AnimeGrid from "./AnimeGrid";
import { useScrollReveal } from "../../../hooks/UseScrollReveal";
import { useAuth } from "../../../context/AuthContext";
import { useAuthModal } from "../../../context/AuthModalContext";
import useToast from "../../../hooks/useToast";

export default function AnimeSection({
    title,
    subtitle,
    accent,
    animeList,
    viewAllLabel = "Lihat Semua",
    onViewAll,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [isMobile, setIsMobile] = useState(false);

    const { isLoggedIn } = useAuth();
    const { openModal } = useAuthModal();
    const toast = useToast();

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.2 });

    const handleViewAll = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.warning("Silakan login terlebih dahulu untuk melihat semua anime.", 3000);
            openModal({
                mode: "login",
                redirectAction: () => { if (onViewAll) onViewAll(); },
            });
            return;
        }
        if (onViewAll) onViewAll();
    };

    const isOngoing = title?.toLowerCase().includes("tayang");

    return (
        <section className="relative max-w-7xl mx-auto overflow-visible transition-colors duration-300 px-3 py-5 sm:px-6 sm:py-8 md:px-8 md:py-10">
            {/* Premium glass panel backdrop */}
            <div
                className={`absolute inset-x-3 sm:inset-x-6 md:inset-x-8 inset-y-2 rounded-2xl sm:rounded-3xl pointer-events-none z-0 border ${
                    isDark
                        ? "bg-white/[0.015] border-white/[0.04]"
                        : "bg-white/40 border-black/[0.04] shadow-sm"
                }`}
            />

            {/* Subtle background glow */}
            <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60vw] h-40 pointer-events-none z-0"
                style={{
                    background: isDark
                        ? `radial-gradient(ellipse at center, ${isOngoing ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.06)"} 0%, transparent 70%)`
                        : `radial-gradient(ellipse at center, ${isOngoing ? "rgba(239,68,68,0.04)" : "rgba(16,185,129,0.03)"} 0%, transparent 70%)`,
                    filter: "blur(40px)",
                }}
            />

            <div
                ref={headerRef}
                className="relative z-10 flex items-center justify-between mb-5 sm:mb-8 gap-2 sm:gap-4"
                style={{
                    opacity: headerVisible ? 1 : 0,
                    transform: headerVisible ? "translateY(0px)" : "translateY(20px)",
                    transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Premium accent bar with glow */}
                    <div className="relative flex items-center">
                        <div
                            className={`w-1 sm:w-1.5 rounded-full ${accent} h-5 sm:h-7 md:h-8`}
                            style={{
                                boxShadow: isOngoing
                                    ? "0 0 20px rgba(239,68,68,0.4), 0 0 40px rgba(239,68,68,0.1)"
                                    : "0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.1)",
                                transform: headerVisible ? "scaleY(1)" : "scaleY(0)",
                                transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1) 150ms",
                                transformOrigin: "top",
                            }}
                        />
                    </div>

                    {/* Title + Subtitle */}
                    <div className="min-w-0">
                        <h2
                            className={`font-display font-black tracking-tight truncate text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-colors duration-500 ${
                                isDark
                                    ? isOngoing ? "text-red-300" : "text-emerald-300"
                                    : isOngoing ? "text-red-600" : "text-emerald-600"
                            }`}
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p
                                className={`text-[10px] sm:text-xs font-medium tracking-wide mt-0.5 transition-colors duration-500 truncate ${
                                    isDark ? "text-white/30" : "text-gray-500"
                                }`}
                                style={{
                                    opacity: headerVisible ? 1 : 0,
                                    transition: "opacity 500ms ease 200ms",
                                }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Live count badge */}
                    {animeList?.length > 0 && (
                        <span
                            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border backdrop-blur-sm transition-all duration-500 ${isDark
                                ? "bg-white/[0.03] border-white/[0.06] text-white/40"
                                : "bg-black/[0.02] border-black/[0.06] text-black/40"
                            }`}
                            style={{
                                opacity: headerVisible ? 1 : 0,
                                transition: "opacity 500ms ease 300ms",
                            }}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${accent} animate-pulse`} />
                            {animeList.length} title{animeList.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Premium View All button */}
                <a
                    href="#"
                    onClick={handleViewAll}
                    className={`group/btn relative shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full border backdrop-blur-sm transition-all duration-400 focus:outline-none
                        ${isDark
                            ? "bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/10"
                            : "bg-black/[0.02] border-black/[0.08] text-black/50 hover:text-red-600 hover:border-red-300 hover:bg-red-50 hover:shadow-lg hover:shadow-red-100/30"
                        }`}
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transition: "opacity 500ms ease 250ms, all 0.3s ease",
                    }}
                >
                    <span className="relative">
                        {viewAllLabel}
                        <span className={`absolute -bottom-px left-0 w-full h-[2px] scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left rounded-full ${isOngoing ? "bg-red-500" : "bg-emerald-500"}`} />
                    </span>
                    <svg
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:scale-110 ${isOngoing ? "text-red-400 group-hover/btn:text-red-500" : "text-emerald-400 group-hover/btn:text-emerald-500"}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
            </div>

            <div className="overflow-visible relative z-10">
                <AnimeGrid animes={animeList} isMobile={isMobile} />
            </div>
        </section>
    );
}