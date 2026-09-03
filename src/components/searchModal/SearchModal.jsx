import { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSearchHistory from "../../hooks/useSearchHistory";
import LoadingState from "./sections/LoadingState";
import ErrorState from "./sections/ErrorState";
import EmptyState from "./sections/EmptyState";
import HistorySection from "./sections/HistorySection";
import ResultsSection from "./sections/ResultsSection";

export default function SearchModal({
    isOpen,
    results,
    phase,
    query,
    onClose,
    isDark,
    anchorRef,
    onSubmit,
    searchLoading,
    isMobile = false,
}) {
    const modalRef = useRef(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { history, historyLoading, saveHistory, deleteOne, deleteAll } =
        useSearchHistory();

    const handleClose = useCallback(() => {
        onClose?.();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                handleClose();
            }
        };

        const handlePointerDown = (e) => {
            const insideModal = modalRef.current?.contains(e.target);
            const insideAnchor = anchorRef?.current?.contains(e.target);
            if (!insideModal && !insideAnchor) {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("pointerdown", handlePointerDown, true);

        if (isMobile) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("pointerdown", handlePointerDown, true);
            if (isMobile) {
                document.body.style.overflow = "";
            }
        };
    }, [isOpen, handleClose, anchorRef, isMobile]);

    if (!isOpen) return null;

    const showHistory = phase === "idle";
    const showResults = phase === "results" && results.length > 0;
    const isEmpty = phase === "results" && results.length === 0;
    const isLoading = phase === "loading";
    const hasError = phase === "error";

    const handleSelectAnime = (anime) => {
        if (!anime?.animeId) return;
        if (isLoggedIn) {
            saveHistory({
                keyword: query || anime.title,
                animeId: anime.animeId,
                title: anime.title,
                poster: anime.poster ?? null,
                type: anime.type ?? null,
            });
        }
        handleClose();
        navigate(`/anime/detail/${anime.animeId}`);
    };

    const handleSelectHistory = (item) => {
        if (!item?.animeId) return;
        handleClose();
        navigate(`/anime/detail/${item.animeId}`);
    };

    return (
        <>
            {isMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
                    onClick={handleClose}
                    aria-hidden="true"
                />
            )}

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label="Pencarian anime"
                className={`
                    fixed z-50 flex flex-col
                    left-3 right-3 top-[4.5rem] max-h-[min(70vh,520px)]
                    md:absolute md:top-full md:mt-2 md:left-auto md:right-0
                    md:w-[min(440px,calc(100vw-2rem))] md:max-h-[480px]
                    rounded-2xl overflow-hidden border
                    ${isDark
                        ? "bg-[#101017] border-white/10"
                        : "bg-white border-slate-200 shadow-xl"
                    }
                `}
                style={{
                    boxShadow: isDark
                        ? "0 25px 50px -12px rgba(0,0,0,0.9), 0 0 40px rgba(255,30,86,0.08)"
                        : "0 25px 50px -12px rgba(0,0,0,0.15)",
                }}
            >
                {/* Hint bar */}
                <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${
                    isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-black/[0.05] bg-black/[0.02]"
                }`}>
                    <p className={`text-[10px] font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>
                        {searchLoading
                            ? "Sedang mencari..."
                            : query.trim()
                                ? `Ketik Enter untuk cari "${query.trim()}"`
                                : "Riwayat pencarian atau ketik keyword"}
                    </p>
                    <button
                        type="button"
                        onClick={handleClose}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md cursor-pointer ${
                            isDark ? "text-white/50 hover:text-white hover:bg-white/[0.06]" : "text-gray-500 hover:bg-black/[0.04]"
                        }`}
                    >
                        Tutup
                    </button>
                </div>

                <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
                    {isLoading && <LoadingState isDark={isDark} />}

                    {hasError && !isLoading && (
                        <ErrorState isDark={isDark} onRetry={() => onSubmit?.()} />
                    )}

                    {isEmpty && !isLoading && <EmptyState isDark={isDark} />}

                    {showHistory && !isLoading && (
                        <HistorySection
                            isDark={isDark}
                            isLoggedIn={isLoggedIn}
                            history={history}
                            historyLoading={historyLoading}
                            onSelectHistory={handleSelectHistory}
                            onDeleteOne={deleteOne}
                            onDeleteAll={deleteAll}
                        />
                    )}

                    {showResults && !isLoading && (
                        <ResultsSection
                            isDark={isDark}
                            results={results}
                            query={query}
                            onSelectAnime={handleSelectAnime}
                            onClose={handleClose}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
