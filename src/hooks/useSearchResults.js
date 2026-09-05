import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../api/axios";
import { mapSearchAnimeList } from "../mappers/AnimeMapper";

// Hook untuk halaman /search, terpisah dari useAnimeSearch milik modal header.
// Keduanya hidup bersamaan di layar yang sama; kalau berbagi state, menutup
// modal akan ikut mengosongkan halaman hasil di belakangnya.
export default function useSearchResults(keyword) {
    const [results, setResults] = useState([]);
    const [phase, setPhase] = useState("idle"); // idle | loading | results | error
    const [error, setError] = useState(null);

    const abortRef = useRef(null);
    const requestIdRef = useRef(0);

    const run = useCallback(async (raw) => {
        const trimmed = (raw ?? "").trim();

        abortRef.current?.abort();

        if (!trimmed) {
            setPhase("idle");
            setResults([]);
            setError(null);
            return;
        }

        const controller = new AbortController();
        abortRef.current = controller;
        const requestId = ++requestIdRef.current;

        setPhase("loading");
        setError(null);

        try {
            const response = await api.get("/anime/search", {
                params: { q: trimmed },
                signal: controller.signal,
            });

            // Balasan yang datang terlambat dari kata kunci lama harus diabaikan,
            // bukan menimpa hasil kata kunci yang sedang ditampilkan.
            if (requestId !== requestIdRef.current) return;

            setResults(mapSearchAnimeList(response.data?.data?.animeList ?? []));
            setPhase("results");
        } catch (err) {
            if (controller.signal.aborted || requestId !== requestIdRef.current) return;
            setError(err.response?.data?.message || err.message || "Gagal mencari anime.");
            setResults([]);
            setPhase("error");
        }
    }, []);

    useEffect(() => {
        run(keyword);
        return () => abortRef.current?.abort();
    }, [keyword, run]);

    return {
        results,
        phase,
        error,
        loading: phase === "loading",
        retry: () => run(keyword),
    };
}
