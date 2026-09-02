/* eslint-disable no-self-assign */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import ServerSelector from './ServerSelector';
import VideoControls from './VideoControls';
import { isDirectVideoUrl, isEmbeddableUrl, findDefaultServer } from '../../../utils/playerUtils';
import {
    IframeLoadingState,
    IframeErrorState,
    BlockedState,
    EmptyState,
    NextEpisodeOverlay,
    BufferingOverlay,
    ServerLoadingOverlay
} from './PlayerOverlays';

export default function VideoPlayer({
    episode,
    activeStreamUrl,
    selectedServer,
    serverLoading,
    onChangeServer,
    hideInternalBack = false,
}) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showVolume, setShowVolume] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isHoveringProgress, setIsHoveringProgress] = useState(false);
    const [hoverTime, setHoverTime] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showNextEp, setShowNextEp] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const progressRef = useRef(null);
    const iframeRef = useRef(null);

    // Flag — auto-fetch server hanya sekali per episode
    const hasAutoFetched = useRef(false);

    const availableServers = episode?.servers ?? [];
    const isDirect = isDirectVideoUrl(activeStreamUrl);
    const isEmbeddable = !isDirect && isEmbeddableUrl(activeStreamUrl);
    const isBlocked = !isDirect && activeStreamUrl && !isEmbeddable;

    const shellClass = isDark
        ? "bg-[#0a0305] text-white"
        : "bg-white text-slate-900";

    // Reset flag auto-fetch saat episode berganti
    useEffect(() => {
        hasAutoFetched.current = false;
    }, [episode?.animeId]);

    // Reset iframe state saat URL berubah
    useEffect(() => {
        setIframeError(false);
        setIframeLoaded(false);
    }, [activeStreamUrl]);

    // Auto-pilih server default — hanya sekali per episode, tidak loop
    useEffect(() => {
        if (hasAutoFetched.current) return;
        if (!episode?.animeId || !availableServers.length || selectedServer) return;

        const def = findDefaultServer(availableServers);
        if (def) {
            hasAutoFetched.current = true; // tandai sudah fetch
            onChangeServer(def.serverId, def.resolution, def.name);
        }
    }, [episode?.animeId]); // hanya dependency stabil

    // Reset state video saat URL berubah
    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setIsBuffering(false);
        setShowSpeedMenu(false);
    }, [activeStreamUrl]);

    // Auto-focus container agar shortcut keyboard langsung aktif saat video diputar
    useEffect(() => {
        if (isPlaying && containerRef.current) {
            containerRef.current.focus();
        }
    }, [isPlaying]);

    // ── Helpers ───────────────────────────────────────────────────────
    const togglePlay = useCallback(() => {
        if (!videoRef.current) return;
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play();
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    }, [isMuted]);

    const changeVolume = useCallback((val) => {
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            videoRef.current.muted = val === 0;
            setIsMuted(val === 0);
        }
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
        else document.exitFullscreen();
    }, []);

    const skip = useCallback((sec) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = Math.max(
            0,
            Math.min(duration, videoRef.current.currentTime + sec)
        );
    }, [duration]);

    const changeSpeed = useCallback((rate) => {
        setPlaybackRate(rate);
        if (videoRef.current) videoRef.current.playbackRate = rate;
        setShowSpeedMenu(false);
    }, []);

    const handleSeek = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (videoRef.current) {
            videoRef.current.currentTime = percent * duration;
            setCurrentTime(percent * duration);
        }
    }, [duration]);

    const handleProgressHover = useCallback((e) => {
        if (!progressRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setHoverTime(percent * duration);
    }, [duration]);

    // handleServerClick — skip kalau server sama
    const handleServerClick = useCallback(async (serverId, resolution, serverName) => {
        if (serverLoading) return;
        if (selectedServer?.serverId === serverId) return; // tidak re-fetch server yang sama
        setShowSpeedMenu(false);
        await onChangeServer(serverId, resolution, serverName);
    }, [serverLoading, selectedServer?.serverId, onChangeServer]);

    // ── MURNI REACT: Handler Auto-hide Controls ──
    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 4000);
    }, [isPlaying]);

    // ── MURNI REACT: Keyboard shortcuts ──
    const handleKeyDown = useCallback((e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        switch (e.key) {
            case ' ': case 'k': e.preventDefault(); togglePlay(); break;
            case 'ArrowRight': e.preventDefault(); skip(10); break;
            case 'ArrowLeft': e.preventDefault(); skip(-10); break;
            case 'ArrowUp': e.preventDefault(); changeVolume(Math.min(1, volume + 0.1)); break;
            case 'ArrowDown': e.preventDefault(); changeVolume(Math.max(0, volume - 0.1)); break;
            case 'm': e.preventDefault(); toggleMute(); break;
            case 'f': e.preventDefault(); toggleFullscreen(); break;
            default: break;
        }
    }, [isPlaying, volume, duration, isMuted, togglePlay, skip, changeVolume, toggleMute, toggleFullscreen]);

    // ── Kalkulasi progress ────────────────────────────────────────────
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration ? Math.min(progressPercent + 15, 100) : 0;
    const hoverPercent = duration ? (hoverTime / duration) * 100 : 0;
    const episodeTitle = episode?.title ?? 'Episode';
    const nextEpisode = episode?.nextEpisode;

    // ── Iframe handlers ───────────────────────────────────────────────
    const handleIframeLoad = () => { setIframeLoaded(true); setIframeError(false); };
    const handleIframeError = () => { setIframeError(true); setIframeLoaded(false); };
    const reloadIframe = () => {
        setIframeError(false);
        setIframeLoaded(false);
        if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
    };

    return (
        <div className={`w-full transition-colors duration-300 ${shellClass}`}>

            {/* Top Bar */}
            {!hideInternalBack && (
                <div className="mt-3 sm:mt-6 mb-2.5 sm:mb-4 px-3 sm:px-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <button
                            onClick={() => {
                                if (episode?.animeId) navigate(`/anime/detail/${episode.animeId}`);
                                else navigate(-1);
                            }}
                            className={`group inline-flex items-center gap-1.5 sm:gap-2.5 backdrop-blur-xl border rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 transition-all duration-300 cursor-pointer w-fit ${isDark
                                ? "bg-black/60 border-white/10 hover:border-[#ff1e56]/30 hover:bg-black/80"
                                : "bg-white/90 border-slate-200 hover:border-rose-300/60 hover:bg-white shadow-sm"
                                }`}
                            title="Kembali ke Detail Anime"
                        >
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center transition-colors ${isDark
                                ? "bg-white/5 group-hover:bg-[#ff1e56]/10"
                                : "bg-slate-100 group-hover:bg-rose-100"
                                }`}>
                                <i className={`fa-solid fa-arrow-left text-[9px] sm:text-[10px] transition-colors ${isDark
                                    ? "text-slate-400 group-hover:text-[#ff1e56]"
                                    : "text-slate-500 group-hover:text-rose-600"
                                    }`} />
                            </div>
                            <span className={`text-[10px] sm:text-[11px] font-bold transition-colors ${isDark
                                ? "text-slate-300 group-hover:text-white"
                                : "text-slate-600 group-hover:text-slate-900"
                                }`}>
                                Detail Anime
                            </span>
                        </button>

                        <div className="hidden sm:block text-right">
                            <p className={`text-[11px] font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                {episodeTitle}
                            </p>
                            <p className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                Gunakan tombol ini untuk kembali ke halaman sebelumnya
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Area */}
            <div
                ref={containerRef}
                tabIndex={0} // Memungkinkan kontainer menerima fokus keyboard untuk shortcut keydown
                onKeyDown={handleKeyDown}
                onMouseMove={handleMouseMove}
                onFullScreenChange={() => setIsFullscreen(!!document.fullscreenElement)}
                className={`relative w-full aspect-video max-h-[72vh] sm:max-h-[85vh] overflow-hidden group/player border-b outline-none focus:outline-none ${isDark
                    ? "bg-[#0a0305] border-[#2a1117]"
                    : "bg-white border-slate-200 shadow-sm"
                    }`}
                onDoubleClick={isDirect ? toggleFullscreen : undefined}
            >
                {/* Ambient glow */}
                <div className={`absolute -inset-20 blur-3xl pointer-events-none animate-pulse ${isDark
                    ? "bg-linear-to-b from-red-900/5 via-transparent to-red-900/5"
                    : "bg-linear-to-b from-rose-200/20 via-transparent to-rose-100/20"
                    }`} />

                {/* Corner frames */}
                {['top-0 left-0 border-l-2 border-t-2 rounded-tl-lg',
                    'top-0 right-0 border-r-2 border-t-2 rounded-tr-lg',
                    'bottom-0 left-0 border-l-2 border-b-2 rounded-bl-lg',
                    'bottom-0 right-0 border-r-2 border-b-2 rounded-br-lg'
                ].map((pos, i) => (
                    <div key={i} className={`absolute w-8 h-8 pointer-events-none z-20 ${pos} ${isDark ? "border-[#ff1e56]/15" : "border-rose-300/40"
                        }`} />
                ))}

                {/* Player */}
                {activeStreamUrl ? (
                    isDirect ? (
                        <video
                            ref={videoRef}
                            className="w-full h-full object-contain"
                            poster={episode?.poster}
                            src={activeStreamUrl}
                            playsInline
                            onClick={togglePlay}
                            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                            onLoadedMetadata={(e) => setDuration(e.target.duration)}
                            onEnded={() => { setIsPlaying(false); if (nextEpisode) setShowNextEp(true); }}
                            onWaiting={() => setIsBuffering(true)}
                            onCanPlay={() => setIsBuffering(false)}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                    ) : isEmbeddable ? (
                        <>
                            {!iframeLoaded && !iframeError && <IframeLoadingState />}
                            {iframeError ? (
                                <IframeErrorState
                                    activeStreamUrl={activeStreamUrl}
                                    reloadIframe={reloadIframe}
                                />
                            ) : (
                                <iframe
                                    ref={iframeRef}
                                    key={activeStreamUrl}
                                    src={activeStreamUrl}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture; web-share"
                                    sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                                    title={episodeTitle}
                                    onLoad={handleIframeLoad}
                                    onError={handleIframeError}
                                    loading="eager"
                                />
                            )}
                        </>
                    ) : (
                        <BlockedState activeStreamUrl={activeStreamUrl} />
                    )
                ) : (
                    <EmptyState />
                )}

                {/* Overlays */}
                {isBuffering && isDirect && <BufferingOverlay />}
                {serverLoading && <ServerLoadingOverlay />}
                {showNextEp && nextEpisode && (
                    <NextEpisodeOverlay
                        nextEpisode={nextEpisode}
                        onNavigate={navigate}
                        onClose={() => setShowNextEp(false)}
                    />
                )}

                {/* Controls — hanya untuk native video */}
                {isDirect && (
                    <VideoControls
                        showControls={showControls}
                        isPlaying={isPlaying}
                        episode={episode}
                        episodeTitle={episodeTitle}
                        currentTime={currentTime}
                        duration={duration}
                        volume={volume}
                        isMuted={isMuted}
                        playbackRate={playbackRate}
                        showSpeedMenu={showSpeedMenu}
                        isHoveringProgress={isHoveringProgress}
                        hoverTime={hoverTime}
                        hoverPercent={hoverPercent}
                        progressPercent={progressPercent}
                        bufferedPercent={bufferedPercent}
                        isFullscreen={isFullscreen}
                        progressRef={progressRef}
                        togglePlay={togglePlay}
                        skip={skip}
                        toggleMute={toggleMute}
                        changeVolume={changeVolume}
                        changeSpeed={changeSpeed}
                        handleSeek={handleSeek}
                        handleProgressHover={handleProgressHover}
                        setIsHoveringProgress={setIsHoveringProgress}
                        setShowSpeedMenu={setShowSpeedMenu}
                        toggleFullscreen={toggleFullscreen}
                        showVolume={showVolume}
                        setShowVolume={setShowVolume}
                    />
                )}
            </div>

            {/* Server selector */}
            <ServerSelector
                availableServers={availableServers}
                selectedServer={selectedServer}
                serverLoading={serverLoading}
                isBlocked={isBlocked}
                handleServerClick={handleServerClick}
            />
        </div>
    );
}