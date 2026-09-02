import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function ScheduleCard({ anime }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState(anime.airingInSeconds);
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatCountdown = (s) => {
        if (s <= 0) return { label: "SEDANG TAYANG", parts: null };
        const d = Math.floor(s / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        return {
            label: "SEGERA TAYANG",
            parts: [
                { value: d, unit: "H" },
                { value: h, unit: "J" },
                { value: m, unit: "M" },
                { value: sec, unit: "D" },
            ]
        };
    };

    const countdown = formatCountdown(timeLeft);
    const isAired = timeLeft <= 0;

    const genres = (Array.isArray(anime.genres)
        ? anime.genres
        : typeof anime.genres === "string"
            ? anime.genres.split(",").map((g) => g.trim()).filter(Boolean)
            : []
    ).slice(0, 3);

    const handleClick = () => {
        if (anime.animeId) {
            navigate(`/anime/detail/${anime.animeId}`);
        }
    };

    return (
        <article
            onClick={handleClick}
            className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer select-none border ${
                isDark
                    ? 'bg-gradient-to-b from-[#15080d] via-[#0d0407] to-[#0a0305] border-white/[0.07] hover:border-[#ff1e56]/50 hover:shadow-[0_8px_30px_rgba(255,30,86,0.2)]'
                    : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-xl'
            } hover:-translate-y-1 sm:hover:-translate-y-1.5`}
        >
            {/* Ambient glow */}
            <div
                className={`absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 ${
                    isDark ? 'bg-[#ff1e56]/15' : 'bg-rose-400/10'
                }`}
            />

            {/* ═══ COVER SECTION ═══ */}
            <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-900">
                {!imgFailed && anime.poster ? (
                    <img
                        alt={anime.title}
                        src={anime.poster}
                        onError={() => setImgFailed(true)}
                        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500">
                        <i className="fa-solid fa-clapperboard text-2xl text-[#ff1e56]/40 mb-1" />
                        <span className="text-[8px] font-mono uppercase">Anime</span>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Floating Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 group-hover:bg-[#ff1e56] transition-all duration-300 shadow-[0_0_20px_rgba(255,30,86,0.6)]">
                        <i className="fa-solid fa-play text-xs ml-0.5" />
                    </div>
                </div>

                {/* ══ TOP BADGES ROW ══ */}
                <div className="absolute top-2 left-2 right-2 z-10 flex items-start justify-between gap-1.5">
                    {/* Status */}
                    <div
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full backdrop-blur-xl border ${
                            isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white/80 border-white/40 text-slate-800'
                        }`}
                    >
                        <span className="relative flex h-1.5 w-1.5">
                            {isAired ? (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            ) : (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e56] opacity-75" />
                            )}
                            <span
                                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                    isAired ? 'bg-emerald-400' : 'bg-[#ff1e56]'
                                }`}
                            />
                        </span>
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider">
                            {isAired ? 'LIVE' : 'JADWAL'}
                        </span>
                    </div>

                    {/* Score */}
                    {anime.score && (
                        <div
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md backdrop-blur-xl border ${
                                isDark ? 'bg-amber-500/15 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                            }`}
                        >
                            <span className="text-amber-400 text-[8px]">★</span>
                            <span className={`font-mono font-bold text-[9px] leading-none ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                                {anime.score}
                            </span>
                        </div>
                    )}
                </div>

                {/* ══ BOTTOM GENRES ══ */}
                <div className="absolute bottom-2 left-2 right-2 z-10">
                    <div className="flex flex-wrap gap-1">
                        {genres.map((g) => (
                            <span
                                key={g}
                                className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                                    isDark
                                        ? 'bg-[#ff1e56]/20 text-[#ff1e56] border-[#ff1e56]/30'
                                        : 'bg-rose-50 text-rose-600 border-rose-200'
                                }`}
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ INFO SECTION ═══ */}
            <div className="p-3 flex flex-col flex-1 justify-between gap-2.5 relative">
                {/* Title */}
                <h3
                    className={`font-black text-xs sm:text-[13px] leading-snug line-clamp-2 transition-colors duration-200 ${
                        isDark ? 'text-white group-hover:text-[#ff1e56]' : 'text-slate-900 group-hover:text-rose-600'
                    }`}
                >
                    {anime.title}
                </h3>

                {/* Countdown Box */}
                <div
                    className={`relative rounded-xl border p-2 overflow-hidden transition-colors ${
                        isAired
                            ? isDark
                                ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : isDark
                                ? 'bg-white/[0.02] border-white/[0.08]'
                                : 'bg-slate-50 border-slate-200'
                    }`}
                >
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <i className={`fa-solid fa-clock text-[9px] ${isAired ? 'text-emerald-400' : 'text-[#ff1e56]'}`} />
                            <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${
                                isAired ? 'text-emerald-400' : isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                                {countdown.label}
                            </span>
                        </div>
                    </div>

                    {/* Countdown Digits */}
                    {countdown.parts ? (
                        <div className="flex items-center justify-center gap-1">
                            {countdown.parts.map((part, i) => (
                                <div key={part.unit} className="flex items-center gap-1">
                                    <div
                                        className={`flex flex-col items-center px-1.5 py-0.5 rounded-lg border min-w-[28px] ${
                                            isDark ? 'bg-[#0e0407] border-white/[0.08]' : 'bg-white border-slate-200'
                                        }`}
                                    >
                                        <span className={`font-mono font-bold text-xs leading-none ${isDark ? 'text-[#ff1e56]' : 'text-rose-600'}`}>
                                            {String(part.value).padStart(2, '0')}
                                        </span>
                                        <span className={`text-[5px] font-mono uppercase tracking-wider mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {part.unit}
                                        </span>
                                    </div>
                                    {i < countdown.parts.length - 1 && (
                                        <span className="font-mono font-bold text-[9px] text-[#ff1e56]/60">:</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                                Sudah Tersedia Ditonton
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom CTA Strip */}
                <div
                    className={`w-full py-1.5 px-2.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        isDark
                            ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300 group-hover:bg-[#ff1e56] group-hover:border-[#ff1e56] group-hover:text-white'
                            : 'bg-slate-100 border border-slate-200 text-slate-700 group-hover:bg-[#ff1e56] group-hover:border-[#ff1e56] group-hover:text-white'
                    }`}
                >
                    <span>Detail Anime</span>
                    <i className="fa-solid fa-arrow-right text-[8px] group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </article>
    );
}