import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import useToast from '../../hooks/useToast';

export default function EpisodeInfo({ episode, animeTitle, selectedServer }) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

    const { toggleWishlist, isWishlisted, isLoading } = useWishlist();
    const { isLoggedIn } = useAuth();
    const { openModal } = useAuthModal();
    const toast = useToast();

    const episodeTitle = episode?.title ?? 'Episode';
    const releaseDate = episode?.releasedOn;

    const animeId = episode?.animeId;
    const isBookmarked = animeId ? isWishlisted(animeId) : false;
    const wishlistLoading = animeId ? isLoading(animeId) : false;

    const handleWishlistClick = async () => {
        if (!isLoggedIn) {
            toast.warning("Silakan login terlebih dahulu untuk menyimpan ke Wishlist", 3000);
            openModal({ mode: 'login' });
            return;
        }

        if (!animeId) {
            toast.error("Data anime tidak lengkap", 3000);
            return;
        }

        await toggleWishlist({
            animeId,
            title: animeTitle ?? episode?.title,
            image: episode?.poster ?? null,
        });
    };

    return (
        <div
            className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xl transition-all duration-300 p-3.5 sm:p-6 md:p-7 lg:p-8 ${isDark
                ? "bg-[#0b0406]/90 border-white/5 backdrop-blur-xl hover:border-[#ff1e56]/30 shadow-2xl"
                : "bg-white border-slate-200 shadow-xl hover:border-rose-300/60"
                }`}
        >
            <div
                className={`absolute -top-12 -left-12 w-36 h-36 sm:w-48 sm:h-48 rounded-full blur-3xl pointer-events-none ${isDark ? "bg-[#ff1e56]/10" : "bg-rose-200/40"
                    }`}
            />
            <div
                className={`absolute -bottom-16 -right-16 w-28 h-28 sm:w-36 sm:h-36 rounded-full blur-3xl pointer-events-none ${isDark
                    ? "bg-gradient-to-br from-[#c41e3a]/5 to-transparent"
                    : "bg-gradient-to-br from-rose-100/50 to-transparent"
                    }`}
            />
            <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${isDark ? "from-[#ff1e56] to-transparent" : "from-rose-400 to-transparent"
                    }`}
            />

            <div className="relative">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white text-[8px] sm:text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase shadow-[0_0_15px_rgba(255,30,86,0.35)] select-none border border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        EPISODE STREAMING
                    </span>

                    <span
                        className={`inline-flex items-center gap-1 border text-[8px] sm:text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider uppercase select-none ${isDark
                            ? "bg-white/[0.03] border-white/10 text-slate-300"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                    >
                        <i className="fa-solid fa-closed-captioning text-[9px] text-[#ff1e56]" />
                        Sub Indo
                    </span>

                    {selectedServer && (
                        <span
                            className={`inline-flex items-center gap-1.5 border text-[8px] sm:text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider uppercase select-none max-w-full ${isDark
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-emerald-50 border-emerald-200 text-emerald-600"
                                }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <i className="fa-solid fa-server text-[8px]" />
                            <span className="truncate max-w-[120px] sm:max-w-none">
                                {selectedServer.name} ({selectedServer.resolution})
                            </span>
                        </span>
                    )}
                </div>

                {/* Title Block */}
                <div className="mb-3 sm:mb-5">
                    <span
                        className={`text-[9px] sm:text-[11px] font-black uppercase tracking-widest block mb-1 ${isDark ? "text-[#ff1e56]" : "text-rose-500"
                            }`}
                    >
                        {episodeTitle}
                    </span>

                    <h1
                        className={`font-display font-black leading-tight tracking-tight wrap-break-word text-xl sm:text-2xl md:text-3xl lg:text-4xl ${isDark ? "text-white" : "text-slate-900"
                            }`}
                    >
                        {animeTitle}
                    </h1>

                    {releaseDate && (
                        <span
                            className={`text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider block mt-1 ${isDark ? "text-slate-600" : "text-slate-500"
                                }`}
                        >
                            Dirilis: {releaseDate}
                        </span>
                    )}
                </div>

                {/* Synopsis */}
                <div className="mb-4 sm:mb-6 max-w-3xl">
                    <p
                        className={`text-[10px] sm:text-xs md:text-sm leading-relaxed transition-all duration-300 ${isSynopsisExpanded ? "" : "line-clamp-2 sm:line-clamp-4"
                            } ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                        {episode?.synopsis ?? 'Sinopsis tidak tersedia.'}
                    </p>

                    {episode?.synopsis && episode.synopsis.length > 90 && (
                        <button
                            onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                            className={`inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-black mt-1.5 tracking-widest uppercase transition-colors cursor-pointer ${isDark
                                    ? "text-[#ff1e56] hover:text-[#ff3e6d]"
                                    : "text-rose-500 hover:text-rose-600"
                                }`}
                        >
                            <span>
                                {isSynopsisExpanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
                            </span>
                            <i
                                className={`fa-solid fa-chevron-down text-[7px] transition-transform duration-200 ${isSynopsisExpanded ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                    {/* Detail Serial Button */}
                    {animeId && (
                        <button
                            onClick={() => navigate(`/anime/detail/${animeId}`)}
                            className={`group col-span-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-[10px] font-black uppercase tracking-wider shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 sm:h-11 sm:w-auto sm:px-5 sm:text-[11px] ${isDark
                                ? "bg-white/[0.04] border-white/10 hover:border-[#ff1e56]/40 hover:bg-white/[0.08] text-slate-200 hover:text-white"
                                : "bg-white border-slate-200 hover:border-rose-400 text-slate-700 hover:text-slate-900"
                                }`}
                        >
                            <i className="fa-solid fa-layer-group text-[10px] text-[#ff1e56] group-hover:scale-110 transition-transform" />
                            <span><span className="sm:hidden">Detail Anime</span><span className="hidden sm:inline">Semua Episode & Detail</span></span>
                        </button>
                    )}

                    {/* Next Episode Button */}
                    {episode?.hasNextEpisode && episode?.nextEpisode ? (
                        <button
                            onClick={() => navigate(`/episode/${episode.nextEpisode.episodeId}`)}
                        className="group col-span-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-gradient-to-r from-[#ff1e56] via-[#e11d48] to-[#be123c] px-4 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(255,30,86,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(255,30,86,0.55)] active:translate-y-0 active:scale-95 sm:h-11 sm:w-auto sm:px-6 sm:text-[11px]"
                        >
                            <span><span className="sm:hidden">Episode berikutnya</span><span className="hidden sm:inline">Episode selanjutnya</span></span>
                            <i className="fa-solid fa-forward text-[9px] transition-transform group-hover:translate-x-1" />
                        </button>
                    ) : (
                        <button
                            disabled
                            className={`col-span-2 inline-flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border px-4 text-[10px] font-bold uppercase tracking-wider sm:h-11 sm:w-auto sm:px-6 sm:text-[11px] ${isDark
                                ? "bg-[#170a0e] border-[#2d1219] text-slate-600"
                                : "bg-slate-100 border-slate-200 text-slate-400"
                                }`}
                        >
                            <i className="fa-solid fa-flag-checkered text-[9px] text-[#ff1e56]" />
                            <span>Episode Terakhir (Tamat)</span>
                        </button>
                    )}

                    {/* Prev Episode Button */}
                    {episode?.hasPrevEpisode && episode?.prevEpisode && (
                        <button
                            onClick={() => navigate(`/episode/${episode.prevEpisode.episodeId}`)}
                            className={`group inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 text-[9px] font-black uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 sm:h-11 sm:w-auto sm:px-5 sm:text-[11px] ${isDark
                                ? "bg-white/[0.03] border-white/10 hover:border-[#ff1e56]/30 text-slate-300 hover:text-white hover:bg-white/[0.06]"
                                : "bg-white border-slate-200 hover:border-rose-300 text-slate-600 hover:text-slate-900 shadow-sm"
                                }`}
                        >
                            <i className="fa-solid fa-backward text-[9px] transition-transform group-hover:-translate-x-1" />
                            <span><span className="sm:hidden">Sebelumnya</span><span className="hidden sm:inline">Episode sebelumnya</span></span>
                        </button>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistClick}
                        disabled={wishlistLoading}
                        className={`group inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 text-[9px] font-black uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:w-auto sm:px-5 sm:text-[11px] ${isBookmarked
                            ? isDark
                                ? "bg-[#ff1e56]/15 border-[#ff1e56]/40 text-[#ff1e56] shadow-[0_0_15px_rgba(255,30,86,0.25)]"
                                : "bg-rose-50 border-rose-300 text-rose-600"
                            : isDark
                                ? "bg-white/[0.03] border-white/10 hover:border-[#ff1e56]/30 text-slate-300 hover:text-white hover:bg-white/[0.06]"
                                : "bg-white border-slate-200 hover:border-rose-300 text-slate-600 hover:text-slate-900 shadow-sm"
                            }`}
                    >
                        {wishlistLoading ? (
                            <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                        ) : isBookmarked ? (
                            <i className="fa-solid fa-bookmark text-[10px] text-[#ff1e56] animate-pulse" />
                        ) : (
                            <i className="fa-solid fa-bookmark text-[10px] text-[#ff1e56]/70 group-hover:text-[#ff1e56] transition-colors" />
                        )}
                        <span>{isBookmarked ? 'TERSIMPAN' : 'WISHLIST'}</span>
                    </button>

                    {/* Quick Jump to Download */}
                    <button
                        onClick={() => {
                            const el = document.getElementById("download-section");
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`group inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 text-[9px] font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:h-11 sm:w-auto sm:px-4 sm:text-[11px] ${isDark
                            ? "bg-white/[0.02] border-white/[0.08] hover:border-[#ff1e56]/30 text-slate-400 hover:text-white"
                            : "bg-white border-slate-200 hover:border-rose-300 text-slate-600 hover:text-slate-900"
                            }`}
                        title="Lompat ke bagian link unduhan"
                    >
                        <i className="fa-solid fa-arrow-down text-[10px] text-[#ff1e56]" />
                        <span>Unduh</span>
                    </button>

                    {/* Quick Jump to Discussion */}
                    <button
                        onClick={() => {
                            const el = document.getElementById("comments-section");
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`group inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 text-[9px] font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:h-11 sm:w-auto sm:px-4 sm:text-[11px] ${isDark
                            ? "bg-white/[0.02] border-white/[0.08] hover:border-[#ff1e56]/30 text-slate-400 hover:text-white"
                            : "bg-white border-slate-200 hover:border-rose-300 text-slate-600 hover:text-slate-900"
                            }`}
                        title="Lompat ke kolom komentar"
                    >
                        <i className="fa-solid fa-comments text-[10px] text-[#ff1e56]" />
                        <span>Diskusi</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
