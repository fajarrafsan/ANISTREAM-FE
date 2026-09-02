export default function HeaderProgressBar({ scrollProgress, isDark }) {
    return (
        <div
            aria-hidden="true"
            className={`absolute bottom-0 left-0 w-full h-[2px] overflow-hidden pointer-events-none ${
                isDark ? "bg-white/[0.05]" : "bg-black/[0.05]"
            }`}
        >
            <div
                className="h-full w-full origin-left bg-linear-to-r from-red-600 via-red-500 to-red-400 will-change-transform"
                style={{ transform: `scaleX(${scrollProgress / 100})` }}
            />
        </div>
    );
}
