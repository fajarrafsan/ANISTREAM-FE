import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import useEpisodeDetail from '../hooks/useEpisodeDetail';
import useWatchHistory from '../hooks/useWatchHistory';
import { api } from '../api/axios';
import { useTheme } from '../context/ThemeContext';

import LoadingState from '../components/serverNonton/videoPlayer/LoadingState';
import ErrorState from '../components/serverNonton/videoPlayer/ErrorState';
import VideoPlayer from '../components/serverNonton/videoPlayer/VideoPlayer';
import EpisodeInfo from '../components/serverNonton/EpisodeInfo';
import RelatedEpisodes from '../components/serverNonton/relatedEpisode/RelatedEpisodes';
import RelatedMovies from '../components/serverNonton/relatedMovie/RelatedMovies';
import DownloadSection from '../components/serverNonton/DownloadSection';
import CommentsTab from '../components/animeDetail/comments/CommentsTab';
import useComments from '../hooks/useComments';
import { normalizeEpisodeId } from '../utils/relatedUtils';

export default function VideoPlayerPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { episodeId } = useParams();
    const navigate = useNavigate();
    const normalizedEpisodeId = normalizeEpisodeId(episodeId);
    const { episode, loading, error, prevEpisode } = useEpisodeDetail();
    const { saveHistory } = useWatchHistory();

    console.log("normalizedEpisodeId", normalizedEpisodeId);

    const [selectedServer, setSelectedServer] = useState(null);
    const [activeStreamUrl, setActiveStreamUrl] = useState(null);
    const [serverLoading, setServerLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const historySavedFor = useRef(null);

    const animeSlug = episode?.animeId || (episodeId ? episodeId.replace(/-episode-\d+.*$/i, '') : '');
    const commentsApi = useComments(animeSlug);

    const handleBack = () => {
        if (animeSlug) {
            navigate(`/anime/detail/${animeSlug}`);
        } else if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [normalizedEpisodeId]);

    useEffect(() => {
        setSelectedServer(null);
        setActiveStreamUrl(null);
        setServerError(null);
        setServerLoading(false);
    }, [normalizedEpisodeId]);

    useEffect(() => {
        if (!episode) return;

        // Cegah eksekusi ulang jika episode ini sudah tersimpan di sesi render saat ini
        if (historySavedFor.current === normalizedEpisodeId) return;

        // 1. Ekstrak Nomor Episode dari ID (karena ID selalu konsisten)
        const epMatchFromId = normalizedEpisodeId.match(/-episode-(\d+)/i);
        const parsedEpisodeTitle = epMatchFromId ? `Episode ${epMatchFromId[1]}` : "Episode Baru";

        // 2. Ekstrak Judul Anime
        let parsedAnimeTitle = episode.title || "";
        const titleMatch = parsedAnimeTitle.match(/(.*?)\s+(?:episode|ep|ep\.)\s+\d+/i);
        if (titleMatch) {
            parsedAnimeTitle = titleMatch[1].trim();
        }

        saveHistory({
            animeId: episode.animeId || normalizedEpisodeId.split("-episode-")[0] || "",
            episodeId: normalizedEpisodeId,
            title: parsedAnimeTitle,
            episodeTitle: parsedEpisodeTitle,
            poster: episode.poster || null
        });

        historySavedFor.current = normalizedEpisodeId;
    }, [episode, saveHistory, normalizedEpisodeId]);

    useEffect(() => {
        if (!episode) return;
        setActiveStreamUrl(episode.defaultStreamingUrl ?? null);
        setSelectedServer(null);
        setServerError(null);
    }, [episode?.episodeId]);

    const handleChangeServer = useCallback(async (serverId, resolution, serverName) => {
        if (serverLoading) return;
        if (selectedServer?.serverId === serverId) return;

        setServerLoading(true);
        setServerError(null);

        try {
            const res = await api.get(`/anime/server/${serverId}`);
            const url = res.data?.data?.url;

            if (!url) throw new Error('URL tidak ditemukan');

            setActiveStreamUrl(url);
            setSelectedServer({ serverId, resolution, name: serverName });

        } catch (err) {
            console.error('[handleChangeServer]', err.message);
            setServerError(`Gagal memuat server "${serverName}". Coba server lain.`);

            if (episode?.defaultStreamingUrl && !activeStreamUrl) {
                setActiveStreamUrl(episode.defaultStreamingUrl);
            }
        } finally {
            setServerLoading(false);
        }
    }, [serverLoading, selectedServer?.serverId, episode?.defaultStreamingUrl, activeStreamUrl]);

    if (loading) return <LoadingState />;

    const effectiveEpisode = episode || prevEpisode;
    const relatedEpisodes = episode?.recommendedEpisodes || prevEpisode?.recommendedEpisodes;
    const animeTitle = episode?.title ?? prevEpisode?.title ?? 'Unknown Anime';

    return (
        <div
            key={normalizedEpisodeId}
            className={`min-h-screen overflow-x-hidden selection:bg-[#ff1e56] selection:text-white transition-colors duration-500 ${isDark ? 'bg-[#060204] text-white' : 'bg-slate-50 text-slate-900'
                }`}
        >
            {/* ── TOP STICKY CINEMA NAVIGATION BAR ── */}
            <header className={`sticky top-0 z-50 w-full backdrop-blur-2xl transition-colors duration-300 border-b ${isDark ? 'bg-[#070204]/90 border-white/5 shadow-2xl' : 'bg-white/95 border-slate-200 shadow-sm'}`}>
                <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6 h-14 flex items-center justify-between gap-2.5 sm:gap-3 select-none">
                    {/* Left: Back to Detail Anime & Home & Breadcrumbs */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            aria-label="Kembali ke Detail Anime"
                            className={`group flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl font-black text-[9px] sm:text-[11px] tracking-wider uppercase transition-all duration-200 cursor-pointer shrink-0 ${isDark
                                ? "bg-white/[0.04] border border-white/10 text-slate-200 hover:text-white hover:bg-[#ff1e56] hover:border-[#ff1e56] hover:shadow-[0_0_15px_rgba(255,30,86,0.5)]"
                                : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-white hover:bg-[#ff1e56] hover:border-[#ff1e56]"
                                }`}
                            title="Kembali ke halaman detail & daftar episode anime"
                        >
                            <i className="fa-solid fa-arrow-left text-[10px] sm:text-[11px] group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden xs:inline">Detail Anime</span>
                            <span className="xs:hidden">Detail</span>
                        </motion.button>

                        <Link
                            to="/"
                            aria-label="Beranda"
                            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border transition-all duration-200 shrink-0 ${isDark
                                ? "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.08]"
                                : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                            title="Ke Beranda Utama"
                        >
                            <i className="fa-solid fa-house text-xs" />
                        </Link>

                        <div className={`hidden sm:block w-[1px] h-4 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

                        {/* Breadcrumbs */}
                        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 min-w-0">
                            {animeSlug && (
                                <Link
                                    to={`/anime/detail/${animeSlug}`}
                                    className={`group flex items-center gap-1.5 text-[11px] font-bold max-w-[140px] md:max-w-[220px] truncate transition-colors ${isDark ? "text-slate-400 hover:text-[#ff1e56]" : "text-slate-600 hover:text-rose-600"}`}
                                    title="Buka Halaman Detail Anime"
                                >
                                    <i className="fa-solid fa-film text-[10px] opacity-70 group-hover:opacity-100 text-[#ff1e56]" />
                                    <span className="truncate">{animeTitle}</span>
                                </Link>
                            )}

                            <span className={`text-xs ${isDark ? "text-slate-600" : "text-slate-300"}`}>/</span>

                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white shadow-[0_0_12px_rgba(255,30,86,0.35)] shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                <span className="max-w-[120px] truncate">
                                    {episode?.title ? episode.title.replace(/^.*?(episode|\bep\b)\s*/i, 'Ep ') : 'Nonton'}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Right Actions: Jump to Section, Prev/Next Ep, Theater Mode & Share */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {/* Quick Jump Buttons (Unduh, Komentar) */}
                        <button
                            onClick={() => {
                                const el = document.getElementById("download-section");
                                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className={`hidden lg:inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${isDark
                                ? "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
                                }`}
                            title="Lompat ke Unduhan"
                        >
                            <i className="fa-solid fa-cloud-arrow-down text-xs text-[#ff1e56]" />
                            <span>Unduh</span>
                        </button>

                        <button
                            onClick={() => {
                                const el = document.getElementById("comments-section");
                                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className={`hidden lg:inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${isDark
                                ? "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
                                }`}
                            title="Lompat ke Diskusi & Komentar"
                        >
                            <i className="fa-solid fa-comments text-xs text-[#ff1e56]" />
                            <span>Diskusi</span>
                        </button>

                        {/* Prev Episode in topbar */}
                        {episode?.hasPrevEpisode && episode?.prevEpisode && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/episode/${episode.prevEpisode.episodeId}`)}
                                className={`flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${isDark
                                    ? "bg-white/[0.02] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.06]"
                                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
                                    }`}
                                title="Putar Episode Sebelumnya"
                            >
                                <i className="fa-solid fa-backward-step text-[10px] text-[#ff1e56]" />
                                <span className="hidden sm:inline">Prev</span>
                            </motion.button>
                        )}

                        {/* Next Episode in topbar */}
                        {episode?.hasNextEpisode && episode?.nextEpisode && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/episode/${episode.nextEpisode.episodeId}`)}
                                className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#ff1e56] to-[#c4143a] text-white shadow-[0_0_12px_rgba(255,30,86,0.35)] cursor-pointer"
                                title="Putar Episode Selanjutnya"
                            >
                                <span>Next</span>
                                <i className="fa-solid fa-forward-step text-[10px]" />
                            </motion.button>
                        )}

                        {/* Theater Mode Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsTheaterMode((prev) => !prev)}
                            className={`flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${isTheaterMode
                                ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                : isDark
                                    ? "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
                                }`}
                            title={isTheaterMode ? "Matikan Mode Bioskop" : "Aktifkan Mode Bioskop"}
                        >
                            <i className={`fa-solid ${isTheaterMode ? "fa-lightbulb text-amber-400" : "fa-lightbulb-slash"} text-[11px]`} />
                            <span className="hidden xs:inline">{isTheaterMode ? "Bioskop ON" : "Bioskop"}</span>
                        </motion.button>

                        {/* Share Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCopyUrl}
                            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border transition-all duration-200 cursor-pointer ${isCopied
                                ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                : isDark
                                    ? "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
                                }`}
                            title="Salin Tautan Episode"
                        >
                            <i className={`fa-solid ${isCopied ? "fa-check" : "fa-share-nodes"} text-xs`} />
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Server error banner */}
            {serverError && (
                <div className={`mx-3 sm:mx-4 md:mx-auto md:max-w-[1440px] mt-3 rounded-lg text-xs py-2 px-4 border flex items-center justify-between gap-3 ${isDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-rose-50 border-rose-200 text-rose-600'
                    }`}>
                    <span>{serverError}</span>
                    <button
                        onClick={() => setServerError(null)}
                        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <i className="fa-solid fa-xmark text-xs" />
                    </button>
                </div>
            )}

            {/* ── CINEMA STAGE & VIDEO PLAYER CONTAINER ── */}
            <div className={`relative mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 transition-all duration-500 ${isTheaterMode ? "scale-[1.01]" : ""}`}>
                {/* Dynamic Ambilight Aura (Behind Video Player) */}
                {isDark && (
                    <div
                        className={`absolute -inset-4 sm:-inset-10 rounded-3xl blur-[120px] pointer-events-none transition-opacity duration-700 ${
                            isTheaterMode
                                ? "opacity-80 bg-gradient-to-br from-[#ff1e56]/30 via-red-900/20 to-indigo-950/30 animate-pulse"
                                : "opacity-35 bg-gradient-to-br from-[#ff1e56]/15 via-red-900/10 to-indigo-950/15"
                        }`}
                    />
                )}

                {/* Cinema Monitor Chassis & Bezel */}
                <div className={`relative rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
                    isDark
                        ? "bg-[#0b0306] border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
                        : "bg-white border-slate-200 shadow-xl"
                }`}>
                    {/* Monitor Top Bezel Strip */}
                    <div className={`h-8 sm:h-9 px-3 sm:px-5 flex items-center justify-between border-b select-none ${
                        isDark ? "bg-[#100508] border-white/5 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>
                        <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] shadow-[0_0_8px_#ff1e56]" />
                            <span className={isDark ? "text-white font-black" : "text-slate-800 font-black"}>Cinema Studio</span>
                            <span className="text-slate-600">•</span>
                            <span>4K UHD Ready</span>
                            <span className="hidden sm:inline text-slate-600">•</span>
                            <span className="hidden sm:inline">Sub Indo</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedServer && (
                                <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    {selectedServer.name}
                                </span>
                            )}
                            <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                                60 FPS
                            </span>
                        </div>
                    </div>

                    {error ? (
                        <ErrorState error={error} onBack={handleBack} />
                    ) : (
                        <VideoPlayer
                            episode={episode}
                            activeStreamUrl={activeStreamUrl}
                            selectedServer={selectedServer}
                            serverLoading={serverLoading}
                            onChangeServer={handleChangeServer}
                            hideInternalBack
                        />
                    )}
                </div>
            </div>

            {/* ── INFO & RELATED CONTENT SECTION ── */}
            <section className={`mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'
                }`}>
                <RelatedEpisodes
                    episodes={relatedEpisodes}
                    currentEpisodeId={normalizedEpisodeId}
                />

                {episode && (
                    <div className={`h-px bg-gradient-to-r my-5 sm:my-6 ${isDark ? 'from-[#2a1117]/60 via-[#2a1117]/30 to-transparent' : 'from-slate-200 via-slate-300/60 to-transparent'
                        }`} />
                )}

                {episode && (
                    <EpisodeInfo
                        episode={episode}
                        animeTitle={animeTitle}
                        selectedServer={selectedServer}
                    />
                )}

                {effectiveEpisode?.movies?.length > 0 && (
                    <>
                        <div className={`h-px my-5 sm:my-6 bg-gradient-to-r ${isDark ? 'from-[#2a1117]/60 via-[#2a1117]/30 to-transparent' : 'from-slate-200 via-slate-300/60 to-transparent'
                            }`} />
                        <RelatedMovies movies={effectiveEpisode.movies} />
                    </>
                )}

                {effectiveEpisode?.downloadFormats?.length > 0 && (
                    <div id="download-section">
                        <div className={`h-px my-5 sm:my-6 bg-gradient-to-r ${isDark ? 'from-[#2a1117]/60 via-[#2a1117]/30 to-transparent' : 'from-slate-200 via-slate-300/60 to-transparent'
                            }`} />
                        <DownloadSection formats={effectiveEpisode.downloadFormats} />
                    </div>
                )}

                {/* ── EPISODE DISCUSSION & COMMENTS ── */}
                {animeSlug && (
                    <div id="comments-section">
                        <div className={`h-px my-6 sm:my-8 bg-gradient-to-r ${isDark ? 'from-[#2a1117]/60 via-[#2a1117]/30 to-transparent' : 'from-slate-200 via-slate-300/60 to-transparent'}`} />
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-1 select-none">
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border ${isDark ? 'bg-gradient-to-br from-[#2a0a12] via-[#1a050a] to-[#0f0205] border-red-900/30 shadow-lg shadow-red-950/20' : 'bg-white border-slate-200 shadow-sm'}`}>
                                    <i className="fa-solid fa-comments text-sm text-[#ff1e56]" />
                                </div>
                                <div>
                                    <h3 className="font-display font-black text-sm sm:text-base tracking-tight uppercase">
                                        Diskusi & Komentar Penonton
                                    </h3>
                                    <p className={`text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Bahas keseruan episode ini bersama komunitas AnimeStream
                                    </p>
                                </div>
                            </div>
                            <CommentsTab commentsApi={commentsApi} />
                        </div>
                    </div>
                )}
            </section>

            {/* ── FLOATING SCROLL TO TOP / KE PEMUTAR BUTTON ── */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#ff1e56] to-[#c4143a] text-white font-bold text-xs shadow-[0_4px_25px_rgba(255,30,86,0.6)] border border-white/20 active:scale-95 transition-all cursor-pointer select-none"
                    title="Kembali ke atas / Pemutar Video"
                >
                    <i className="fa-solid fa-arrow-up text-xs" />
                    <span className="hidden sm:inline">Ke Pemutar</span>
                </motion.button>
            )}
        </div>
    );
}