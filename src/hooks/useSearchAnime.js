import { useState, useCallback, useRef } from "react";
import { api } from "../api/axios";
import { mapSearchAnimeList } from "../mappers/AnimeMapper";

export default function useAnimeSearch() {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [query, setQueryState] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [phase, setPhase] = useState("idle"); // idle | loading | results | error

    const abortRef = useRef(null);
    const requestIdRef = useRef(0);
    const lastSearchedRef = useRef("");

    const setQuery = useCallback((value) => {
        setQueryState(value);
        if (!value.trim()) {
            abortRef.current?.abort();
            setPhase("idle");
            setResults([]);
            setError(null);
            lastSearchedRef.current = "";
        } else if (value.trim() !== lastSearchedRef.current) {
            abortRef.current?.abort();
            setPhase("idle");
            setResults([]);
            setError(null);
        }
    }, []);

    const openSearch = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeSearch = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        setIsOpen(false);
    }, []);

    const resetSearch = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        lastSearchedRef.current = "";
        setQueryState("");
        setResults([]);
        setError(null);
        setPhase("idle");
        setIsOpen(false);
    }, []);

    const searchAnime = useCallback(async (keyword) => {
        const trimmed = keyword.trim();
        if (!trimmed) return;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        const requestId = ++requestIdRef.current;

        setIsOpen(true);
        setPhase("loading");
        setError(null);

        try {
            const response = await api.get("/anime/search", {
                params: { q: trimmed },
                signal: controller.signal,
            });

            if (requestId !== requestIdRef.current) return;

            const list = response.data?.data?.animeList ?? [];
            const mapped = mapSearchAnimeList(list);
            lastSearchedRef.current = trimmed;
            setResults(mapped);
            setPhase("results");
        } catch (err) {
            if (controller.signal.aborted || requestId !== requestIdRef.current) return;

            setError(
                err.response?.data?.message ||
                err.message ||
                "Gagal mencari anime"
            );
            setResults([]);
            setPhase("error");
        }
    }, []);

    return {
        query,
        setQuery,
        results,
        loading: phase === "loading",
        error,
        isOpen,
        phase,
        openSearch,
        searchAnime,
        closeSearch,
        resetSearch,
    };
}
