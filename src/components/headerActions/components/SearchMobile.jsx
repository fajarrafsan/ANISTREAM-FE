import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
import SearchModal from "../../searchModal";

export default function MobileSearch({
    isDark,
    searchQuery,
    setSearchQuery,
    searchLoading,
    onSubmit,
    onKeyDown,
    onCloseMobileSearch,
    isSearchOpen,
    searchResults,
    searchPhase,
    openSearch,
    mobileSearchOpen,
    setMobileSearchOpen,
}) {
    const mobileSearchRef = useRef(null);
    const inputRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (!mobileSearchOpen) return;
        const timer = setTimeout(() => {
            inputRef.current?.focus();
            openSearch();
        }, 100);
        return () => clearTimeout(timer);
    }, [mobileSearchOpen, openSearch]);

    useEffect(() => {
        onCloseMobileSearch();
    }, [location.pathname, onCloseMobileSearch]);

    if (!mobileSearchOpen) {
        return (
            <div className="shrink-0 md:hidden" ref={mobileSearchRef}>
                <button
                    type="button"
                    aria-label="Buka pencarian anime"
                    onClick={() => setMobileSearchOpen(true)}
                    className={`grid size-11 place-items-center rounded-xl border cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                        isDark
                            ? "bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-white/[0.08] hover:text-white focus-visible:ring-offset-zinc-950"
                            : "bg-white/80 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-offset-white"
                    }`}
                >
                    <Search size={19} strokeWidth={1.8} aria-hidden="true" />
                </button>
            </div>
        );
    }

    return (
        <div
            className="relative z-50 flex min-w-0 flex-1 items-center gap-2 md:hidden"
            ref={mobileSearchRef}
        >
            <label
                className={`relative z-50 flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl border px-3 ring-2 ring-red-500/10 ${
                    isDark
                        ? "bg-white/[0.06] border-red-400/50"
                        : "bg-white border-red-500/50"
                }`}
            >
                <Search size={18} strokeWidth={1.8} aria-hidden="true" className={`shrink-0 ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
                <input
                    ref={inputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    aria-label="Cari anime"
                    placeholder={searchLoading ? "Mencari..." : "Cari anime..."}
                    disabled={searchLoading}
                    className={`h-full min-w-0 flex-1 bg-transparent text-base font-medium outline-none disabled:opacity-60 [&::-webkit-search-cancel-button]:appearance-none ${
                        isDark ? "text-white placeholder:text-zinc-400" : "text-zinc-900 placeholder:text-zinc-500"
                    }`}
                />
            </label>
            <button
                type="button"
                aria-label="Tutup pencarian"
                onClick={onCloseMobileSearch}
                className={`relative z-50 grid size-11 shrink-0 place-items-center rounded-xl border cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    isDark
                        ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                        : "border-zinc-200 bg-white/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
            >
                <X size={19} strokeWidth={1.8} aria-hidden="true" />
            </button>

            <SearchModal
                isOpen={isSearchOpen}
                results={searchResults}
                query={searchQuery}
                phase={searchPhase}
                onClose={onCloseMobileSearch}
                anchorRef={mobileSearchRef}
                isDark={isDark}
                onSubmit={onSubmit}
                searchLoading={searchLoading}
                isMobile
            />
        </div>
    );
}
