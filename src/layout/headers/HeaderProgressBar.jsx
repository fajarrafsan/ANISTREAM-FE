export default function HeaderProgressBar({ scrollProgress }) {
    return (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/[0.04] overflow-hidden pointer-events-none">
            <div
                className="h-full w-full origin-left bg-linear-to-r from-red-600 via-red-500 to-red-400 will-change-transform"
                style={{ transform: `scaleX(${scrollProgress / 100})` }}
            />
        </div>
    );
}
