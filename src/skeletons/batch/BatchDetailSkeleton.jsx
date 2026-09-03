import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import BatchSkeletonBlock from "./BatchSkeletonBlock";

function ProviderSkeleton({ isDark, index }) {
    return (
        <div className={`flex min-h-11 min-w-0 items-center gap-2.5 rounded-xl border px-3 py-3 ${
            isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white"
        }`}>
            <BatchSkeletonBlock isDark={isDark} className="h-4 w-4 shrink-0 rounded" />
            <BatchSkeletonBlock isDark={isDark} className={`h-3.5 rounded ${index % 2 === 0 ? "w-24" : "w-20"}`} />
            <BatchSkeletonBlock isDark={isDark} className="ml-auto h-4 w-4 shrink-0 rounded" />
        </div>
    );
}

function DownloadSkeleton({ isDark, surface }) {
    return (
        <div className="min-w-0">
            <div className="mb-5 flex items-start gap-3">
                <BatchSkeletonBlock isDark={isDark} className="mt-0.5 h-11 w-11 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                    <div className="flex h-8 items-center">
                        <BatchSkeletonBlock isDark={isDark} className="h-6 w-44 rounded-md" />
                    </div>
                    <div className="mt-1 flex h-12 flex-col justify-center gap-3 sm:h-6 sm:items-start">
                        <BatchSkeletonBlock isDark={isDark} className="h-3.5 w-80 rounded" />
                        <BatchSkeletonBlock isDark={isDark} className="h-3.5 w-2/3 rounded sm:hidden" />
                    </div>
                </div>
            </div>

            <div className="min-w-0 space-y-4">
                <div className="flex min-w-0 flex-wrap gap-2">
                    {[0, 1, 2].map((item) => (
                        <BatchSkeletonBlock
                            key={item}
                            isDark={isDark}
                            className="h-11 min-w-11 flex-1 basis-20 rounded-xl sm:w-20 sm:flex-none sm:basis-auto"
                        />
                    ))}
                </div>

                <div className={`min-w-0 overflow-hidden rounded-2xl border ${surface}`}>
                    <div className={`flex min-w-0 items-center gap-3 border-b px-4 py-4 sm:px-5 ${
                        isDark ? "border-white/10 bg-white/[0.02]" : "border-zinc-200/80 bg-zinc-50/80"
                    }`}>
                        <BatchSkeletonBlock isDark={isDark} className="h-10 w-10 shrink-0 rounded-xl" />
                        <div className="min-w-0 flex-1">
                            <div className="flex h-4 items-center">
                                <BatchSkeletonBlock isDark={isDark} className="h-2.5 w-28 rounded" />
                            </div>
                            <div className="mt-0.5 flex h-7 items-center">
                                <BatchSkeletonBlock isDark={isDark} className="h-4 w-16 rounded" />
                            </div>
                        </div>
                        <BatchSkeletonBlock isDark={isDark} className="h-5 w-6 shrink-0 rounded" />
                    </div>

                    <div className={`divide-y ${isDark ? "divide-white/10" : "divide-zinc-200/80"}`}>
                        {[0, 1, 2].map((quality) => (
                            <div key={quality} className="grid min-w-0 gap-3 p-4 sm:p-5 xl:grid-cols-[130px_minmax(0,1fr)] xl:gap-5">
                                <div className="min-w-0 xl:pt-1">
                                    <div className="flex h-5 items-center">
                                        <BatchSkeletonBlock isDark={isDark} className="h-3.5 w-16 rounded" />
                                    </div>
                                    <div className="mt-1 flex h-4 items-center">
                                        <BatchSkeletonBlock isDark={isDark} className="h-2.5 w-20 rounded" />
                                    </div>
                                </div>
                                <div className="grid min-w-0 gap-2 min-[420px]:grid-cols-2">
                                    {[0, 1, 2, 3, 4, 5].map((provider) => <ProviderSkeleton key={provider} index={provider} isDark={isDark} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BatchDetailSkeleton({ isDark }) {
    const surface = isDark
        ? "border-white/10 bg-white/[0.03]"
        : "border-zinc-200 bg-white shadow-sm shadow-zinc-200/30";

    return (
        <div role="status" aria-live="polite" aria-busy="true" aria-label="Memuat detail batch" className="mt-5">
            <div aria-hidden="true">
                <div className={`overflow-hidden rounded-2xl border ${surface}`}>
                    <div className="relative grid min-w-0 gap-5 p-5 sm:grid-cols-[184px_minmax(0,1fr)] sm:gap-7 sm:p-8 lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-9">
                        <BatchSkeletonBlock
                            isDark={isDark}
                            className={`aspect-2/3 w-32 shrink-0 rounded-xl border shadow-xl sm:w-full ${
                                isDark ? "border-white/10 shadow-black/20" : "border-zinc-200 shadow-zinc-200/50"
                            }`}
                        />
                        <div className="min-w-0 self-center">
                            <div className="flex h-4 items-center">
                                <BatchSkeletonBlock isDark={isDark} className="h-2.5 w-28 rounded" />
                            </div>
                            <div className="mt-3 space-y-2">
                                <BatchSkeletonBlock isDark={isDark} className="h-6 w-full rounded-md sm:h-8 lg:h-9" />
                                <BatchSkeletonBlock isDark={isDark} className="h-6 w-3/4 rounded-md sm:h-8 lg:h-9" />
                                <BatchSkeletonBlock isDark={isDark} className="h-6 w-1/2 rounded-md sm:hidden" />
                            </div>
                            <div className="mt-2 flex h-6 items-center">
                                <BatchSkeletonBlock isDark={isDark} className="h-3 w-2/3 rounded" />
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                {["w-16", "w-12", "w-24"].map((width) => (
                                    <BatchSkeletonBlock key={width} isDark={isDark} className={`h-8 rounded-lg ${width}`} />
                                ))}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                                {["w-12", "w-16", "w-20"].map((width) => (
                                    <div key={width} className="flex h-5 items-center">
                                        <BatchSkeletonBlock isDark={isDark} className={`h-2.5 rounded ${width}`} />
                                    </div>
                                ))}
                            </div>
                            <BatchSkeletonBlock isDark={isDark} className="mt-6 h-11 w-44 rounded-xl" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
                    <div className="min-w-0 space-y-8">
                        <DownloadSkeleton isDark={isDark} surface={surface} />
                        <div className={`rounded-2xl border p-5 sm:p-6 ${surface}`}>
                            <div className="flex h-7 items-center gap-2">
                                <BatchSkeletonBlock isDark={isDark} className="h-5 w-5 shrink-0 rounded" />
                                <BatchSkeletonBlock isDark={isDark} className="h-5 w-32 rounded" />
                            </div>
                            <div className="mt-4 space-y-3">
                                {["w-full", "w-full", "w-5/6", "w-2/3"].map((width, index) => (
                                    <div key={index} className="flex h-4 items-center">
                                        <BatchSkeletonBlock isDark={isDark} className={`h-3 rounded ${width}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`min-w-0 rounded-2xl border p-5 sm:p-6 ${surface}`}>
                        <div className="flex h-7 items-center gap-2">
                            <BatchSkeletonBlock isDark={isDark} className="h-5 w-5 shrink-0 rounded" />
                            <BatchSkeletonBlock isDark={isDark} className="h-5 w-36 rounded" />
                        </div>
                        <div className="mt-5 grid min-w-0 grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-1">
                            {[0, 1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="min-w-0">
                                    <div className="flex h-4 items-center">
                                        <BatchSkeletonBlock isDark={isDark} className="h-2.5 w-12 rounded" />
                                    </div>
                                    <div className="mt-1.5 flex h-6 items-center">
                                        <BatchSkeletonBlock isDark={isDark} className={`h-3.5 rounded ${item % 2 === 0 ? "w-20" : "w-28"}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <span className="sr-only">Memuat informasi anime dan pilihan unduhan batch.</span>
        </div>
    );
}

export function BatchDetailPageSkeleton() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 md:px-8">
            <div className="flex min-w-0 items-center gap-3" aria-hidden="true">
                <span className={`inline-flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-3 text-xs font-semibold ${
                    isDark ? "border-white/10 bg-white/[0.03] text-zinc-300" : "border-zinc-200 bg-white text-zinc-600"
                }`}>
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    Semua batch
                </span>
                <span className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Detail batch</span>
            </div>
            <BatchDetailSkeleton isDark={isDark} />
        </div>
    );
}
