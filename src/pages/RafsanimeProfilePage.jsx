import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import CurrentlyWatching from '../components/profile/CurrentlyWatching';
import RecentActivity from '../components/profile/RecentActivity';
import Wishlist from "../components/profile/Wishlist";
import ProfileHeader from '../components/profile/profileHeader/ProfileHeader';
import ChangePassword from '../components/profile/ChangePassword';
import { useScrollReveal } from "../hooks/UseScrollReveal"
import { useWishlist } from '../hooks/useWishList'; 
import useWatchHistory from '../hooks/useWatchHistory'; 
import useRecentActivity from '../hooks/useRecentActivity'; 

// Helper function untuk relative time
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
    return `${diffDays} hari lalu`;
}

export default function RafsanimeProfilePage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { wishlistItems, loadingItems, removeWishlist } = useWishlist();
    
    const { history, historyLoading } = useWatchHistory(); 

    const { recentWatched, recentWishlist, loading: recentLoading } = useRecentActivity();

    const [animeWatchedCount, setAnimeWatchedCount] = useState(0);
    const [isWishlistExpanded, setIsWishlistExpanded] = useState(false);

    const [mounted, setMounted] = useState(true);

    const revealGrid = useScrollReveal({ threshold: 0.1, once: true });

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (history) {
            setAnimeWatchedCount(history.length);
        }
    }, [history]);

    const watchingList = history.map((item) => ({
        id: item.id,
        episodeId: item.episodeId,
        title: item.title,
        episode: item.episodeTitle || "Episode Baru",
        image: item.poster || "https://lh3.googleusercontent.com/aida-public/AB6AXuBtETzdVxgDy-r-GfUJ0Zh2NVGToYHg6YvQilrN0Juq5_DDr_GxxN6wzLDq5s4kD44rake8-LC5-kjwkS1oKqtPzCPmmbuUgTXHFh570SrtFPvSeUPDhEAjRqD2TWsYsfccSdtWp7cKbYUDrPfAHPh-p-yawViMKDmLMNRFeeoX5JEdi3BxL8qQudt9e3Jw8pmQSso-1aLEo8uis0nZB4dA8ZMx95s4DUlfFqPKLhuqDz-bkEktP6uxu1OYs-yFEQzWBzmfKufs1lh3",
        duration: getRelativeTime(item.watchedAt),
        progress: 100
    }));

    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'watching' | 'wishlist' | 'activity'

    return (
        <div
            className="min-h-screen font-sans antialiased selection:bg-red-600 selection:text-white overflow-x-hidden relative transition-colors duration-500"
            style={{
                backgroundColor: isDark ? "#050203" : "#faf8f5",
                color: isDark ? "#e5e2e1" : "#1a1a1a",
            }}
        >
            {/* Ambient Cones */}
            {isDark && (
                <>
                    <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[140px] pointer-events-none z-0 bg-[#ff1e56]/5" />
                    <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full blur-[130px] pointer-events-none z-0 bg-[#ff1e56]/4" />
                    <div className="absolute bottom-[10%] left-[25%] w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none z-0 bg-rose-900/5" />
                </>
            )}

            <main className="pt-4 sm:pt-8 pb-16 sm:pb-24 px-3.5 sm:px-6 max-w-7xl mx-auto z-10 relative space-y-6 sm:space-y-8">

                {/* ── 1. CINEMA PROFILE HEADER ── */}
                <div
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0px)" : "translateY(20px)",
                        transition: "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    <ProfileHeader animeWatchedCount={animeWatchedCount} />
                </div>

                {/* ── 2. BENTO STATS METRIC DECK ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {/* Stat 1: Total Selesai */}
                    <div
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                            isDark
                                ? 'bg-gradient-to-br from-[#120509]/80 to-[#0a0305]/90 border-white/[0.08] hover:border-[#ff1e56]/40 hover:shadow-[0_8px_25px_rgba(255,30,86,0.15)]'
                                : 'bg-white border-slate-200 hover:border-rose-400 hover:shadow-lg'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Anime Ditonton
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-[#ff1e56]/15 flex items-center justify-center text-[#ff1e56] text-xs">
                                <i className="fa-solid fa-film" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-display font-black text-2xl sm:text-3xl text-white">
                                {animeWatchedCount}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#ff1e56] uppercase">
                                Seri Selesai
                            </span>
                        </div>
                        <p className={`text-[10px] mt-1 line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Tersimpan dalam riwayat cloud
                        </p>
                    </div>

                    {/* Stat 2: Wishlist Koleksi */}
                    <div
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                            isDark
                                ? 'bg-gradient-to-br from-[#120509]/80 to-[#0a0305]/90 border-white/[0.08] hover:border-rose-500/40 hover:shadow-[0_8px_25px_rgba(244,63,94,0.15)]'
                                : 'bg-white border-slate-200 hover:border-rose-400 hover:shadow-lg'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Wishlist Favorit
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 text-xs">
                                <i className="fa-solid fa-heart" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-display font-black text-2xl sm:text-3xl text-white">
                                {wishlistItems.length}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                                Anime Disimpan
                            </span>
                        </div>
                        <p className={`text-[10px] mt-1 line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Siap ditonton kapan saja
                        </p>
                    </div>

                    {/* Stat 3: Total Interaksi */}
                    <div
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                            isDark
                                ? 'bg-gradient-to-br from-[#120509]/80 to-[#0a0305]/90 border-white/[0.08] hover:border-amber-500/40 hover:shadow-[0_8px_25px_rgba(245,158,11,0.15)]'
                                : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-lg'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Log Aktivitas
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 text-xs">
                                <i className="fa-solid fa-clock-rotate-left" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-display font-black text-2xl sm:text-3xl text-white">
                                {recentWatched.length + recentWishlist.length}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                                Riwayat
                            </span>
                        </div>
                        <p className={`text-[10px] mt-1 line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Sinkronisasi otomatis aktif
                        </p>
                    </div>

                    {/* Stat 4: VIP Privilege Tier */}
                    <div
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                            isDark
                                ? 'bg-gradient-to-br from-[#16060c] via-[#0e0408] to-[#0a0205] border-[#ff1e56]/30 shadow-[0_8px_25px_rgba(255,30,86,0.15)]'
                                : 'bg-gradient-to-br from-rose-50 to-white border-rose-200 shadow-md'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff1e56]">
                                Keanggotaan
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff1e56] to-rose-600 flex items-center justify-center text-white text-xs shadow-md">
                                <i className="fa-solid fa-crown" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-display font-black text-xl sm:text-2xl text-white">
                                VIP PRO
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-[10px] mt-1 font-mono text-emerald-400 font-bold uppercase tracking-wider">
                            Ultra HD 4K • Zero Ads
                        </p>
                    </div>
                </div>

                {/* ── 3. STUDIO TAB DECK ── */}
                <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                        isDark
                            ? 'border-white/[0.08] bg-[#0d0408]/90 backdrop-blur-2xl'
                            : 'border-slate-200 bg-white shadow-sm'
                    }`}
                >
                    {/* Tab Buttons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" style={{ scrollbarWidth: 'none' }}>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                                activeTab === 'all'
                                    ? 'bg-[#ff1e56] border-[#ff1e56] text-white shadow-[0_4px_16px_rgba(255,30,86,0.35)]'
                                    : isDark
                                        ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <i className="fa-solid fa-table-cells-large text-[10px]" />
                            <span>Ringkasan Studio</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('watching')}
                            className={`px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                                activeTab === 'watching'
                                    ? 'bg-[#ff1e56] border-[#ff1e56] text-white shadow-[0_4px_16px_rgba(255,30,86,0.35)]'
                                    : isDark
                                        ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <i className="fa-solid fa-play text-[9px]" />
                            <span>Sedang Ditonton ({watchingList.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                                activeTab === 'wishlist'
                                    ? 'bg-[#ff1e56] border-[#ff1e56] text-white shadow-[0_4px_16px_rgba(255,30,86,0.35)]'
                                    : isDark
                                        ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <i className="fa-solid fa-heart text-[9px]" />
                            <span>Wishlist ({wishlistItems.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                                activeTab === 'activity'
                                    ? 'bg-[#ff1e56] border-[#ff1e56] text-white shadow-[0_4px_16px_rgba(255,30,86,0.35)]'
                                    : isDark
                                        ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <i className="fa-solid fa-clock-rotate-left text-[9px]" />
                            <span>Aktivitas & Log</span>
                        </button>
                    </div>

                    {/* Status Sync Badge */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Cloud Sync Aktif</span>
                        </span>
                    </div>
                </div>

                {/* ── 4. DYNAMIC VIEW SECTIONS ── */}
                {/* MODE A: BENTO OVERVIEW (ALL) */}
                {activeTab === 'all' && (
                    <div className="space-y-8">
                        <div
                            ref={revealGrid.ref}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start"
                            style={{
                                opacity: revealGrid.isVisible ? 1 : 0,
                                transform: revealGrid.isVisible ? "translateY(0px)" : "translateY(25px)",
                                transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                        >
                            {/* Left Col (8): Currently Watching & Wishlist */}
                            <div className="lg:col-span-8 flex flex-col gap-8">
                                <CurrentlyWatching
                                    shows={watchingList}
                                    loading={historyLoading}
                                    compact
                                    onViewAll={() => setActiveTab('watching')}
                                />

                                <div className="pt-2">
                                    <Wishlist
                                        wishlist={wishlistItems}
                                        loading={loadingItems}
                                        onRemove={removeWishlist}
                                        isExpanded={isWishlistExpanded}
                                        setIsExpanded={setIsWishlistExpanded}
                                    />
                                </div>
                            </div>

                            {/* Right Col (4): VIP Member Perks + Recent Activity */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                {/* VIP Privilege Cinema Card */}
                                <div
                                    className={`rounded-3xl p-5 sm:p-6 border relative overflow-hidden transition-all duration-300 ${
                                        isDark
                                            ? 'bg-gradient-to-br from-[#18060e] via-[#0d0408] to-[#070204] border-[#ff1e56]/25 shadow-xl'
                                            : 'bg-gradient-to-br from-rose-50 to-white border-rose-200 shadow-lg'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#ff1e56]/15 border border-[#ff1e56]/30 text-[#ff1e56]">
                                            <i className="fa-solid fa-certificate text-[9px]" />
                                            <span>MEMBER PRIVILEGE</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-400 font-bold">● AKTIF</span>
                                    </div>

                                    <h4 className="font-display font-black text-lg text-white mb-3">
                                        Rafsanime Titanium Pass
                                    </h4>

                                    <ul className="space-y-2.5 text-xs text-slate-300 mb-5">
                                        <li className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">
                                                <i className="fa-solid fa-check" />
                                            </div>
                                            <span>Multi-Server Streaming 1080p & 4K</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">
                                                <i className="fa-solid fa-check" />
                                            </div>
                                            <span>Simulcast Resmi Subtitle Indonesia</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">
                                                <i className="fa-solid fa-check" />
                                            </div>
                                            <span>Zero Iklan & Tanpa Buffering</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">
                                                <i className="fa-solid fa-check" />
                                            </div>
                                            <span>Riwayat & Wishlist Tersinkron Cloud</span>
                                        </li>
                                    </ul>

                                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                                        <span className="text-slate-400">Status Server:</span>
                                        <span className="text-[#ff1e56] font-bold">VIP High-Speed 10Gbps</span>
                                    </div>
                                </div>

                                <RecentActivity
                                    recentWatched={recentWatched}
                                    recentWishlist={recentWishlist}
                                    loading={recentLoading}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Pengaturan akun tinggal di tampilan ringkasan, bukan tab tersendiri. */}
                {activeTab === 'all' && (
                    <div className="max-w-2xl mx-auto mt-4 sm:mt-6">
                        <ChangePassword />
                    </div>
                )}

                {/* MODE B: SEDANG DITONTON (FULL VIEW) */}
                {activeTab === 'watching' && (
                    <div className="w-full">
                        <CurrentlyWatching shows={watchingList} loading={historyLoading} />
                    </div>
                )}

                {/* MODE C: WISHLIST KOLEKSI (FULL VIEW) */}
                {activeTab === 'wishlist' && (
                    <div className="w-full">
                        <Wishlist
                            wishlist={wishlistItems}
                            loading={loadingItems}
                            onRemove={removeWishlist}
                            isExpanded={true}
                            setIsExpanded={setIsWishlistExpanded}
                        />
                    </div>
                )}

                {/* MODE D: RIWAYAT AKTIVITAS (FULL VIEW) */}
                {activeTab === 'activity' && (
                    <div className="max-w-2xl mx-auto">
                        <RecentActivity
                            recentWatched={recentWatched}
                            recentWishlist={recentWishlist}
                            loading={recentLoading}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
