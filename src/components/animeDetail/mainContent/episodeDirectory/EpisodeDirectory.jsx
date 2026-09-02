import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../../../context/ThemeContext";
import RangeFilter from "./RangeFilter";
import EpisodeCard from "./EpisodeCard";
import {
    episodeGridVariants,
    useMotionSafe,
    DETAIL_EASE,
} from "../../constants/animeDetailMotion";

const EPISODES_PER_PAGE = 6;

function extractEpisodeNumber(title) {
    if (!title) return 0;
    const match = title.match(/episode\s*(\d+)/i);
    if (match) return parseInt(match[1], 10);
    const fallbackMatch = title.match(/\d+/);
    if (fallbackMatch) return parseInt(fallbackMatch[0], 10);
    return 0;
}

function sortEpisodes(episodes, order = "asc") {
    return [...episodes].sort((a, b) => {
        const numA = extractEpisodeNumber(a.title);
        const numB = extractEpisodeNumber(b.title);
        return order === "asc" ? numA - numB : numB - numA;
    });
}

function buildRanges(episodes, order = "desc") {
    if (!episodes.length) return [];
    const ranges = [];
    for (let i = 0; i < episodes.length; i += 50) {
        ranges.push(`${i + 1}-${Math.min(i + 50, episodes.length)}`);
    }
    if (order === "desc") ranges.reverse();
    return ranges;
}

function getEpisodesForRange(episodesAsc, range) {
    const [start, end] = range.split("-").map(Number);
    return episodesAsc.slice(start - 1, end);
}

function getPaginationItems(page, totalPages) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return pages
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
            acc.push(p);
            return acc;
        }, []);
}

export default function EpisodeDirectory({
    episodes = [],
    poster,
    duration,
    activeRange,
    onRangeChange,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const reduced = useMotionSafe();

    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);

    const isFirstRender = useRef(true);
    const prevSortOrderRef = useRef(sortOrder);

    const sortedEpisodesAsc = useMemo(() => {
        const unique = [...new Map(
            episodes.map((ep, index) => [ep.slug ?? `${ep.title}-${index}`, ep])
        ).values()];
        return sortEpisodes(unique, "asc");
    }, [episodes]);

    const rangeOptions = useMemo(
        () => buildRanges(sortedEpisodesAsc, sortOrder),
        [sortedEpisodesAsc, sortOrder]
    );

    useEffect(() => {
        if (rangeOptions.length > 0) {
            const hasSortOrderChanged = prevSortOrderRef.current !== sortOrder;
            if (
                isFirstRender.current ||
                hasSortOrderChanged ||
                !activeRange ||
                !rangeOptions.includes(activeRange)
            ) {
                isFirstRender.current = false;
                prevSortOrderRef.current = sortOrder;
                onRangeChange(rangeOptions[0]);
            }
        }
    }, [rangeOptions, activeRange, sortOrder, onRangeChange]);

    useEffect(() => {
        setPage(1);
    }, [activeRange, sortOrder]);

    const rangeEpisodes = useMemo(() => {
        if (!activeRange) return [];
        const sliced = getEpisodesForRange(sortedEpisodesAsc, activeRange);
        return sortEpisodes(sliced, sortOrder);
    }, [sortedEpisodesAsc, activeRange, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(rangeEpisodes.length / EPISODES_PER_PAGE));

    const currentEpisodes = useMemo(() => {
        const start = (page - 1) * EPISODES_PER_PAGE;
        return rangeEpisodes.slice(start, start + EPISODES_PER_PAGE);
    }, [rangeEpisodes, page]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const borderClass = isDark ? "border-[#ff1e56]/10" : "border-slate-300";

    const navBtnBase =
        "min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 w-11 h-11 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center text-[10px] sm:text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation";

    const navBtnIdle = isDark
        ? "border-white/10 text-slate-400 hover:text-white hover:border-[#ff1e56]/50"
        : "border-slate-300 text-slate-400 hover:text-slate-700 hover:border-rose-400/50";

    const cardClass = `border p-4 sm:p-5 md:p-7 rounded-[28px] shadow-2xl space-y-4 sm:space-y-6 transition-colors duration-500 relative overflow-hidden backdrop-blur-xl ${isDark ? "bg-[#0b0406]/90 border-white/5" : "bg-white border-slate-200"
        }`;

    return (
        <div className={cardClass}>
            {/* Ambient inner glow */}
            {isDark && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff1e56]/10 blur-[80px] rounded-full pointer-events-none" />
            )}

            {/* Header */}
            <div
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b pb-4 sm:pb-5 ${borderClass}`}
            >
                <div className="space-y-1 sm:space-y-1.5">
                    <h3
                        className={`font-display text-sm sm:text-lg uppercase tracking-wider flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-800"
                            }`}
                    >
                        <span className="w-1 h-4 rounded-full bg-[#ff1e56] shadow-[0_0_8px_#ff1e56]" />
                        Episode
                    </h3>
                    <p className={`text-[10px] sm:text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        {rangeEpisodes.length} episode tersedia — klik untuk menonton
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                        className={`flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded-lg border text-[10px] sm:text-[11px] font-bold transition-all duration-200 select-none touch-manipulation ${isDark
                            ? "bg-white/[0.03] border-white/10 text-slate-300 hover:border-[#ff1e56]/40 hover:text-white"
                            : "bg-white border-slate-300 text-slate-600 hover:border-rose-300/60"
                            }`}
                        title={sortOrder === "desc" ? "Urutkan Terlama" : "Urutkan Terbaru"}
                    >
                        <i className={`fa-solid ${sortOrder === "desc" ? "fa-sort-amount-down" : "fa-sort-amount-up"} text-[#ff1e56] text-[10px]`} />
                        <span>{sortOrder === "desc" ? "Terbaru" : "Terlama"}</span>
                    </button>

                    {rangeOptions.length > 1 && (
                        <RangeFilter
                            rangeOptions={rangeOptions}
                            activeRange={activeRange}
                            onRangeChange={onRangeChange}
                        />
                    )}
                </div>
            </div>

            {/* Episode Grid */}
            <AnimatePresence mode="wait">
                {currentEpisodes.length > 0 ? (
                    <motion.div
                        key={`${page}-${sortOrder}-${activeRange}`}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4"
                        variants={reduced ? undefined : episodeGridVariants}
                        initial={reduced ? false : "hidden"}
                        animate={reduced ? false : "visible"}
                        exit={reduced ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: DETAIL_EASE }}
                    >
                        {currentEpisodes.map((episode, index) => (
                            <EpisodeCard
                                key={episode.slug ?? `${episode.title}-${index}`}
                                episode={episode}
                                poster={poster}
                                duration={duration}
                                reduced={reduced}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <p
                        className={`text-center text-[11px] sm:text-sm py-8 sm:py-10 ${isDark ? "text-slate-600" : "text-slate-400"
                            }`}
                    >
                        Belum ada episode tersedia
                    </p>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 sm:pt-4 border-t ${borderClass}`}
                >
                    <span className={`text-[10px] sm:text-xs text-center sm:text-left ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        Hal.{" "}
                        <span className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            {page}
                        </span>
                        {" / "}
                        {totalPages}
                    </span>

                    <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`${navBtnBase} ${navBtnIdle}`}
                            aria-label="Previous page"
                        >
                            <i className="fa-solid fa-chevron-left text-[9px] sm:text-xs" />
                        </button>

                        {getPaginationItems(page, totalPages).map((p, idx) =>
                            p === "..." ? (
                                <span
                                    key={`dot-${idx}`}
                                    className={`text-[10px] sm:text-xs px-1 select-none ${isDark ? "text-slate-600" : "text-slate-400"}`}
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`${navBtnBase} ${page === p
                                        ? "bg-[#ff1e56] border-[#ff1e56] text-white"
                                        : navBtnIdle
                                        }`}
                                    aria-label={`Page ${p}`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className={`${navBtnBase} ${navBtnIdle}`}
                            aria-label="Next page"
                        >
                            <i className="fa-solid fa-chevron-right text-[9px] sm:text-xs" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
