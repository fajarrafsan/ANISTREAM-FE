import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowDown, ArrowLeft, ArrowUpRight, AlertCircle, BookOpen,
    Download, FileArchive, Film, Info, Package, Star,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useBatchDetail } from "../hooks/useBatch";

function BatchPoster({ poster, isDark }) {
    return (
        <div className={`relative aspect-2/3 w-32 shrink-0 overflow-hidden rounded-xl border shadow-xl sm:w-full ${
            isDark ? "border-white/10 bg-zinc-900 shadow-black/20" : "border-zinc-200 bg-zinc-100 shadow-zinc-200/50"
        }`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-3" aria-hidden="true">
                <Film className={`h-9 w-9 ${isDark ? "text-zinc-600" : "text-zinc-400"}`} />
                <span className={`text-center text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Poster belum tersedia</span>
            </div>
            {poster && (
                <img
                    key={poster}
                    src={poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => { event.currentTarget.style.opacity = "0"; }}
                />
            )}
        </div>
    );
}

function DetailSkeleton({ isDark }) {
    const block = isDark ? "bg-white/[0.07]" : "bg-zinc-200/80";
    const surface = isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white";

    return (
        <div role="status" aria-live="polite" aria-label="Memuat detail batch" className="mt-5 motion-safe:animate-pulse">
            <div className={`grid gap-6 rounded-2xl border p-5 sm:grid-cols-[184px_minmax(0,1fr)] sm:p-8 ${surface}`} aria-hidden="true">
                <div className={`aspect-2/3 w-32 rounded-xl sm:w-full ${block}`} />
                <div className="min-w-0 space-y-4 sm:py-3">
                    <div className={`h-5 w-24 rounded-md ${block}`} />
                    <div className={`h-10 w-full rounded-lg ${block}`} />
                    <div className={`h-5 w-2/3 rounded-md ${block}`} />
                    <div className="flex gap-2 pt-1">
                        <div className={`h-8 w-20 rounded-lg ${block}`} />
                        <div className={`h-8 w-24 rounded-lg ${block}`} />
                    </div>
                    <div className={`h-11 w-40 rounded-xl ${block}`} />
                </div>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]" aria-hidden="true">
                <div className="space-y-4">
                    <div className={`h-8 w-44 rounded-lg ${block}`} />
                    {[0, 1].map((item) => (
                        <div key={item} className={`space-y-5 rounded-2xl border p-5 ${surface}`}>
                            <div className={`h-6 w-28 rounded-md ${block}`} />
                            <div className={`h-12 w-full rounded-xl ${block}`} />
                            <div className={`h-12 w-full rounded-xl ${block}`} />
                        </div>
                    ))}
                </div>
                <div className={`h-72 rounded-2xl border ${surface}`} />
            </div>
            <span className="sr-only">Memuat informasi dan pilihan unduhan batch.</span>
        </div>
    );
}

function DownloadFormat({ format, index, isDark }) {
    const qualities = format.qualities ?? [];

    return (
        <article className={`min-w-0 overflow-hidden rounded-2xl border ${
            isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white shadow-sm shadow-zinc-200/30"
        }`}>
            <header className={`flex min-w-0 items-center gap-3 border-b px-4 py-4 sm:px-5 ${
                isDark ? "border-white/10 bg-white/[0.02]" : "border-zinc-200/80 bg-zinc-50/80"
            }`}>
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"}`}>
                    <FileArchive className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Format unduhan</p>
                    <h3 className={`mt-0.5 wrap-anywhere font-display text-lg font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {format.title?.trim() || "Format lainnya"}
                    </h3>
                </div>
                <span className={`font-display text-xl font-medium tabular-nums ${isDark ? "text-zinc-500" : "text-zinc-400"}`} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                </span>
            </header>

            {qualities.length > 0 ? (
                <div className={`divide-y ${isDark ? "divide-white/10" : "divide-zinc-200/80"}`}>
                    {qualities.map((quality, qualityIndex) => (
                        <div key={`${quality.title}-${qualityIndex}`} className="grid min-w-0 gap-3 p-4 sm:p-5 xl:grid-cols-[130px_minmax(0,1fr)] xl:gap-5">
                            <div className="min-w-0 xl:pt-1">
                                <h4 className={`wrap-anywhere text-sm font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                                    {quality.title?.trim() || "Kualitas tersedia"}
                                </h4>
                                <p className={`mt-1 text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Pilih penyedia</p>
                            </div>

                            {quality.urls?.length > 0 ? (
                                <ul className="grid min-w-0 gap-2 min-[420px]:grid-cols-2">
                                    {quality.urls.map((item, itemIndex) => (
                                        <li key={`${item.title}-${item.url}-${itemIndex}`} className="min-w-0">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer nofollow"
                                                className={`group flex min-h-11 min-w-0 items-center gap-2.5 rounded-xl border px-3 py-3 text-[13px] font-semibold transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                                                    isDark
                                                        ? "border-white/10 bg-white/[0.03] text-zinc-200 hover:border-red-400/40 hover:bg-red-500/10 hover:text-white active:bg-red-500/15 focus-visible:ring-offset-zinc-950"
                                                        : "border-zinc-200 bg-white text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 active:bg-red-100 focus-visible:ring-offset-white"
                                                }`}
                                            >
                                                <Download className={`h-4 w-4 shrink-0 ${isDark ? "text-red-400" : "text-red-600"}`} aria-hidden="true" />
                                                <span className="min-w-0 flex-1 wrap-anywhere">{item.title?.trim() || "Buka unduhan"}</span>
                                                <ArrowUpRight className={`h-4 w-4 shrink-0 ${isDark ? "text-zinc-400 group-hover:text-red-400" : "text-zinc-500 group-hover:text-red-600"}`} aria-hidden="true" />
                                                <span className="sr-only"> (buka tab baru)</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={`py-2 text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Tautan untuk kualitas ini belum tersedia.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className={`p-5 text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Belum ada pilihan kualitas untuk format ini.</p>
            )}
        </article>
    );
}

function BatchDownloads({ formats, isDark }) {
    const [selectedIndex, setSelectedIndex] = useState(() => Math.max(0, formats.findIndex(
        (format) => format.qualities?.some((quality) => quality.urls?.some((item) => item.url)),
    )));
    const format = formats[selectedIndex] ?? formats[0];

    return (
        <div className="min-w-0 space-y-4">
            {formats.length > 1 && (
                <div role="group" aria-label="Pilih format unduhan" className="flex min-w-0 flex-wrap gap-2">
                    {formats.map((item, index) => (
                        <button
                            key={`${item.title}-${index}`}
                            type="button"
                            aria-pressed={index === selectedIndex}
                            aria-controls="batch-selected-format"
                            onClick={() => setSelectedIndex(index)}
                            className={`min-h-11 min-w-11 max-w-full flex-1 basis-20 cursor-pointer wrap-anywhere rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 sm:flex-none sm:basis-auto motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                                index === selectedIndex
                                    ? "border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 active:bg-red-800"
                                    : isDark
                                        ? "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.07] active:bg-white/10 focus-visible:ring-offset-zinc-950"
                                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100 focus-visible:ring-offset-white"
                            }`}
                        >
                            {item.title?.trim() || `Format ${index + 1}`}
                        </button>
                    ))}
                </div>
            )}
            <p role="status" aria-live="polite" className="sr-only">Format {format.title?.trim() || selectedIndex + 1} ditampilkan.</p>
            <div id="batch-selected-format">
                <DownloadFormat format={format} index={selectedIndex} isDark={isDark} />
            </div>
        </div>
    );
}

export default function BatchDetailPage() {
    const { batchId } = useParams();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { batch, loading, error } = useBatchDetail(batchId);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [batchId]);

    const textPrimary = isDark ? "text-white" : "text-zinc-900";
    const textSecondary = isDark ? "text-zinc-400" : "text-zinc-600";
    const surface = isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white shadow-sm shadow-zinc-200/30";
    const formats = batch?.downloadUrl ?? [];
    const hasDownloads = formats.some((format) => format.qualities?.some((quality) => quality.urls?.length > 0));
    const meta = batch ? [
        ["Tipe", batch.type],
        ["Status", batch.status],
        ["Episode", batch.episodes],
        ["Durasi", batch.duration],
        ["Studio", batch.studios],
        ["Musim", batch.season],
        ["Rilis", batch.releasedOn || batch.aired],
    ].filter(([, value]) => value) : [];

    return (
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 md:px-8">
            <nav aria-label="Navigasi detail batch" className="flex min-w-0 items-center gap-3">
                <Link
                    to="/batch"
                    className={`inline-flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                        isDark
                            ? "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07] hover:text-white focus-visible:ring-offset-zinc-950"
                            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:ring-offset-white"
                    }`}
                >
                    <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Semua batch
                </Link>
                <span className={`text-xs ${textSecondary}`} aria-current="page">Detail batch</span>
            </nav>

            {loading ? (
                <DetailSkeleton isDark={isDark} />
            ) : error || !batch ? (
                <section className={`mx-auto mt-6 max-w-xl rounded-2xl border px-5 py-12 text-center sm:px-10 sm:py-16 ${surface}`} aria-labelledby="batch-error-title">
                    <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"}`}>
                        <AlertCircle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h1 id="batch-error-title" className={`mt-5 font-display text-2xl font-semibold ${textPrimary}`}>
                        {error ? "Detail batch belum bisa dimuat" : "Batch tidak ditemukan"}
                    </h1>
                    <p className={`mt-3 text-sm leading-6 ${textSecondary}`}>
                        {error ? "Silakan kembali ke koleksi dan coba buka batch ini lagi." : "Coba jelajahi koleksi untuk menemukan batch lainnya."}
                    </p>
                    <Link to="/batch" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Kembali ke koleksi
                    </Link>
                </section>
            ) : (
                <>
                    <header className={`relative mt-5 overflow-hidden rounded-2xl border ${surface}`}>
                        <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent ${isDark ? "via-red-400/60" : "via-red-500/40"}`} aria-hidden="true" />
                        <div className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-red-600/[0.07]" : "bg-red-100/50"}`} aria-hidden="true" />
                        <div className="relative grid min-w-0 gap-5 p-5 sm:grid-cols-[184px_minmax(0,1fr)] sm:gap-7 sm:p-8 lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-9">
                            <BatchPoster poster={batch.poster} isDark={isDark} />
                            <div className="min-w-0 self-center">
                                <p className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ${isDark ? "text-red-400" : "text-red-600"}`}>
                                    <Package className="h-3.5 w-3.5" aria-hidden="true" />
                                    Batch anime
                                </p>
                                <h1 className={`mt-3 wrap-anywhere font-display text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl ${textPrimary}`}>
                                    {batch.title}
                                </h1>
                                {batch.japanese && <p className={`mt-2 wrap-anywhere text-sm leading-6 ${textSecondary}`} lang="ja">{batch.japanese}</p>}

                                {(batch.score || batch.status || batch.type) && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        {batch.score && (
                                            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold ${isDark ? "border-amber-400/15 bg-amber-400/10 text-amber-300" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                                                <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                                                <span className="sr-only">Skor </span>{batch.score}
                                            </span>
                                        )}
                                        {[batch.type, batch.status].filter(Boolean).map((label, index) => (
                                            <span key={`${label}-${index}`} className={`max-w-full wrap-anywhere rounded-lg border px-2.5 py-1.5 text-xs font-medium ${isDark ? "border-white/10 bg-white/[0.03] text-zinc-300" : "border-zinc-200 bg-zinc-50 text-zinc-700"}`}>
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {batch.genres?.length > 0 && (
                                    <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Genre anime">
                                        {batch.genres.map((genre, index) => (
                                            <li key={`${genre}-${index}`} className={`max-w-full wrap-anywhere text-xs leading-5 ${textSecondary}`}>{genre}</li>
                                        ))}
                                    </ul>
                                )}

                                {hasDownloads && (
                                    <a href="#batch-downloads" className="mt-6 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-red-600/10 transition-colors duration-200 hover:bg-red-700 active:bg-red-800 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                                        Pilih unduhan
                                        <ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="mt-8 grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
                        <div className="min-w-0 space-y-8">
                            <section id="batch-downloads" className="scroll-mt-24" aria-labelledby="batch-downloads-title">
                                <div className="mb-5 flex items-start gap-3">
                                    <div className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"}`}>
                                        <Download className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 id="batch-downloads-title" className={`font-display text-2xl font-semibold ${textPrimary}`}>Pilihan unduhan</h2>
                                        <p className={`mt-1 text-sm leading-6 ${textSecondary}`}>Pilih kualitas, lalu buka salah satu penyedia unduhan.</p>
                                    </div>
                                </div>

                                {formats.length > 0 ? (
                                    <BatchDownloads key={batchId} formats={formats} isDark={isDark} />
                                ) : (
                                    <div className={`rounded-2xl border border-dashed px-5 py-10 text-center ${isDark ? "border-white/15 bg-white/[0.02]" : "border-zinc-300 bg-zinc-50"}`}>
                                        <FileArchive className={`mx-auto h-7 w-7 ${textSecondary}`} aria-hidden="true" />
                                        <h3 className={`mt-4 text-sm font-semibold ${textPrimary}`}>Tautan unduhan belum tersedia</h3>
                                        <p className={`mx-auto mt-2 max-w-sm text-sm leading-6 ${textSecondary}`}>Belum ada tautan untuk batch ini. Kamu bisa melihat pilihan lain di koleksi batch.</p>
                                        <Link to="/batch" className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark ? "text-red-400" : "text-red-600"}`}>
                                            Jelajahi koleksi <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                        </Link>
                                    </div>
                                )}
                            </section>

                            {batch.synopsis?.paragraphs?.length > 0 && (
                                <section className={`rounded-2xl border p-5 sm:p-6 ${surface}`} aria-labelledby="batch-synopsis-title">
                                    <h2 id="batch-synopsis-title" className={`flex items-center gap-2 font-display text-xl font-semibold ${textPrimary}`}>
                                        <BookOpen className={`h-5 w-5 ${textSecondary}`} aria-hidden="true" />
                                        Tentang anime
                                    </h2>
                                    <div className={`mt-4 space-y-3 text-sm leading-7 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                                        {batch.synopsis.paragraphs.map((paragraph, index) => <p key={index} className="wrap-anywhere">{paragraph}</p>)}
                                    </div>
                                </section>
                            )}
                        </div>

                        {meta.length > 0 && (
                            <aside className={`min-w-0 rounded-2xl border p-5 sm:p-6 ${surface}`} aria-labelledby="batch-info-title">
                                <h2 id="batch-info-title" className={`flex items-center gap-2 font-display text-xl font-semibold ${textPrimary}`}>
                                    <Info className={`h-5 w-5 ${textSecondary}`} aria-hidden="true" />
                                    Informasi anime
                                </h2>
                                <dl className="mt-5 grid min-w-0 grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-1">
                                    {meta.map(([label, value]) => (
                                        <div key={label} className="min-w-0">
                                            <dt className={`text-xs ${textSecondary}`}>{label}</dt>
                                            <dd className={`mt-1.5 wrap-anywhere text-sm font-semibold leading-6 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </aside>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
