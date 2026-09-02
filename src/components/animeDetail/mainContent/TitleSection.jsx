import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";
import { useWishlist } from "../../../context/WishlistContext";
import { sectionVariants, useMotionSafe, motionProps, DETAIL_EASE } from "../constants/animeDetailMotion";
import { getAnimeTitleParts, getAnimeId, getSeasonYear } from "../../../utils/animeDetailUtils";

const STATUS_LABELS = {
    FINISHED: "Selesai",
    RELEASING: "Sedang Tayang",
    NOT_YET_RELEASED: "Segera Hadir",
    CANCELLED: "Dibatalkan",
    HIATUS: "Hiatus",
};

// Premium Text Reveal Component
const AnimatedTitle = ({ text, isDark }) => {
    const words = text.split(" ");
    return (
        <h1
            className={`font-display text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black leading-[1.14] tracking-tight flex flex-wrap gap-x-2 gap-y-1 ${isDark ? "text-white" : "text-slate-900"}`}
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
        >
            {words.map((word, idx) => (
                <motion.span
                    key={idx}
                    className="inline-block relative"
                    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: DETAIL_EASE, delay: idx * 0.04 + 0.2 }}
                >
                    {word}
                </motion.span>
            ))}
        </h1>
    );
};

export default function TitleSection({ anime }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const location = useLocation();
    const navigate = useNavigate();
    const reduced = useMotionSafe();

    const { toggleWishlist, isWishlisted, isLoading } = useWishlist();

    const { main: titleMain, native: titleNative, romaji: titleRomaji } = getAnimeTitleParts(anime);
    const trailerId = anime?.trailer?.id;
    const season = anime?.season;
    const year = getSeasonYear(anime);
    const averageScore = anime?.averageScore;
    const statusLabel = STATUS_LABELS[anime?.status] ?? null;
    const genres = anime?.genres ?? [];
    const studioName = anime?.studios?.[0]?.name;
    const episodesCount = anime?.episodes?.length || anime?.totalEpisodes || null;

    const animeId = getAnimeId(anime);

    const isFavorited = animeId ? isWishlisted(animeId) : false;
    const isFavoriteLoading = animeId ? isLoading(animeId) : false;

    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, [location]);

    const shareText = useMemo(
        () =>
            `Yuk tonton anime ${titleMain} Sub Indo secara gratis dengan kualitas terbaik di platform kami! 🎬`,
        [titleMain]
    );

    const handleShareClick = () => {
        setIsShareOpen((prev) => !prev);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavoriteClick = async () => {
        if (!animeId) return;
        if (isFavoriteLoading) return;

        await toggleWishlist({
            animeId,
            title: titleMain,
            image: anime?.image || anime?.poster || anime?.coverImage?.large || ""
        });
    };

    // First episode resolution for immediate watch CTA
    const firstEpisode = useMemo(() => {
        if (!anime?.episodes || anime.episodes.length === 0) return null;
        const ep1 = anime.episodes.find((e) => {
            const num = (e.title || "").match(/episode\s*(\d+)/i);
            return num && parseInt(num[1], 10) === 1;
        });
        return ep1 || anime.episodes[anime.episodes.length - 1] || anime.episodes[0];
    }, [anime?.episodes]);

    const handleWatchNow = () => {
        if (firstEpisode?.slug) {
            navigate(`/episode/${firstEpisode.slug}`);
        } else {
            const epElem = document.getElementById("section-episodes");
            if (epElem) epElem.scrollIntoView({ behavior: "smooth" });
        }
    };

    const cleanSynopsis = useMemo(() => {
        const raw = anime?.description || anime?.synopsis || "";
        return raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }, [anime?.description, anime?.synopsis]);

    const isButtonDisabled = !animeId || isFavoriteLoading;

    return (
        <motion.div
            className="relative w-full min-w-0"
            {...motionProps(reduced, sectionVariants)}
        >
            {/* Ambient Background Aura */}
            {isDark && (
                <div className="absolute -top-12 -left-12 w-96 h-48 bg-[#ff1e56]/10 blur-[90px] pointer-events-none rounded-full" />
            )}

            {/* TOP METADATA STRIP: Studio & Series Identity */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-3"
            >
                {studioName && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-white/[0.04] border border-white/10 text-slate-300">
                        <i className="fa-solid fa-clapperboard text-[#ff1e56] text-[9px]" />
                        {studioName}
                    </span>
                )}

                {season && year && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-white/[0.03] border border-white/5 text-slate-400">
                        <i className="fa-regular fa-calendar-check text-[9px] text-[#ff1e56]" />
                        {season} {year}
                    </span>
                )}

                {anime?.format && (
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/[0.03] border border-white/5 text-slate-400">
                        {anime.format}
                    </span>
                )}
            </motion.div>

            {/* MAIN TITLE WITH GLOW */}
            <div className="relative mb-2">
                <AnimatedTitle text={titleMain} isDark={isDark} />
            </div>

            {/* JAPANESE AUTHENTIC CALLIGRAPHY & ROMAJI */}
            {(titleNative || titleRomaji) && (
                <motion.div
                    className="flex flex-wrap items-center gap-2 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                >
                    {titleNative && (
                        <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md border ${isDark
                            ? "bg-white/[0.02] border-white/10 text-slate-400 tracking-wider"
                            : "bg-slate-100 border-slate-200 text-slate-600"
                            }`}>
                            🇯🇵 {titleNative}
                        </span>
                    )}
                    {titleRomaji && titleRomaji !== titleMain && (
                        <span className={`text-[10px] sm:text-xs italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            • {titleRomaji}
                        </span>
                    )}
                </motion.div>
            )}

            {/* LUXURY SPECIFICATION PILLS: 4K UHD • DOLBY • MATCH SCORE • RATING */}
            <motion.div
                className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5 select-none"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {/* SUB INDO BADGE */}
                <span className="relative overflow-hidden inline-flex items-center gap-1.5 bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white text-[9px] sm:text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase shadow-[0_0_20px_rgba(255,30,86,0.35)] border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Sub Indo
                </span>

                {/* SCORE MATCH RING */}
                {averageScore != null && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black tracking-wider border ${isDark
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        : "bg-amber-50 border-amber-300 text-amber-700"
                        }`}>
                        <i className="fa-solid fa-star text-[9px] text-amber-400" />
                        {(averageScore / 10).toFixed(1)} / 10
                        <span className="text-[8px] font-bold opacity-80">({averageScore}% Match)</span>
                    </span>
                )}

                {/* 4K ULTRA HD */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border ${isDark
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    }`}>
                    4K Ultra HD
                </span>

                {/* AUDIO */}
                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase border ${isDark
                    ? "bg-white/[0.03] border-white/10 text-slate-300"
                    : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}>
                    Dolby 5.1
                </span>

                {/* STATUS */}
                {statusLabel && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase border ${isDark
                        ? "bg-white/[0.03] border-white/10 text-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}>
                        {statusLabel}
                    </span>
                )}

                {/* EPISODES COUNT */}
                {episodesCount && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase border ${isDark
                        ? "bg-white/[0.03] border-white/10 text-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}>
                        {episodesCount} Episode
                    </span>
                )}

                {/* AGE RATING */}
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black border border-white/20 bg-white/5 text-slate-300">
                    13+
                </span>
            </motion.div>

            {/* EDITORIAL LOGLINE EXCERPT */}
            {cleanSynopsis && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative pl-3.5 mb-5 group/quote"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ff1e56] to-transparent rounded-full shadow-[0_0_8px_#ff1e56]" />
                    <p className={`text-xs sm:text-[13px] leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3 font-medium transition-colors ${isDark ? "text-slate-300 group-hover/quote:text-white" : "text-slate-600"
                        }`}>
                        {cleanSynopsis}
                    </p>
                </motion.div>
            )}

            {/* GENRE PILLS */}
            {genres.length > 0 && (
                <motion.div
                    className="flex flex-wrap gap-1.5 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.55 }}
                >
                    {genres.slice(0, 5).map((genre) => (
                        <span
                            key={genre}
                            className={`text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all duration-300 cursor-default ${isDark
                                ? "bg-white/[0.02] border-white/5 text-slate-400 hover:border-[#ff1e56]/40 hover:text-white hover:bg-white/[0.06]"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-rose-400 hover:text-slate-900"
                                }`}
                        >
                            {genre}
                        </span>
                    ))}
                </motion.div>
            )}

            {/* ACTION BUTTONS: HERO PLAY BUTTON + SECONDARIES */}
            <motion.div
                className="flex flex-wrap items-center gap-2 sm:gap-3 w-full select-none pt-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                {/* ── PRIMARY HERO CTA: MULAI NONTON ── */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleWatchNow}
                    className="group relative inline-flex items-center justify-center gap-2.5 h-11 w-full xs:w-auto px-5 sm:px-6 bg-gradient-to-r from-[#ff1e56] via-[#e11d48] to-[#be123c] text-white font-black rounded-xl text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(255,30,86,0.45)] hover:shadow-[0_0_35px_rgba(255,30,86,0.7)] overflow-hidden border border-white/20 cursor-pointer"
                >
                    {/* Animated Specular Light Beam */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.8s_infinite] skew-x-12 z-10 pointer-events-none" />

                    <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 z-20 group-hover:scale-110 transition-transform shadow-sm">
                        <i className="fa-solid fa-play text-[9px] ml-0.5 text-white" />
                    </div>

                    <span className="z-20 font-black tracking-widest whitespace-nowrap">
                        Mulai Nonton {firstEpisode ? "Ep 1" : ""}
                    </span>
                </motion.button>

                {/* Secondaries Container: on small mobile fills the second row cleanly */}
                <div className="flex items-center gap-2 w-full xs:w-auto flex-1 min-w-0">
                    {/* ── TRAILER BUTTON ── */}
                    {trailerId && (
                        <motion.a
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            href="#section-trailer"
                            className={`group relative flex-1 xs:flex-none inline-flex items-center justify-center gap-1.5 xs:gap-2 h-11 px-3 xs:px-4 sm:px-5 border rounded-xl text-[10px] sm:text-[11px] font-black tracking-wider uppercase transition-all duration-300 backdrop-blur-xl ${isDark
                                ? "bg-white/[0.04] border-white/10 hover:border-[#ff1e56]/40 hover:bg-white/[0.08] text-slate-200 hover:text-white"
                                : "bg-white border-slate-200 hover:border-rose-400 text-slate-700 hover:text-slate-900 shadow-sm"
                                }`}
                        >
                            <i className="fa-brands fa-youtube text-sm xs:text-base text-[#ff1e56] group-hover:scale-110 transition-transform" />
                            <span className="whitespace-nowrap">Trailer</span>
                        </motion.a>
                    )}

                    {/* ── WISHLIST BUTTON ── */}
                    <motion.button
                        whileHover={!isButtonDisabled ? { scale: 1.03 } : {}}
                        whileTap={!isButtonDisabled ? { scale: 0.96 } : {}}
                        onClick={handleFavoriteClick}
                        disabled={isButtonDisabled}
                        className={`group relative flex-1 xs:flex-none inline-flex items-center justify-center gap-1.5 xs:gap-2 h-11 px-3 xs:px-4 sm:px-5 border rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-300 backdrop-blur-xl ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            } ${isFavorited
                                ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                                : isDark
                                    ? "bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.08] text-slate-200 hover:text-white"
                                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm"
                            }`}
                    >
                        <div className="relative flex items-center justify-center shrink-0 z-20 group-hover:scale-110 transition-transform">
                            {isFavoriteLoading ? (
                                <i className="fa-solid fa-spinner animate-spin text-[#ff1e56]" />
                            ) : (
                                <i className={`${isFavorited ? "fa-solid text-yellow-400" : "fa-regular text-[#ff1e56]"} fa-bookmark text-xs`} />
                            )}
                        </div>
                        <span className="whitespace-nowrap z-20">
                            {isFavorited ? "Tersimpan" : "Favorit"}
                        </span>
                    </motion.button>

                    {/* ── SHARE BUTTON ── */}
                    <div className="relative flex-1 xs:flex-none">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleShareClick}
                            className={`group w-full xs:w-auto inline-flex items-center justify-center gap-1.5 xs:gap-2 h-11 px-3 xs:px-4 sm:px-5 border rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer backdrop-blur-xl ${isDark
                                ? "bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.08] text-slate-200 hover:text-white"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm"
                                }`}
                        >
                            <i className="fa-solid fa-share-nodes text-[#ff1e56] text-xs group-hover:scale-110 transition-transform" />
                            <span className="whitespace-nowrap">Bagikan</span>
                        </motion.button>

                        {/* Share Menu Popup */}
                        <AnimatePresence>
                            {isShareOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsShareOpen(false)}
                                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm cursor-default"
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 450, damping: 28 }}
                                        className={`absolute left-0 mt-3 z-50 p-5 rounded-2xl border backdrop-blur-2xl w-[320px] shadow-[0_25px_50px_rgba(0,0,0,0.6)] ${isDark
                                            ? "bg-[#0f0508]/95 border-[#ff1e56]/30 shadow-[0_0_30px_rgba(255,30,86,0.15)]"
                                            : "bg-white/95 border-rose-200 shadow-2xl"
                                            }`}
                                    >
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 text-center ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                                            Bagikan Serial Ini
                                        </p>

                                        <div className="grid grid-cols-4 gap-3 mb-4">
                                            {[
                                                { href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + currentUrl)}`, icon: "fa-whatsapp", color: "hover:bg-green-500 hover:text-white border-green-500/30 text-green-500" },
                                                { href: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`, icon: "fa-telegram", color: "hover:bg-blue-500 hover:text-white border-blue-500/30 text-blue-500" },
                                                { href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`, icon: "fa-twitter", color: "hover:bg-sky-500 hover:text-white border-sky-500/30 text-sky-500" },
                                                { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, icon: "fa-facebook", color: "hover:bg-indigo-600 hover:text-white border-indigo-600/30 text-indigo-500" },
                                            ].map((social, idx) => (
                                                <motion.a
                                                    whileHover={{ scale: 1.1, y: -2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    key={idx}
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center justify-center aspect-square rounded-xl border transition-colors ${isDark ? "bg-[#180a0f]" : "bg-slate-50"} ${social.color}`}
                                                >
                                                    <i className={`fa-brands ${social.icon} text-xl`} />
                                                </motion.a>
                                            ))}
                                        </div>

                                        <div className={`flex items-center gap-2 border rounded-xl p-1.5 pl-3 min-w-0 ${isDark ? "bg-[#080305] border-[#ff1e56]/20" : "bg-slate-50 border-slate-200"}`}>
                                            <span className={`flex-1 min-w-0 truncate text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                {currentUrl}
                                            </span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleCopyLink}
                                                className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors ${isCopied ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white shadow-[0_4px_15px_rgba(255,30,86,0.3)]"}`}
                                            >
                                                {isCopied ? "Tersalin" : "Salin"}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}