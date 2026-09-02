import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import RecentActivitySkeleton from '../../skeletons/profil/RecentActivitySkeleton';
import { ChevronLeft, ChevronRight, Play, Heart, Clock } from 'lucide-react';

function getRelativeTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 30) return `${diffDays} hari lalu`;
    return new Date(dateString).toLocaleDateString("id-ID");
}

function isRecent(timestamp) {
    if (!timestamp) return false;
    const diffMs = new Date() - new Date(timestamp);
    return diffMs < 86400000;
}

const ITEMS_PER_PAGE = 5;

export default function RecentActivity({ recentWatched = [], recentWishlist = [], loading = false }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [animKey, setAnimKey] = useState(0);
    const prevPageRef = useRef(page);

    const activities = React.useMemo(() => {
        const watched = recentWatched.map(item => ({
            ...item,
            type: "watch",
            timestamp: item.watchedAt,
            description: `${item.episodeTitle || "Episode"}`,
            subtitle: item.title,
            link: `/episode/${item.episodeId}`
        }));

        const wishlisted = recentWishlist.map(item => ({
            ...item,
            type: "wishlist",
            timestamp: item.createdAt,
            description: `${item.title}`,
            subtitle: "Wishlist",
            link: `/anime/detail/${item.animeId}`
        }));

        return [...watched, ...wishlisted].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    }, [recentWatched, recentWishlist]);

    const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE) || 1;
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const visibleActivities = activities.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    const empty = !loading && activities.length === 0;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    useEffect(() => {
        if (prevPageRef.current !== page) {
            setAnimKey(prev => prev + 1);
            prevPageRef.current = page;
        }
    }, [page]);

    const typeConfig = {
        watch: {
            icon: Play,
            iconBg: isDark ? "bg-red-500/20" : "bg-red-50",
            iconColor: "text-red-500",
            badge: "bg-red-500/10 text-red-400 border-red-500/20",
            label: "Nonton"
        },
        wishlist: {
            icon: Heart,
            iconBg: isDark ? "bg-rose-500/20" : "bg-rose-50",
            iconColor: "text-rose-500",
            badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            label: "Wishlist"
        }
    };

    const pageBase = isDark
        ? "text-neutral-500 hover:text-white hover:bg-white/[0.06]"
        : "text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100";

    return (
        <div className="flex flex-col transition-colors duration-500">
            <div className="flex items-center gap-2.5 mb-5 shrink-0">
                <div className="w-1 h-5 bg-gradient-to-b from-[#ec001d] to-rose-500 rounded-full shadow-[0_2px_10px_rgba(236,0,29,0.4)]" />
                <h2 className={`font-sora text-xs md:text-sm font-extrabold tracking-tight uppercase transition-colors duration-300 ${
                    isDark ? "text-white" : "text-neutral-800"
                }`}>
                    Recent Activity
                </h2>
                {!loading && activities.length > 0 && (
                    <span className={`ml-auto text-[9px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded-full ${
                        isDark ? "text-neutral-500 bg-white/[0.04]" : "text-neutral-400 bg-neutral-100"
                    }`}>
                        {activities.length}
                    </span>
                )}
            </div>

            <div className={`relative border rounded-3xl p-5 backdrop-blur-md transition-all duration-300 ${
                isDark
                    ? "bg-white/[0.02] border-white/5 shadow-none"
                    : "bg-gradient-to-b from-white to-neutral-50/80 border-neutral-200/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)]"
            }`}>
                <div className={`absolute inset-0 rounded-3xl pointer-events-none opacity-30 ${
                    isDark
                        ? "bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent"
                        : ""
                }`} />

                {loading ? (
                    <RecentActivitySkeleton />
                ) : empty ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                            isDark ? "bg-white/[0.03]" : "bg-neutral-100"
                        }`}>
                            <Clock size={22} className={isDark ? "text-neutral-600" : "text-neutral-300"} />
                        </div>
                        <p className={`text-[11px] font-semibold text-center ${
                            isDark ? "text-neutral-500" : "text-neutral-400"
                        }`}>
                            Belum ada aktivitas
                        </p>
                        <p className={`text-[9px] font-mono text-center mt-1 ${
                            isDark ? "text-neutral-600" : "text-neutral-300"
                        }`}>
                            Mulai nonton atau tambah wishlist
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="relative space-y-0.5 min-h-[300px]" key={animKey}>
                            {visibleActivities.map((item, idx) => {
                                const config = typeConfig[item.type];
                                const Icon = config.icon;
                                const isNew = isRecent(item.timestamp);

                                return (
                                    <div
                                        key={`${item.type}-${item.id || idx}`}
                                        onClick={() => navigate(item.link)}
                                        className="relative group cursor-pointer"
                                        style={{
                                            animation: `fadeSlideIn 400ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`
                                        }}
                                    >
                                        <div className={`relative flex items-center gap-3 -mx-3 px-3 py-2.5 rounded-2xl transition-all duration-300 ${
                                            isDark
                                                ? "hover:bg-white/[0.04] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                                                : "hover:bg-neutral-100/70 group-hover:shadow-[inset_0_1px_0_rgba(0,0,0,0.02)]"
                                        }`}>
                                            <div className="relative shrink-0">
                                                <div className={`w-10 h-10 rounded-xl overflow-hidden border ring-1 transition-all duration-300 ${
                                                    isDark
                                                        ? "border-white/8 ring-white/5 group-hover:ring-red-500/40 group-hover:border-red-500/20"
                                                        : "border-neutral-200/60 ring-black/5 group-hover:ring-red-500/20 group-hover:border-red-500/10"
                                                }`}>
                                                    <img
                                                        alt={item.title}
                                                        className="w-10 h-10 object-cover transition-all duration-500 ease-out group-hover:scale-105"
                                                        src={item.poster || ""}
                                                        onError={(e) => { e.target.style.display = "none" }}
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 ${
                                                    isDark ? "border-[#070707]" : "border-white"
                                                } ${config.iconBg}`}>
                                                    <Icon size={7} className={config.iconColor} fill="currentColor" />
                                                </div>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-[9px] font-mono font-semibold uppercase tracking-wider ${config.iconColor}`}>
                                                        {config.label}
                                                    </span>
                                                    {isNew && (
                                                        <span className={`text-[7px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${
                                                            isDark
                                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                        }`}>
                                                            Baru
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-xs font-bold truncate mt-0.5 transition-colors duration-200 ${
                                                    isDark
                                                        ? "text-neutral-200 group-hover:text-white"
                                                        : "text-neutral-700 group-hover:text-neutral-900"
                                                }`}>
                                                    {item.description}
                                                </p>
                                                <p className={`text-[9px] font-mono font-medium truncate mt-0.5 ${
                                                    isDark ? "text-neutral-500" : "text-neutral-400"
                                                }`}>
                                                    {item.subtitle}
                                                </p>
                                            </div>

                                            <span className={`shrink-0 text-[8px] font-mono font-semibold tracking-wider ${
                                                isDark ? "text-neutral-600" : "text-neutral-300"
                                            }`}>
                                                {getRelativeTime(item.timestamp)}
                                            </span>
                                        </div>

                                        {idx < visibleActivities.length - 1 && (
                                            <div className={`mx-3 ml-[52px] h-px ${
                                                isDark ? "bg-white/[0.03]" : "bg-neutral-100"
                                            }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-3 border-t transition-colors duration-300"
                                style={{
                                    borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"
                                }}
                            >
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className={`p-1.5 rounded-xl transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed ${
                                        isDark ? "hover:bg-white/[0.05] text-neutral-400" : "hover:bg-neutral-100 text-neutral-500"
                                    }`}
                                >
                                    <ChevronLeft size={13} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {pages.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`relative w-7 h-7 rounded-xl text-[10px] font-bold font-mono transition-all duration-300 ${
                                                p === page
                                                    ? "bg-gradient-to-br from-[#ec001d] to-rose-600 text-white shadow-[0_4px_12px_rgba(236,0,29,0.35)] scale-105"
                                                    : `${pageBase}`
                                            }`}
                                        >
                                            {p === page && (
                                                <span className="absolute inset-0 rounded-xl animate-pulse ring-1 ring-red-500/30" />
                                            )}
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    className={`p-1.5 rounded-xl transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed ${
                                        isDark ? "hover:bg-white/[0.05] text-neutral-400" : "hover:bg-neutral-100 text-neutral-500"
                                    }`}
                                >
                                    <ChevronRight size={13} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
