import { useTheme } from '../../../context/ThemeContext';
import { formatTime } from '../../../utils/playerUtils';

export default function VideoControls({
    showControls,
    isPlaying,
    episode,
    episodeTitle,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    showSpeedMenu,
    isHoveringProgress,
    hoverTime,
    hoverPercent,
    progressPercent,
    bufferedPercent,
    isFullscreen,
    progressRef,
    togglePlay,
    skip,
    toggleMute,
    changeVolume,
    changeSpeed,
    handleSeek,
    handleProgressHover,
    setIsHoveringProgress,
    setShowSpeedMenu,
    toggleFullscreen,
    showVolume,
    setShowVolume,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const VolumeIcon =
        isMuted || volume === 0
            ? 'fa-volume-xmark'
            : volume < 0.5
                ? 'fa-volume-low'
                : 'fa-volume-high';

    return (
        <div
            className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } ${
                isDark
                    ? 'bg-gradient-to-t from-black/95 via-black/30 to-transparent'
                    : 'bg-gradient-to-t from-white/95 via-white/30 to-transparent'
            }`}
        >
            {/* Title */}
            <div className="absolute top-2 sm:top-16 left-2 sm:left-5 right-2 sm:right-5">
                <div className="flex items-center gap-2 sm:block">
                    <div
                        className={`hidden sm:inline-flex items-center gap-2 rounded-lg px-2 py-1 mb-2 border ${
                            isDark
                                ? 'bg-[#ff1e56]/10 border-[#ff1e56]/20'
                                : 'bg-rose-50 border-rose-200'
                        }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-pulse" />
                        <span className="text-[8px] sm:text-[9px] font-black text-[#ff1e56] tracking-wider uppercase">
                            Now Playing
                        </span>
                    </div>

                    <h2
                        className={`min-w-0 flex-1 truncate font-black leading-tight drop-shadow-lg ${
                            isDark ? 'text-white' : 'text-slate-900'
                        } text-[10px] sm:text-base md:text-lg`}
                    >
                        {episodeTitle}
                    </h2>
                </div>

                {episode?.animeTitle && (
                    <p
                        className={`hidden sm:block text-[10px] mt-1 truncate ${
                            isDark ? 'text-slate-500' : 'text-slate-500'
                        }`}
                    >
                        {episode.animeTitle}
                    </p>
                )}
            </div>

            {/* Progress bar */}
            <div className="px-2 sm:px-5 pb-1.5 sm:pb-2">
                <div className="relative h-4 sm:h-6 mb-0">
                    {isHoveringProgress && duration > 0 && (
                        <div
                            className={`absolute -top-7 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border pointer-events-none ${
                                isDark
                                    ? 'text-white bg-black/80 border-white/10 backdrop-blur-sm'
                                    : 'text-slate-800 bg-white border-slate-200 shadow-sm'
                            }`}
                            style={{ left: `${hoverPercent}%`, transform: 'translateX(-50%)' }}
                        >
                            {formatTime(hoverTime)}
                        </div>
                    )}
                </div>

                <div
                    ref={progressRef}
                    className={`relative w-full h-1 rounded-full cursor-pointer group/progress ${
                        isDark ? 'bg-[#2a1117]/40' : 'bg-slate-200'
                    }`}
                    onClick={handleSeek}
                    onMouseMove={handleProgressHover}
                    onMouseEnter={() => setIsHoveringProgress(true)}
                    onMouseLeave={() => setIsHoveringProgress(false)}
                >
                    {isHoveringProgress && (
                        <div
                            className={`absolute top-0 h-full rounded-full pointer-events-none ${
                                isDark ? 'bg-white/20' : 'bg-slate-400/20'
                            }`}
                            style={{ width: `${hoverPercent}%` }}
                        />
                    )}

                    <div
                        className={`absolute top-0 left-0 h-full rounded-full ${
                            isDark ? 'bg-[#2a1117]' : 'bg-slate-300'
                        }`}
                        style={{ width: `${bufferedPercent}%` }}
                    />

                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff1e56] via-[#ff4d79] to-[#ff1e56] rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />

                    <div
                        className="absolute top-0 h-full bg-[#ff1e56]/25 blur-sm rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />

                    <div
                        className="absolute top-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-red-500/40 opacity-0 group-hover/progress:opacity-100 transition-all duration-200"
                        style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#ff1e56] to-[#c4143a]" />
                    </div>
                </div>

                {/* Mobile time */}
                <div className="sm:hidden mt-1 text-center">
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        <span className={isDark ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>
                            {formatTime(currentTime)}
                        </span>
                        <span className={`mx-1 ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>/</span>
                        <span className={isDark ? 'text-slate-600' : 'text-slate-500'}>
                            {formatTime(duration)}
                        </span>
                    </span>
                </div>
            </div>

            {/* Controls bar */}
            <div className="flex items-center justify-between px-2 sm:px-5 pb-2 sm:pb-4 gap-2">
                {/* Left controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={togglePlay}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isDark
                                ? 'bg-white/10 hover:bg-[#ff1e56]/20 border-white/5 hover:border-[#ff1e56]/30'
                                : 'bg-white border-slate-200 hover:bg-rose-50 hover:border-rose-300'
                        }`}
                    >
                        <i
                            className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-[11px] transition-colors ${
                                isDark
                                    ? 'text-white'
                                    : 'text-slate-700'
                            } ${!isPlaying ? 'ml-0.5' : ''}`}
                        />
                    </button>

                    <button
                        onClick={() => skip(-10)}
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isDark
                                ? 'text-slate-500 hover:text-[#ff1e56] hover:bg-white/5'
                                : 'text-slate-500 hover:text-[#ff1e56] hover:bg-slate-100'
                        }`}
                        title="-10 detik"
                    >
                        <i className="fa-solid fa-rotate-left text-[10px]" />
                    </button>

                    <button
                        onClick={() => skip(10)}
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isDark
                                ? 'text-slate-500 hover:text-[#ff1e56] hover:bg-white/5'
                                : 'text-slate-500 hover:text-[#ff1e56] hover:bg-slate-100'
                        }`}
                        title="+10 detik"
                    >
                        <i className="fa-solid fa-rotate-right text-[10px]" />
                    </button>

                    {/* Volume only desktop */}
                    <div
                        className="hidden sm:flex items-center gap-1.5"
                        onMouseEnter={() => setShowVolume(true)}
                        onMouseLeave={() => setShowVolume(false)}
                    >
                        <button
                            onClick={toggleMute}
                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer ${
                                isDark
                                    ? 'text-slate-500 hover:text-[#ff1e56] hover:bg-white/5'
                                    : 'text-slate-500 hover:text-[#ff1e56] hover:bg-slate-100'
                            }`}
                        >
                            <i className={`fa-solid ${VolumeIcon} text-[10px]`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${showVolume ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}>
                            <div
                                className={`relative w-20 h-1 rounded-full ${
                                    isDark ? 'bg-[#2a1117]' : 'bg-slate-200'
                                }`}
                            >
                                <div
                                    className="absolute top-0 left-0 h-full bg-linear-to-r from-[#ff1e56] to-[#ff4d79] rounded-full"
                                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Time desktop */}
                    <span
                        className={`hidden md:block ml-1 text-[11px] font-mono ${
                            isDark ? 'text-slate-500' : 'text-slate-500'
                        }`}
                    >
                        <span className={isDark ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>
                            {formatTime(currentTime)}
                        </span>
                        <span className={`mx-1 ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>/</span>
                        <span className={isDark ? 'text-slate-600' : 'text-slate-500'}>
                            {formatTime(duration)}
                        </span>
                    </span>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1">
                    <div className="relative">
                        <button
                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer text-[10px] font-bold ${
                                isDark
                                    ? 'text-slate-500 hover:text-[#ff1e56] hover:bg-white/5'
                                    : 'text-slate-500 hover:text-[#ff1e56] hover:bg-slate-100'
                            }`}
                        >
                            {playbackRate}x
                        </button>

                        {showSpeedMenu && (
                            <div
                                className={`absolute bottom-full right-0 mb-2 backdrop-blur-xl border rounded-lg overflow-hidden shadow-2xl min-w-[72px] ${
                                    isDark
                                        ? 'bg-black/90 border-white/10'
                                        : 'bg-white border-slate-200 shadow-slate-200/60'
                                }`}
                            >
                                {speedOptions.map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={() => changeSpeed(rate)}
                                        className={`w-full px-2.5 py-1.5 text-[10px] font-bold text-left transition-colors ${
                                            playbackRate === rate
                                                ? 'bg-[#ff1e56]/20 text-[#ff1e56]'
                                                : isDark
                                                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={toggleFullscreen}
                        className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isDark
                                ? 'text-slate-500 hover:text-[#ff1e56] hover:bg-white/5'
                                : 'text-slate-500 hover:text-[#ff1e56] hover:bg-slate-100'
                        }`}
                    >
                        <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-[10px]`} />
                    </button>
                </div>
            </div>
        </div>
    );
}