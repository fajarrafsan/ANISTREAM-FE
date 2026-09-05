import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, RotateCcw, Search, SearchX } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useSearchResults from "../hooks/useSearchResults";
import SearchResultCard from "../components/search/SearchResultCard";
import BatchSkeletonBlock from "../skeletons/batch/BatchSkeletonBlock";

const GRID = "grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 xl:grid-cols-5";

function ResultSkeleton({ isDark }) {
    const surface = isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white";
    return (
        <div className={GRID} aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border ${surface}`}>
                    <BatchSkeletonBlock isDark={isDark} className="aspect-2/3 w-full shrink-0 rounded-none" />
                    <div className="min-w-0 flex-1 p-3 pb-2.5 sm:p-4 sm:pb-3">
                        <div className="flex h-[39px] flex-col justify-center gap-2 sm:h-[42px]">
                            <BatchSkeletonBlock isDark={isDark} className="h-3 w-full" />
                            <BatchSkeletonBlock isDark={isDark} className="h-3 w-3/4" />
                        </div>
                        <BatchSkeletonBlock isDark={isDark} className="mt-1.5 h-2.5 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function SearchPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";

    // Input dikelola lokal agar mengetik tidak memicu request tiap huruf;
    // URL baru diperbarui saat submit, dan URL itulah yang memicu pencarian.
    const [draft, setDraft] = useState(query);
    const { results, phase, error, retry } = useSearchResults(query);

    // Menekan Enter di header saat sudah berada di halaman ini hanya mengubah
    // URL, jadi input perlu ikut menyusul agar tidak menampilkan kata lama.
    useEffect(() => { setDraft(query); }, [query]);

    useEffect(() => {
        document.title = query
            ? `Hasil pencarian "${query}" | Rafsanime`
            : "Cari anime | Rafsanime";
    }, [query]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const next = draft.trim();
        if (!next || next === query) return;
        setSearchParams({ q: next });
    };

    const primaryText = isDark ? "text-white" : "text-zinc-900";
    const secondaryText = isDark ? "text-zinc-400" : "text-zinc-600";
    const surface = isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white";
    const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]";

    return (
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 md:px-8">
            <header>
                <h1 className={`font-display text-2xl font-semibold tracking-tight sm:text-3xl ${primaryText}`}>
                    {query ? <>Hasil untuk <span className="text-red-500 wrap-anywhere">{query}</span></> : "Cari anime"}
                </h1>
                <p className={`mt-1.5 text-xs leading-5 sm:text-sm ${secondaryText}`} role="status">
                    {phase === "loading" ? "Mencari…"
                        : phase === "error" ? "Pencarian belum bisa dimuat"
                        : phase === "results" ? `${results.length} anime ditemukan`
                        : "Ketik judul anime lalu tekan Enter."}
                </p>

                <form onSubmit={handleSubmit} role="search" className="mt-5 flex max-w-xl gap-2">
                    <label htmlFor="search-page-input" className="sr-only">Cari anime</label>
                    <div className="relative min-w-0 flex-1">
                        <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} aria-hidden="true" />
                        <input
                            id="search-page-input"
                            type="search"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="Judul anime…"
                            autoComplete="off"
                            className={`min-h-11 w-full rounded-xl border pl-10 pr-3 text-sm outline-none transition-colors ${focusRing} ${
                                isDark
                                    ? "border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-500"
                                    : "border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
                            }`}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 ${focusRing}`}
                    >
                        Cari
                    </button>
                </form>
            </header>

            <section aria-label="Hasil pencarian" className="mt-8 sm:mt-10">
                {phase === "loading" ? (
                    <ResultSkeleton isDark={isDark} />
                ) : phase === "error" ? (
                    <div className={`rounded-2xl border px-5 py-12 text-center sm:py-16 ${surface}`}>
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
                            <AlertCircle className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h2 className={`mt-4 font-display text-xl font-semibold ${primaryText}`}>Pencarian gagal</h2>
                        <p role="alert" className={`mx-auto mt-2 max-w-sm text-sm leading-6 ${secondaryText}`}>{error}</p>
                        <button
                            type="button"
                            onClick={retry}
                            className={`mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 ${focusRing}`}
                        >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            Coba lagi
                        </button>
                    </div>
                ) : phase === "results" && results.length === 0 ? (
                    <div className={`rounded-2xl border border-dashed px-5 py-12 text-center sm:py-16 ${surface}`}>
                        <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-500"}`}>
                            <SearchX className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h2 className={`mt-4 font-display text-xl font-semibold ${primaryText}`}>Tidak ada hasil</h2>
                        <p className={`mx-auto mt-2 max-w-sm text-sm leading-6 ${secondaryText}`}>
                            Tidak ada anime yang cocok dengan “{query}”. Coba kata kunci yang lebih pendek atau judul aslinya.
                        </p>
                    </div>
                ) : phase === "results" ? (
                    <ul aria-label={`Hasil pencarian ${query}`} className={GRID}>
                        {results.map((anime, index) => (
                            <li key={anime.animeId ?? index} className="min-w-0">
                                <SearchResultCard anime={anime} isDark={isDark} eager={index < 4} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={`rounded-2xl border border-dashed px-5 py-12 text-center sm:py-16 ${surface}`}>
                        <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-500"}`}>
                            <Search className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h2 className={`mt-4 font-display text-xl font-semibold ${primaryText}`}>Mulai pencarian</h2>
                        <p className={`mx-auto mt-2 max-w-sm text-sm leading-6 ${secondaryText}`}>
                            Ketik judul anime di kolom di atas, lalu tekan Enter.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
