import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

export default function RelatedHeader({
    episodesCount = 0,
    hasEpisodes = false,
    viewMode = "carousel",
    onViewModeChange,
    searchQuery = "",
    onSearchChange,
    onJumpToActive,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 px-1 select-none">
            {/* Left Info */}
            <div className="flex items-center gap-3 min-w-0">
                <div
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-lg overflow-hidden shrink-0 ${
                        isDark
                            ? "bg-gradient-to-br from-[#2a0a12] via-[#1a050a] to-[#0f0205] border-red-900/30 shadow-red-950/20"
                            : "bg-white border-slate-200 shadow-sm"
                    }`}
                >
                    <div
                        className={`absolute inset-0 rounded-xl animate-pulse ${
                            isDark ? "bg-[#ff1e56]/10" : "bg-rose-100/60"
                        }`}
                    />
                    <i className="fa-solid fa-list-ul text-sm text-[#ff1e56] relative z-10" />
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3
                            className={`font-display font-black text-sm sm:text-base tracking-tight uppercase leading-tight ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                        >
                            <span className="sm:hidden">Daftar Episode</span>
                            <span className="hidden sm:inline">Episode Terkait & Daftar Putar</span>
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ff1e56]/10 border border-[#ff1e56]/30 text-[#ff1e56]">
                            {episodesCount} EP
                        </span>
                    </div>
                    <p
                        className={`text-[10px] sm:text-[11px] font-medium mt-0.5 ${
                            isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                    >
                        {viewMode === "carousel" ? "Geser ke samping untuk memilih episode" : "Tampilan kotak semua episode"}
                    </p>
                </div>
            </div>

            {/* Right Controls: Search, Jump & View Switcher */}
            {hasEpisodes && (
                <div className="flex items-center flex-wrap gap-2 shrink-0 self-start sm:self-auto">
                    {/* Search / Filter input */}
                    {showSearch ? (
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                placeholder="Cari episode (cth: 12)..."
                                autoFocus
                                className={`h-8 px-3 pr-7 text-[11px] font-bold rounded-xl border outline-none transition-all w-36 sm:w-44 ${
                                    isDark
                                        ? "bg-[#140609] border-[#ff1e56]/40 text-white placeholder-slate-600 focus:border-[#ff1e56]"
                                        : "bg-white border-rose-300 text-slate-800 placeholder-slate-400 focus:border-rose-500"
                                }`}
                            />
                            <button
                                onClick={() => {
                                    onSearchChange?.("");
                                    setShowSearch(false);
                                }}
                                className="absolute right-2 text-[10px] opacity-60 hover:opacity-100 cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowSearch(true)}
                            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                searchQuery
                                    ? "bg-[#ff1e56]/20 border-[#ff1e56]/40 text-[#ff1e56]"
                                    : isDark
                                        ? "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                                        : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
                            }`}
                            title="Cari Episode"
                        >
                            <i className="fa-solid fa-magnifying-glass text-[10px]" />
                            <span className="hidden sm:inline">Cari Ep</span>
                        </button>
                    )}

                    {/* Quick Jump to Active Episode */}
                    {onJumpToActive && (
                        <button
                            onClick={onJumpToActive}
                            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                isDark
                                    ? "bg-white/[0.03] border-white/10 text-slate-300 hover:text-white hover:border-[#ff1e56]/40 hover:bg-[#ff1e56]/10"
                                    : "bg-white border-slate-200 text-slate-700 hover:text-rose-600 shadow-sm"
                            }`}
                            title="Lompat ke episode yang sedang diputar"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-ping" />
                            <span className="sm:hidden">Aktif</span>
                            <span className="hidden sm:inline">Sedang Nonton</span>
                        </button>
                    )}

                    {/* View Mode Toggle: Carousel vs Grid */}
                    {onViewModeChange && (
                        <div
                            className={`flex items-center p-0.5 rounded-xl border ${
                                isDark ? "bg-white/[0.02] border-white/10" : "bg-slate-100 border-slate-200"
                            }`}
                        >
                            <button
                                onClick={() => onViewModeChange("carousel")}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                    viewMode === "carousel"
                                        ? "bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white shadow-[0_0_10px_rgba(255,30,86,0.35)]"
                                        : isDark
                                            ? "text-slate-400 hover:text-white"
                                            : "text-slate-600 hover:text-slate-900"
                                }`}
                                title="Mode Karusel Geser"
                            >
                                <i className="fa-solid fa-grip-lines text-[9px]" />
                                <span className="hidden xs:inline">Karusel</span>
                            </button>

                            <button
                                onClick={() => onViewModeChange("grid")}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                    viewMode === "grid"
                                        ? "bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white shadow-[0_0_10px_rgba(255,30,86,0.35)]"
                                        : isDark
                                            ? "text-slate-400 hover:text-white"
                                            : "text-slate-600 hover:text-slate-900"
                                }`}
                                title="Mode Kotak Grid"
                            >
                                <i className="fa-solid fa-border-all text-[9px]" />
                                <span className="hidden xs:inline">Grid</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
