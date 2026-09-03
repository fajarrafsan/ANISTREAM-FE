import { Link } from "react-router-dom";
import { ArrowUpRight, Package, Star } from "lucide-react";

export default function BatchCard({ batch, isDark, view, eager = false }) {
    const isList = view === "list";
    const isComplete = /^(completed|complete|selesai|tamat)$/i.test(batch.status?.trim() ?? "");
    const genres = batch.genres?.filter(Boolean).join(" · ");

    return (
        <Link
            to={`/batch/${encodeURIComponent(batch.batchId)}`}
            aria-label={`Lihat batch ${batch.title}`}
            title={batch.title}
            className={`group flex h-full min-w-0 overflow-hidden rounded-2xl border text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] ${
                isList ? "flex-row gap-3 p-3 sm:gap-4" : "flex-col"
            } ${isDark ? "border-white/10 bg-white/[0.03] hover:border-red-400/40 hover:bg-white/[0.05]" : "border-zinc-200 bg-white hover:border-red-300 hover:bg-red-50/20"}`}
        >
            <div className={`relative isolate shrink-0 overflow-hidden ${isDark ? "bg-zinc-900" : "bg-zinc-100"} ${isList ? "aspect-2/3 w-20 self-start rounded-xl sm:w-24" : "aspect-2/3 w-full"}`}>
                <div aria-hidden="true" className={`absolute inset-0 -z-10 grid place-items-center ${isDark ? "text-zinc-700" : "text-zinc-300"}`}>
                    <Package className={isList ? "h-8 w-8" : "h-12 w-12"} strokeWidth={1.25} />
                </div>
                {batch.poster && <img src={batch.poster} alt="" loading={eager ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                {!isList && (
                    <>
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10" />
                        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1.5 sm:inset-x-3 sm:top-3">
                            {batch.type && <span className="max-w-[55%] truncate rounded-lg border border-white/10 bg-black/75 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">{batch.type}</span>}
                            {batch.score && <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-black/75 px-1.5 py-1 text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm sm:px-2">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                                <span className="sr-only">Rating </span>{batch.score}
                            </span>}
                        </div>
                    </>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className={`min-w-0 flex-1 ${isList ? "pt-0.5" : "p-3 pb-2.5 sm:p-4 sm:pb-3"}`}>
                    {isList && <p className={`mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        <span className="uppercase tracking-wider">{batch.type || "Batch"}</span>
                        {batch.score && <span className="inline-flex items-center gap-1 tabular-nums"><Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" /><span className="sr-only">Rating </span>{batch.score}</span>}
                    </p>}
                    <h3 className={`line-clamp-2 wrap-anywhere font-semibold leading-[1.5] ${isList ? "text-sm" : "min-h-[39px] text-[13px] sm:min-h-[42px] sm:text-sm"} ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        {batch.title}
                    </h3>
                    <p className={`mt-1.5 truncate text-[11px] leading-5 sm:text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{genres || "Batch anime"}</p>
                    {batch.status && <p className={`mt-2 flex items-center gap-1.5 text-[10px] font-medium leading-4 sm:text-[11px] ${isComplete ? isDark ? "text-emerald-400" : "text-emerald-700" : isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-current" />
                        <span className="truncate">{isComplete ? "Selesai" : batch.status}</span>
                    </p>}
                </div>
                <div className={`flex min-h-11 items-center justify-between gap-1.5 text-[11px] font-semibold transition-colors sm:text-xs ${isList ? "mt-1" : "mx-3 border-t py-2 sm:mx-4"} ${isDark ? "border-white/[0.08] text-zinc-300 group-hover:text-red-400" : "border-zinc-100 text-zinc-600 group-hover:text-red-600"}`}>
                    <span>Lihat unduhan</span>
                    <ArrowUpRight className={`h-4 w-4 shrink-0 ${isDark ? "text-red-400" : "text-red-600"}`} aria-hidden="true" />
                </div>
            </div>
        </Link>
    );
}
