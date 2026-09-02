import { useNavigate } from "react-router-dom";
import { Play, History } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useWatchHistory from "../../hooks/useWatchHistory";

// Persentase progres; tanpa durasi kita tidak bisa tahu, jadi tampilkan 0.
function percentOf(item) {
    if (!item?.durationSeconds || !item?.progressSeconds) return 0;
    return Math.min(100, Math.round((item.progressSeconds / item.durationSeconds) * 100));
}

function formatRemaining(item) {
    if (!item?.durationSeconds) return null;
    const left = Math.max(0, item.durationSeconds - (item.progressSeconds ?? 0));
    const minutes = Math.round(left / 60);
    return minutes > 0 ? `${minutes} menit lagi` : "Hampir selesai";
}

export default function ContinueWatching() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { isLoggedIn } = useAuth();
    const { continueWatching, continueLoading } = useWatchHistory();
    const navigate = useNavigate();

    // Baris ini tidak punya arti untuk tamu atau ketika tidak ada yang tertunda.
    if (!isLoggedIn || continueLoading || continueWatching.length === 0) return null;

    return (
        <section
            aria-labelledby="lanjutkan-nonton-judul"
            className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8"
        >
            <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-red-500/15 grid place-items-center text-red-500">
                    <History className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                    <h2
                        id="lanjutkan-nonton-judul"
                        className={`font-display text-lg sm:text-xl uppercase tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                        Lanjutkan Nonton
                    </h2>
                    <p className={`text-[10px] ${isDark ? "text-white/40" : "text-gray-500"}`}>
                        Episode yang belum selesai kamu tonton
                    </p>
                </div>
            </div>

            <ul className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                {continueWatching.map((item) => {
                    const percent = percentOf(item);
                    const remaining = formatRemaining(item);

                    return (
                        <li key={item.id ?? item.episodeId} className="shrink-0 w-[190px] sm:w-[230px]">
                            <button
                                type="button"
                                onClick={() => navigate(`/episode/${item.episodeId}`)}
                                className={`group w-full text-left rounded-xl overflow-hidden border cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                                    isDark
                                        ? "bg-white/[0.03] border-white/10 hover:border-white/20 focus-visible:ring-offset-[#0a0a0f]"
                                        : "bg-white border-black/10 hover:border-black/20 shadow-sm focus-visible:ring-offset-white"
                                }`}
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    {item.poster ? (
                                        <img
                                            src={item.poster}
                                            alt=""
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => { e.target.style.opacity = "0"; }}
                                        />
                                    ) : (
                                        <div className={`w-full h-full ${isDark ? "bg-zinc-900" : "bg-gray-200"}`} />
                                    )}

                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                                    <span className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="grid size-11 place-items-center rounded-full bg-red-600/90 text-white">
                                            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                                        </span>
                                    </span>

                                    {/* Bar progres nyata dari posisi tontonan terakhir */}
                                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/50">
                                        <div
                                            className="h-full bg-red-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="p-2.5">
                                    <p className={`text-[11px] font-bold line-clamp-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                                        {item.title}
                                    </p>
                                    <p className={`text-[10px] mt-0.5 line-clamp-1 ${isDark ? "text-white/45" : "text-gray-500"}`}>
                                        {item.episodeTitle ?? "Episode"}
                                        {remaining ? ` · ${remaining}` : ""}
                                    </p>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
