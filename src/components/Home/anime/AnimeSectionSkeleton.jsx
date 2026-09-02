import { useTheme } from "../../../context/ThemeContext";

export default function AnimeSectionSkeleton({ title = "LAGI TAYANG" }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const isOngoing = title?.toLowerCase().includes("tayang");
    const accentColor = isOngoing ? "red" : "emerald";

    return (
        <section className="relative max-w-7xl mx-auto overflow-hidden transition-colors duration-300 px-3 py-5 sm:px-6 sm:py-8 md:px-8 md:py-10">
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

            {/* Section Header Skeleton */}
            <div className="relative z-10 flex items-center justify-between mb-5 sm:mb-8 gap-2 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Premium accent bar with glow */}
                    <div className="relative flex items-center">
                        <div
                            className={`w-1 sm:w-1.5 rounded-full h-5 sm:h-7 md:h-8 ${isOngoing ? "bg-red-600/40" : "bg-emerald-500/40"}`}
                            style={{
                                boxShadow: isOngoing
                                    ? "0 0 20px rgba(239,68,68,0.4), 0 0 40px rgba(239,68,68,0.1)"
                                    : "0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.1)",
                            }}
                        />
                    </div>

                    {/* Title skeleton */}
                    <div
                        className={`font-display font-black tracking-tight truncate text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-colors duration-500 ${
                            isDark
                                ? isOngoing ? "text-red-300" : "text-emerald-300"
                                : isOngoing ? "text-red-600" : "text-emerald-600"
                        }`}
                        style={{ opacity: 0.25 }}
                    >
                        {title}
                    </div>

                    {/* Live count badge skeleton */}
                    <span
                        className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border backdrop-blur-sm ${isDark
                            ? "bg-white/[0.03] border-white/[0.06] text-white/40"
                            : "bg-black/[0.02] border-black/[0.06] text-black/40"
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? "bg-red-500/40" : "bg-emerald-500/40"} animate-pulse`} />
                        <span className="w-8 h-2.5 rounded bg-current opacity-20 animate-pulse" />
                    </span>
                </div>

                {/* Premium View All button skeleton */}
                <div
                    className={`relative shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full border backdrop-blur-sm ${isDark
                        ? "bg-white/[0.03] border-white/[0.08] text-white/30"
                        : "bg-black/[0.02] border-black/[0.08] text-black/30"
                    }`}
                >
                    <span className="relative">
                        <span className="opacity-0">Lihat Semua</span>
                        <span className="absolute inset-0 rounded bg-current opacity-10 animate-pulse" />
                    </span>
                    <svg
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-20 ${isOngoing ? "text-red-400" : "text-emerald-400"}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>

            {/* Anime Cards Grid Skeleton */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <AnimeCardSkeleton key={i} index={i} isDark={isDark} accentColor={accentColor} />
                ))}
            </div>
        </section>
    );
}

function AnimeCardSkeleton({ index, isDark, accentColor }) {
    const delay = `${index * 80}ms`;
    const color = accentColor === "red" ? "239,68,68" : "16,185,129";

    return (
        <div
            className="group relative"
            style={{ animationDelay: delay }}
        >
            {/* Ambient glow */}
            <div
                className="absolute -inset-2 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at center, rgba(${color},0.08) 0%, transparent 70%)`,
                }}
            />

            {/* Border glow */}
            <div
                className={`absolute inset-px rounded-xl bg-linear-to-br opacity-40 ${isDark
                    ? "from-red-500/20 via-transparent to-red-900/10"
                    : "from-slate-300/30 via-transparent to-slate-200/10"
                }`}
            />

            {/* Main card */}
            <div
                className={`relative rounded-2xl overflow-hidden border ${
                    isDark ? "bg-[#0a0a0f] border-white/[0.06]" : "bg-white border-black/[0.06]"
                }`}
            >
                {/* Poster Skeleton */}
                <div className={`relative aspect-[2/3] overflow-hidden ${isDark ? "bg-[#14141f]" : "bg-gray-200"}`}>
                    {/* Animated shimmer overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: isDark
                                ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)"
                                : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 2s infinite",
                        }}
                    />

                    {/* Dot pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "#fff" : "#000"} 1px, transparent 0)`,
                            backgroundSize: "16px 16px",
                        }}
                    />

                    {/* Scanlines - Desktop only */}
                    <div className="hidden sm:block absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-size-[100%_4px]" />

                    {/* Rating badge skeleton */}
                    <div className={`absolute top-2 right-2 z-10 w-10 h-5 rounded-md overflow-hidden ${isDark ? "bg-[#1a1a2e]/80" : "bg-white/80"
                    } backdrop-blur-sm`}>
                        <div
                            className="absolute inset-0"
                            style={{
                                background: isDark
                                    ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)"
                                    : "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 50%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 2.2s infinite",
                                animationDelay: delay,
                            }}
                        />
                    </div>

                    {/* Episode badge skeleton */}
                    <div className={`absolute top-2 left-2 z-10 w-14 h-5 rounded-md overflow-hidden ${isDark ? "bg-[#1a1a2e]/80" : "bg-white/80"
                    } backdrop-blur-sm`}>
                        <div
                            className="absolute inset-0"
                            style={{
                                background: isDark
                                    ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)"
                                    : "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 50%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 2.2s infinite",
                                animationDelay: `${index * 80 + 100}ms`,
                            }}
                        />
                    </div>

                    {/* Corner ornaments */}
                    <div className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 border-l border-t rounded-tl-sm ${isDark ? "border-white/10" : "border-black/10"
                    }`} />
                    <div className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 border-r border-t rounded-tr-sm ${isDark ? "border-white/10" : "border-black/10"
                    }`} />
                    <div className={`absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-l border-b rounded-bl-sm ${isDark ? "border-white/10" : "border-black/10"
                    }`} />
                    <div className={`absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-r border-b rounded-br-sm ${isDark ? "border-white/10" : "border-black/10"
                    }`} />

                    {/* Floating decorative particles */}
                    <div
                        className={`hidden sm:block absolute top-1/4 right-3 w-1 h-1 rounded-full ${isDark ? "bg-red-500/20" : "bg-slate-400/20"
                        } animate-pulse`}
                        style={{ animationDelay: delay }}
                    />
                    <div
                        className={`hidden sm:block absolute bottom-1/3 left-3 w-0.5 h-0.5 rounded-full ${isDark ? "bg-red-500/15" : "bg-slate-400/15"
                        } animate-pulse`}
                        style={{ animationDelay: `${index * 80 + 400}ms` }}
                    />

                    {/* Bottom title overlay skeleton */}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 pt-10 bg-gradient-to-t from-black/80 to-transparent space-y-1.5">
                        <div className={`h-3 w-full rounded ${isDark ? "bg-white/10" : "bg-white/30"}`} />
                        <div className={`h-2.5 w-2/3 rounded ${isDark ? "bg-white/8" : "bg-white/20"}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
