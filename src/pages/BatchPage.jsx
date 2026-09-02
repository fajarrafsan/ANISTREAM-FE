import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ChevronLeft, ChevronRight, Star, Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useBatchList } from "../hooks/useBatch";

export default function BatchPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { items, pagination, loading, error } = useBatchList(page);

    const navButton = `inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full border text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
        isDark
            ? "bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.09] focus-visible:ring-offset-[#0a0a0f]"
            : "bg-black/[0.03] border-black/10 text-gray-700 hover:bg-black/[0.06] focus-visible:ring-offset-white"
    }`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
            <header className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-red-500/15 grid place-items-center text-red-500">
                    <Package className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                    <h1 className={`font-display text-2xl sm:text-3xl uppercase tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>
                        Batch <span className="text-red-500">Download</span>
                    </h1>
                    <p className={`text-[11px] ${isDark ? "text-white/45" : "text-gray-500"}`}>
                        Unduh satu seri sekaligus dalam berbagai kualitas
                    </p>
                </div>
            </header>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" aria-hidden="true" />
                    <p className="text-xs font-medium text-red-500">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="grid place-items-center py-24" role="status" aria-live="polite">
                    <Loader2 className={`w-7 h-7 animate-spin ${isDark ? "text-white/40" : "text-gray-400"}`} aria-hidden="true" />
                    <span className="sr-only">Memuat daftar batch</span>
                </div>
            ) : items.length === 0 && !error ? (
                <p className={`py-24 text-center text-sm ${isDark ? "text-white/45" : "text-gray-500"}`}>
                    Tidak ada batch pada halaman ini.
                </p>
            ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {items.map((batch) => (
                        <li key={batch.batchId}>
                            <button
                                type="button"
                                onClick={() => navigate(`/batch/${encodeURIComponent(batch.batchId)}`)}
                                className={`group w-full text-left rounded-xl overflow-hidden border cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                                    isDark
                                        ? "bg-white/[0.03] border-white/10 hover:border-white/20 focus-visible:ring-offset-[#0a0a0f]"
                                        : "bg-white border-black/10 hover:border-black/20 shadow-sm focus-visible:ring-offset-white"
                                }`}
                            >
                                <div className="relative aspect-2/3 overflow-hidden">
                                    {batch.poster ? (
                                        <img
                                            src={batch.poster}
                                            alt=""
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => { e.target.style.opacity = "0"; }}
                                        />
                                    ) : (
                                        <div className={`w-full h-full ${isDark ? "bg-zinc-900" : "bg-gray-200"}`} />
                                    )}

                                    {batch.score && (
                                        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" aria-hidden="true" />
                                            {batch.score}
                                        </span>
                                    )}
                                    {batch.type && (
                                        <span className="absolute top-2 left-2 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                                            {batch.type}
                                        </span>
                                    )}
                                </div>

                                <div className="p-2.5">
                                    <p className={`text-[11px] font-bold line-clamp-2 leading-snug ${isDark ? "text-white" : "text-gray-900"}`}>
                                        {batch.title}
                                    </p>
                                    {batch.status && (
                                        <p className={`text-[10px] mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                                            {batch.status}
                                        </p>
                                    )}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {pagination && (
                <nav className="flex items-center justify-center gap-3 mt-8" aria-label="Navigasi halaman batch">
                    <button
                        type="button"
                        className={navButton}
                        disabled={!pagination.hasPrevPage || loading}
                        onClick={() => setPage(pagination.prevPage ?? page - 1)}
                    >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                        Sebelumnya
                    </button>

                    <span className={`text-xs font-mono ${isDark ? "text-white/50" : "text-gray-600"}`} aria-live="polite">
                        {pagination.currentPage} / {pagination.totalPages ?? "?"}
                    </span>

                    <button
                        type="button"
                        className={navButton}
                        disabled={!pagination.hasNextPage || loading}
                        onClick={() => setPage(pagination.nextPage ?? page + 1)}
                    >
                        Berikutnya
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                </nav>
            )}
        </div>
    );
}
