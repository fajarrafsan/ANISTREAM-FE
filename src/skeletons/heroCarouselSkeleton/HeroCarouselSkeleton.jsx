import { useTheme } from "../../context/ThemeContext";

export default function HeroCarouselSkeleton() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <section
            className={`relative w-full overflow-hidden select-none
                aspect-[3/1] min-h-[480px] max-h-[680px]
                max-sm:aspect-auto max-sm:max-h-none
                sm:min-h-[460px] sm:max-h-[720px]
                md:max-h-[760px]
                ${isDark ? "bg-[#050508]" : "bg-[#f8f9fa]"}`}
        >
            <div className={`absolute inset-0 ${isDark ? "bg-zinc-900/60" : "bg-gray-200/60"}`}>
                <div
                    className="absolute inset-0"
                    style={{
                        background: isDark
                            ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)"
                            : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                    }}
                />
            </div>

            <div className={`absolute inset-0 ${isDark ? "bg-linear-to-t from-[#07020a] via-transparent to-transparent" : "bg-linear-to-t from-[#f0f2f5] via-transparent to-transparent"}`} />

            <div className="relative z-10 h-full flex items-end pb-[140px] max-sm:h-auto max-sm:min-h-[480px] max-sm:pt-6 sm:pb-[96px]">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 w-full">
                    <div className="max-w-xl space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`h-3 w-14 rounded ${isDark ? "bg-red-500/20" : "bg-red-200/50"} animate-pulse`} />
                            <div className={`h-5 w-16 rounded-full ${isDark ? "bg-white/5" : "bg-black/5"} animate-pulse`} />
                        </div>
                        <div className={`h-10 sm:h-12 md:h-14 w-[80%] rounded-lg ${isDark ? "bg-white/8" : "bg-black/8"} animate-pulse`} />
                        <div className="flex gap-2">
                            <div className={`h-5 w-12 rounded-full ${isDark ? "bg-white/5" : "bg-black/5"} animate-pulse`} />
                            <div className={`h-5 w-28 rounded ${isDark ? "bg-white/5" : "bg-black/5"} animate-pulse`} />
                        </div>
                        <div className={`h-14 w-full max-w-md rounded-xl ${isDark ? "bg-white/4" : "bg-white/60"} animate-pulse`} />
                        <div className="flex gap-3">
                            <div className={`h-10 w-36 rounded-xl ${isDark ? "bg-red-500/20" : "bg-red-200/50"} animate-pulse`} />
                            <div className={`h-10 w-24 rounded-xl ${isDark ? "bg-white/5" : "bg-black/5"} animate-pulse`} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 z-20">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 pb-3 sm:pb-5">
                    <div className="flex items-end justify-center sm:justify-end gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`rounded-lg shrink-0 animate-pulse ${i === 0 ? "w-[88px] h-28 sm:w-[100px] sm:h-[130px]" : "w-14 h-14 sm:w-16 sm:h-16"} ${isDark ? "bg-white/8" : "bg-black/8"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
