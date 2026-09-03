import { useTheme } from "../../context/ThemeContext";
import BatchPageHeader from "../../components/batch/BatchPageHeader";
import BatchSkeletonBlock from "./BatchSkeletonBlock";

function BatchCardSkeleton({ isDark, view }) {
    const isList = view === "list";
    const surface = isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white";

    return (
        <div className={`flex h-full min-w-0 overflow-hidden rounded-2xl border ${surface} ${isList ? "gap-3 p-3 sm:gap-4" : "flex-col"}`}>
            <BatchSkeletonBlock isDark={isDark} className={`shrink-0 ${isList ? "aspect-2/3 w-20 self-start rounded-xl sm:w-24" : "aspect-2/3 w-full rounded-none"}`}>
                {!isList && <div className="absolute inset-x-2 top-2 flex justify-between gap-2 sm:inset-x-3 sm:top-3">
                    <div className={`h-6 w-8 rounded-lg ${isDark ? "bg-black/25" : "bg-white/50"}`} />
                    <div className={`h-6 w-12 rounded-lg ${isDark ? "bg-black/25" : "bg-white/50"}`} />
                </div>}
            </BatchSkeletonBlock>
            <div className="flex min-w-0 flex-1 flex-col">
                <div className={`min-w-0 flex-1 ${isList ? "pt-0.5" : "p-3 pb-2.5 sm:p-4 sm:pb-3"}`}>
                    {isList && <div className="mb-1.5 flex h-[15px] items-center gap-2">
                        <BatchSkeletonBlock isDark={isDark} className="h-2.5 w-6" />
                        <BatchSkeletonBlock isDark={isDark} className="h-2.5 w-10" />
                    </div>}
                    <div className={`flex flex-col justify-center gap-2 ${isList ? "h-[42px]" : "h-[39px] sm:h-[42px]"}`}>
                        <BatchSkeletonBlock isDark={isDark} className="h-3 w-full" />
                        <BatchSkeletonBlock isDark={isDark} className="h-3 w-3/4" />
                    </div>
                    <div className="mt-1.5 flex h-5 items-center">
                        <BatchSkeletonBlock isDark={isDark} className="h-2.5 w-5/6" />
                    </div>
                    <div className="mt-2 flex h-4 items-center gap-1.5">
                        <BatchSkeletonBlock isDark={isDark} className="h-1 w-1 rounded-full" />
                        <BatchSkeletonBlock isDark={isDark} className="h-2 w-12" />
                    </div>
                </div>
                <div className={`flex min-h-11 items-center justify-between gap-2 ${isList ? "mt-1" : "mx-3 border-t py-2 sm:mx-4"} ${isDark ? "border-white/[0.08]" : "border-zinc-100"}`}>
                    <BatchSkeletonBlock isDark={isDark} className="h-2.5 w-20" />
                    <BatchSkeletonBlock isDark={isDark} className="h-3.5 w-3.5 shrink-0" />
                </div>
            </div>
        </div>
    );
}

export default function BatchListSkeleton({ isDark, view = "grid", count = 10 }) {
    return (
        <div role="status" aria-label="Memuat daftar batch" aria-busy="true">
            <span className="sr-only">Memuat daftar batch anime. Mohon tunggu.</span>
            <div aria-hidden="true" className={view === "grid"
                ? "grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 xl:grid-cols-5"
                : "grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-4"}>
                {Array.from({ length: count }, (_, index) => <BatchCardSkeleton key={index} isDark={isDark} view={view} />)}
            </div>
        </div>
    );
}

export function BatchPageSkeleton() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 md:px-8">
            <BatchPageHeader isDark={isDark} />
            <section className="mt-8 sm:mt-10" aria-label="Koleksi batch">
                <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                    <div className="min-w-0">
                        <h2 className={`font-display text-xl font-semibold tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-zinc-900"}`}>Jelajahi batch</h2>
                        <p className={`mt-1 text-xs leading-5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Memuat koleksi…</p>
                    </div>
                    <div aria-hidden="true" className={`flex shrink-0 gap-1 rounded-2xl border p-1 ${isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white"}`}>
                        <BatchSkeletonBlock isDark={isDark} className="h-11 w-11 rounded-xl" />
                        <BatchSkeletonBlock isDark={isDark} className="h-11 w-11 rounded-xl" />
                    </div>
                </div>
                <BatchListSkeleton isDark={isDark} />
            </section>
        </div>
    );
}
