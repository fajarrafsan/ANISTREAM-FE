// MetadataCard.jsx
import { useTheme } from "../../../context/ThemeContext";
import { getSeasonYear } from "../../../utils/animeDetailUtils";

export default function MetadataCard({ anime }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const metadata = [
        { label: 'FORMAT TIPE', value: anime?.format ?? 'TBA', icon: 'fa-solid fa-desktop' },
        { label: 'DURASI TAYANG', value: anime?.duration ? `${anime.duration} Menit` : 'TBA', icon: 'fa-solid fa-stopwatch' },
        { label: 'MUSIM RILIS', value: (anime?.season && getSeasonYear(anime)) ? `${anime.season} ${getSeasonYear(anime)}` : 'TBA', icon: 'fa-regular fa-calendar-check' },
        { label: 'STUDIO ANIMASI', value: anime?.studios?.[0]?.name ?? 'TBA', icon: 'fa-solid fa-clapperboard' },
        { label: 'SUMBER CERITA', value: anime?.source ?? 'TBA', icon: 'fa-solid fa-layer-group' },
    ];

    return (
        <div className="relative group w-full min-w-0 select-none rounded-[18px] p-[1px] overflow-hidden">
            {/* Animated Magic Border */}
            {isDark && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1e56]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] transition-all duration-500 z-0" />
            )}

            <div
                className={`relative z-10 rounded-[17px] p-4 sm:p-5 shadow-2xl transition-all duration-500 backdrop-blur-xl ${isDark
                        ? "bg-[#0b0406]/90 border border-white/5 hover:border-[#ff1e56]/20"
                        : "bg-white border border-slate-200 hover:border-rose-300"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-4 sm:mb-5 select-none">
                    <div className="flex gap-[2px] items-center shrink-0">
                        <span className="w-1 h-3.5 bg-[#ff1e56] rounded-full shadow-[0_0_10px_#ff1e56]" />
                        <span className={`w-1 h-2 rounded-full ${isDark ? "bg-[#ff1e56]/40" : "bg-rose-400/50"}`} />
                    </div>
                    <h3
                        className={`font-black text-[10px] sm:text-[11px] tracking-[0.2em] uppercase ${isDark ? "text-slate-300 group-hover:text-white transition-colors" : "text-slate-500"
                            }`}
                    >
                        Spesifikasi Serial
                    </h3>
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                    {metadata.map((item) => (
                        <div
                            key={item.label}
                            className={`group/item flex flex-row items-center justify-between gap-3 w-full px-3.5 py-2.5 sm:py-3 rounded-xl transition-all duration-300 select-none ${isDark
                                    ? "bg-white/[0.02] border border-white/5 hover:border-[#ff1e56]/30 hover:bg-[#ff1e56]/10"
                                    : "bg-slate-50 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 shadow-sm"
                                }`}
                        >
                            {/* UJUNG KIRI: Ikon + Label */}
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 ${isDark ? "bg-[#ff1e56]/20 text-[#ff1e56]" : "bg-rose-100 text-rose-500"}`}>
                                    <i className={`${item.icon} text-[10px]`} />
                                </div>
                                <span
                                    className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase truncate ${isDark
                                            ? "text-slate-400 group-hover/item:text-slate-300"
                                            : "text-slate-500 group-hover/item:text-slate-600"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </div>

                            {/* UJUNG KANAN: Nilai */}
                            <div className="flex items-center shrink-0">
                                <span
                                    className={`font-black text-[9px] sm:text-[10px] tracking-wider uppercase transition-colors duration-300 ${isDark
                                            ? "text-slate-200 group-hover/item:text-white"
                                            : "text-slate-700 group-hover/item:text-slate-900"
                                        }`}
                                >
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}