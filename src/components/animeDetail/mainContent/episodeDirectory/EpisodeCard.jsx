import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useTheme } from "../../../../context/ThemeContext";
import { episodeCardVariants, detailSpring } from "../../constants/animeDetailMotion";

const extractEpisodeNumber = (title) => {
    if (!title) return "";
    const match = title.match(/episode\s*(\d+)/i);
    if (match) return match[1];
    const fallback = title.match(/\d+/);
    if (fallback) return fallback[0];
    return title;
};

export default function EpisodeCard({ episode, poster, duration, reduced = false }) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const epNumber = extractEpisodeNumber(episode.title);
    const hasPoster = !!poster;

    const handleNavigate = () => {
        if (!episode?.slug) return;
        navigate(`/episode/${episode.slug}`);
    };

    const cardClassName = `group relative block rounded-2xl overflow-hidden transition-all duration-300 border min-h-[76px] ${!episode?.slug ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${isDark
        ? "bg-white/[0.02] border-white/5 hover:border-[#ff1e56]/40 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgba(255,30,86,0.12)]"
        : "bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 hover:shadow-xl"
        }`;

    const inner = (
        <>
            <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${isDark
                    ? "from-[#ff1e56]/10 via-transparent to-transparent"
                    : "from-rose-200/40 via-transparent to-transparent"
                    }`}
            />

            <div className="relative flex gap-3 p-3 min-h-[76px] items-center">
                <div
                    className={`relative w-24 sm:w-[110px] aspect-video rounded-xl overflow-hidden shrink-0 border transition-all duration-300 ${isDark
                        ? "bg-[#0b0406] border-white/10 group-hover:border-[#ff1e56]/50"
                        : "bg-slate-200 border-slate-300 group-hover:border-rose-400"
                        }`}
                >
                    {hasPoster ? (
                        <img
                            src={poster}
                            alt={episode.title}
                            loading="lazy"
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isDark
                                ? "opacity-60 group-hover:opacity-90"
                                : "opacity-80 group-hover:opacity-100"
                                }`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <i className={`fa-solid fa-film text-sm ${isDark ? "text-slate-700" : "text-slate-400"}`} />
                        </div>
                    )}

                    {duration && (
                        <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md text-slate-200 border border-white/10 shadow-sm">
                            {duration}m
                        </span>
                    )}

                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-[#ff1e56] animate-ping opacity-40" />
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff1e56] to-[#c41e3a] flex items-center justify-center shadow-[0_0_20px_rgba(255,30,86,0.8)] scale-75 group-hover:scale-100 transition-transform duration-300 delay-75">
                                <i className="fa-solid fa-play text-white text-[10px] ml-0.5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex items-center justify-between w-full mb-1">
                        <span
                            className={`inline-flex items-center gap-1.5 border text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md transition-colors ${isDark
                                ? "bg-[#14080b] border-[#ff1e56]/30 text-[#ff1e56] group-hover:bg-[#ff1e56]/10 group-hover:border-[#ff1e56]/50"
                                : "bg-white border-rose-200 text-rose-500 group-hover:bg-rose-50 group-hover:border-rose-400"
                                }`}
                        >
                            <span className="w-1 h-1 rounded-full bg-current opacity-70" />
                            EP {epNumber}
                        </span>
                    </div>

                    <h4
                        className={`font-bold text-xs sm:text-sm leading-tight line-clamp-2 transition-colors duration-300 ${isDark
                            ? "text-slate-300 group-hover:text-white"
                            : "text-slate-700 group-hover:text-slate-900"
                            }`}
                    >
                        {episode.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500 group-hover:text-slate-400" : "text-slate-400 group-hover:text-slate-500"}`}>
                            Tersedia
                        </span>
                    </div>
                </div>
            </div>
        </>
    );

    if (reduced) {
        return (
            <div
                onClick={handleNavigate}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNavigate();
                    }
                }}
                className={cardClassName}
            >
                {inner}
            </div>
        );
    }

    return (
        <motion.div
            variants={episodeCardVariants}
            whileHover={{ y: -4, transition: detailSpring }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNavigate}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNavigate();
                }
            }}
            className={cardClassName}
        >
            {inner}
        </motion.div>
    );
}
