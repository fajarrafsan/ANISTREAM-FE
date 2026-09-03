import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, ChevronLeft, ChevronRight, Download, Grid2X2, List, Package, RotateCcw, Settings2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useBatchList } from "../hooks/useBatch";
import BatchCard from "../components/batch/BatchCard";

const DOWNLOAD_STEPS = [
    { icon: Package, label: "Pilih anime" },
    { icon: Settings2, label: "Pilih kualitas" },
    { icon: Download, label: "Unduh batch" },
];

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
            <header className={`relative isolate overflow-hidden rounded-3xl border ${surface}`}>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.12),transparent_65%)]" />
                <div className="grid gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-center lg:p-10">
                    <div className="min-w-0">
                        <p className={`mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                            Koleksi AniStream
                        </p>
                        <h1 className={`font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl ${primaryText}`}>
                            Batch <span className={isDark ? "text-red-400" : "text-red-600"}>Download</span>
                        </h1>
                        <p className={`mt-3 max-w-lg text-sm leading-7 ${secondaryText}`}>
                            Satu seri dalam satu paket. Temukan anime favoritmu, lalu pilih kualitas unduhan yang pas.
                        </p>
                    </div>

                    <ol aria-label="Cara mengunduh batch" className={`grid grid-cols-3 gap-2 border-t pt-5 lg:grid-cols-1 lg:gap-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 ${isDark ? "border-white/10" : "border-zinc-200"}`}>
                        {DOWNLOAD_STEPS.map(({ icon: Icon, label }, index) => (
                            <li key={label} className="flex min-w-0 flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-3">
                                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${isDark ? "border-white/10 bg-white/[0.04] text-red-400" : "border-red-100 bg-red-50 text-red-600"}`}>
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <span className={`text-[11px] font-semibold leading-5 sm:text-xs ${primaryText}`}>
                                    <span className={`mr-1.5 hidden font-mono text-[10px] lg:inline ${secondaryText}`}>0{index + 1}</span>
                                    {label}
                                </span>
                                {index < DOWNLOAD_STEPS.length - 1 && <ArrowRight className={`ml-auto hidden h-3.5 w-3.5 lg:block ${secondaryText}`} aria-hidden="true" />}
                            </li>
                        ))}
                    </ol>
                </div>
            </header>

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
                    <div role="status" aria-label="Memuat daftar batch">
                        <span className="sr-only">Memuat daftar batch</span>
                        <div className={gridClass} aria-hidden="true">
                            {Array.from({ length: 10 }, (_, index) => (
                                <div key={index} className={`overflow-hidden rounded-2xl border motion-safe:animate-pulse ${surface} ${view === "list" ? "flex gap-3 p-3" : ""}`}>
                                    <div className={`${isDark ? "bg-white/[0.06]" : "bg-zinc-100"} ${view === "list" ? "aspect-2/3 w-20 shrink-0 rounded-xl sm:w-24" : "aspect-2/3"}`} />
                                    <div className={`min-w-0 flex-1 ${view === "list" ? "py-2" : "p-3 sm:p-4"}`}>
                                        <div className={`h-4 w-5/6 rounded ${isDark ? "bg-white/10" : "bg-zinc-200"}`} />
                                        <div className={`mt-2 h-4 w-2/3 rounded ${isDark ? "bg-white/[0.06]" : "bg-zinc-100"}`} />
                                        <div className={`mt-4 h-3 w-1/2 rounded ${isDark ? "bg-white/[0.06]" : "bg-zinc-100"}`} />
                                        <div className={`mt-6 h-3 w-3/4 rounded ${isDark ? "bg-white/[0.06]" : "bg-zinc-100"}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
