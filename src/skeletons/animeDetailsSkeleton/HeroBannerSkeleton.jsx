import ShimmerSkeleton from "./SimmerSkeleton";
import { useTheme } from "../../context/ThemeContext"; // sesuaikan path

export default function HeroBannerSkeleton() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="relative w-full h-[260px] sm:h-[340px] md:h-[480px] lg:h-[580px] overflow-hidden select-none">

            {/* ── BACKGROUND ── */}
            <div className={`absolute inset-0 ${
                isDark
                    ? "bg-linear-to-br from-[#1a0a0f] via-[#0d0407] to-black"
                    : "bg-linear-to-br from-rose-50 via-white to-slate-50"
            }`} />

            {/* Dot Pattern */}
            <div
                className="absolute inset-0"
                style={{
                    opacity: isDark ? 0.025 : 0.06,
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "#ff1e56" : "#f43f5e"} 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Vignette */}
            <div className={`absolute inset-0 ${
                isDark
                    ? "bg-linear-to-t from-[#070204] via-transparent to-[#070204]/90"
                    : "bg-linear-to-t from-white/80 via-transparent to-white/60"
            }`} />
            <div className={`absolute inset-0 ${
                isDark
                    ? "bg-linear-to-r from-[#070204]/70 via-transparent to-[#070204]/70"
                    : "bg-linear-to-r from-white/50 via-transparent to-white/50"
            }`} />

            {/* Top gradient */}
            <div className={`absolute top-0 left-0 right-0 h-[150px] sm:h-[240px] ${
                isDark
                    ? "bg-linear-to-b from-[#070204] via-[#070204]/60 to-transparent"
                    : "bg-linear-to-b from-white via-white/60 to-transparent"
            }`} />

            {/* Bottom gradient */}
            <div className={`absolute bottom-0 left-0 right-0 h-[220px] sm:h-[360px] ${
                isDark
                    ? "bg-linear-to-t from-[#070204] via-[#070204]/60 to-transparent"
                    : "bg-linear-to-t from-white via-white/60 to-transparent"
            }`} />

            {/* ── SKELETON CONTENT ── */}
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-12 xs:pt-16 sm:pt-28 md:pt-36 gap-2 sm:gap-3 px-6">

                {/* Badge pills */}
                <div className="flex gap-2 mb-1">
                    <div className={`w-14 h-4 sm:w-20 sm:h-5 rounded da-animate-pulse overflow-hidden ${
                        isDark ? "bg-[#2a1117]" : "bg-rose-100"
                    }`}>
                        <ShimmerSkeleton isDark={isDark} />
                    </div>
                    <div className={`w-10 h-4 sm:w-16 sm:h-5 rounded da-animate-pulse overflow-hidden ${
                        isDark ? "bg-[#2a1117]" : "bg-slate-100"
                    }`}>
                        <ShimmerSkeleton isDark={isDark} />
                    </div>
                </div>

                {/* Title */}
                <div className={`w-[85%] xs:w-[75%] sm:w-[55%] max-w-lg h-6 sm:h-9 rounded-lg da-animate-pulse overflow-hidden ${
                    isDark ? "bg-[#2a1117]" : "bg-slate-200"
                }`}>
                    <ShimmerSkeleton isDark={isDark} />
                </div>

                {/* Subtitle */}
                <div className={`w-[60%] xs:w-[50%] sm:w-[35%] max-w-sm h-3 sm:h-4 rounded-md da-animate-pulse overflow-hidden ${
                    isDark ? "bg-[#2a1117]" : "bg-slate-100"
                }`}>
                    <ShimmerSkeleton isDark={isDark} />
                </div>

                {/* Loading dots */}
                <div className="flex items-center gap-2 mt-2 sm:mt-3">
                    <div className={`w-4 sm:w-6 h-px bg-linear-to-r from-transparent ${
                        isDark ? "to-[#ff1e56]/20" : "to-rose-300/40"
                    }`} />
                    <div className="flex gap-1.5 sm:gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full da-animate-bounce ${
                                    isDark
                                        ? "bg-linear-to-br from-[#ff1e56]/60 to-[#ff1e56]/20 shadow-[0_0_4px_rgba(255,30,86,0.15)]"
                                        : "bg-linear-to-br from-rose-400/70 to-rose-300/30 shadow-[0_0_4px_rgba(244,63,94,0.2)]"
                                }`}
                                style={{
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: "1.2s",
                                }}
                            />
                        ))}
                    </div>
                    <div className={`w-4 sm:w-6 h-px bg-linear-to-l from-transparent ${
                        isDark ? "to-[#ff1e56]/20" : "to-rose-300/40"
                    }`} />
                </div>
            </div>

            {/* Top line decoration */}
            <div className="absolute top-0 left-0 right-0">
                <div className={`h-[1.5px] sm:h-[2px] bg-linear-to-r from-transparent ${
                    isDark ? "via-[#ff1e56]/20" : "via-rose-400/30"
                } to-transparent`} />
            </div>

            {/* Scanlines — dark only */}
            {isDark && (
                <div className="hidden sm:block absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-size-[100%_4px]" />
            )}
        </div>
    );
}