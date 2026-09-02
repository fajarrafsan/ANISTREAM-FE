import { useState, useEffect, useCallback } from "react";
import { getBatchListApi, getBatchDetailApi } from "../api/batchApi";

export function useBatchList(page = 1) {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getBatchListApi(page);
            setItems(res?.data ?? []);
            setPagination(res?.pagination ?? null);
        } catch (err) {
            setError("Gagal memuat daftar batch.");
            console.warn("[useBatchList]", err.message);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    return { items, pagination, loading, error, refetch: fetchList };
}

export function useBatchDetail(batchId) {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!batchId) return;
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getBatchDetailApi(batchId);
                if (!cancelled) setBatch(res?.data ?? null);
            } catch (err) {
                if (!cancelled) setError("Gagal memuat detail batch.");
                console.warn("[useBatchDetail]", err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [batchId]);

    return { batch, loading, error };
}
