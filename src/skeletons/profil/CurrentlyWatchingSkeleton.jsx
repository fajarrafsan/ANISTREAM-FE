import { useTheme } from '../../context/ThemeContext';

export default function CurrentlyWatchingSkeleton({ compact = false }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={compact
            ? '-mx-3.5 flex gap-3 overflow-hidden px-3.5 pb-3 sm:mx-0 sm:gap-4 sm:px-0'
            : 'grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'
        }>
            {/* Merender 3 buah kerangka dummy */}
            {Array.from({ length: 3 }).map((_, idx) => (
                <div
                    key={idx}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${compact
                        ? 'w-[82vw] max-w-[280px] shrink-0 sm:w-[calc((100%_-_1rem)/2)] sm:max-w-none lg:w-[calc((100%_-_2rem)/3)]'
                        : ''
                    } ${isDark
                            ? "bg-[#0f0f0f] border-white/5"
                            : "bg-white border-neutral-100"
                        }`}
                >
                    {/* Skeleton Gambar (Aspect Video) */}
                    <div className={`relative aspect-video w-full animate-pulse ${isDark ? "bg-white/10" : "bg-neutral-200"
                        }`} />

                    {/* Skeleton Konten Teks */}
                    <div className="p-4 sm:p-5 flex flex-col gap-3">
                        <div>
                            {/* Skeleton "Currently At" & "Episode" */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`h-2.5 w-16 rounded-sm animate-pulse ${isDark ? "bg-white/5" : "bg-neutral-200/80"
                                    }`} />
                                <span className={`w-1 h-1 rounded-full animate-pulse ${isDark ? "bg-white/20" : "bg-neutral-300"
                                    }`} />
                                <div className={`h-2.5 w-10 rounded-sm animate-pulse ${isDark ? "bg-white/10" : "bg-neutral-200"
                                    }`} />
                            </div>

                            {/* Skeleton Judul Animasi (Variasi Lebar) */}
                            <div className={`h-4 rounded-md animate-pulse ${isDark ? "bg-white/10" : "bg-neutral-200"
                                } ${idx === 1 ? 'w-3/4' : 'w-5/6'}`} />
                        </div>

                        {/* Skeleton Progress Bar */}
                        <div className="mt-1">
                            <div className="flex justify-between items-center mb-2">
                                <div className={`h-2 w-12 rounded-sm animate-pulse ${isDark ? "bg-white/5" : "bg-neutral-200/80"
                                    }`} />
                                <div className={`h-2 w-6 rounded-sm animate-pulse ${isDark ? "bg-white/10" : "bg-neutral-200"
                                    }`} />
                            </div>
                            <div className={`w-full rounded-full h-1.5 overflow-hidden shadow-inner ${isDark ? "bg-white/5" : "bg-neutral-100"
                                }`}>
                                {/* Batang Progress Palsu yang sedang di-load */}
                                <div className={`h-full rounded-full animate-pulse ${isDark ? "bg-white/10" : "bg-neutral-200"
                                    }`} style={{ width: `${40 + (idx * 20)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
