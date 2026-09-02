import { motion } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import CommentSkeleton from "./CommentSkeleton";

const SORT_OPTIONS = [
    { id: "newest", label: "Terbaru", icon: "fa-arrow-down-short-wide" },
    { id: "oldest", label: "Terlama", icon: "fa-arrow-up-wide-short" },
    { id: "popular", label: "Populer", icon: "fa-fire" },
];

// Ambil nama & avatar user aktif (mengikuti pola ProfileHeader).
function getMyName(user) {
    return user?.username || user?.name || user?.email?.split("@")[0] || "Pengguna";
}
function getMyAvatar(user) {
    return user?.profil?.avatar || user?.profile?.avatar || user?.avatar || null;
}

export default function CommentsTab({ commentsApi }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const {
        comments,
        total,
        sort,
        loading,
        loadingMore,
        posting,
        hasMore,
        currentUser,
        isLoggedIn,
        changeSort,
        loadMore,
        addComment,
        editComment,
        deleteComment,
        toggleLike,
        fetchReplies,
        isLiked,
    } = commentsApi;

    const cardBaseClass = isDark
        ? "bg-[#0b0406]/90 border border-white/5 shadow-2xl backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8"
        : "bg-white/95 border border-slate-200 shadow-xl rounded-3xl p-4 sm:p-6 md:p-8";

    const handleAddMain = (content) => addComment({ content, parentId: null });

    // Props aksi yang diteruskan ke setiap CommentItem.
    const itemActions = {
        currentUser,
        toggleLike,
        isLiked,
        editComment,
        deleteComment,
        addComment,
        fetchReplies,
        posting,
    };

    return (
        <div className="relative group">
            {/* Ambient radiant glow */}
            {isDark && (
                <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-30 bg-gradient-to-br from-[#ff1e56]/15 via-transparent to-transparent pointer-events-none" />
            )}

            <div className={`relative overflow-hidden transition-all duration-500 ${cardBaseClass}`}>
                {/* ── Header Komunitas ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-white/5">
                    <div className="flex items-center gap-3.5">
                        <div
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border ${isDark
                                ? "bg-[#14080b] border-[#ff1e56]/20 shadow-[0_0_20px_rgba(255,30,86,0.2)]"
                                : "bg-rose-50 border-rose-200 shadow-sm"
                                }`}
                        >
                            <i className="fa-solid fa-comments text-base sm:text-lg text-[#ff1e56]" />
                        </div>
                        <div>
                            <h4 className={`font-black text-sm sm:text-lg tracking-tight uppercase flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
                                Diskusi Komunitas
                                <span
                                    className={`border text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black ${isDark
                                        ? "bg-[#ff1e56]/15 text-[#ff1e56] border-[#ff1e56]/30 shadow-[0_0_10px_rgba(255,30,86,0.15)]"
                                        : "bg-rose-50 text-rose-600 border-rose-200"
                                        }`}
                                >
                                    {total}
                                </span>
                            </h4>
                            <p className={`text-[10px] sm:text-xs mt-0.5 font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                Bagikan ulasan, teori cerita, dan diskusikan bersama penggemar lain
                            </p>
                        </div>
                    </div>

                    {/* Sliding Sort selector with Framer Motion */}
                    <div
                        className={`flex items-center gap-1 p-1 rounded-2xl border shrink-0 self-start sm:self-auto ${isDark ? "bg-[#060204] border-white/5" : "bg-slate-100 border-slate-200"
                            }`}
                    >
                        {SORT_OPTIONS.map((opt) => {
                            const isActive = sort === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => changeSort(opt.id)}
                                    className={`relative px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-black tracking-wider uppercase transition-colors z-10 flex items-center gap-1.5 cursor-pointer ${isActive
                                        ? "text-white"
                                        : isDark
                                            ? "text-slate-400 hover:text-slate-200"
                                            : "text-slate-500 hover:text-slate-900"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeCommentSort"
                                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] shadow-[0_0_15px_rgba(255,30,86,0.35)] z-[-1]"
                                        />
                                    )}
                                    <i className={`fa-solid ${opt.icon} text-[9px] ${isActive ? "text-white" : isDark ? "text-slate-500" : "text-slate-400"}`} />
                                    <span>{opt.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Form Komentar Utama ── */}
                <div className={`pb-6 mb-6 sm:mb-8 border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
                    {isLoggedIn ? (
                        <CommentForm
                            avatarSrc={getMyAvatar(currentUser)}
                            displayName={getMyName(currentUser)}
                            placeholder="Tulis ulasan atau pendapatmu tentang anime ini..."
                            posting={posting}
                            onSubmit={handleAddMain}
                        />
                    ) : (
                        <CommentForm
                            placeholder="Masuk untuk bergabung dalam diskusi dan menulis ulasan..."
                            posting={posting}
                            onSubmit={handleAddMain}
                        />
                    )}
                </div>

                {/* ── Daftar Komentar ── */}
                {loading ? (
                    <CommentSkeleton />
                ) : comments.length > 0 ? (
                    <div className="space-y-6">
                        <div className="space-y-4 sm:space-y-5">
                            {comments.map((comment) => (
                                <CommentItem key={comment.id} comment={comment} {...itemActions} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                    type="button"
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black tracking-wider uppercase border transition-all duration-200 disabled:opacity-50 cursor-pointer ${isDark
                                        ? "bg-white/[0.03] hover:bg-[#ff1e56]/15 border-white/10 hover:border-[#ff1e56]/40 text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,30,86,0.2)]"
                                        : "bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 shadow-sm"
                                        }`}
                                >
                                    {loadingMore ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin text-[#ff1e56]" />
                                            <span>Memuat Lebih Banyak...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-arrow-down text-[#ff1e56]" />
                                            <span>Tampilkan Komentar Lainnya</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-12 sm:py-16 text-center">
                        <div
                            className={`w-14 h-14 mx-auto rounded-3xl flex items-center justify-center mb-3.5 border ${isDark
                                ? "bg-[#14080b] border-[#ff1e56]/20 shadow-[0_0_25px_rgba(255,30,86,0.15)]"
                                : "bg-rose-50 border-rose-200 shadow-sm"
                                }`}
                        >
                            <i className="fa-regular fa-comments text-xl text-[#ff1e56]" />
                        </div>
                        <h5 className={`text-sm sm:text-base font-black uppercase tracking-tight mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                            Belum Ada Komentar
                        </h5>
                        <p className={`text-xs max-w-sm mx-auto font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Jadilah yang pertama untuk membagikan ulasan atau kesan menonton anime ini kepada komunitas!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
