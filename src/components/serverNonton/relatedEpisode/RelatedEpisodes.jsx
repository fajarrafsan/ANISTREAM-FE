import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import RelatedHeader from "./RelatedHeader";
import EpisodeCard from "./EpisodeCard";
import ScrollPaddles from "./ScrollPaddles";
import useEpisodeScroll from "./hooks/useEpisodeScroll";
import useActiveEpisode from "./hooks/useActiveEpisode";

export default function RelatedEpisodes({ episodes = [], currentEpisodeId }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const location = useLocation();
    const pathSegment = location.pathname.split("/episode/")[1] || "";
    const effectiveEpisodeId = currentEpisodeId || pathSegment;

    const [viewMode, setViewMode] = useState("carousel");
    const [searchQuery, setSearchQuery] = useState("");
    const { activeIndex, handleEpisodeClick } = useActiveEpisode(episodes, effectiveEpisodeId);
    const { scrollRef, canScrollLeft, canScrollRight, scrollBy } = useEpisodeScroll(episodes, effectiveEpisodeId);

    const hasEpisodes = episodes.length > 0;

    // Filter episodes by search query (e.g. number or title)
    const displayedEpisodes = useMemo(() => {
        if (!searchQuery.trim()) return episodes;
        const q = searchQuery.toLowerCase().trim();
        return episodes.filter((ep) => (ep.title || "").toLowerCase().includes(q));
    }, [episodes, searchQuery]);

    const handleJumpToActive = () => {
        if (viewMode === "grid") {
            const activeCard = document.querySelector('[data-active="true"]');
            if (activeCard) {
                activeCard.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            const container = scrollRef.current;
            if (container) {
                const activeCard = container.querySelector('[data-active="true"]');
                if (activeCard) {
                    activeCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                }
            }
        }
    };

    return (
        <div className="relative group">
            {/* Ambient Background Aura */}
            {isDark && (
                <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-30 bg-gradient-to-br from-[#ff1e56]/15 via-transparent to-transparent pointer-events-none" />
            )}

            {/* Luxury Glassmorphic Chassis Container */}
            <div
                className={`relative overflow-hidden transition-all duration-500 rounded-2xl sm:rounded-3xl border shadow-2xl backdrop-blur-xl p-3.5 xs:p-4 sm:p-6 md:p-7 ${
                    isDark
                        ? "bg-[#0b0406]/90 border-white/5 shadow-2xl"
                        : "bg-white/95 border-slate-200 shadow-xl"
                }`}
            >
                {/* Header Controls */}
                <RelatedHeader
                    episodesCount={episodes.length}
                    hasEpisodes={hasEpisodes}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onJumpToActive={activeIndex >= 0 ? handleJumpToActive : undefined}
                />

                {/* Content: Carousel Mode or Grid Mode */}
                {viewMode === "carousel" ? (
                    <div className="relative">
                        <ScrollPaddles
                            canScrollLeft={canScrollLeft}
                            canScrollRight={canScrollRight}
                            onScroll={scrollBy}
                        />

                        <div
                            ref={scrollRef}
                            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide py-3 sm:py-4 px-2 sm:px-3"
                            style={{
                                scrollbarWidth: "none",
                                scrollSnapType: "x mandatory",
                                scrollBehavior: "smooth",
                            }}
                        >
                            {displayedEpisodes.length > 0 ? (
                                displayedEpisodes.map((ep, index) => {
                                    const originalIndex = episodes.indexOf(ep);
                                    return (
                                        <div
                                            key={`${ep.episodeId || ep.slug || index}-${index}`}
                                            style={{ scrollSnapAlign: "start", flexShrink: 0 }}
                                        >
                                            <EpisodeCard
                                                ep={ep}
                                                index={originalIndex >= 0 ? originalIndex : index}
                                                isActive={originalIndex === activeIndex}
                                                handleEpisodeClick={handleEpisodeClick}
                                                isGrid={false}
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="w-full py-8 text-center text-xs opacity-60">
                                    Tidak ada episode yang cocok dengan pencarian "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Grid Mode View */
                    <div className="pt-2">
                        {displayedEpisodes.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                {displayedEpisodes.map((ep, index) => {
                                    const originalIndex = episodes.indexOf(ep);
                                    return (
                                        <EpisodeCard
                                            key={`${ep.episodeId || ep.slug || index}-${index}`}
                                            ep={ep}
                                            index={originalIndex >= 0 ? originalIndex : index}
                                            isActive={originalIndex === activeIndex}
                                            handleEpisodeClick={handleEpisodeClick}
                                            isGrid={true}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="w-full py-8 text-center text-xs opacity-60">
                                Tidak ada episode yang cocok dengan pencarian "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
