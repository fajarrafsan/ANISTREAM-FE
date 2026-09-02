export default function MovieCard({
    movie,
    index,
    isDark,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onClick,
}) {
    // Definisi gaya warna gelap/terang
    const cardOuterClass = isDark
        ? "bg-[#0f0508] border-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.35)] group-hover/movie:border-[#ff1e56]/45 group-hover/movie:shadow-[0_18px_50px_rgba(255,30,86,0.18)]"
        : "bg-white border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)] group-hover/movie:border-rose-300/80 group-hover/movie:shadow-[0_18px_40px_rgba(255,30,86,0.12)]";

    const titleClass = isDark
        ? "text-slate-300 group-hover/movie:text-white"
        : "text-slate-700 group-hover/movie:text-slate-900";

    const badgeClass = isDark
        ? "bg-[#1e0a10] text-[#ff1e56]/80 border-red-950/30 group-hover/movie:border-red-900/50 group-hover/movie:text-[#ff1e56]"
        : "bg-rose-50 text-rose-500 border-rose-200 group-hover/movie:border-rose-300 group-hover/movie:text-rose-600";

    return (
        <div
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`flex-none group/movie cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isHovered ? "scale-105 z-10 relative" : "scale-100 z-1 relative"
            }`}
            style={{ width: "clamp(8.75rem, 42vw, 12rem)" }}
        >
            {/* Poster Card */}
            <div
                className={`relative w-full aspect-2/3 rounded-2xl overflow-hidden border transition-all duration-500 ${cardOuterClass}`}
            >
                {/* Diagonal Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.12] to-transparent opacity-0 group-hover/movie:opacity-100 transition-opacity duration-700 z-15 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-start justify-between gap-1.5">
                    {movie.rating ? (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white text-[7px] sm:text-[8px] font-black px-2 py-0.5 rounded-md tracking-wider shadow-lg shadow-orange-500/20 backdrop-blur-sm">
                            <i className="fa-solid fa-star text-[6px]" />
                            {movie.rating}
                        </span>
                    ) : (
                        <span />
                    )}

                    {movie.status && (
                        <span
                            className={`backdrop-blur-md text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded-md border ${
                                isDark
                                    ? "bg-black/70 border-white/[0.08] text-white"
                                    : "bg-white/90 border-slate-200/60 text-slate-700"
                            }`}
                        >
                            {movie.status}
                        </span>
                    )}
                </div>

                {/* Poster Image */}
                {movie.poster ? (
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className={`w-full h-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isHovered
                                ? "scale-105 brightness-75 contrast-[1.03]"
                                : "group-hover/movie:scale-[1.08] group-hover/movie:brightness-75 group-hover/movie:contrast-[1.02]"
                        }`}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className={`w-full h-full flex items-center justify-center ${
                            isDark
                                ? "bg-gradient-to-br from-[#1a0a0f] to-[#0d0407]"
                                : "bg-gradient-to-br from-slate-50 to-slate-100"
                        }`}
                    >
                        <i className={`fa-solid fa-film text-xl sm:text-2xl ${isDark ? "text-slate-700" : "text-slate-300"}`} />
                    </div>
                )}

                {/* Bottom Overlay Gradient */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                        isDark
                            ? "from-neutral-950 via-neutral-900/30 to-transparent opacity-85 group-hover/movie:opacity-100"
                            : "from-white/95 via-white/20 to-transparent opacity-65 group-hover/movie:opacity-85"
                    }`}
                />

                {/* Release Date */}
                <div
                    className={`absolute bottom-2 right-2 backdrop-blur-sm text-[7px] sm:text-[8px] font-mono font-black px-1.5 py-0.5 rounded-md z-10 border ${
                        isDark
                            ? "bg-black/60 text-slate-300 border-white/5"
                            : "bg-white/80 text-slate-600 border-slate-200"
                    }`}
                >
                    {movie.releaseDate}
                </div>

                {/* Center Play/Info Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/movie:opacity-100 transition-all duration-500 scale-50 group-hover/movie:scale-100 z-10">
                    <div className="relative group/play">
                        <div className="absolute inset-0 w-10 h-10 rounded-full bg-[#ff1e56]/30 blur-md group-hover/play:scale-135 transition-transform duration-500 animate-pulse" />
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#ff1e56] to-[#c4143a] flex items-center justify-center shadow-[0_0_30px_rgba(255,30,86,0.4)] group-hover/movie:shadow-[0_0_50px_rgba(255,30,86,0.6)] transition-shadow duration-500">
                            <i className="fa-solid fa-circle-info text-white text-xs" />
                        </div>
                    </div>
                </div>

                {/* Watermark Index */}
                <div className="absolute bottom-1 left-2 text-4xl sm:text-5xl font-black text-white/[0.035] z-5 select-none pointer-events-none leading-none">
                    {String(index + 1).padStart(2, "0")}
                </div>
            </div>

            {/* Metadata (Title & Genres) */}
            <div className="mt-2.5 px-0.5">
                <h4
                    className={`font-black text-[10px] sm:text-xs transition-colors duration-300 truncate leading-snug ${titleClass}`}
                >
                    {movie.title}
                </h4>

                {movie.genreList?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {movie.genreList.slice(0, 2).map((g) => (
                            <span
                                key={g.genreId}
                                className={`text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-md border transition-all duration-300 ${badgeClass}`}
                            >
                                {g.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}