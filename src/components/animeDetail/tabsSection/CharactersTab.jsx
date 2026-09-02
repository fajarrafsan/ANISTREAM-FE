import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";
import { DETAIL_EASE } from "../constants/animeDetailMotion";

export default function CharactersTab({ characters = [] }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [currentPage, setCurrentPage] = useState(1);
    const [filterRole, setFilterRole] = useState("ALL");

    const validChars = characters?.filter((c) => c.character?.name && c.seiyuu) ?? [];

    const sortedChars = [...validChars].sort((a, b) => {
        if (a.role === "MAIN" && b.role !== "MAIN") return -1;
        if (a.role !== "MAIN" && b.role === "MAIN") return 1;
        return 0;
    });

    const filteredChars = sortedChars.filter((item) => {
        if (filterRole === "MAIN") return item.role === "MAIN";
        if (filterRole === "SUPPORT") return item.role !== "MAIN";
        return true;
    });

    const INITIAL_LIMIT = 6;
    const totalPages = Math.max(1, Math.ceil(filteredChars.length / INITIAL_LIMIT));

    useEffect(() => {
        setCurrentPage(1);
    }, [characters, filterRole]);

    const startIndex = (currentPage - 1) * INITIAL_LIMIT;
    const displayChars = filteredChars.slice(startIndex, startIndex + INITIAL_LIMIT);
    const mainCount = sortedChars.filter((c) => c.role === "MAIN").length;

    const getCharImage = (item) =>
        item.character?.image?.large ||
        item.character?.image?.medium ||
        item.character?.image ||
        item.character?.images?.jpg?.image_url ||
        null;

    const getSeiyuuImage = (item) =>
        item.seiyuu?.image?.large ||
        item.seiyuu?.image?.medium ||
        item.seiyuu?.image ||
        item.seiyuu?.images?.jpg?.image_url ||
        null;

    return (
        <div className="relative group">
            {isDark && (
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#ff1e56]/10 via-transparent to-transparent blur-2xl pointer-events-none" />
            )}

            <div
                className={`relative rounded-3xl p-3 xs:p-4 sm:p-6 md:p-7 shadow-2xl backdrop-blur-xl border transition-all duration-500 overflow-hidden ${isDark
                    ? "bg-[#0b0406]/90 border-white/5"
                    : "bg-white/95 border-slate-200"
                    }`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg ${isDark
                                ? "bg-[#14080b] border-[#ff1e56]/20 shadow-[0_0_20px_rgba(255,30,86,0.15)]"
                                : "bg-rose-50 border-rose-200"
                                }`}
                        >
                            <i className="fa-solid fa-users text-sm sm:text-base text-[#ff1e56]" />
                        </div>
                        <div>
                            <h4
                                className={`font-black text-sm sm:text-lg tracking-tight uppercase flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"
                                    }`}
                            >
                                Karakter & Seiyuu
                                <span
                                    className={`border text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black ${isDark
                                        ? "bg-[#ff1e56]/10 text-[#ff1e56] border-[#ff1e56]/30 shadow-[0_0_10px_rgba(255,30,86,0.2)]"
                                        : "bg-rose-50 text-rose-600 border-rose-200"
                                        }`}
                                >
                                    {validChars.length}
                                </span>
                            </h4>
                            <p className={`text-[10px] sm:text-xs mt-0.5 font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                {mainCount} karakter utama · {validChars.length - mainCount} pendukung
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 p-1 rounded-xl border self-start sm:self-auto backdrop-blur-md bg-white/[0.02] border-white/5">
                        {[
                            { id: "ALL", label: "Semua" },
                            { id: "MAIN", label: "Utama" },
                            { id: "SUPPORT", label: "Pendukung" },
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => setFilterRole(btn.id)}
                                className={`px-2.5 xs:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${filterRole === btn.id
                                    ? "bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white shadow-[0_0_12px_rgba(255,30,86,0.4)]"
                                    : isDark
                                        ? "text-slate-400 hover:text-white hover:bg-white/5"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentPage}-${filterRole}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: DETAIL_EASE }}
                        className="grid grid-cols-1 gap-3 sm:gap-4"
                    >
                        {displayChars.map((item, index) => {
                            const charImage = getCharImage(item);
                            const seiyuuImage = getSeiyuuImage(item);
                            const isMain = item.role === "MAIN";

                            return (
                                <motion.div
                                    key={`${item.character?.name}-${item.seiyuu?.name}-${index}`}
                                    whileHover={{ y: -2 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    className="relative group/card rounded-2xl p-[1px] overflow-hidden transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1e56]/30 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite] transition-all duration-500 z-0 opacity-0 group-hover/card:opacity-100" />

                                    <div
                                        className={`relative z-10 rounded-[15px] p-3 sm:p-4 border transition-colors duration-300 backdrop-blur-xl ${isDark
                                            ? "bg-[#120609]/80 border-white/5 group-hover/card:border-[#ff1e56]/30 group-hover/card:bg-[#18090d]/90 shadow-md"
                                            : "bg-white border-slate-200 group-hover/card:border-rose-300 shadow-sm"
                                            }`}
                                    >
                                        {/* ── DESKTOP STUDIO LAYOUT (md and up) ── */}
                                        <div className="hidden md:flex items-center justify-between gap-4">
                                            {/* Character (Left) */}
                                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md group-hover/card:border-[#ff1e56]/40 transition-colors">
                                                    {charImage ? (
                                                        <img
                                                            src={charImage}
                                                            alt={item.character.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#1a0a0f] text-slate-500">
                                                            <i className="fa-solid fa-user text-xs" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                                                            Character
                                                        </span>
                                                        <span
                                                            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${isMain
                                                                ? "bg-[#ff1e56]/15 text-[#ff1e56] border border-[#ff1e56]/30 shadow-[0_0_8px_rgba(255,30,86,0.3)]"
                                                                : "bg-white/5 text-slate-400 border border-white/5"
                                                                }`}
                                                        >
                                                            {isMain ? "Utama" : "Pendukung"}
                                                        </span>
                                                    </div>
                                                    <h5 className={`font-bold text-sm tracking-tight truncate ${isDark ? "text-slate-100 group-hover/card:text-white" : "text-slate-800"}`}>
                                                        {item.character.name}
                                                    </h5>
                                                    <p className={`text-[10px] mt-0.5 truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                        {isMain ? "Karakter Utama Serial" : "Karakter Pendukung"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Studio Audio Equalizer (Center) */}
                                            <div className="flex items-center justify-center px-4 select-none">
                                                <div className="flex items-center gap-1.5 opacity-60 group-hover/card:opacity-100 transition-opacity">
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-1 h-2 rounded-full bg-[#ff1e56] animate-pulse" />
                                                        <span className="w-1 h-3.5 rounded-full bg-[#ff1e56]/70" />
                                                        <span className="w-1 h-1.5 rounded-full bg-[#ff1e56]/40" />
                                                    </div>

                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-transform duration-300 group-hover/card:scale-110 ${isDark
                                                        ? "bg-[#1e0a10] border-[#ff1e56]/30 text-[#ff1e56] shadow-[0_0_12px_rgba(255,30,86,0.2)]"
                                                        : "bg-rose-50 border-rose-200 text-rose-500"
                                                        }`}>
                                                        <i className="fa-solid fa-microphone text-[10px]" />
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <span className="w-1 h-1.5 rounded-full bg-[#ff1e56]/40" />
                                                        <span className="w-1 h-3.5 rounded-full bg-[#ff1e56]/70" />
                                                        <span className="w-1 h-2 rounded-full bg-[#ff1e56] animate-pulse" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Seiyuu (Right) */}
                                            <div className="flex items-center gap-3.5 flex-1 min-w-0 justify-end text-right">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-end gap-2 mb-1">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
                                                            Seiyuu
                                                        </span>
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                            Voice Actor
                                                        </span>
                                                    </div>
                                                    <h5 className={`font-bold text-sm tracking-tight truncate ${isDark ? "text-slate-100 group-hover/card:text-white" : "text-slate-800"}`}>
                                                        {item.seiyuu.name}
                                                    </h5>
                                                    <p className={`text-[10px] mt-0.5 truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                        {item.seiyuu.native || "Pengisi Suara Resmi"}
                                                    </p>
                                                </div>

                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md group-hover/card:border-amber-500/40 transition-colors">
                                                    {seiyuuImage ? (
                                                        <img
                                                            src={seiyuuImage}
                                                            alt={item.seiyuu.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#1a0a0f] text-slate-500">
                                                            <i className="fa-solid fa-microphone text-xs" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── MOBILE COMPACT DUO LAYOUT (< md) ── */}
                                        <div className="md:hidden flex flex-col gap-2.5">
                                            {/* Character Row */}
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-sm">
                                                    {charImage ? (
                                                        <img
                                                            src={charImage}
                                                            alt={item.character.name}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#1a0a0f] text-slate-500">
                                                            <i className="fa-solid fa-user text-xs" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                                                            Karakter
                                                        </span>
                                                        <span
                                                            className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isMain
                                                                ? "bg-[#ff1e56]/15 text-[#ff1e56] border border-[#ff1e56]/30"
                                                                : "bg-white/5 text-slate-400 border border-white/10"
                                                                }`}
                                                        >
                                                            {isMain ? "Utama" : "Pendukung"}
                                                        </span>
                                                    </div>
                                                    <h5 className={`font-bold text-xs truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                                                        {item.character.name}
                                                    </h5>
                                                </div>
                                            </div>

                                            {/* Integrated Connector Divider */}
                                            <div className="relative flex items-center justify-center my-0.5">
                                                <div className={`w-full h-px ${isDark ? "bg-white/[0.06]" : "bg-slate-200"}`} />
                                                <span className={`absolute px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 border shadow-sm ${isDark ? "bg-[#18090d] border-[#ff1e56]/30 text-[#ff1e56]" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
                                                    <i className="fa-solid fa-microphone text-[7px]" />
                                                    <span>Diisi Oleh</span>
                                                </span>
                                            </div>

                                            {/* Seiyuu Row */}
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-sm">
                                                    {seiyuuImage ? (
                                                        <img
                                                            src={seiyuuImage}
                                                            alt={item.seiyuu.name}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#1a0a0f] text-slate-500">
                                                            <i className="fa-solid fa-microphone text-xs" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                                                            Seiyuu / VA
                                                        </span>
                                                    </div>
                                                    <h5 className={`font-bold text-xs truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                                                        {item.seiyuu.name}
                                                    </h5>
                                                    {item.seiyuu.native && (
                                                        <p className={`text-[9px] truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                            {item.seiyuu.native}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Empty state */}
                {displayChars.length === 0 && (
                    <div className="py-12 text-center">
                        <div
                            className={`w-12 h-12 mx-auto rounded-2xl border flex items-center justify-center mb-3 ${isDark
                                ? "bg-[#14080b] border-[#ff1e56]/20 text-slate-500"
                                : "bg-slate-100 border-slate-200 text-slate-400"
                                }`}
                        >
                            <i className="fa-solid fa-users-slash text-base" />
                        </div>
                        <p className={`text-xs font-semibold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Tidak ada karakter pada kategori ini
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 mt-5 border-t border-white/5">
                        <span className={`text-[10px] sm:text-xs text-center sm:text-left ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Halaman <span className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentPage}</span> dari {totalPages}
                        </span>

                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                aria-label="Halaman Sebelumnya"
                                className={`h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl border text-[10px] sm:text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 ${isDark
                                    ? "bg-white/[0.03] border-white/10 text-slate-300 hover:border-[#ff1e56]/50 hover:text-white"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-rose-400"
                                    }`}
                            >
                                <i className="fa-solid fa-chevron-left text-[9px]" />
                                <span className="hidden xs:inline">Sebelumnya</span>
                            </motion.button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <motion.button
                                        key={p}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border text-[10px] sm:text-[11px] font-black transition ${currentPage === p
                                            ? "bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] border-[#ff1e56] text-white shadow-[0_0_15px_rgba(255,30,86,0.4)]"
                                            : isDark
                                                ? "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-rose-300"
                                            }`}
                                    >
                                        {p}
                                    </motion.button>
                                ))}
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                aria-label="Halaman Selanjutnya"
                                className={`h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl border text-[10px] sm:text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 ${isDark
                                    ? "bg-white/[0.03] border-white/10 text-slate-300 hover:border-[#ff1e56]/50 hover:text-white"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-rose-400"
                                    }`}
                            >
                                <span className="hidden xs:inline">Selanjutnya</span>
                                <i className="fa-solid fa-chevron-right text-[9px]" />
                            </motion.button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}