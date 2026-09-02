import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";

// Color schema for relations
const RELATION_TYPE_LABEL = {
    ADAPTATION: { label: "Adaptasi", color: "blue", icon: "fa-book-open" },
    PREQUEL: { label: "Prequel", color: "amber", icon: "fa-backward-step" },
    SEQUEL: { label: "Sekuel", color: "emerald", icon: "fa-forward-step" },
    SIDE_STORY: { label: "Side Story", color: "fuchsia", icon: "fa-code-branch" },
    SPIN_OFF: { label: "Spin-off", color: "orange", icon: "fa-shuffle" },
    ALTERNATIVE: { label: "Alternatif", color: "pink", icon: "fa-repeat" },
    SUMMARY: { label: "Ringkasan", color: "slate", icon: "fa-list" },
    CHARACTER: { label: "Karakter", color: "rose", icon: "fa-user" },
};

const getColorClasses = (color, isDark) => {
    const colorMap = {
        blue: isDark ? "bg-blue-950/40 border-blue-500/40 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "bg-blue-50 border-blue-300 text-blue-700",
        amber: isDark ? "bg-amber-950/40 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "bg-amber-50 border-amber-300 text-amber-700",
        emerald: isDark ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-emerald-50 border-emerald-300 text-emerald-700",
        fuchsia: isDark ? "bg-fuchsia-950/40 border-fuchsia-500/40 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700",
        orange: isDark ? "bg-orange-950/40 border-orange-500/40 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]" : "bg-orange-50 border-orange-300 text-orange-700",
        pink: isDark ? "bg-pink-950/40 border-pink-500/40 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]" : "bg-pink-50 border-pink-300 text-pink-700",
        slate: isDark ? "bg-slate-900/40 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-700",
        rose: isDark ? "bg-rose-950/40 border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]" : "bg-rose-50 border-rose-300 text-rose-700",
    };
    return colorMap[color] || (isDark ? "bg-slate-900/40 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-700");
};

// Helper to generate a slug for anime navigation
const slugify = (text) =>
    (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export default function RelationsTab({ relations = [], tags = [] }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [isTagsExpanded, setIsTagsExpanded] = useState(false);

    const INITIAL_TAGS_LIMIT = 10;
    const visibleTags = isTagsExpanded ? tags : tags.slice(0, INITIAL_TAGS_LIMIT);

    const cardBaseClass = isDark
        ? "bg-[#0b0406]/90 border border-white/5 shadow-2xl backdrop-blur-xl rounded-3xl p-3 xs:p-4 sm:p-6 md:p-7"
        : "bg-white/95 border border-slate-200 shadow-xl rounded-3xl p-3 xs:p-4 sm:p-6 md:p-7";

    return (
        <div className="relative group">
            {/* Ambient glow */}
            {isDark && (
                <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-30 bg-gradient-to-br from-[#ff1e56]/10 via-transparent to-transparent pointer-events-none" />
            )}

            {/* Main Container */}
            <div className={`relative overflow-hidden transition-all duration-500 ${cardBaseClass}`}>
                {/* ===== RELATIONS ===== */}
                <div className="mb-7 sm:mb-9">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3.5">
                            <div
                                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 border ${isDark
                                    ? "bg-[#14080b] border-[#ff1e56]/20 shadow-[0_0_20px_rgba(255,30,86,0.15)]"
                                    : "bg-rose-50 border-rose-200 shadow-sm"
                                    }`}
                            >
                                <i className="fa-solid fa-diagram-project text-base text-[#ff1e56]" />
                            </div>
                            <div>
                                <h4 className={`font-black text-sm sm:text-lg tracking-tight uppercase flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
                                    Karya Terkait & Sekuel
                                    <span
                                        className={`border text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black ${isDark
                                            ? "bg-[#ff1e56]/10 text-[#ff1e56] border-[#ff1e56]/30"
                                            : "bg-rose-50 text-rose-600 border-rose-200"
                                            }`}
                                    >
                                        {relations.length}
                                    </span>
                                </h4>
                                <p className={`text-[10px] sm:text-xs mt-0.5 font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                    Jelajahi alur cerita, prequel, sequel, dan adaptasi resmi
                                </p>
                            </div>
                        </div>
                    </div>

                    {relations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                            {relations.map((relation) => {
                                const matched = RELATION_TYPE_LABEL[relation.relationType] || {
                                    label: relation.relationType,
                                    color: "slate",
                                    icon: "fa-link",
                                };
                                const typeClasses = getColorClasses(matched.color, isDark);
                                const isManga = relation.format === "MANGA" || relation.mediaType === "MANGA";

                                const title =
                                    relation.title?.english ??
                                    relation.title?.romaji ??
                                    "Karya Terkait";

                                const animeSlug = slugify(title);

                                return (
                                    <motion.div
                                        key={relation.id}
                                        whileHover={{ y: -3 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        className={`group/card relative rounded-2xl p-3 sm:p-4 border backdrop-blur-xl transition-all duration-300 overflow-hidden ${isDark
                                            ? "bg-[#120609]/80 border-white/5 hover:border-[#ff1e56]/40 hover:bg-[#18090d]/90 shadow-md hover:shadow-[0_10px_30px_rgba(255,30,86,0.15)]"
                                            : "bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 shadow-sm hover:shadow-lg"
                                            }`}
                                    >
                                        {/* Subtle Glow on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1e56]/10 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite] pointer-events-none" />

                                        <div className="relative z-10 flex gap-3.5 sm:gap-4 items-center">
                                            {/* Cover Poster */}
                                            <div
                                                className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shrink-0 border transition-transform duration-500 group-hover/card:scale-105 shadow-md ${isDark
                                                    ? "bg-[#1a0a0f] border-white/10 group-hover/card:border-[#ff1e56]/40"
                                                    : "bg-slate-100 border-slate-200 group-hover/card:border-rose-300"
                                                    }`}
                                            >
                                                {relation.cover ? (
                                                    <img
                                                        src={relation.cover}
                                                        alt={title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <i className={`fa-solid fa-film text-sm ${isDark ? "text-slate-700" : "text-slate-400"}`} />
                                                    </div>
                                                )}

                                                {/* Format Badge Overlay */}
                                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-black/80 text-white backdrop-blur-md border border-white/10">
                                                    {relation.format || (isManga ? "MANGA" : "ANIME")}
                                                </span>
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0 flex-1 flex flex-col justify-between h-full py-0.5 space-y-2">
                                                <div>
                                                    {/* Relation Type Pill */}
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md border shadow-xs ${typeClasses}`}
                                                        >
                                                            <i className={`fa-solid ${matched.icon} text-[8px]`} />
                                                            {matched.label}
                                                        </span>
                                                        <span className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                            {isManga ? "Adaptasi Asli" : "Serial Resmi"}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h5
                                                        className={`font-black text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${isDark
                                                            ? "text-slate-100 group-hover/card:text-white"
                                                            : "text-slate-800 group-hover/card:text-rose-600"
                                                            }`}
                                                    >
                                                        {title}
                                                    </h5>
                                                </div>

                                                {/* Action Link Button */}
                                                <div className="pt-1">
                                                    {isManga ? (
                                                        <a
                                                            href={`https://anilist.co/manga/${relation.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider border transition-all ${isDark
                                                                ? "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]"
                                                                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                                                                }`}
                                                        >
                                                            <i className="fa-solid fa-book-open text-[9px] text-[#ff1e56]" />
                                                            <span>Info Manga</span>
                                                            <i className="fa-solid fa-arrow-up-right-from-square text-[8px] opacity-70" />
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            to={`/anime/detail/${animeSlug}`}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white shadow-[0_2px_10px_rgba(255,30,86,0.3)] hover:shadow-[0_0_15px_rgba(255,30,86,0.5)] transition-all"
                                                        >
                                                            <span>Buka Detail</span>
                                                            <i className="fa-solid fa-chevron-right text-[8px]" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <div
                                className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 ${isDark
                                    ? "bg-[#14080b] border border-[#ff1e56]/20 text-slate-500"
                                    : "bg-slate-100 border border-slate-200 text-slate-400"
                                    }`}
                            >
                                <i className="fa-solid fa-link-slash text-base" />
                            </div>
                            <p className={`text-xs font-semibold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                Tidak ada data relasi serial untuk anime ini
                            </p>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-6 sm:mb-8" />

                {/* ===== GENRE & TAGS ===== */}
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 border ${isDark
                                    ? "bg-[#14080b] border-[#ff1e56]/20 shadow-[0_0_20px_rgba(255,30,86,0.15)]"
                                    : "bg-rose-50 border-rose-200 shadow-sm"
                                    }`}
                            >
                                <i className="fa-solid fa-tags text-sm sm:text-base text-[#ff1e56]" />
                            </div>
                            <div>
                                <h4 className={`font-black text-sm sm:text-lg tracking-tight uppercase flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
                                    Genre & Karakteristik
                                    <span
                                        className={`border text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black ${isDark
                                            ? "bg-[#ff1e56]/10 text-[#ff1e56] border-[#ff1e56]/30"
                                            : "bg-rose-50 text-rose-600 border-rose-200"
                                            }`}
                                    >
                                        {tags.length}
                                    </span>
                                </h4>
                                <p className={`text-[10px] sm:text-xs mt-0.5 font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                    Indikator tema, topik, dan kecocokan genre penonton
                                </p>
                            </div>
                        </div>

                        {tags.length > INITIAL_TAGS_LIMIT && (
                            <button
                                onClick={() => setIsTagsExpanded((prev) => !prev)}
                                className={`self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all select-none cursor-pointer ${isDark
                                    ? "bg-white/[0.03] border-white/10 text-slate-300 hover:border-[#ff1e56]/40 hover:text-white"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-rose-400"
                                    }`}
                            >
                                <span>{isTagsExpanded ? "Perkecil" : `Semua (${tags.length})`}</span>
                                <i className={`fa-solid fa-chevron-${isTagsExpanded ? "up" : "down"} text-[9px] text-[#ff1e56]`} />
                            </button>
                        )}
                    </div>

                    {/* Tags List with Color Coded Ranking Badges */}
                    {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {visibleTags.map((tag) => {
                                const rank = tag.rank || 0;
                                const isHighRank = rank >= 80;
                                const isMediumRank = rank >= 60;

                                return (
                                    <span
                                        key={tag.name}
                                        className={`group/tag inline-flex items-center gap-2 text-[10px] sm:text-xs px-3 py-1.5 rounded-xl transition-all duration-300 border select-none ${isDark
                                            ? "bg-white/[0.02] border-white/5 hover:border-[#ff1e56]/40 text-slate-300 hover:text-white hover:bg-white/[0.06] hover:shadow-[0_0_15px_rgba(255,30,86,0.15)]"
                                            : "bg-white border-slate-200 hover:border-rose-400 text-slate-700 hover:text-slate-950 shadow-xs"
                                            }`}
                                    >
                                        <span className="font-bold tracking-wide">
                                            {tag.name}
                                        </span>
                                        <span
                                            className={`font-black text-[9px] px-1.5 py-0.5 rounded-md border ${isHighRank
                                                ? isDark
                                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : isMediumRank
                                                    ? isDark
                                                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                    : isDark
                                                        ? "bg-[#ff1e56]/15 text-[#ff1e56] border-[#ff1e56]/30"
                                                        : "bg-rose-50 text-rose-600 border-rose-200"
                                                }`}
                                        >
                                            {rank}%
                                        </span>
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <div
                                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${isDark
                                    ? "bg-[#1a0a0f] border border-[#2a1117]"
                                    : "bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                <i className={`fa-solid fa-tag text-xs ${isDark ? "text-slate-700" : "text-slate-400"}`} />
                            </div>
                            <p className={`text-[10px] sm:text-xs font-medium ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                                Tidak ada data tag
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}