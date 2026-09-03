export default function BatchSkeletonBlock({ isDark, className = "", children }) {
    return (
        <div aria-hidden="true" className={`relative isolate max-w-full overflow-hidden rounded-md ${isDark ? "bg-white/[0.07]" : "bg-zinc-200/70"} ${className}`}>
            {children}
            <span className={`pointer-events-none absolute inset-0 bg-linear-to-r from-transparent to-transparent motion-safe:animate-[shimmer-sweep_2.4s_ease-in-out_infinite] motion-reduce:hidden ${isDark ? "via-white/[0.08]" : "via-white/60"}`} />
        </div>
    );
}
