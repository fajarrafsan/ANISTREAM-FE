import { useRef } from "react";
import SearchModal from "../../searchModal";

export default function DesktopSearch({
    isDark,
    searchQuery,
    setSearchQuery,
    isFocused,
    setIsFocused,
    searchLoading,
    onKeyDown,
    isSearchOpen,
    searchResults,
    searchPhase,
    openSearch,
    onClose,
    onSubmit,
}) {
    const desktopSearchRef = useRef(null);
    const inputRef = useRef(null);

    return (
        <div className="relative hidden md:block" ref={desktopSearchRef}>
            <div
                className={`flex items-center rounded-full px-4 py-2 border transition-[border-color,background-color,box-shadow] duration-300 ${
                    isFocused || isSearchOpen
                        ? isDark
                            ? "bg-white/[0.07] border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                            : "bg-white border-red-400/50 shadow-[0_0_16px_rgba(239,68,68,0.1)]"
                        : isDark
                            ? "bg-white/[0.04] border-white/[0.08] hover:border-white/[0.14]"
                            : "bg-white/80 border-black/[0.08] hover:border-black/[0.14]"
                }`}
            >
                <input
                    ref={inputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => {
                        setIsFocused(true);
                        openSearch();
                    }}
                    placeholder={searchLoading ? "Mencari..." : "Cari anime..."}
                    disabled={searchLoading}
                    className={`bg-transparent text-sm outline-none w-36 focus:w-52 transition-[width] duration-300 font-medium disabled:opacity-60 ${
                        isDark
                            ? "text-white placeholder:text-white/35"
                            : "text-gray-900 placeholder:text-gray-400"
                    }`}
                />

                {searchQuery && !searchLoading && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            inputRef.current?.focus();
                            openSearch();
                        }}
                        className={`ml-2 text-[10px] font-semibold shrink-0 cursor-pointer ${
                            isDark ? "text-white/40 hover:text-white/70" : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        Hapus
                    </button>
                )}
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                results={searchResults}
                query={searchQuery}
                phase={searchPhase}
                onClose={onClose}
                anchorRef={desktopSearchRef}
                isDark={isDark}
                onSubmit={onSubmit}
                searchLoading={searchLoading}
            />
        </div>
    );
}
