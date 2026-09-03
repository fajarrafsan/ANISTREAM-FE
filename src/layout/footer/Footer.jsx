import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import useToast from "../../hooks/useToast";
import { useNavigate, useLocation } from "react-router-dom";
import {
    footerContainerVariants,
    footerItemVariants,
    quoteVariants,
    statCardSpring,
    FOOTER_EASE,
} from "./footerMotion";

const animeQuotes = [
    { text: "Mati tanpa kebencian adalah jalan seorang ninja", from: "Jiraiya — Naruto" },
    { text: "Seorang raja harus memiliki semangat lebih besar dari siapa pun", from: "Luffy — One Piece" },
    { text: "Kenyataan tidak selalu indah, tapi itu yang membuatnya nyata", from: "Yato — Noragami" },
    { text: "Seorang pahlawan bukanlah yang tak pernah kalah, tapi yang terus bangkit", from: "All Might — MHA" },
    { text: "Menjadi kuat bukan berarti tak pernah terluka", from: "Tanjiro — Demon Slayer" },
    { text: "Perubahan bisa terjadi dalam sekejap, tapi hasilnya butuh selamanya", from: "Shoyo — Haikyuu" },
];

const stats = [
    { count: "800+", label: "Anime" },
    { count: "12K+", label: "Episode" },
    { count: "50K+", label: "Pengguna" },
    { count: "10K+", label: "Komunitas" },
];

const genres = [
    "Action", "Romance", "Isekai", "Fantasy", "Comedy", "Horror",
    "Slice of Life", "Mecha", "Adventure", "Thriller", "Drama", "Sci-Fi",
];

const navLinks = [
    { label: "Katalog", desc: "Jelajahi", href: "/catalog" },
    { label: "Jadwal", desc: "Rilis", href: "/schedule" },
    { label: "Beranda", desc: "Home", href: "/" },
];

const socials = ["Discord", "Twitter", "YouTube", "Instagram", "GitHub"];

export default function Footer() {
    const { theme } = useTheme();
    const { isLoggedIn } = useAuth();
    const { openModal } = useAuthModal();
    const toast = useToast();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isDark = theme === "dark";
    const currentYear = new Date().getFullYear();
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const handler = (e) => setReducedMotion(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (reducedMotion) return;
        const interval = setInterval(() => {
            setQuoteIdx((prev) => (prev + 1) % animeQuotes.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [reducedMotion]);

    const handleNavigation = (e, href) => {
        e.preventDefault();
        if (href !== "/" && !isLoggedIn) {
            toast.warning("Silakan login terlebih dahulu", 3000);
            openModal({ mode: "login", redirectAction: () => navigate(href) });
            return;
        }
        navigate(href);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const q = animeQuotes[quoteIdx];

    return (
        <footer
            className={`relative w-full mt-auto overflow-hidden border-t transition-colors duration-500 ${
                isDark
                    ? "bg-[#050508] border-white/[0.06]"
                    : "bg-[#faf9f7] border-black/[0.06]"
            }`}
        >
            {/* Ambient */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: isDark
                            ? "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,30,86,0.12) 0%, transparent 60%)"
                            : "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(220,38,38,0.06) 0%, transparent 60%)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(${isDark ? "#fff" : "#000"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "#fff" : "#000"} 1px, transparent 1px)`,
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            {/* Top accent line */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-px origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: FOOTER_EASE }}
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,30,86,0.5), transparent)",
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
                <motion.div
                    className="flex flex-col items-center gap-8 sm:gap-10"
                    variants={footerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                >
                    {/* Stats */}
                    <motion.div
                        variants={footerItemVariants}
                        className="flex max-[360px]:grid max-[360px]:grid-cols-2 flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-2xl"
                    >
                        {stats.map((s) => (
                            <motion.div
                                key={s.label}
                                whileHover={reducedMotion ? {} : { y: -2, scale: 1.02 }}
                                transition={statCardSpring}
                                className={`flex flex-col items-center min-w-[72px] px-3 py-2 rounded-xl border backdrop-blur-sm ${
                                    isDark
                                        ? "bg-white/[0.03] border-white/[0.07]"
                                        : "bg-white/70 border-black/[0.06] shadow-sm"
                                }`}
                            >
                                <span className={`font-display text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>
                                    {s.count}
                                </span>
                                <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${isDark ? "text-white/40" : "text-gray-500"}`}>
                                    {s.label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Brand */}
                    <motion.div variants={footerItemVariants} className="flex flex-col items-center gap-2 text-center">
                        <button
                            type="button"
                            onClick={(e) => handleNavigation(e, "/")}
                            className="cursor-pointer group bg-transparent border-none p-0"
                            aria-label="AniStream Beranda"
                        >
                            <span className={`font-display text-2xl sm:text-3xl tracking-[0.08em] uppercase transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                                Ani<span className="text-red-500 group-hover:text-red-400 transition-colors">Stream</span>
                            </span>
                        </button>
                        <p className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] ${isDark ? "text-white/35" : "text-gray-500"}`}>
                            Nonton anime gratis tanpa iklan
                        </p>
                    </motion.div>

                    {/* Nav */}
                    <motion.nav variants={footerItemVariants} className="flex flex-wrap justify-center gap-2 sm:gap-3">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavigation(e, link.href)}
                                    whileHover={reducedMotion ? {} : { y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`group relative px-4 sm:px-5 py-2.5 rounded-xl border cursor-pointer transition-colors duration-300 ${
                                        isActive
                                            ? isDark
                                                ? "bg-red-500/10 border-red-500/25"
                                                : "bg-red-50 border-red-200"
                                            : isDark
                                                ? "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/[0.12]"
                                                : "bg-white/60 border-black/[0.06] hover:border-black/[0.1]"
                                    }`}
                                >
                                    <span className={`block text-xs font-bold uppercase tracking-[0.12em] ${isDark ? "text-white/90" : "text-gray-800"}`}>
                                        {link.label}
                                    </span>
                                    <span className={`block text-[9px] font-medium uppercase tracking-widest mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                                        {link.desc}
                                    </span>
                                    <motion.span
                                        className="absolute bottom-1.5 left-4 right-4 h-px bg-red-500/60 origin-left"
                                        initial={false}
                                        animate={{ scaleX: isActive ? 1 : 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3, ease: FOOTER_EASE }}
                                    />
                                </motion.a>
                            );
                        })}
                    </motion.nav>

                    {/* Genres */}
                    <motion.div variants={footerItemVariants} className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-xl">
                        {genres.map((g, i) => (
                            <motion.span
                                key={g}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.03, duration: 0.35, ease: FOOTER_EASE }}
                                whileHover={reducedMotion ? {} : { scale: 1.05, y: -1 }}
                                className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider border cursor-default ${
                                    isDark
                                        ? "bg-white/[0.03] text-white/45 border-white/[0.06] hover:border-red-500/30 hover:text-red-300/80"
                                        : "bg-white/80 text-gray-500 border-black/[0.06] hover:border-red-300 hover:text-red-600"
                                }`}
                            >
                                {g}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Quote */}
                    <motion.div
                        variants={footerItemVariants}
                        className={`relative w-full max-w-lg px-4 py-4 rounded-2xl border text-center overflow-hidden ${
                            isDark
                                ? "bg-white/[0.02] border-white/[0.07]"
                                : "bg-white/80 border-black/[0.06] shadow-sm"
                        }`}
                    >
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={quoteIdx}
                                variants={quoteVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <p className={`text-xs sm:text-sm font-medium leading-relaxed italic ${isDark ? "text-white/65" : "text-gray-600"}`}>
                                    &ldquo;{q.text}&rdquo;
                                </p>
                                <p className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 ${isDark ? "text-white/35" : "text-gray-400"}`}>
                                    {q.from}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Social — text first */}
                    <motion.div variants={footerItemVariants} className="flex flex-wrap justify-center gap-2">
                        {socials.map((label) => (
                            <motion.button
                                key={label}
                                type="button"
                                whileHover={reducedMotion ? {} : { y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={(e) => e.preventDefault()}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                                    isDark
                                        ? "bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/[0.15]"
                                        : "bg-white/70 border-black/[0.08] text-gray-500 hover:text-gray-800 hover:border-black/[0.12]"
                                }`}
                            >
                                {label}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Divider */}
                    <motion.div variants={footerItemVariants} className="w-full max-w-xs flex items-center gap-3">
                        <div className={`flex-1 h-px ${isDark ? "bg-gradient-to-r from-transparent to-white/10" : "bg-gradient-to-r from-transparent to-black/10"}`} />
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                        <div className={`flex-1 h-px ${isDark ? "bg-gradient-to-l from-transparent to-white/10" : "bg-gradient-to-l from-transparent to-black/10"}`} />
                    </motion.div>

                    {/* Copyright */}
                    <motion.div variants={footerItemVariants} className="flex flex-col items-center gap-1.5 text-center">
                        <p className={`text-[10px] font-medium uppercase tracking-[0.18em] ${isDark ? "text-white/30" : "text-gray-400"}`}>
                            Dibuat untuk penggemar anime
                        </p>
                        <p className={`text-[10px] font-semibold tracking-wide ${isDark ? "text-white/25" : "text-gray-400"}`}>
                            © {currentYear}{" "}
                            <span className={isDark ? "text-white/45" : "text-gray-500"}>AniStream</span>
                            {" · "}All rights reserved
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
}
