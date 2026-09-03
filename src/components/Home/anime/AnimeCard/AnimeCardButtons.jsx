import { motion } from "motion/react";
import { useTheme } from "../../../../context/ThemeContext";
import { useAuth } from "../../../../context/AuthContext";
import { useAuthModal } from "../../../../context/AuthModalContext";
import useToast from "../../../../hooks/useToast";
import { useWishlist } from "../../../../context/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function AnimeCardButtons({
    anime,
    isDark,
    onPlay,
    reducedMotion = false,
}) {
    const { theme } = useTheme();
    const dark = isDark !== undefined ? isDark : theme === "dark";
    const navigate = useNavigate();

    const { isLoggedIn } = useAuth();
    const { openModal } = useAuthModal();
    const toast = useToast();
    const { toggleWishlist, isWishlisted, isLoading } = useWishlist();

    const isBookmarked = anime?.animeId ? isWishlisted(anime.animeId) : false;
    const wishlistLoading = anime?.animeId ? isLoading(anime.animeId) : false;
    const isOngoing = anime.status === "ONGOING";

    const tap = reducedMotion ? {} : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.96 } };

    const handlePrimaryClick = (e) => {
        e.stopPropagation();
        if (isOngoing && !isLoggedIn) {
            toast.warning("Silakan login terlebih dahulu", 3000);
            openModal({ mode: "login" });
            return;
        }
        if (isOngoing) {
            const animeId = anime.animeId;
            if (!animeId) return;
            const episodeNum = (anime.episode ?? "").replace(/\D/g, "") || "1";
            navigate(`/episode/${animeId}-episode-${episodeNum}`);
        } else {
            onPlay?.();
        }
    };

    const handleBookmarkClick = async (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            toast.warning("Silakan login terlebih dahulu", 3000);
            openModal({ mode: "login" });
            return;
        }
        if (!anime?.animeId) return;
        await toggleWishlist(anime);
    };

    return (
        <div className="flex flex-col gap-2">
            <motion.button
                type="button"
                onClick={handlePrimaryClick}
                {...tap}
                className="relative w-full min-h-[44px] font-bold rounded-xl cursor-pointer overflow-hidden text-[11px] sm:text-xs text-white border border-red-400/30"
                style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #ff1e56 50%, #ef4444 100%)",
                    boxShadow: "0 4px 20px rgba(255,30,86,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
            >
                <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                    animate={reducedMotion ? {} : { x: ["-120%", "220%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                />
                <span className="relative z-10">{isOngoing ? "Tonton Sekarang" : "Lihat Detail"}</span>
            </motion.button>

            <motion.button
                type="button"
                onClick={handleBookmarkClick}
                disabled={wishlistLoading}
                {...tap}
                className={`w-full min-h-[44px] font-bold rounded-xl cursor-pointer border text-[11px] sm:text-xs transition-colors disabled:opacity-50 ${
                    isBookmarked
                        ? "bg-red-500/20 border-red-400/35 text-red-300"
                        : dark
                            ? "bg-white/[0.06] border-white/[0.1] text-white/85 hover:bg-white/[0.1]"
                            : "bg-white/10 border-white/15 text-white/90 hover:bg-white/15"
                }`}
            >
                {wishlistLoading ? "Menyimpan..." : isBookmarked ? "Di Watchlist" : "+ Simpan ke Watchlist"}
            </motion.button>
        </div>
    );
}
