import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import useAnimeRating from "../../../hooks/useAnimeRating";

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function AnimeRating({ animeId }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { isLoggedIn } = useAuth();
    const { averageScore, count, userScore, loading, submitting, submitScore } = useAnimeRating(animeId);

    // Hover hanya untuk pratinjau visual; nilai sebenarnya tetap userScore.
    const [hovered, setHovered] = useState(null);
    const preview = hovered ?? userScore ?? 0;

    if (!animeId) return null;

    return (
        <section
            aria-labelledby="rating-judul"
            className={`rounded-2xl border p-3.5 sm:p-4 ${
                isDark ? "bg-white/[0.03] border-white/10" : "bg-black/[0.02] border-black/10"
            }`}
        >
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2
                    id="rating-judul"
                    className={`text-[11px] font-bold uppercase tracking-[0.18em] ${isDark ? "text-white/50" : "text-slate-500"}`}
                >
                    Rating Penonton
                </h2>

                <div className="flex items-baseline gap-1.5">
                    {loading ? (
                        <Loader2 className={`w-3.5 h-3.5 animate-spin ${isDark ? "text-white/40" : "text-slate-400"}`} aria-hidden="true" />
                    ) : averageScore != null ? (
                        <>
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                            <span className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                {averageScore.toFixed(1)}
                            </span>
                            <span className={`text-[10px] ${isDark ? "text-white/40" : "text-slate-500"}`}>
                                /10 · {count} penilai
                            </span>
                        </>
                    ) : (
                        <span className={`text-[10px] ${isDark ? "text-white/40" : "text-slate-500"}`}>
                            {isLoggedIn ? "Belum ada penilaian" : "Masuk untuk melihat & menilai"}
                        </span>
                    )}
                </div>
            </div>

            <div
                className="mt-3 flex items-center gap-1 sm:gap-1.5"
                onMouseLeave={() => setHovered(null)}
                role="group"
                aria-label="Beri nilai 1 sampai 10"
            >
                {SCORES.map((score) => {
                    const filled = score <= preview;
                    return (
                        <button
                            key={score}
                            type="button"
                            disabled={submitting}
                            onClick={() => submitScore(score)}
                            onMouseEnter={() => setHovered(score)}
                            onFocus={() => setHovered(score)}
                            onBlur={() => setHovered(null)}
                            aria-label={
                                score === userScore
                                    ? `Hapus nilai ${score} dari 10`
                                    : `Beri nilai ${score} dari 10`
                            }
                            aria-pressed={score === userScore}
                            className={`relative flex-1 min-w-0 h-11 rounded-lg cursor-pointer transition-colors duration-150 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                                isDark ? "focus-visible:ring-offset-[#0b0b12]" : "focus-visible:ring-offset-white"
                            } ${
                                filled
                                    ? "bg-red-500/85 hover:bg-red-500"
                                    : isDark
                                        ? "bg-white/[0.06] hover:bg-white/[0.12]"
                                        : "bg-black/[0.05] hover:bg-black/[0.1]"
                            }`}
                        >
                            <span
                                className={`text-[10px] font-bold tabular-nums ${
                                    filled ? "text-white" : isDark ? "text-white/45" : "text-slate-500"
                                }`}
                            >
                                {score}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className={`mt-2 text-[10px] ${isDark ? "text-white/35" : "text-slate-500"}`}>
                {userScore
                    ? `Nilaimu ${userScore}/10 — klik angka yang sama untuk membatalkan.`
                    : "Klik salah satu angka untuk memberi nilai."}
            </p>
        </section>
    );
}
