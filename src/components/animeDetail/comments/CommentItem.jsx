import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";
import { formatRelativeTime } from "../../../utils/timeFormat";
import CommentForm, { CommentAvatar } from "./CommentForm";

// Ambil nama tampilan penulis komentar secara defensif (mengikuti pola ProfileHeader).
function getAuthorName(user) {
    return user?.username || user?.name || user?.email?.split("@")[0] || "Pengguna";
}

// Ambil URL avatar penulis dari berbagai kemungkinan bentuk data.
function getAuthorAvatar(user) {
    return (
        user?.profil?.avatar ||
        user?.profile?.avatar ||
        user?.avatar ||
        null
    );
}

export default function CommentItem({
    comment,
    isReply = false,
    parentId = null,
    currentUser,
    toggleLike,
    isLiked,
    editComment,
    deleteComment,
    addComment,
    fetchReplies,
    posting,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingLoading, setIsEditingLoading] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [repliesLoaded, setRepliesLoaded] = useState(false);

    const author = comment.user || comment.author || {};
    const authorName = getAuthorName(author);
    const authorAvatar = getAuthorAvatar(author);

    const authorId = author.id ?? comment.userId;
    const isOwner =
        currentUser && authorId != null && String(currentUser.id) === String(authorId);

    const liked = isLiked?.(comment.id) ?? false;
    const likeCount = comment._count?.likes ?? 0;
    const replyCount = comment._count?.replies ?? 0;
    const isEdited =
        comment.updatedAt &&
        comment.createdAt &&
        new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 1000;

    // ── Handlers ──────────────────────────────────────────────
    const handleEditSubmit = async (content) => {
        setIsEditingLoading(true);
        try {
            const result = await editComment(comment.id, content);
            if (result) setIsEditing(false);
            return result;
        } finally {
            setIsEditingLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteComment(comment.id, { isReply, parentId });
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error("Gagal menghapus komentar:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReplySubmit = async (content) => {
        const created = await addComment({ content, parentId: comment.id });
        if (created) {
            setReplies((prev) => [...prev, created]);
            setShowReplies(true);
            setRepliesLoaded(true);
            setShowReplyForm(false);
        }
        return created;
    };

    const handleToggleReplies = async () => {
        if (repliesLoaded) {
            setShowReplies((prev) => !prev);
            return;
        }
        setLoadingReplies(true);
        const fetched = await fetchReplies(comment.id);
        setReplies(fetched);
        setRepliesLoaded(true);
        setShowReplies(true);
        setLoadingReplies(false);
    };

    const handleReplyDeleted = (replyId) => {
        setReplies((prev) => prev.filter((r) => r.id !== replyId));
    };

    // Custom Glass Modal Hapus
    const DeleteConfirmationModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`p-6 rounded-3xl shadow-2xl w-full max-w-[340px] border text-center ${isDark ? "bg-[#0f0508] border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]" : "bg-white border-slate-200"
                    }`}
            >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3.5 border ${isDark ? "bg-[#ff1e56]/15 border-[#ff1e56]/30 text-[#ff1e56]" : "bg-rose-50 border-rose-200 text-rose-500"
                    }`}>
                    <i className="fa-solid fa-trash-can text-lg" />
                </div>
                <h4 className={`text-base font-black uppercase tracking-tight mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Hapus Komentar?
                </h4>
                <p className={`text-xs mb-5 leading-relaxed font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Tindakan ini permanen dan ulasan tidak dapat dikembalikan lagi.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setShowDeleteConfirm(false)}
                        className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${isDark
                            ? "bg-white/5 text-slate-300 hover:bg-white/10"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white hover:shadow-[0_0_20px_rgba(255,30,86,0.5)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        {isDeleting ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin text-xs" />
                                <span>Menghapus...</span>
                            </>
                        ) : (
                            "Hapus"
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group/comment relative rounded-2xl transition-all duration-300 ${isReply
                ? "p-2.5 sm:p-3 bg-transparent"
                : isDark
                    ? "p-3.5 sm:p-4 bg-white/[0.015] hover:bg-white/[0.035] border border-white/5 hover:border-white/10 shadow-xs"
                    : "p-3.5 sm:p-4 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-rose-200 shadow-xs"
                }`}
        >
            <div className="flex gap-3 sm:gap-3.5 items-start">
                <CommentAvatar src={authorAvatar} name={authorName} size={isReply ? "sm" : "md"} />

                <div className="flex-1 min-w-0">
                    {/* Header: Author + Badge + Timestamp */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`font-black text-xs sm:text-sm tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                            {authorName}
                        </span>

                        {isOwner && (
                            <span
                                className={`text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border ${isDark
                                    ? "bg-[#ff1e56]/15 text-[#ff1e56] border-[#ff1e56]/30 shadow-[0_0_8px_rgba(255,30,86,0.2)]"
                                    : "bg-rose-50 text-rose-600 border-rose-200"
                                    }`}
                            >
                                Penulis
                            </span>
                        )}

                        <span className="text-[10px] font-medium flex items-center gap-1 text-slate-500">
                            <span>•</span>
                            <span>{formatRelativeTime(comment.createdAt)}</span>
                            {isEdited && <span className="italic text-[9px] text-slate-500">(diedit)</span>}
                        </span>
                    </div>

                    {/* Content or Edit Form */}
                    {isEditing ? (
                        <div className="mt-2">
                            <CommentForm
                                compact
                                autoFocus
                                initialValue={comment.content}
                                submitLabel="Simpan Perubahan"
                                placeholder="Ubah komentar..."
                                posting={posting || isEditingLoading}
                                onSubmit={handleEditSubmit}
                                onCancel={() => setIsEditing(false)}
                            />
                        </div>
                    ) : (
                        <p
                            className={`text-[12px] sm:text-[13px] leading-[1.8] whitespace-pre-wrap break-words font-medium transition-colors ${isDark ? "text-slate-300 group-hover/comment:text-slate-200" : "text-slate-700"
                                }`}
                        >
                            {comment.content}
                        </p>
                    )}

                    {/* Action Bar */}
                    {!isEditing && (
                        <div className="flex items-center gap-3 sm:gap-4 mt-2.5 pt-1.5 border-t border-white/5">
                            {/* Like Button */}
                            <motion.button
                                whileTap={{ scale: 1.3 }}
                                type="button"
                                onClick={() => toggleLike(comment.id)}
                                className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer ${liked
                                    ? "text-[#ff1e56]"
                                    : isDark
                                        ? "text-slate-500 hover:text-slate-300"
                                        : "text-slate-400 hover:text-slate-700"
                                    }`}
                                aria-pressed={liked}
                            >
                                <i className={`fa-heart ${liked ? "fa-solid text-[#ff1e56] drop-shadow-[0_0_8px_rgba(255,30,86,0.6)]" : "fa-regular"} text-xs`} />
                                <span>{likeCount > 0 ? likeCount : "Suka"}</span>
                            </motion.button>

                            {/* Reply Button */}
                            {!isReply && (
                                <button
                                    type="button"
                                    onClick={() => setShowReplyForm((prev) => !prev)}
                                    className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer ${showReplyForm
                                        ? "text-[#ff1e56]"
                                        : isDark
                                            ? "text-slate-500 hover:text-slate-300"
                                            : "text-slate-400 hover:text-slate-700"
                                        }`}
                                >
                                    <i className="fa-solid fa-reply text-[10px]" />
                                    <span>Balas</span>
                                </button>
                            )}

                            {/* Edit & Delete for Owner */}
                            {isOwner && (
                                <div className="flex items-center gap-2.5 ml-auto">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className={`inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase transition-colors cursor-pointer ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-700"
                                            }`}
                                        title="Ubah komentar"
                                    >
                                        <i className="fa-solid fa-pen-to-square text-[10px]" />
                                        <span className="hidden sm:inline">Ubah</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className={`inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase transition-colors cursor-pointer ${isDark ? "text-slate-500 hover:text-[#ff1e56]" : "text-slate-400 hover:text-rose-600"
                                            }`}
                                        title="Hapus komentar"
                                    >
                                        <i className="fa-solid fa-trash-can text-[10px]" />
                                        <span className="hidden sm:inline">Hapus</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reply Form */}
                    {showReplyForm && !isReply && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-2"
                        >
                            <CommentForm
                                compact
                                autoFocus
                                submitLabel="Kirim Balasan"
                                placeholder={`Tulis balasan untuk ${authorName}...`}
                                posting={posting}
                                onSubmit={handleReplySubmit}
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </motion.div>
                    )}

                    {/* Toggle Replies View */}
                    {!isReply && (replyCount > 0 || replies.length > 0) && (
                        <button
                            type="button"
                            onClick={handleToggleReplies}
                            disabled={loadingReplies}
                            className={`mt-2.5 inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${isDark
                                ? "text-[#ff1e56] hover:text-[#ff1e56]/80"
                                : "text-rose-600 hover:text-rose-700"
                                } disabled:opacity-50`}
                        >
                            {loadingReplies ? (
                                <i className="fa-solid fa-spinner fa-spin text-[10px]" />
                            ) : (
                                <i className={`fa-solid fa-chevron-${showReplies ? "up" : "down"} text-[9px]`} />
                            )}
                            <span>
                                {showReplies
                                    ? "Sembunyikan Balasan"
                                    : `Lihat ${replyCount || replies.length} Balasan`}
                            </span>
                        </button>
                    )}

                    {/* Replies Thread Branch */}
                    {showReplies && replies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 space-y-3 pl-3 sm:pl-4 border-l-2 relative ${isDark ? "border-[#ff1e56]/30" : "border-rose-200"
                                }`}
                        >
                            {replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    isReply
                                    parentId={comment.id}
                                    currentUser={currentUser}
                                    toggleLike={toggleLike}
                                    isLiked={isLiked}
                                    editComment={editComment}
                                    deleteComment={async (id, opts) => {
                                        const ok = await deleteComment(id, opts);
                                        if (ok) handleReplyDeleted(id);
                                        return ok;
                                    }}
                                    addComment={addComment}
                                    fetchReplies={fetchReplies}
                                    posting={posting}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            {showDeleteConfirm && <DeleteConfirmationModal />}
        </motion.div>
    );
}