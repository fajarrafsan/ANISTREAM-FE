import { memo } from "react";
import { getImageFilter } from "../hero/HeroStyle";

const PRESET_COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#10b981"];

export default memo(function HeroBackground({
    anime,
    index,
    currentSlide,
    isLoaded,
    isDark,
}) {
    const isActive = index === currentSlide;
    const color = PRESET_COLORS[index % 5];

    return (
        <div
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: isActive && isLoaded ? 1 : 0, zIndex: isActive ? 1 : 0, transition: 'opacity 1s ease, z-index 0s' }}
        >
            {/* Background image with Ken Burns effect */}
            <div className="absolute inset-0"
                style={{
                    animation: isActive
                        ? 'kenBurns 10s ease-in-out forwards'
                        : 'kenBurnsReverse 1s ease-in-out forwards',
                    animationDelay: isActive ? '0.5s' : '0s',
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, ${color}33 0%, ${color}11 30%, ${isDark ? '#0a0a14' : '#e8eaf0'} 70%)`,
                        backgroundSize: '200% 200%',
                        animation: isActive ? 'gradientShift 8s ease-in-out infinite' : 'none',
                    }}
                />
                <img
                    src={anime.banner || undefined}
                    alt=""
                    fetchPriority={isActive ? "high" : "low"}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        objectPosition: 'center center',
                        filter: getImageFilter(isDark),
                    }}
                    onError={(e) => { e.target.style.opacity = '0'; }}
                />
            </div>

            {/* Color mesh overlay - animated */}
            <div
                className="absolute inset-0 pointer-events-none z-2"
                style={{
                    background: `radial-gradient(ellipse at 30% 40%, ${color}33 0%, transparent 60%),
                                radial-gradient(ellipse at 70% 60%, ${color}1a 0%, transparent 50%)`,
                    mixBlendMode: isDark ? 'screen' : 'multiply',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 1s ease',
                }}
            />

            {/* Cinematic color grade overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-2 mix-blend-overlay"
                style={{
                    background: `linear-gradient(135deg, ${color}22 0%, transparent 40%, ${color}11 100%)`,
                    opacity: isActive ? 0.8 : 0,
                    transition: 'opacity 0.8s ease',
                }}
            />

            {/* Dramatic vignette - bottom with enhanced gradient */}
            <div
                className={`absolute inset-0 pointer-events-none z-3 ${isDark
                    ? "bg-linear-to-t from-[#070204] via-[#070204]/80 sm:via-[#070204]/40 via-30% to-transparent"
                    : "bg-linear-to-t from-white via-white/80 sm:via-white/40 via-30% to-transparent"
                }`}
            />

            {/* Left vignette for depth */}
            <div
                className="absolute inset-0 pointer-events-none z-3"
                style={{
                    background: isDark
                        ? 'linear-gradient(to right, rgba(5,5,8,0.6) 0%, transparent 40%)'
                        : 'linear-gradient(to right, rgba(248,249,250,0.3) 0%, transparent 40%)',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                }}
            />
        </div>
    );
});