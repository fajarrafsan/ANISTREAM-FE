import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { getEpisodeBadge, cleanEpisodeTitle } from "../../../utils/relatedUtils";

export default function EpisodeCard({
    ep,
    index,
    isActive,
    handleEpisodeClick,
    setHoveredIndex,
    isGrid = false,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [imgFailed, setImgFailed] = useState(false);

    const epBadge = getEpisodeBadge(ep.title);
    const cleanTitle = cleanEpisodeTitle(ep.title);

    return (
        <div
            data-active={isActive}
            onClick={() => handleEpisodeClick(ep.title)}
            onMouseEnter={() => setHoveredIndex?.(index)}
            onMouseLeave={() => setHoveredIndex?.(null)}
            className={`relative group/ep cursor-pointer select-none transition-all duration-300 ${
                isGrid ? "w-full" : "flex-none"
            } ${isActive ? "scale-[1.02] z-10" : "scale-100 hover:scale-[1.03] hover:z-10"}`}
            style={isGrid ? undefined : { width: "clamp(8.1rem, 41vw, 11.5rem)" }}
        >
            {/* NEON BREATHING GLOW ── Denyut pendar ganda yang sangat halus untuk kartu aktif */}
            {isActive && (
                <div
                    className={`absolute -inset-1 rounded-2xl -z-10 opacity-80 animate-[pulse_2.5s_infinite] ${isDark
                        ? "shadow-[0_0_25px_rgba(255,30,86,0.5),0_0_50px_rgba(255,30,86,0.25)]"
                        : "shadow-[0_0_20px_rgba(244,63,94,0.3),0_0_40px_rgba(244,63,94,0.15)]"
                        }`}
                />
            )}

            <div
                className={`relative w-full aspect-16/10 rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 ${isActive
                    ? isDark
                        ? "border-[#ff1e56] shadow-[inset_0_0_20px_rgba(255,30,86,0.25),0_0_15px_rgba(255,30,86,0.35)]"
                        : "border-rose-500 shadow-[inset_0_0_20px_rgba(244,63,94,0.2),0_0_15px_rgba(244,63,94,0.25)]"
                    : isDark
                        ? "border-white/[0.08] shadow-[0_6px_18px_rgba(0,0,0,0.5)] group-hover/ep:border-[#ff1e56]/50 group-hover/ep:shadow-[0_12px_28px_rgba(255,30,86,0.2)]"
                        : "border-slate-200 shadow-[0_4px_12px_rgba(148,163,184,0.1)] group-hover/ep:border-rose-300 group-hover/ep:shadow-[0_8px_20px_rgba(244,63,94,0.15)]"
                    }`}
            >
                {/* DIAGONAL HOLOGRAPHIC SHEEN */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.15] to-transparent -translate-x-full group-hover/ep:translate-x-full transition-transform duration-1000 ease-out z-15 pointer-events-none" />

                {/* NOW PLAYING EQUALIZER BADGE */}
                {isActive && (
                    <span
                        className="absolute top-2 left-2 backdrop-blur-md border text-white text-[7px] sm:text-[8px] font-black px-2 py-1 rounded-lg tracking-wider uppercase z-20 shadow-md flex items-center gap-1.5 bg-[#ff1e56] border-white/20 shadow-[0_0_12px_rgba(255,30,86,0.6)]"
                    >
                        {/* Audio visualizer equalizer bars */}
                        <span className="flex items-end gap-[1.5px] h-2.5">
                            <span className="w-[2px] bg-white rounded-full animate-bounce h-2" />
                            <span className="w-[2px] bg-white rounded-full animate-bounce [animation-delay:0.15s] h-2.5" />
                            <span className="w-[2px] bg-white rounded-full animate-bounce [animation-delay:0.3s] h-1.5" />
                        </span>
                        DIPUTAR
                    </span>
                )}

                {/* EP BADGE */}
                {!isActive && (
                    <span
                        className={`absolute top-2 left-2 backdrop-blur-md border text-[7px] sm:text-[8px] font-black px-2 py-0.5 rounded-lg tracking-wider uppercase z-20 shadow-sm ${isDark
                            ? "bg-black/75 border-white/10 text-neutral-200"
                            : "bg-white/90 border-slate-200 text-slate-700"
                            }`}
                    >
                        {epBadge}
                    </span>
                )}

                {/* DURATION BADGE */}
                {ep.duration && (
                    <span
                        className={`absolute top-2 right-2 backdrop-blur-md text-[6px] sm:text-[7px] font-extrabold px-2 py-0.5 rounded-md z-20 border tracking-wider flex items-center gap-1 ${isDark
                            ? "bg-neutral-950/70 text-slate-300 border-white/[0.05]"
                            : "bg-white/90 text-slate-600 border-slate-200/60"
                            }`}
                    >
                        <i className="fa-regular fa-clock text-[6px] sm:text-[7.5px]" />
                        {ep.duration}
                    </span>
                )}

                {/* Thumbnail dengan Ken-burns zoom halus */}
                {ep.poster && !imgFailed ? (
                    <img
                        src={ep.poster}
                        alt=""
                        onError={() => setImgFailed(true)}
                        className={`w-full h-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive
                            ? "scale-105 brightness-[0.70] contrast-[1.05]"
                            : "group-hover/ep:scale-[1.08] group-hover/ep:brightness-[0.75] group-hover/ep:contrast-[1.02]"
                            }`}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className={`w-full h-full flex flex-col items-center justify-center gap-1.5 ${isDark
                            ? "bg-gradient-to-br from-[#1c080e] via-[#120508] to-[#0a0305]"
                            : "bg-gradient-to-br from-rose-50 to-slate-100"
                            }`}
                    >
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border ${
                            isDark ? "bg-[#ff1e56]/10 border-[#ff1e56]/20 text-[#ff1e56]" : "bg-rose-100 border-rose-200 text-rose-600"
                        }`}>
                            <i className="fa-solid fa-clapperboard text-xs sm:text-sm" />
                        </div>
                        <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
                            isDark ? "text-slate-500" : "text-slate-400"
                        }`}>
                            {epBadge}
                        </span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${isDark
                        ? "from-neutral-950 via-neutral-900/40 to-transparent"
                        : "from-white/95 via-white/20 to-transparent"
                        } ${isActive ? "opacity-100" : "opacity-75 group-hover/ep:opacity-100"
                        }`}
                />

                {/* Release date overlay */}
                <div
                    className={`absolute bottom-2 right-2 backdrop-blur-sm text-[6px] sm:text-[7px] font-mono font-black px-2 py-0.5 rounded-md z-10 border flex items-center gap-1 ${isDark
                        ? "bg-black/55 text-slate-400 border-white/[0.05]"
                        : "bg-white/80 text-slate-500 border-slate-200"
                        }`}
                >
                    <i className="fa-regular fa-calendar text-[6px] sm:text-[7px]" />
                    {ep.releaseDate}
                </div>

                {/* PLAY BUTTON HALO EFFECT */}
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${isActive
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75 group-hover/ep:opacity-100 group-hover/ep:scale-100"
                        }`}
                >
                    <div className="relative group/play">
                        {/* Glow halo */}
                        <div className="absolute inset-0 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#ff1e56]/30 blur-md group-hover/play:scale-135 transition-transform duration-500 animate-pulse" />
                        <div
                            className={`absolute -inset-1 rounded-full border backdrop-blur-[3px] transition-transform duration-500 group-hover/play:scale-115 ${isDark ? "border-white/15" : "border-white/40"
                                }`}
                        />
                        <div
                            className={`relative w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#ff1e56] to-[#c4143a] flex items-center justify-center transition-all duration-300 shadow-xl ${isActive
                                ? "shadow-[#ff1e56]/40"
                                : "shadow-black/60 group-hover/play:shadow-[#ff1e56]/50"
                                }`}
                        >
                            <i className="fa-solid fa-play text-white text-[8px] sm:text-[11px] ml-0.5 transition-transform duration-300 group-hover/play:scale-110" />
                        </div>
                    </div>
                </div>

                {/* Watermark EP Number */}
                <div
                    className={`absolute bottom-1 left-2 text-3xl sm:text-4xl font-extrabold z-5 select-none pointer-events-none leading-none tracking-tighter ${isDark ? "text-white/[0.025]" : "text-slate-900/[0.045]"
                        }`}
                >
                    {epBadge.replace("EP ", "")}
                </div>
            </div>

            {/* Info section */}
            <div className="mt-2.5 flex items-center justify-between px-0.5">
                <div className="min-w-0 flex-1 pr-1.5">
                    <h4
                        className={`font-black text-[10px] sm:text-[11px] leading-snug tracking-wide truncate transition-colors duration-300 ${isActive
                            ? "text-[#ff1e56]"
                            : isDark
                                ? "text-slate-100 group-hover/ep:text-white"
                                : "text-slate-700 group-hover/ep:text-slate-900"
                            }`}
                    >
                        {cleanTitle}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                            className={`inline-block w-1.5 h-1.5 rounded-full ${isActive
                                ? "bg-[#ff1e56] animate-pulse shadow-[0_0_6px_#ff1e56]"
                                : isDark
                                    ? "bg-neutral-600"
                                    : "bg-slate-300"
                                }`}
                        />
                        <span
                            className={`text-[8.5px] font-extrabold tracking-wider uppercase ${isDark ? "text-neutral-500" : "text-slate-400"
                                }`}
                        >
                            {ep.releaseDate}
                        </span>
                    </div>
                </div>

                {/* Small premium play icon */}
                <div
                    className={`shrink-0 transition-all duration-500 ${isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-1.5 group-hover/ep:opacity-100 group-hover/ep:translate-x-0"
                        }`}
                >
                    <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive
                            ? "bg-[#ff1e56]/20 border border-[#ff1e56]/50 shadow-[0_0_8px_rgba(255,30,86,0.2)]"
                            : isDark
                                ? "bg-white/[0.04] border border-white/10 hover:bg-[#ff1e56]/25 hover:border-[#ff1e56]/40"
                                : "bg-slate-50 border border-slate-200/80 hover:bg-rose-50 hover:border-rose-400"
                            }`}
                    >
                        <i
                            className={`fa-solid fa-play text-[6px] ml-0.5 ${isActive
                                ? "text-[#ff1e56]"
                                : isDark
                                    ? "text-neutral-400 group-hover/ep:text-[#ff1e56]"
                                    : "text-slate-400 group-hover/ep:text-rose-500"
                                }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}