import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import useToast from "./useToast";
import { rateAnimeApi, getAnimeRatingApi } from "../api/ratingApi";

export default function useAnimeRating(animeId) {
    const { isLoggedIn } = useAuth();
    const toast = useToast();

    const [averageScore, setAverageScore] = useState(null);
    const [count, setCount] = useState(0);
    const [userScore, setUserScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchRating = useCallback(async () => {
        // Endpoint agregat masih di balik auth, jadi tamu tidak bisa memuatnya.
        if (!animeId || !isLoggedIn) return;
        setLoading(true);
        try {
            const res = await getAnimeRatingApi(animeId);
            const data = res?.data ?? {};
            setAverageScore(data.averageScore ?? null);
            setCount(data.count ?? 0);
            setUserScore(data.userScore ?? null);
        } catch (error) {
            console.warn("[useAnimeRating] Gagal ambil rating:", error.message);
        } finally {
            setLoading(false);
        }
    }, [animeId, isLoggedIn]);

    useEffect(() => {
        fetchRating();
    }, [fetchRating]);

    // Klik skor yang sama = batalkan rating (server memperlakukan 0 sebagai hapus).
    const submitScore = useCallback(async (score) => {
        if (!isLoggedIn) {
            toast.warning("Silakan masuk terlebih dahulu untuk memberi rating.", 3000);
            return;
        }
        if (submitting) return;

        const nextScore = score === userScore ? 0 : score;
        const previous = userScore;

        setSubmitting(true);
        setUserScore(nextScore === 0 ? null : nextScore);   // optimistis

        try {
            await rateAnimeApi({ animeId, score: nextScore });
            await fetchRating();                             // ambil rata-rata terbaru
            toast.success(nextScore === 0 ? "Rating dihapus." : `Rating ${nextScore}/10 tersimpan.`, 2500);
        } catch (error) {
            setUserScore(previous);                          // kembalikan bila gagal
            toast.error("Gagal menyimpan rating. Coba lagi.", 3000);
            console.warn("[useAnimeRating] Gagal simpan:", error.message);
        } finally {
            setSubmitting(false);
        }
    }, [isLoggedIn, submitting, userScore, animeId, fetchRating, toast]);

    return { averageScore, count, userScore, loading, submitting, submitScore, fetchRating };
}
