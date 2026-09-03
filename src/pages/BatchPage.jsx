import { useEffect, useRef, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Grid2X2, List, Package, RotateCcw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useBatchList } from "../hooks/useBatch";
import BatchCard from "../components/batch/BatchCard";
import BatchPageHeader from "../components/batch/BatchPageHeader";
import BatchListSkeleton from "../skeletons/batch/BatchListSkeleton";

export default function BatchPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [page, setPage] = useState(1);
    const [view, setView] = useState("grid");
    const collectionTitle = useRef(null);
    const { items, pagination, loading, error, refetch } = useBatchList(page);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    const primaryText = isDark ? "text-white" : "text-zinc-900";
    const secondaryText = isDark ? "text-zinc-400" : "text-zinc-600";
    const surface = isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white";
    const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]";
    const gridClass = view === "grid"
        ? "grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 xl:grid-cols-5"
        : "grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-4";
    const navButton = `inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${focusRing} ${
        isDark
            ? "border-white/10 bg-white/[0.04] text-zinc-200 enabled:hover:bg-white/[0.09]"
            : "border-zinc-200 bg-white text-zinc-700 enabled:hover:bg-zinc-100"
    }`;

    const changePage = (nextPage) => {
        setPage(nextPage);
        collectionTitle.current?.focus({ preventScroll: true });
        collectionTitle.current?.scrollIntoView({ block: "start", behavior: "instant" });
    };

    return (
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 md:px-8">
            <BatchPageHeader isDark={isDark} />

            <section aria-labelledby="batch-collection-title" className="mt-8 sm:mt-10">
                <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                    <div className="min-w-0">
                        <h2 id="batch-collection-title" ref={collectionTitle} tabIndex={-1} className={`scroll-mt-24 rounded-sm font-display text-xl font-semibold tracking-tight sm:text-2xl ${primaryText} ${focusRing}`}>
                            Jelajahi batch
                        </h2>
                        <p className={`mt-1 text-xs leading-5 ${secondaryText}`} role="status">
                            {loading ? "Memuat koleksi…" : error ? "Koleksi belum dapat dimuat" : `${items.length} anime di halaman ${pagination?.currentPage ?? page}`}
                        </p>
                    </div>
                    <div role="group" aria-label="Tampilan koleksi" className={`inline-flex shrink-0 gap-1 rounded-2xl border p-1 ${surface}`}>
                        {[
                            { value: "grid", label: "Tampilan grid", icon: Grid2X2 },
                            { value: "list", label: "Tampilan daftar", icon: List },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                aria-label={label}
                                aria-pressed={view === value}
                                title={label}
                                onClick={() => setView(value)}
                                className={`grid h-11 w-11 cursor-pointer place-items-center rounded-xl transition-colors ${focusRing} ${
                                    view === value
                                        ? isDark ? "bg-white/10 text-white" : "bg-zinc-900 text-white"
                                        : isDark ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                }`}
                            >
                                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <BatchListSkeleton isDark={isDark} view={view} count={items.length || 10} />
                ) : error ? (
                    <div className={`rounded-2xl border px-5 py-12 text-center sm:py-16 ${surface}`}>
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
                            <AlertCircle className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h3 className={`mt-4 font-display text-xl font-semibold ${primaryText}`}>Koleksi belum bisa dimuat</h3>
                        <p role="alert" className={`mx-auto mt-2 max-w-sm text-sm leading-6 ${secondaryText}`}>{error} Silakan coba kembali.</p>
                        <button type="button" onClick={refetch} className={`mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 ${focusRing}`}>
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            Coba lagi
                        </button>
                    </div>
                ) : items.length === 0 ? (
                    <div className={`rounded-2xl border border-dashed px-5 py-12 text-center sm:py-16 ${surface}`}>
                        <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-500"}`}>
                            <Package className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h3 className={`mt-4 font-display text-xl font-semibold ${primaryText}`}>Belum ada batch di sini</h3>
                        <p className={`mt-2 text-sm leading-6 ${secondaryText}`}>Koleksi pada halaman ini belum tersedia.</p>
                        {page > 1 && <button type="button" onClick={() => changePage(1)} className={`${navButton} mt-5`}>Kembali ke halaman pertama</button>}
                    </div>
                ) : (
                    <ul aria-label="Koleksi batch anime" className={gridClass}>
                        {items.map((batch, index) => (
                            <li key={batch.batchId} className="min-w-0">
                                <BatchCard batch={batch} isDark={isDark} view={view} eager={index < 2} />
                            </li>
                        ))}
                    </ul>
                )}

                {pagination && !error && (
                    <nav className={`mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row ${isDark ? "border-white/10" : "border-zinc-200"}`} aria-label="Navigasi halaman batch">
                        <p className={`text-xs ${secondaryText}`} aria-live="polite">
                            {loading ? `Memuat halaman ${page}…` : <>Halaman <span className={`font-semibold tabular-nums ${primaryText}`}>{pagination.currentPage}</span>{pagination.totalPages ? <> dari <span className={`font-semibold tabular-nums ${primaryText}`}>{pagination.totalPages}</span></> : null}</>}
                        </p>
                        <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
                            <button type="button" className={navButton} disabled={!pagination.hasPrevPage || loading} onClick={() => changePage(pagination.prevPage ?? page - 1)}>
                                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                                Sebelumnya
                            </button>
                            <button type="button" className={navButton} disabled={!pagination.hasNextPage || loading} onClick={() => changePage(pagination.nextPage ?? page + 1)}>
                                Berikutnya
                                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                            </button>
                        </div>
                    </nav>
                )}
            </section>
        </div>
    );
}
