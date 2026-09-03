import { motion, AnimatePresence } from "motion/react";
import { memo } from "react";
import { Play, Plus, Check, Star } from "lucide-react";
import { stripHtml } from "../../../utils/htmlParser";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useAuthModal } from "../../../context/AuthModalContext";
import { useWishlist } from "../../../context/WishlistContext";
import useToast from "../../../hooks/useToast";
import { getHeroAccent } from "./heroAccents";

const ease = [0.16, 1, 0.3, 1];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.05 },
    },
    exit: { opacity: 0, transition: { duration: 0.25 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.55, ease },
    },
};

export default memo(function HeroContent({ current, currentIndex, isDark }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { openModal } = useAuthModal();
    const toast = useToast();
    const { toggleWishlist, isWishlisted, isLoading } = useWishlist();

    if (!current) return null;

    const accent = getHeroAccent(currentIndex, current.status);
    const isBookmarked = current.animeId ? isWishlisted(current.animeId) : false;
    const wishlistLoading = current.animeId ? isLoading(current.animeId) : false;
    const subtitle = current.subtitle || current.subTitle;

    const handleWatch = () => {
        if (!current.animeId) return;
        if (!isLoggedIn) {
            toast.warning("Silakan login terlebih dahulu untuk menonton", 3000);
            openModal({
                redirectAction: () => navigate(`/anime/detail/${current.animeId}`),
                mode: "login",
            });
            return;
        }
        navigate(`/anime/detail/${current.animeId}`);
    };

    const handleBookmark = async (e) => {
        e?.stopPropagation();
        if (!isLoggedIn) {
            toast.warning("Silakan login terlebih dahulu untuk menyimpan ke Watchlist", 3000);
            openModal({
                redirectAction: () => toggleWishlist({
                    animeId: current.animeId,
                    title: current.title,
                    image: current.image || current.poster,
                }),
                mode: "login",
            });
            return;
        }
        if (!current.animeId || !current.title) {
            toast.error("Data anime tidak lengkap", 3000);
            return;
        }
        await toggleWishlist({
            animeId: current.animeId,
            title: current.title,
            image: current.image || current.poster,
        });
    };

    return (
        <div className="relative z-10 h-full flex items-end pb-[140px] max-sm:h-auto max-sm:min-h-[480px] max-sm:pt-6 sm:pb-[96px] md:pb-[100px]">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="max-w-xl max-sm:min-w-0 max-sm:wrap-anywhere"
                    >
                        {/* Editorial label */}
                        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4 sm:mb-5">
                            <span
                                className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase"
                                style={{ color: accent.color }}
                            >
                                Featured
                            </span>
                            <span className={`h-px flex-1 max-w-16 ${isDark ? "bg-white/10" : "bg-black/10"}`} />
                            {current.status && (
                                <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                                    current.status === "ONGOING"
                                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                }`}>
                                    {current.status}
                                </span>
                            )}
                        </motion.div>

                        {/* Title — editorial stacked */}
                        <motion.h1
                            variants={itemVariants}
                            className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[0.95] mb-2 sm:mb-3 ${
                                isDark ? "text-white" : "text-gray-900"
                            }`}
                        >
                            {current.title}
                        </motion.h1>

                        {subtitle && (
                            <motion.p
                                variants={itemVariants}
                                className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 tracking-wide"
                                style={{ color: accent.color }}
                            >
                                {subtitle}
                            </motion.p>
                        )}

                        {/* Meta pills */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                            {current.rating && current.rating !== "0.0" && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${
                                    isDark ? "bg-white/5 border-white/10 text-yellow-400" : "bg-black/5 border-black/10 text-yellow-600"
                                }`}>
                                    <Star className="w-3 h-3 fill-current" />
                                    {current.rating}
                                </span>
                            )}
                            {current.genre && (
                                <span className={`text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>
                                    {current.genre}
                                </span>
                            )}
                            {current.year && (
                                <span className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
                                    • {current.year}
                                </span>
                            )}
                            {current.episode && (
                                <span className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
                                    • {current.episode}
                                </span>
                            )}
                        </motion.div>

                        {/* Description */}
                        {current.description && (
                            <motion.div
                                variants={itemVariants}
                                className={`mb-4 sm:mb-5 p-3 rounded-xl border backdrop-blur-md max-w-md ${
                                    isDark
                                        ? "bg-black/40 border-white/[0.08]"
                                        : "bg-white/70 border-black/[0.06]"
                                }`}
                            >
                                <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${isDark ? "text-white/55" : "text-gray-600"}`}>
                                    {stripHtml(current.description)}
                                </p>
                            </motion.div>
                        )}

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex items-center gap-2.5 sm:gap-3">
                            <motion.button
                                onClick={handleWatch}
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                className="group relative flex items-center gap-2.5 h-11 sm:h-12 px-5 sm:px-7 rounded-xl sm:rounded-2xl font-bold text-sm text-white overflow-hidden cursor-pointer shadow-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${accent.color}, ${accent.color}cc)`,
                                    boxShadow: `0 8px 28px rgba(${accent.rgb},0.35)`,
                                }}
                            >
                                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <span className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                </span>
                                <span className="relative">Tonton Sekarang</span>
                            </motion.button>

                            <motion.button
                                onClick={handleBookmark}
                                disabled={wishlistLoading}
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                aria-label={isBookmarked ? "Hapus dari watchlist" : "Tambah ke watchlist"}
                                className={`flex items-center gap-2 h-11 sm:h-12 px-4 sm:px-5 rounded-xl sm:rounded-2xl border text-sm font-bold backdrop-blur-md transition-colors cursor-pointer disabled:opacity-60 ${
                                    isBookmarked
                                        ? "bg-red-500/15 border-red-500/30 text-red-400"
                                        : isDark
                                            ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                            : "bg-white/70 border-black/10 text-gray-700 hover:bg-white"
                                }`}
                            >
                                {wishlistLoading ? (
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : isBookmarked ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">{isBookmarked ? "Tersimpan" : "Watchlist"}</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
});
