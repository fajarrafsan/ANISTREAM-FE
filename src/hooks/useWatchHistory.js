import { useCallback, useState, useEffect } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function useWatchHistory() {
    const { isLoggedIn } = useAuth();
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [continueWatching, setContinueWatching] = useState([]);
    const [continueLoading, setContinueLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        if (!isLoggedIn) return;
        setHistoryLoading(true);
        try {
            const res = await api.get("/anime/watch-history");
            setHistory(res.data.data ?? []);
        } catch (error) {
            console.warn("[useWatchHistory] Gagal ambil watch history:", error.message);
        } finally {
            setHistoryLoading(false);
        }
    }, [isLoggedIn]);

    // Episode yang belum tuntas (<95% durasi) — sudah difilter di server.
    const fetchContinueWatching = useCallback(async () => {
        if (!isLoggedIn) {
            setContinueWatching([]);
            return;
        }
        setContinueLoading(true);
        try {
            const res = await api.get("/anime/watch-history/continue");
            setContinueWatching(res.data.data ?? []);
        } catch (error) {
            console.warn("[useWatchHistory] Gagal ambil continue watching:", error.message);
        } finally {
            setContinueLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    useEffect(() => {
        fetchContinueWatching();
    }, [fetchContinueWatching]);

    const saveHistory = useCallback(async ({ animeId, episodeId, title, episodeTitle, poster, progressSeconds, durationSeconds }) => {
        try {
            await api.post("/anime/watch-history", {
                animeId, episodeId, title, episodeTitle, poster, progressSeconds, durationSeconds
            });
            // Update local state langsung agar responsif di UI
            setHistory(prev => {
                const filtered = prev.filter(h => h.episodeId !== episodeId);
                return [{ animeId, episodeId, title, episodeTitle, poster, progressSeconds, durationSeconds, watchedAt: new Date() }, ...filtered].slice(0, 20);
            });
        } catch (error) {
            console.warn("[useWatchHistory] Gagal simpan watch history:", error.message);
        }
    }, []);

    const deleteOne = useCallback(async (id) => {
        try {
            await api.delete(`/anime/watch-history/${id}`);
            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (error) {
            console.warn("[useWatchHistory] Gagal hapus watch history:", error.message);
        }
    }, []);

    const deleteAll = useCallback(async () => {
        try {
            await api.delete("/anime/watch-history/all");
            setHistory([]);
        } catch (error) {
            console.warn("[useWatchHistory] Gagal hapus semua watch history:", error.message);
        }
    }, []);

    return {
        history, historyLoading, saveHistory, deleteOne, deleteAll, fetchHistory,
        continueWatching, continueLoading, fetchContinueWatching,
    };
}
