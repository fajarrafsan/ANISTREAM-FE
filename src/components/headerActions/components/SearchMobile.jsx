import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
    }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!mobileSearchOpen) {
        return (
            <div className="md:hidden" ref={mobileSearchRef}>
                <button
                    type="button"
                    onClick={() => setMobileSearchOpen(true)}
                    className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold cursor-pointer ${
                        isDark
                            ? "bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08]"
                            : "bg-black/[0.03] border-black/[0.08] text-gray-700 hover:bg-black/[0.05]"
                    }`}
                >
                    Cari
                </button>
            </div>
        );
    }

    return (
        <div
            className="relative md:hidden flex items-center flex-1 min-w-0 z-50"
            ref={mobileSearchRef}
        >
            <div
                className={`flex items-center w-full rounded-full border px-3 py-1.5 gap-2 ${
                    isDark
                        ? "bg-zinc-900 border-zinc-700"
                        : "bg-white border-zinc-300"
                }`}
            >
                <input
                    ref={inputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={searchLoading ? "Mencari..." : "Cari anime..."}
                    disabled={searchLoading}
                    className={`bg-transparent text-xs outline-none flex-1 min-w-0 font-medium ${
                        isDark ? "text-white placeholder:text-white/40" : "text-zinc-900 placeholder:text-gray-400"
                    }`}
                />
                <button
                    type="button"
                    onClick={onCloseMobileSearch}
                    className={`shrink-0 text-[10px] font-semibold cursor-pointer ${
                        isDark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                    Tutup
                </button>
            </div>

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
