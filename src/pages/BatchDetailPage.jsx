import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Loader2, AlertCircle, Star } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useBatchDetail } from "../hooks/useBatch";

export default function BatchDetailPage() {
    const { batchId } = useParams();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const { batch, loading, error } = useBatchDetail(batchId);

    if (loading) {
        return (
            <div className="grid place-items-center py-32" role="status" aria-live="polite">
                <Loader2 className={`w-7 h-7 animate-spin ${isDark ? "text-white/40" : "text-gray-400"}`} aria-hidden="true" />
                <span className="sr-only">Memuat detail batch</span>
            </div>
        );
    }

    if (error || !batch) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                <AlertCircle className="w-8 h-8 mx-auto text-red-500" aria-hidden="true" />
                <p className={`mt-3 text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {error ?? "Batch tidak ditemukan."}
                </p>
                <Link to="/batch" className="inline-block mt-5 text-xs font-bold text-red-500 hover:text-red-400">
                    Kembali ke daftar batch
                </Link>
            </div>
        );
    }

    const meta = [
        ["Tipe", batch.type],
        ["Status", batch.status],
        ["Episode", batch.episodes],
        ["Durasi", batch.duration],
        ["Studio", batch.studios],
        ["Musim", batch.season],
        ["Rilis", batch.releasedOn || batch.aired],
    ].filter(([, value]) => value);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className={`inline-flex items-center gap-1.5 min-h-11 text-xs font-bold cursor-pointer bg-transparent border-none p-0 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    isDark ? "text-white/55 hover:text-white" : "text-gray-500 hover:text-gray-900"
                }`}
            >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Kembali
            </button>

            <header className="mt-4 flex flex-col sm:flex-row gap-5">
                {batch.poster && (
                    <img
                        src={batch.poster}
                        alt=""
                        className="w-36 sm:w-44 shrink-0 rounded-xl object-cover self-start"
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                )}

                <div className="min-w-0">
                    <h1 className={`font-display text-xl sm:text-3xl font-black leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                        {batch.title}
                    </h1>

                    {batch.japanese && (
                        <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{batch.japanese}</p>
                    )}

                    {batch.score && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                            <span className={isDark ? "text-white" : "text-gray-900"}>{batch.score}</span>
                        </p>
                    )}

                    {batch.genres?.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5 mt-3">
                            {batch.genres.map((genre) => (
                                <li
                                    key={genre}
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                        isDark ? "bg-white/[0.06] text-white/65" : "bg-black/[0.05] text-gray-600"
                                    }`}
                                >
                                    {genre}
                                </li>
                            ))}
                        </ul>
                    )}

                    {meta.length > 0 && (
                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4">
                            {meta.map(([label, value]) => (
                                <div key={label}>
                                    <dt className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-white/35" : "text-gray-400"}`}>
                                        {label}
                                    </dt>
                                    <dd className={`text-[11px] font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </header>

            {batch.synopsis?.paragraphs?.length > 0 && (
                <section className="mt-8">
                    <h2 className={`text-[11px] font-bold uppercase tracking-[0.18em] mb-2 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                        Sinopsis
                    </h2>
                    {batch.synopsis.paragraphs.map((paragraph, i) => (
                        <p key={i} className={`text-xs leading-relaxed mb-2 ${isDark ? "text-white/65" : "text-gray-700"}`}>
                            {paragraph}
                        </p>
                    ))}
                </section>
            )}

            <section className="mt-8">
                <h2 className={`text-[11px] font-bold uppercase tracking-[0.18em] mb-3 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                    Tautan Unduhan
                </h2>

                {batch.downloadUrl?.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {batch.downloadUrl.map((format) => (
                            <div
                                key={format.title}
                                className={`rounded-2xl border p-4 ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-black/10 shadow-sm"}`}
                            >
                                <p className={`text-xs font-black uppercase tracking-wide mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                                    {format.title}
                                </p>

                                <div className="flex flex-col gap-3">
                                    {format.qualities?.map((quality) => (
                                        <div key={quality.title}>
                                            <p className={`text-[10px] font-bold mb-1.5 ${isDark ? "text-white/45" : "text-gray-500"}`}>
                                                {quality.title}
                                            </p>
                                            <ul className="flex flex-wrap gap-2">
                                                {quality.urls?.map((item) => (
                                                    <li key={item.title + item.url}>
                                                        {/* Tautan pihak ketiga — dibuka di tab baru, tanpa membocorkan referrer. */}
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer nofollow"
                                                            className={`inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-lg border text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                                                                isDark
                                                                    ? "bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.09] hover:text-white focus-visible:ring-offset-[#0a0a0f]"
                                                                    : "bg-black/[0.03] border-black/10 text-gray-700 hover:bg-black/[0.06] focus-visible:ring-offset-white"
                                                            }`}
                                                        >
                                                            <Download className="w-3.5 h-3.5" aria-hidden="true" />
                                                            {item.title}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={`text-xs ${isDark ? "text-white/45" : "text-gray-500"}`}>
                        Tidak ada tautan unduhan untuk batch ini.
                    </p>
                )}
            </section>
        </div>
    );
}
