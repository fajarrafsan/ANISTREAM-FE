import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function MovieCard({ anime, variant = 'default', viewMode = 'grid', onClick }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const isRecent = variant === 'recent';
    const isList = viewMode === 'list';
    const [imgFailed, setImgFailed] = useState(false);

    const isOngoing = anime.status === 'Ongoing' || anime.status === 'Berjalan';
    const statusLabel = isOngoing ? 'Ongoing' : 'Selesai';

    const fullStars = Math.floor((anime.score || 0) / 2);
    const hasHalfStar = ((anime.score || 0) / 2) % 1 >= 0.5;

    const formatRecentTime = (text = '') => {
        return text
            .replace(/seconds yang lalu/g, 'DETIK')
            .replace(/second yang lalu/g, 'DETIK')
            .replace(/minuts yang lalu/g, 'MENIT')
            .replace(/minute yang lalu/g, 'MENIT')
            .replace(/hours yang lalu/g, 'JAM')
            .replace(/hour yang lalu/g, 'JAM')
            .replace(/days yang lalu/g, 'HARI')
            .replace(/day yang lalu/g, 'HARI');
    };

    const recentLabel = anime.releasedOn ? formatRecentTime(anime.releasedOn) : '';

    if (isList) {
        return (
            <article
                onClick={onClick}
                className={`group relative flex flex-col sm:flex-row items-stretch rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer select-none border ${
                    isDark
                        ? 'bg-gradient-to-r from-[#120509] via-[#0d0407] to-[#070204] border-white/[0.08] hover:border-[#ff1e56]/50 hover:shadow-[0_8px_30px_rgba(255,30,86,0.18)]'
                        : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-xl'
                }`}
            >
                {/* Poster Thumbnail */}
                <div className="relative w-full sm:w-44 md:w-52 aspect-16/9 sm:aspect-3/4 shrink-0 overflow-hidden bg-slate-900">
                    {!imgFailed && anime.poster ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${anime.poster}')` }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-500">
                            <i className="fa-solid fa-clapperboard text-2xl text-[#ff1e56]/40" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Floating Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 group-hover:bg-[#ff1e56] transition-all duration-300 shadow-xl">
                            <i className="fa-solid fa-play text-xs ml-0.5" />
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase bg-black/70 backdrop-blur-md text-white border border-white/10">
                            {statusLabel}
                        </span>
                    </div>

                    {/* Rating */}
                    {anime.score && (
                        <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-md text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                ★ {anime.score}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Details */}
                <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 min-w-0">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            {anime.type && (
                                <span className="px-2 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase bg-[#ff1e56]/15 text-[#ff1e56] border border-[#ff1e56]/30">
                                    {anime.type}
                                </span>
                            )}
                            {anime.totalEpisodes && (
                                <span className={`text-[9px] font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    • {anime.totalEpisodes} Episode
                                </span>
                            )}
                            {anime.year && (
                                <span className={`text-[9px] font-mono font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    • {anime.year}
                                </span>
                            )}
                        </div>

                        <h3 className={`font-display font-black text-sm sm:text-base md:text-lg leading-tight group-hover:text-[#ff1e56] transition-colors truncate ${
                            isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                            {anime.title}
                        </h3>

                        {/* Genres */}
                        {anime.genres?.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {anime.genres.slice(0, 4).map((g) => (
                                    <span
                                        key={g}
                                        className={`px-2 py-0.5 rounded-lg text-[9px] font-medium border ${
                                            isDark ? 'bg-white/[0.03] border-white/[0.06] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                                        }`}
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-inherit">
                        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {recentLabel ? `Update: ${recentLabel}` : 'Tersedia Sub Indo'}
                        </span>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#ff1e56] text-white shadow-sm group-hover:shadow-[0_0_15px_rgba(255,30,86,0.4)] transition-all">
                            <span>Tonton</span>
                            <i className="fa-solid fa-arrow-right text-[9px]" />
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article
            onClick={onClick}
            className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer select-none
                ${isDark
                    ? 'bg-gradient-to-b from-[#15080d] via-[#0d0407] to-[#0a0305] border border-white/[0.07] hover:border-[#ff1e56]/50 hover:shadow-[0_8px_30px_rgba(255,30,86,0.18)]'
                    : 'bg-gradient-to-b from-white via-white to-slate-50/80 border border-slate-200/80 hover:border-rose-300/70 hover:shadow-xl'
                }
                hover:-translate-y-1 sm:hover:-translate-y-2
            `}
        >
            {/* Ambient glow behind */}
            <div
                className={`absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10
                ${isDark ? 'bg-[#ff1e56]/15' : 'bg-rose-400/10'}`}
            />

            {/* ── COVER SECTION ── */}
            <div className={`relative w-full overflow-hidden bg-slate-900 ${isRecent ? 'aspect-3/4' : 'aspect-2/3'}`}>
                {/* Image with Ken Burns */}
                {!imgFailed && anime.poster ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-[1.2s] ease-out group-hover:scale-110 group-hover:brightness-110"
                        style={{ backgroundImage: `url('${anime.poster}')` }}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a050d] to-[#0a0205] text-slate-500 p-3 text-center">
                        <i className="fa-solid fa-clapperboard text-2xl text-[#ff1e56]/40 mb-1" />
                        <span className="text-[9px] font-mono uppercase tracking-wider">{anime.title}</span>
                    </div>
                )}

                {/* Floating Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/75 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 group-hover:bg-[#ff1e56] transition-all duration-300 shadow-[0_0_20px_rgba(255,30,86,0.6)]">
                        <i className="fa-solid fa-play text-xs ml-0.5" />
                    </div>
                </div>

                {/* Multi-layer cinematic gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff1e56]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]" />

                {/* Shimmer / gleam effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30 overflow-hidden">
                    <div
                        className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-in-out skew-x-12
                        ${isDark
                                ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
                                : 'bg-gradient-to-r from-transparent via-white/30 to-transparent'
                            }`}
                    />
                </div>

                {/* ── TOP BADGES ── */}
                <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-2 sm:left-2 sm:right-2 z-10 flex items-start justify-between gap-1.5">
                    {/* Status */}
                    <div
                        className={`flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-xl border shrink-0 max-w-[58%]
                        ${isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-white/40'}`}
                    >
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                            <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOngoing ? 'bg-emerald-400' : 'bg-[#ff1e56]'
                                    }`}
                            />
                            <span
                                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isOngoing ? 'bg-emerald-400' : 'bg-[#ff1e56]'
                                    }`}
                            />
                        </span>
                        <span
                            className={`text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider whitespace-nowrap truncate ${isDark ? 'text-slate-200' : 'text-slate-800'
                                }`}
                        >
                            {statusLabel}
                        </span>
                    </div>

                    {/* Recent label / score */}
                    {isRecent && recentLabel ? (
                        <div
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-xl border text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0 max-w-[42%] truncate
                            ${isDark ? 'bg-black/60 border-white/10 text-slate-300' : 'bg-white/80 border-white/40 text-slate-600'}`}
                            title={recentLabel}
                        >
                            {recentLabel}
                        </div>
                    ) : !isRecent && anime.score ? (
                        <div
                            className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-xl border shrink-0
                            ${isDark ? 'bg-black/60 border-amber-500/30' : 'bg-white/80 border-amber-300'}`}
                        >
                            <i className="fa-solid fa-star text-[8px] text-amber-400" />
                            <span className={`font-mono font-bold text-[9px] sm:text-[10px] leading-none ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                                {anime.score}
                            </span>
                        </div>
                    ) : null}
                </div>

                {/* ── BOTTOM OVERLAY ── */}
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5 z-10">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 flex-wrap">
                            {anime.type && (
                                <span
                                    className={`px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border
                                    ${isDark
                                            ? 'bg-[#ff1e56]/20 text-[#ff1e56] border-[#ff1e56]/40'
                                            : 'bg-rose-50 text-rose-600 border-rose-200'
                                        }`}
                                >
                                    {anime.type}
                                </span>
                            )}
                            {isRecent && anime.episodes && (
                                <span
                                    className={`px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border
                                    ${isDark
                                            ? 'bg-white/10 text-slate-300 border-white/10'
                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}
                                >
                                    EP {anime.episodes}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Progress bar */}
                    {isOngoing && anime.currentEpisode && anime.totalEpisodes && (
                        <div className="w-full">
                            <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider mb-0.5 text-slate-400">
                                <span>Progress</span>
                                <span>{anime.currentEpisode} / {anime.totalEpisodes}</span>
                            </div>
                            <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#ff1e56] to-rose-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${(anime.currentEpisode / anime.totalEpisodes) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── INFO SECTION ── */}
            <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 gap-1.5 sm:gap-2 relative">
                {/* Decorative top line */}
                <div
                    className={`absolute top-0 left-3 right-3 h-px
                    ${isDark ? 'bg-gradient-to-r from-transparent via-[#ff1e56]/20 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`}
                />

                {/* Genres */}
                {!isRecent && anime.genres?.length > 0 && (
                    <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5">
                        {anime.genres.slice(0, 2).map((genre) => (
                            <span
                                key={genre}
                                className={`text-[8px] sm:text-[9px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                            >
                                • {genre}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3
                    className={`font-bold text-[11px] sm:text-[12px] md:text-[13px] leading-snug line-clamp-2 transition-all duration-300
                    ${isDark
                            ? 'text-slate-100 group-hover:text-white'
                            : 'text-slate-800 group-hover:text-slate-900'
                        }`}
                >
                    {anime.title}
                </h3>

                {/* Meta info */}
                <div className="flex items-center gap-2 mt-auto pt-1">
                    {!isRecent && anime.year && (
                        <span className={`text-[8px] sm:text-[9px] font-mono font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {anime.year}
                        </span>
                    )}
                    {!isRecent && anime.totalEpisodes && (
                        <span className={`text-[8px] sm:text-[9px] font-mono font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            • {anime.totalEpisodes} EP
                        </span>
                    )}
                </div>

                {/* CTA Button */}
                <div
                    className={`relative w-full py-2 px-3 rounded-xl font-bold text-[9px] sm:text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 overflow-hidden group/btn mt-1
                    ${isDark
                            ? 'bg-white/[0.04] border border-white/[0.08] text-slate-300 group-hover:bg-[#ff1e56] group-hover:border-[#ff1e56] group-hover:text-white'
                            : 'bg-slate-100 border border-slate-200 text-slate-700 group-hover:bg-[#ff1e56] group-hover:border-[#ff1e56] group-hover:text-white'
                        }`}
                >
                    <span>{isRecent ? 'Tonton Sekarang' : 'Lihat Detail'}</span>
                    <i className="fa-solid fa-arrow-right text-[9px] transform group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </article>
    );
}