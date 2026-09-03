import { useEffect, useCallback } from "react";
import { fetchCommentsApi, fetchRepliesApi } from "./commentService";
import { SORT_LIST, DEFAULT_LIMIT } from "./constants";

export default function useCommentFetch({
    animeId,
    cacheRef,
    sortRef,
    toastRef,
    setComments,
    setTotal,
    setPage,
    setHasMore,
    setLikedIds,
    setSort,
    setLoading,
    setLoadingMore,
    loadingMore,
    hasMore,
    page,
}) {
    const fetchComments = useCallback(
        async ({ nextSort, nextPage = 1 } = {}) => {
            if (!animeId) return;

            const effectiveSort = nextSort ?? sortRef.current;
            const isFirstPage = nextPage === 1;

            if (isFirstPage) setLoading(true);
            else setLoadingMore(true);

            try {
                const data = await fetchCommentsApi(animeId, effectiveSort, nextPage, DEFAULT_LIMIT);
                const fetched = data.comments || [];

                setComments((prev) => (isFirstPage ? fetched : [...prev, ...fetched]));
                setTotal(data.total ?? 0);
                setHasMore(Boolean(data.hasMore));
                setPage(data.page ?? nextPage);

                if (isFirstPage) {
                    setLikedIds(new Set(data.likedIds || []));
                } else {
                    setLikedIds((prev) => {
                        const next = new Set(prev);
                        (data.likedIds || []).forEach((id) => next.add(id));
                        return next;
                    });
                }

                cacheRef.current[effectiveSort] = {
                    comments: isFirstPage
                        ? fetched
                        : [...(cacheRef.current[effectiveSort]?.comments || []), ...fetched],
                    total: data.total ?? 0,
                    page: data.page ?? nextPage,
                    hasMore: Boolean(data.hasMore),
                    likedIds: isFirstPage
                        ? data.likedIds || []
                        : [...(cacheRef.current[effectiveSort]?.likedIds || []), ...(data.likedIds || [])],
                };
            } catch (err) {
                console.error("[useComments] fetch error:", err);
                if (isFirstPage) toastRef.current.error("Gagal memuat komentar", 3000);
            } finally {
                if (isFirstPage) setLoading(false);
                else setLoadingMore(false);
            }
        },
        [animeId, sortRef, toastRef, cacheRef, setComments, setTotal, setPage, setHasMore, setLikedIds, setLoading, setLoadingMore]
    );

    const applyCache = useCallback(
        (sortType) => {
            const cached = cacheRef.current[sortType];
            if (!cached) return false;
            setComments(cached.comments);
            setTotal(cached.total);
            setPage(cached.page);
            setHasMore(cached.hasMore);
            setLikedIds(new Set(cached.likedIds));
            return true;
        },
        [cacheRef, setComments, setTotal, setPage, setHasMore, setLikedIds]
    );

    useEffect(() => {
        if (!animeId) {
            setComments([]);
            setTotal(0);
            setHasMore(false);
            setLikedIds(new Set());
            cacheRef.current = {};
            setLoading(false);
            return;
        }
        let cancelled = false;

        const initial = async () => {
            if (cancelled) return;
            setLoading(true);
            setComments([]);
            setTotal(0);
            setPage(1);
            setSort("newest");
            sortRef.current = "newest";
            cacheRef.current = {};

            try {
                const results = await Promise.all(
                    SORT_LIST.map((s) =>
                        fetchCommentsApi(animeId, s, 1, DEFAULT_LIMIT).then((data) => ({ sort: s, data }))
                    )
                );

                if (cancelled) return;
                results.forEach(({ sort: s, data }) => {
                    cacheRef.current[s] = {
                        comments: data.comments || [],
                        total: data.total ?? 0,
                        page: data.page ?? 1,
                        hasMore: Boolean(data.hasMore),
                        likedIds: data.likedIds || [],
                    };
                });

                const newest = cacheRef.current["newest"];
                setComments(newest.comments);
                setTotal(newest.total);
                setPage(newest.page);
                setHasMore(newest.hasMore);
                setLikedIds(new Set(newest.likedIds));
            } catch (err) {
                if (cancelled) return;
                console.error("[useComments] initial fetch error:", err);
                toastRef.current.error("Gagal memuat komentar", 3000);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        initial();
        return () => {
            cancelled = true;
        };
    }, [animeId]);

    const changeSort = useCallback(
        (newSort) => {
            if (newSort === sortRef.current) return;
            setSort(newSort);
            sortRef.current = newSort;

            const cached = cacheRef.current[newSort];
            if (cached) {
                applyCache(newSort);
            } else {
                fetchComments({ nextSort: newSort, nextPage: 1 });
            }
        },
        [fetchComments, applyCache]
    );

    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;
        fetchComments({ nextPage: page + 1 });
    }, [loadingMore, hasMore, page, fetchComments]);

    const fetchReplies = useCallback(async (parentId) => {
        try {
            return await fetchRepliesApi(parentId);
        } catch (err) {
            console.error("[useComments] fetch replies error:", err);
            toastRef.current.error("Gagal memuat balasan", 2500);
            return [];
        }
    }, [toastRef]);

    return { fetchComments, applyCache, changeSort, loadMore, fetchReplies };
}
