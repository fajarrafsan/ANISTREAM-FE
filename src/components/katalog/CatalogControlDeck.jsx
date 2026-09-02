import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function CatalogControlDeck({
    selectedGenre, setSelectedGenre,
    activeStatus, setActiveStatus,
    handleResetFilters,
    genreOptions = [],
    statusOptions = [],
    onApply,
    order, setOrder,
    orderOptions = [],
    showOrder = false,
    setPage,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [isOpen, setIsOpen] = useState(false);

    const activeFilterCount = (selectedGenre ? 1 : 0) + (activeStatus ? 1 : 0);

    const filteredStatusOptions = statusOptions;

    const handleApplyAndClose = () => {
        onApply();
        setIsOpen(false);
    };

    // Top popular genres for quick 1-click filtering
    const popularGenres = genreOptions.slice(0, 8);

    return (
        <div className="w-full flex flex-col gap-3 mb-6 relative">
            {/* Top decorative line */}
            <div
                className={`absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-slate-200'
                    } to-transparent`}
            />

            {/* Quick Popular Genre Chips (Horizontal Scroll on Mobile) */}
            {genreOptions.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide pt-1" style={{ scrollbarWidth: 'none' }}>
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider shrink-0 mr-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Genre:
                    </span>
                    <button
                        onClick={() => {
                            setSelectedGenre('');
                            onApply();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 transition-all duration-200 cursor-pointer border ${
                            !selectedGenre
                                ? 'bg-[#ff1e56] text-white border-[#ff1e56] shadow-[0_0_12px_rgba(255,30,86,0.35)]'
                                : isDark
                                    ? 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                        }`}
                    >
                        Semua
                    </button>
                    {popularGenres.map((g) => {
                        const isSel = selectedGenre === g.genreId;
                        return (
                            <button
                                key={g.genreId}
                                onClick={() => {
                                    setSelectedGenre(isSel ? '' : g.genreId);
                                    setTimeout(() => onApply(), 50);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 transition-all duration-200 cursor-pointer border ${
                                    isSel
                                        ? 'bg-[#ff1e56] text-white border-[#ff1e56] shadow-[0_0_12px_rgba(255,30,86,0.35)]'
                                        : isDark
                                            ? 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                                }`}
                            >
                                {g.title}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 w-full">
                {/* Left: Filter Toggle & Reset */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 select-none overflow-hidden group w-full sm:w-auto cursor-pointer
                            ${isOpen
                                ? isDark
                                    ? 'bg-gradient-to-r from-[#ff1e56] to-rose-600 border-transparent text-white shadow-[0_4px_18px_rgba(255,30,86,0.35)]'
                                    : 'bg-slate-900 border-transparent text-white shadow-lg'
                                : isDark
                                    ? 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-[#ff1e56]/30 hover:text-white hover:bg-white/[0.06]'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <i className={`fa-solid ${isOpen ? "fa-circle-chevron-up" : "fa-sliders"} text-[10px] text-[#ff1e56]`} />
                        <span>Filter Lengkap</span>
                        {activeFilterCount > 0 && (
                            <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ml-1
                                    ${isOpen
                                        ? "bg-white/20 text-white"
                                        : "bg-[#ff1e56] text-white"
                                    }`}
                            >
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={handleResetFilters}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] sm:text-[11px] font-bold transition-all duration-200 w-full sm:w-auto cursor-pointer
                                ${isDark
                                    ? 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-red-900/40 hover:text-white'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                                }`}
                        >
                            <i className="fa-solid fa-rotate-left text-[10px]" />
                            <span>Reset Filter</span>
                        </button>
                    )}
                </div>

                {/* Right: Order Selector */}
                {showOrder && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <span
                            className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'
                                }`}
                        >
                            Urutkan:
                        </span>
                        <div className="relative w-full sm:w-auto">
                            <select
                                value={order}
                                onChange={(e) => { setOrder(e.target.value); setPage(1); }}
                                className={`appearance-none w-full sm:w-auto border text-[10px] sm:text-[11px] font-bold rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-1 cursor-pointer transition-all duration-200
                                    ${isDark
                                        ? 'border-white/10 bg-[#0f0408] text-white focus:border-[#ff1e56]/50'
                                        : 'border-slate-200 bg-white text-slate-800 focus:border-rose-400'
                                    }`}
                            >
                                {orderOptions.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <i
                                className={`fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'
                                    }`}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Filter Drawer */}
            <div
                className={`transition-all duration-500 ease-out overflow-hidden ${isOpen ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
            >
                <div
                    className={`relative rounded-2xl border p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 overflow-hidden shadow-2xl backdrop-blur-xl
                        ${isDark
                            ? 'border-white/[0.08] bg-[#0c0407]/95'
                            : 'border-slate-200 bg-white shadow-xl'
                        }`}
                >
                    {/* Status Filter */}
                    {filteredStatusOptions.length > 0 && (
                        <div className="space-y-2 relative z-10">
                            <span className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Status Penayangan
                            </span>

                            <div className="flex flex-wrap gap-2">
                                {filteredStatusOptions.map(status => {
                                    const isActive = activeStatus === status;
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setActiveStatus(isActive ? "" : status)}
                                            className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer
                                                ${isActive
                                                    ? 'bg-[#ff1e56] border-[#ff1e56] text-white shadow-sm'
                                                    : isDark
                                                        ? 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                                                }`}
                                        >
                                            <span>{status}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Genre Filter */}
                    <div className="space-y-2 relative z-10">
                        <span className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pilih Genre Anime
                        </span>

                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                            {genreOptions.map(genre => {
                                const isSelected = selectedGenre === genre.genreId;
                                return (
                                    <button
                                        key={genre.genreId}
                                        onClick={() => setSelectedGenre(isSelected ? "" : genre.genreId)}
                                        className={`px-2.5 py-1.5 text-[10px] sm:text-[11px] font-medium rounded-xl border transition-all duration-200 flex items-center gap-1.5 cursor-pointer
                                            ${isSelected
                                                ? 'bg-[#ff1e56] border-[#ff1e56] text-white shadow-sm'
                                                : isDark
                                                    ? 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
                                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                                            }`}
                                    >
                                        <span>{genre.title}</span>
                                        {isSelected && <i className="fa-solid fa-check text-[8px]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex justify-end pt-3 border-t border-inherit relative z-10">
                        <button
                            onClick={handleApplyAndClose}
                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
                                ${isDark
                                    ? 'bg-gradient-to-r from-[#ff1e56] to-rose-600 border-transparent text-white shadow-[0_0_15px_rgba(255,30,86,0.3)]'
                                    : 'bg-slate-900 border-transparent text-white hover:bg-slate-800'
                                }`}
                        >
                            <i className="fa-solid fa-check text-[10px]" />
                            <span>Terapkan Filter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}