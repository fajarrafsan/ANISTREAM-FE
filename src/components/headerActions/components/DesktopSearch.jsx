import { useRef } from "react";
import { Search, X } from "lucide-react";
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
        <div className="relative hidden w-44 shrink-0 md:block xl:w-[216px]" ref={desktopSearchRef}>
            <label
                className={`relative flex h-11 items-center gap-2.5 rounded-xl border pl-3 transition-[border-color,background-color,box-shadow] duration-200 ${
                    isFocused || isSearchOpen
                        ? isDark
                            ? "bg-white/[0.07] border-red-400/50 ring-2 ring-red-500/10"
                            : "bg-white border-red-500/50 ring-2 ring-red-500/10"
                        : isDark
                            ? "bg-white/[0.04] border-white/10 hover:border-white/20"
                            : "bg-zinc-100/80 border-zinc-200 hover:border-zinc-300"
                }`}
            >
                <Search
                    size={17}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className={`shrink-0 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                />
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
                    onBlur={() => setIsFocused(false)}
                    aria-label="Cari anime"
                    placeholder={searchLoading ? "Mencari..." : "Cari anime..."}
                    disabled={searchLoading}
                    className={`h-full w-full min-w-0 bg-transparent text-[13px] outline-none font-medium disabled:opacity-60 [&::-webkit-search-cancel-button]:appearance-none ${
                        searchQuery && !searchLoading ? "pr-11" : "pr-3"
                    } ${
                        isDark
                            ? "text-zinc-100 placeholder:text-zinc-400"
                            : "text-zinc-900 placeholder:text-zinc-500"
                    }`}
                />

                {searchQuery && !searchLoading && (
                    <button
                        type="button"
                        aria-label="Hapus pencarian"
                        onClick={() => {
                            setSearchQuery("");
                            inputRef.current?.focus();
                            openSearch();
                        }}
                        className={`absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-xl cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                            isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                        }`}
                    >
                        <X size={15} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                )}
            </label>

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
