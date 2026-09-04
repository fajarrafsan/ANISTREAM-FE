import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

export default function ServerSelector({
    availableServers,
    selectedServer,
    serverLoading,
    isBlocked,
    handleServerClick,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    const flatServers = useMemo(() => {
        if (!availableServers || availableServers.length === 0) return [];

        return availableServers.flatMap((q) =>
            q.serverList.map((s) => ({
                serverId: s.serverId,
                title: s.title,
                resolution: q.resolution,
            }))
        );
    }, [availableServers]);

    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;

            if (width < 640) setItemsPerPage(4);
            else if (width < 1024) setItemsPerPage(6);
            else setItemsPerPage(8);
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);
        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    const totalPages = Math.max(1, Math.ceil(flatServers.length / itemsPerPage));

    const pagedServers = useMemo(() => {
        const start = currentPage * itemsPerPage;
        return flatServers.slice(start, start + itemsPerPage);
    }, [flatServers, currentPage, itemsPerPage]);

    useEffect(() => {
        if (!selectedServer?.serverId || !flatServers.length) return;

        const activeIndex = flatServers.findIndex(
            (s) => s.serverId === selectedServer.serverId
        );

        if (activeIndex >= 0) {
            const pageOfActive = Math.floor(activeIndex / itemsPerPage);
            setCurrentPage(pageOfActive); // tidak perlu kondisi !== lagi
        }
    }, [selectedServer?.serverId, flatServers, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(0);
    }, [availableServers]);

    if (!availableServers || availableServers.length === 0) return null;

    const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
    const goNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

    return (
        <div
            className={`border-t px-3 sm:px-5 py-3 sm:py-4 transition-colors duration-300 ${isDark
                    ? "bg-linear-to-b from-[#0d0508] to-[#0a0305] border-[#2a1117]/40"
                    : "bg-white border-slate-200"
                }`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${isDark
                            ? "bg-linear-to-br from-[#1a0a0f] to-[#0a0204] border-red-950/30"
                            : "bg-white border-slate-200 shadow-sm"
                        }`}
                >
                    <i className="fa-solid fa-server text-[9px] text-[#ff1e56]/70" />
                </div>
                <div className="min-w-0">
                    <span
                        className={`block text-[10px] font-black uppercase tracking-wider select-none ${isDark ? "text-slate-600" : "text-slate-500"
                            }`}
                    >
                        Server
                    </span>
                    <span
                        className={`block text-[10px] mt-0.5 ${isDark ? "text-slate-700" : "text-slate-400"
                            }`}
                    >
                        Pilih server pemutaran
                    </span>
                </div>
            </div>

            {/* Page buttons */}
            <div
                className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 ${flatServers.length > 4 ? "mb-3" : ""
                    }`}
            >
                {pagedServers.map((s) => {
                    const isActive = selectedServer?.serverId === s.serverId;
                    const isLoading = serverLoading && isActive;

                    return (
                        <button
                            key={s.serverId}
                            onClick={() =>
                                handleServerClick(s.serverId, s.resolution, s.title)
                            }
                            disabled={serverLoading}
                            className={`min-w-0 inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border transition-all duration-300 text-[10px] sm:text-[11px] font-bold ${serverLoading
                                    ? "cursor-not-allowed opacity-40"
                                    : "cursor-pointer"
                                } ${isActive
                                    ? isDark
                                        ? "bg-gradient-to-r from-[#ff1e56]/20 via-[#ff1e56]/10 to-transparent border-[#ff1e56] text-white shadow-[0_0_15px_rgba(255,30,86,0.3)]"
                                        : "bg-rose-50 border-rose-400 text-rose-600 shadow-sm"
                                    : isDark
                                        ? "bg-white/[0.03] border-white/10 text-slate-300 hover:border-[#ff1e56]/30 hover:text-white hover:bg-white/[0.06]"
                                        : "bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:text-slate-900 shadow-sm"
                                }`}
                        >
                            {isLoading ? (
                                <span className="w-3 h-3 rounded-full border-2 border-[#ff1e56]/30 border-t-[#ff1e56] animate-spin shrink-0" />
                            ) : isActive ? (
                                <span className="w-2 h-2 rounded-full bg-[#ff1e56] animate-pulse shadow-[0_0_8px_rgba(255,30,86,0.5)] shrink-0" />
                            ) : (
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${isDark ? "bg-slate-700" : "bg-slate-300"
                                        }`}
                                />
                            )}

                            {s.resolution !== "unknown" && (
                                <span
                                    className={`inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-black sm:text-[9px] ${isActive
                                            ? isDark
                                                ? "bg-[#ff1e56]/20 text-[#ff1e56]"
                                                : "bg-rose-100 text-[#ff1e56]"
                                            : isDark
                                                ? "bg-white/5 text-slate-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                >
                                    {s.resolution}
                                </span>
                            )}

                            <span className="truncate min-w-0">
                                {s.title}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-2 mb-3">
                    <button
                        onClick={goPrev}
                        disabled={currentPage === 0}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-300 ${currentPage === 0
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer"
                            } ${isDark
                                ? "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-[#ff1e56]/30"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-rose-300"
                            }`}
                    >
                        <i className="fa-solid fa-chevron-left text-[8px]" />
                        Prev
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentPage
                                        ? "bg-[#ff1e56] scale-125"
                                        : isDark
                                            ? "bg-slate-700 hover:bg-slate-500"
                                            : "bg-slate-300 hover:bg-slate-400"
                                    }`}
                                aria-label={`Halaman ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={goNext}
                        disabled={currentPage >= totalPages - 1}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-300 ${currentPage >= totalPages - 1
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer"
                            } ${isDark
                                ? "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-[#ff1e56]/30"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-rose-300"
                            }`}
                    >
                        Next
                        <i className="fa-solid fa-chevron-right text-[8px]" />
                    </button>
                </div>
            )}

            {/* Warning — server blocked */}
            {isBlocked && (
                <div
                    className={`mt-2 flex items-start gap-2 px-3 py-2 rounded-lg border ${isDark
                            ? "bg-[#ff1e56]/5 border-[#ff1e56]/10"
                            : "bg-rose-50 border-rose-200"
                        }`}
                >
                    <i className="fa-solid fa-triangle-exclamation text-[10px] text-[#ff1e56]/60 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-[#ff1e56]/70 font-medium">
                        Server aktif tidak mendukung pemutaran langsung — coba pilih server lain.
                    </p>
                </div>
            )}

            {/* Active server info */}
            {selectedServer && !serverLoading && !isBlocked && (
                <div
                    className={`mt-2 flex items-start gap-2 px-3 py-2 rounded-lg border ${isDark
                            ? "bg-white/[0.02] border-white/5"
                            : "bg-slate-50 border-slate-200"
                        }`}
                >
                    <i className="fa-solid fa-circle-check text-[10px] text-[#ff1e56]/50 mt-0.5" />
                    <p className={`text-[10px] font-medium leading-relaxed ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                        Aktif:{" "}
                        <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                            {selectedServer.resolution} — {selectedServer.name}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
