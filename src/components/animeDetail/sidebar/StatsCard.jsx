// StatsCard.jsx
import { useTheme } from "../../../context/ThemeContext";

export default function StatsCard({ anime }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const allTime = anime?.rankings?.find(r => r.type === 'RATED' && r.allTime);
    const score = anime?.averageScore || 0;
    const scoreDecimal = (score / 10).toFixed(1);

    // SVG Circular progress math (radius: 28, perimeter = 2 * PI * 28 ≈ 175.9)
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (circumference * (score || 0)) / 100;

    const getRecommendation = (val) => {
        if (val >= 80) return "Sangat Direkomendasikan";
        if (val >= 70) return "Koleksi Pilihan";
        if (val >= 60) return "Cukup Populer";
        return "Tontonan Santai";
    };

    return (
        <div className="relative group w-full min-w-0 select-none rounded-[20px] p-[1px] overflow-hidden">
            {/* Animated Magic Border */}
            {isDark && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1e56]/25 to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] transition-all duration-500 z-0" />
            )}

            <div
                className={`relative z-10 rounded-[19px] p-4 sm:p-5 shadow-2xl transition-all duration-500 backdrop-blur-xl ${isDark
                    ? "bg-[#0b0406]/90 border border-white/5 hover:border-[#ff1e56]/20"
                    : "bg-white border border-slate-200 hover:border-rose-300"
                    }`}
            >
                {/* ── TOP: CIRCULAR SCORE GAUGE ── */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
                    {/* SVG Progress Ring */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
                            {/* Track */}
                            <circle
                                cx="35"
                                cy="35"
                                r={radius}
                                className={`fill-none stroke-[5] ${isDark ? "stroke-white/10" : "stroke-slate-200"}`}
                            />
                            {/* Animated Stroke */}
                            <circle
                                cx="35"
                                cy="35"
                                r={radius}
                                className="fill-none stroke-[5] stroke-[#ff1e56] transition-all duration-1000 ease-out"
                                strokeDasharray={circumference}
                                strokeDashoffset={progressOffset}
                                strokeLinecap="round"
                                style={{ filter: "drop-shadow(0 0 6px #ff1e56)" }}
                            />
                        </svg>

                        {/* Centered Score */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className={`font-black text-sm leading-none ${isDark ? "text-white" : "text-slate-800"}`}>
                                {score ? scoreDecimal : "-"}
                            </span>
                            <span className="text-[7px] font-bold tracking-widest text-[#ff1e56] uppercase mt-0.5">
                                /10
                            </span>
                        </div>
                    </div>

                    {/* Score Labels */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">
                                Rating Komunitas
                            </span>
                        </div>
                        <h4 className={`font-black text-xs sm:text-sm tracking-tight truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                            {score ? `${score}% Penonton Suka` : "Belum Ada Rating"}
                        </h4>
                        <p className={`text-[9px] mt-0.5 truncate font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            {getRecommendation(score)}
                        </p>
                    </div>
                </div>

                {/* ── BOTTOM: RANKING & POPULARITY STATS ── */}
                <div className="pt-3.5 space-y-2.5">
                    {/* Ranking Card */}
                    <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${isDark ? "bg-white/[0.02] border-white/5 hover:border-amber-500/30" : "bg-slate-50 border-slate-200"}`}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                <i className="fa-solid fa-trophy text-[10px]" />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                Peringkat Global
                            </span>
                        </div>
                        <span className={`font-black text-xs ${allTime ? "text-amber-400" : isDark ? "text-slate-500" : "text-slate-400"}`}>
                            {allTime ? `#${allTime.rank}` : "Top 100"}
                        </span>
                    </div>

                    {/* Popularity Card */}
                    <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${isDark ? "bg-white/[0.02] border-white/5 hover:border-[#ff1e56]/30" : "bg-slate-50 border-slate-200"}`}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#ff1e56]/10 border border-[#ff1e56]/30 flex items-center justify-center text-[#ff1e56] shrink-0 shadow-[0_0_10px_rgba(255,30,86,0.2)]">
                                <i className="fa-solid fa-users text-[10px]" />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                Penonton Terdaftar
                            </span>
                        </div>
                        <span className={`font-black text-xs ${isDark ? "text-white" : "text-slate-800"}`}>
                            {anime?.popularity ? anime.popularity.toLocaleString("id-ID") : "-"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}