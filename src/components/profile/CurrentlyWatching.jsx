import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; 
import CurrentlyWatchingSkeleton from '../../skeletons/profil/CurrentlyWatchingSkeleton'; 

const OVERVIEW_LIMIT = 6;

export default function CurrentlyWatching({
    shows = [],
    loading = true,
    compact = false,
    onViewAll,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const visibleShows = compact ? shows.slice(0, OVERVIEW_LIMIT) : shows;
    const hasShows = shows.length > 0;

    return (
        <section className="relative w-full">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#ec001d] to-[#ff4d63] shadow-[0_0_12px_rgba(236,0,29,0.5)] dark:shadow-[0_0_16px_rgba(236,0,29,0.8)]" />
                    <div className="flex min-w-0 items-center gap-2.5">
                        <h2 className={`truncate font-sora text-xs font-extrabold uppercase tracking-[0.04em] transition-colors duration-300 sm:text-sm sm:tracking-wide md:text-base ${
                            isDark ? "text-white" : "text-neutral-900"
                        }`}>
                            Currently Watching
                        </h2>
                        {!loading && hasShows && (
                            <span className={`hidden shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold sm:inline-block ${
                                isDark
                                    ? 'border-white/10 bg-white/[0.05] text-slate-400'
                                    : 'border-slate-200 bg-white text-slate-500'
                            }`}>
                                {shows.length}
                            </span>
                        )}
                    </div>
                </div>

                {compact && hasShows && onViewAll && (
                    <button
                        type="button"
                        onClick={onViewAll}
                        className={`group/view-all inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1e56] focus-visible:ring-offset-2 sm:px-4 ${
                            isDark
                                ? 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-[#ff1e56]/45 hover:bg-[#ff1e56]/10 hover:text-white focus-visible:ring-offset-[#080305]'
                                : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-rose-300 hover:text-[#e6002d] focus-visible:ring-offset-[#faf8f5]'
                        }`}
                    >
                        <span><span className="hidden sm:inline">Lihat </span>semua</span>
                        <i className="fa-solid fa-arrow-right text-[9px] transition-transform duration-300 group-hover/view-all:translate-x-0.5" />
                    </button>
                )}
            </div>

            {loading ? (
                <CurrentlyWatchingSkeleton compact={compact} />
            ) : !hasShows ? (
                <div className={`flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 sm:p-14 text-center transition-all duration-300 ${
                    isDark
                        ? "border-white/10 bg-white/[0.02] backdrop-blur-xl text-neutral-400"
                        : "border-neutral-300 bg-neutral-50/50 text-neutral-500 shadow-inner"
                }`}>
                    <span className="material-symbols-outlined text-4xl mb-3 opacity-50">
                        live_tv
                    </span>
                    <p className="text-sm font-medium tracking-wide">
                        Belum ada seri yang ditonton.
                    </p>
                    <p className="text-xs mt-1 opacity-70">
                        Mulai tonton episode favoritmu sekarang!
                    </p>
                </div>
            ) : (
                <div
                    className={compact
                        ? '-mx-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3.5 pb-3 scrollbar-hide sm:mx-0 sm:gap-4 sm:px-0'
                        : 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'
                    }
                    aria-label={compact ? 'Daftar tontonan ringkas' : 'Daftar tontonan'}
                >
                    {visibleShows.map((show) => (
                        <button
                            type="button"
                            key={show.id}
                            onClick={() => show.episodeId && navigate(`/episode/${show.episodeId}`)}
                            disabled={!show.episodeId}
                            aria-label={`Lanjut menonton ${show.title}, ${show.episode}`}
                            className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1e56] focus-visible:ring-offset-2 disabled:cursor-default ${compact
                                ? 'w-[82vw] max-w-[280px] shrink-0 snap-start sm:w-[calc((100%_-_1rem)/2)] sm:max-w-none lg:w-[calc((100%_-_2rem)/3)]'
                                : ''
                            } ${
                                isDark
                                    ? "border-white/[0.08] bg-gradient-to-b from-[#13050a] via-[#0b0305] to-[#070204] hover:border-[#ff1e56]/50 hover:shadow-[0_15px_40px_rgba(255,30,86,0.2)] focus-visible:ring-offset-[#080305]"
                                    : "border-slate-200 bg-white hover:border-rose-400 hover:shadow-xl focus-visible:ring-offset-[#faf8f5]"
                            }`}
                        >
                            <div className="relative aspect-video overflow-hidden bg-slate-900">
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500" />

                                <img
                                    alt={show.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    src={show.image}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80';
                                    }}
                                />

                                {/* Center Play Action */}
                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="flex flex-col items-center gap-2 transform scale-80 group-hover:scale-100 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#ff1e56] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,30,86,0.8)] border border-white/30">
                                            <i className="fa-solid fa-play text-sm ml-0.5" />
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/20">
                                            Lanjut Tonton
                                        </span>
                                    </div>
                                </div>

                                {/* Duration & Episode Badge */}
                                <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase bg-black/70 backdrop-blur-md text-white border border-white/10">
                                        {show.duration}
                                    </span>
                                </div>

                                <div className="absolute top-2.5 right-2.5 z-20">
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase bg-[#ff1e56]/80 backdrop-blur-md text-white border border-[#ff1e56]">
                                        {show.episode}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col gap-2.5 relative z-10">
                                <div>
                                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Sedang Ditonton
                                    </span>
                                    <h4 className={`font-display text-sm font-black truncate transition-colors duration-300 mt-0.5 ${
                                        isDark ? "text-white group-hover:text-[#ff1e56]" : "text-slate-900 group-hover:text-[#ff1e56]"
                                    }`}>
                                        {show.title}
                                    </h4>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1 text-[9px] font-mono font-bold">
                                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                                            Progress Episode
                                        </span>
                                        <span className="text-[#ff1e56]">
                                            {show.progress}%
                                        </span>
                                    </div>
                                    <div className={`w-full rounded-full h-1.5 overflow-hidden ${
                                        isDark ? "bg-white/10" : "bg-slate-200"
                                    }`}>
                                        <div
                                            className="bg-gradient-to-r from-[#ff1e56] to-rose-400 h-full rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${show.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
