import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Wishlist({ wishlist = [], loading, onRemove, isExpanded, setIsExpanded }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [brokenImages, setBrokenImages] = useState({});

    const collapsedLimit = 6;
    const itemsPerPage = 12;

    useEffect(() => {
        if (!isExpanded) {
            setCurrentPage(1);
        }
    }, [isExpanded]);

    // Reset broken image state when wishlist data changes (re-fetch, page nav, etc.)
    useEffect(() => {
        setBrokenImages({});
    }, [wishlist]);

    const totalPages = Math.ceil(wishlist.length / itemsPerPage);

    const displayedWishlist = isExpanded
        ? wishlist.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : wishlist.slice(0, collapsedLimit);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleImageError = (id) => {
        setBrokenImages(prev => ({ ...prev, [id]: true }));
    };

    const handleItemClick = (animeId) => {
        if (animeId) {
            navigate(`/anime/detail/${animeId}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        // Smooth scroll kembali ke header wishlist saat di-collapse agar rapi
        setTimeout(() => {
            document.getElementById('wishlist-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    if (loading) {
        return (
            <section className="relative w-full">
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                    <div className="flex items-center gap-4 animate-pulse">
                        <div className={`w-1.5 h-7 rounded-full ${isDark ? 'bg-[#ec001d]/50' : 'bg-red-300'}`} />
                        <div className={`h-6 w-40 rounded-lg ${isDark ? 'bg-neutral-800/80' : 'bg-neutral-200'}`} />
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className={`relative aspect-2/3 rounded-[24px] overflow-hidden ${isDark ? 'bg-neutral-800/40 border border-white/5' : 'bg-neutral-200/50 border border-black/5'}`}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="wishlist-section" className="relative w-full scroll-mt-24">
            {/* INJEKSI CSS KEYFRAMES UNTUK TRANSISI KARTU PREMIUM */}
            <style>{`
                @keyframes cardEntrance {
                    0% { opacity: 0; transform: translateY(40px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-card-entrance {
                    animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    opacity: 0; /* Pastikan invisible sebelum animasi dimulai */
                }
            `}</style>

            <div className="flex items-center justify-between mb-8 sm:mb-10">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative flex items-center justify-center w-1.5 h-7">
                        <div className="absolute inset-0 bg-[#ec001d] blur-[8px] opacity-70 dark:opacity-100 rounded-full" />
                        <div className="relative w-full h-full bg-gradient-to-b from-[#ff4a5a] to-[#a60014] rounded-full shadow-[0_0_10px_rgba(236,0,29,0.5)]" />
                    </div>
                    <h2 className={`font-sora text-base md:text-lg font-extrabold tracking-widest uppercase bg-clip-text text-transparent transition-colors duration-300 ${isDark ? "bg-gradient-to-r from-white via-neutral-200 to-neutral-500" : "bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-400"}`}>
                        My Wishlist
                    </h2>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 rounded-full border backdrop-blur-xl shadow-sm transition-colors duration-300 ${isDark ? "bg-white/[0.03] border-white/10 text-neutral-300" : "bg-black/[0.02] border-black/10 text-neutral-600"}`}>
                    <span className={`material-symbols-outlined text-[16px] text-[#ec001d]`}>bookmarks</span>
                    <span className="text-[10px] sm:text-xs font-bold font-mono tracking-[0.15em] pt-px">
                        {wishlist.length} ITEMS
                    </span>
                </div>
            </div>

            {wishlist.length === 0 ? (
                <div className={`relative overflow-hidden flex flex-col items-center justify-center p-16 sm:p-24 rounded-[32px] border transition-all duration-500 group ${isDark ? "border-white/5 bg-gradient-to-b from-neutral-900/50 to-neutral-950/80 backdrop-blur-xl" : "border-black/5 bg-gradient-to-b from-white/50 to-neutral-50/80 backdrop-blur-xl"}`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#ec001d]/10 rounded-full blur-[60px] pointer-events-none" />
                    <div className={`relative flex items-center justify-center w-20 h-20 rounded-2xl mb-6 border transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 ${isDark ? "bg-neutral-800/30 border-white/10 text-neutral-400" : "bg-white border-neutral-200 text-neutral-400"}`}>
                        <span className="material-symbols-outlined text-4xl">bookmark_add</span>
                    </div>
                    <h3 className={`font-sora text-base sm:text-lg font-bold mb-2 tracking-wide ${isDark ? "text-neutral-200" : "text-neutral-800"}`}>Wishlist Kosong</h3>
                    <p className={`text-xs sm:text-sm text-center max-w-sm leading-relaxed text-neutral-500`}>Jelajahi berbagai anime epik dan simpan ke daftar ini untuk ditonton nanti.</p>
                </div>
            ) : (
                <div className="relative">
                    {/* --- GRID POSTER ANIME (PREMIUM CARDS) --- */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 relative z-10">
                        {displayedWishlist.map((item, index) => {
                            const itemId = item.animeId || item.id;
                            const imageSrc = item.poster || item.image || "";

                            // Logic delay untuk animasi bertahap (waterfall effect) saat kartu baru muncul
                            const animationDelay = (index % itemsPerPage) * 40;

                            return (
                                <article
                                    key={`${itemId}-page-${currentPage}`}
                                    onClick={() => handleItemClick(itemId)}
                                    style={{ animationDelay: `${animationDelay}ms` }}
                                    className="animate-card-entrance group relative cursor-pointer aspect-2/3 rounded-[24px] overflow-hidden isolate shadow-lg hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out hover:-translate-y-2.5 hover:ring-2 ring-inset ring-[#ec001d]/40 bg-neutral-900"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(itemId);
                                        }}
                                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/80 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#ec001d] hover:border-[#ec001d] hover:text-white transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-30"
                                        title="Hapus dari Wishlist"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>

                                    <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#ec001d]/0 group-hover:to-[#ec001d]/10 transition-all duration-700 z-10 pointer-events-none`} />

                                    {brokenImages[itemId] || !imageSrc ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-neutral-900">
                                            <span className="material-symbols-outlined text-neutral-500 text-3xl mb-3 opacity-40">broken_image</span>
                                            <span className="text-[10px] text-neutral-400 font-medium line-clamp-2">{item.title}</span>
                                        </div>
                                    ) : (
                                        <img
                                            key={imageSrc}
                                            alt={item.title}
                                            src={imageSrc}
                                            loading="lazy"
                                            onError={() => handleImageError(itemId)}
                                            className="w-full h-full object-cover transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:rotate-1"
                                        />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 pointer-events-none">
                                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
                                            <div className="absolute inset-0 rounded-full bg-[#ec001d]/60 animate-ping opacity-0 group-hover:opacity-30" style={{ animationDuration: '2s' }} />
                                            <span className="material-symbols-outlined text-3xl ml-1 relative z-10 drop-shadow-lg">play_arrow</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                                        <h3 className="font-sora text-[13px] sm:text-[15px] font-bold text-white leading-snug line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                                            {item.title}
                                        </h3>
                                        <div className="h-[3px] bg-gradient-to-r from-[#ec001d] to-[#ff4a5a] mt-3 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100 ease-out shadow-[0_0_10px_rgba(236,0,29,0.8)]" />
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Gradient Fade-Out Effect saat Collapse */}
                    {!isExpanded && wishlist.length > collapsedLimit && (
                        <div className={`absolute bottom-0 left-0 w-full h-32 pointer-events-none transition-all duration-700 bg-gradient-to-t z-20 ${isDark ? "from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" : "from-[#fafafa] via-[#fafafa]/80 to-transparent"}`} />
                    )}
                </div>
            )}

            {/* --- PAGINATION & CONTROLS --- */}
            {wishlist.length > collapsedLimit && (
                <div className="mt-8 relative z-30">
                    {!isExpanded ? (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className={`w-full relative group overflow-hidden py-4 rounded-2xl text-xs font-mono font-bold tracking-[0.25em] transition-all duration-500 uppercase flex items-center justify-center gap-3 cursor-pointer border ${
                                isDark
                                    ? "bg-neutral-900/40 border-white/10 text-neutral-300 hover:text-white hover:border-[#ec001d]/50"
                                    : "bg-white border-neutral-200 text-neutral-600 hover:text-white hover:border-[#ec001d]"
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#ec001d] to-[#a60014] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0" />
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#ec001d]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-0.5">View All ({wishlist.length - collapsedLimit} More)</span>
                            <span className="material-symbols-outlined text-xl relative z-10 transition-transform duration-500 group-hover:translate-y-1">keyboard_arrow_down</span>
                        </button>
                    ) : (
                        <div className={`flex flex-col sm:flex-row gap-6 items-center justify-between pt-8 border-t transition-colors duration-300 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                            <button
                                onClick={handleCollapse}
                                className={`group py-2.5 px-6 rounded-xl text-[11px] font-mono font-bold tracking-[0.2em] transition-all duration-300 uppercase flex items-center gap-2 cursor-pointer border ${
                                    isDark
                                        ? "bg-white/5 hover:bg-white/10 border-transparent text-neutral-400 hover:text-white"
                                        : "bg-neutral-100 hover:bg-neutral-200 border-transparent text-neutral-600 hover:text-black"
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-translate-y-1">keyboard_arrow_up</span>
                                Show Less
                            </button>

                            {totalPages > 1 && (
                                <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-200 shadow-sm'}`}>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? "hover:bg-white/10 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700"}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
                                    </button>

                                    {Array.from({ length: totalPages }, (_, index) => {
                                        const pageNum = index + 1;
                                        const isActive = pageNum === currentPage;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-9 h-9 text-[11px] font-mono font-bold rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-tr from-[#ec001d] to-[#ff4a5a] text-white shadow-[0_4px_12px_rgba(236,0,29,0.3)] scale-105' : isDark ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? "hover:bg-white/10 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700"}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}