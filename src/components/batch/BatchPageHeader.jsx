import { ArrowRight, Download, Package, Settings2 } from "lucide-react";

const DOWNLOAD_STEPS = [
    { icon: Package, label: "Pilih anime" },
    { icon: Settings2, label: "Pilih kualitas" },
    { icon: Download, label: "Unduh batch" },
];

export default function BatchPageHeader({ isDark }) {
    const primaryText = isDark ? "text-white" : "text-zinc-900";
    const secondaryText = isDark ? "text-zinc-400" : "text-zinc-600";
    const surface = isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white";

    return (
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
    );
}
