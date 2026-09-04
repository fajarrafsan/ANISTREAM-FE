import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CatalogControlDeck from '../components/katalog/CatalogControlDeck';
import MovieCard from '../components/katalog/MovieCard';
import useAnimeCatalog from '../hooks/useAnimeKatalog';
import { api } from '../api/axios';

import { SkeletonCard, SkeletonIndexList } from '../skeletons/movieKatalog/CatalogSkeletons';

const TABS = [
    { key: 'popular', label: 'Populer', icon: 'fa-fire' },
    { key: 'complete', label: 'Selesai', icon: 'fa-circle-check' },
    { key: 'ongoing', label: 'Ongoing', icon: 'fa-circle-play' },
    { key: 'recent', label: 'Terbaru', icon: 'fa-clock' },
    { key: 'movies', label: 'Movies', icon: 'fa-film' },
    { key: 'all', label: 'Indeks A-Z', icon: 'fa-font' },
];

const ORDER_OPTIONS = {
    complete: [
        { value: 'latest', label: 'Terbaru' },
        { value: 'oldest', label: 'Terlama' },
        { value: 'title', label: 'A - Z' },
        { value: 'rating', label: 'Rating' },
    ],
    ongoing: [
        { value: 'popular', label: 'Terpopuler' },
        { value: 'latest', label: 'Terbaru' },
        { value: 'title', label: 'A - Z' },
    ],
};

export default function MovieCatalogPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        activeTab,
        changeTab,
        page,
        setPage,
        order,
        setOrder,
        genreId,
        changeGenre,
        data,
        pagination,
        loading,
        error,
        isRecent,
        isAll,
    } = useAnimeCatalog();

    const [genreOptions, setGenreOptions] = useState([]);

    // ── SINKRONISASI FILTER TAB DARI HOMEPAGE ──
    const tabParam = searchParams.get('tab');

    useEffect(() => {
        if (tabParam) {
            const isValidTab = TABS.some(t => t.key === tabParam);
            if (isValidTab) {
                changeTab(tabParam);
                setSearchParams({}, { replace: true });
            }
        }
    }, [tabParam, changeTab, setSearchParams]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await api.get('/anime/genres');
                setGenreOptions(res.data.data ?? []);
            } catch (err) {
                console.error('Gagal mengambil opsi genre:', err);
            }
        };
        fetchGenres();
    }, []);

    const [selectedGenre, setSelectedGenre] = useState('');
    const [activeStatus, setActiveStatus] = useState('');
    const [appliedStatus, setAppliedStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    const handleApplyFilters = () => {
        setAppliedStatus(activeStatus);
        changeGenre(selectedGenre);
    };

    const handleResetFilters = () => {
        setSelectedGenre('');
        setActiveStatus('');
        setAppliedStatus('');
        setSearchQuery('');
        changeGenre('');
        setPage(1);
    };

    useEffect(() => {
        handleResetFilters();
    }, [activeTab]);

    const filteredData = useMemo(() => {
        let result = [...data];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((a) => {
                const titleMatch = a.title?.toLowerCase().includes(q);
                const genreMatch = Array.isArray(a.genres) && a.genres.some((g) => g.toLowerCase().includes(q));
                return titleMatch || genreMatch;
            });
        }

        if (!isRecent && appliedStatus) {
            result = result.filter((a) => {
                const s = a.status?.toLowerCase();
                if (appliedStatus === 'Selesai') return s === 'completed' || s === 'selesai';
                if (appliedStatus === 'Berjalan') return s === 'ongoing' || s === 'berjalan';
                return true;
            });
        }

        return result;
    }, [data, appliedStatus, isRecent, searchQuery]);

    const spotlightAnime = useMemo(() => {
        if (page === 1 && !searchQuery && !appliedStatus && !genreId && filteredData.length > 0 && !isAll) {
            return filteredData[0];
        }
        return null;
    }, [page, searchQuery, appliedStatus, genreId, filteredData, isAll]);

    const handlePageChange = (p) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── LOGIKA LOADING AWAL RENDER (Mencegah Kedipan Layar Kosong) ──
    // Tetap tampilkan skeleton jika sedang loading ATAU jika data masih kosong/belum di-fetch dan belum ada error
    const showSkeleton = loading || (data.length === 0 && !error);

    const contentGridClass = isRecent
        ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
        : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';

    return (
        <div
            className={`min-h-screen transition-colors duration-500 relative overflow-hidden py-4 sm:py-6 md:py-8 ${isDark ? 'bg-[#050203]' : 'bg-[#faf8f5]'
                }`}
        >
            {/* Ambient background glows */}
            {isDark && (
                <>
                    <div className="hidden sm:block absolute top-[-150px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[#ff1e56]/4 blur-[150px] pointer-events-none" />
                    <div className="hidden sm:block absolute top-[20%] right-[-200px] w-[500px] h-[500px] rounded-full bg-[#ff1e56]/3 blur-[180px] pointer-events-none" />
                </>
            )}

            <main className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 flex flex-col relative z-10 min-w-0">
                {/* Studio Header */}
                <header className="relative mb-6 sm:mb-8 min-w-0">
                    <div
                        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 md:p-10 backdrop-blur-2xl transition-all duration-300 ${
                            isDark
                                ? 'bg-gradient-to-br from-[#18050e] via-[#0c0306] to-[#050102] border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                                : 'bg-gradient-to-br from-white via-slate-50 to-rose-50/40 border-slate-200 shadow-xl'
                        }`}
                    >
                        {/* Micro-grid overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.12] pointer-events-none"
                            style={{
                                backgroundImage: isDark
                                    ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`
                                    : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)`,
                                backgroundSize: "24px 24px"
                            }}
                        />

                        {/* Ambient ruby glow */}
                        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-48 rounded-full blur-[100px] bg-[#ff1e56]/15 pointer-events-none" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.15em] bg-[#ff1e56]/15 border border-[#ff1e56]/30 text-[#ff1e56]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-pulse" />
                                        <span>RAFSANIME ARCHIVE ENGINE</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase bg-white/[0.04] border border-white/[0.08] text-slate-400">
                                        <i className="fa-solid fa-bolt text-[9px] text-amber-400" />
                                        <span>Ultra Fast CDN</span>
                                    </span>
                                </div>

                                <h1
                                    className={`font-display font-black text-2xl sm:text-3xl md:text-5xl tracking-tight uppercase leading-none ${
                                        isDark ? 'text-white' : 'text-slate-900'
                                    }`}
                                >
                                    Katalog Anime & Movie
                                </h1>

                                <p className={`text-xs sm:text-sm font-medium max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Jelajahi arsip pustaka anime terlengkap dengan kualitas tayangan Full HD hingga 4K, subtitle resmi Indonesia, dan update simulcast harian tanpa jeda.
                                </p>
                            </div>

                            {/* Luxury Stats Deck */}
                            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
                                <div
                                    className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all ${
                                        isDark ? 'bg-white/[0.03] border-white/[0.08] hover:border-[#ff1e56]/40' : 'bg-white border-slate-200 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-1.5 mb-1 text-xs font-mono font-black text-[#ff1e56]">
                                        <i className="fa-solid fa-layer-group text-[10px]" />
                                        <span>6 Kategori</span>
                                    </div>
                                    <span className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Filter Pintar
                                    </span>
                                </div>

                                <div
                                    className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all ${
                                        isDark ? 'bg-white/[0.03] border-white/[0.08] hover:border-[#ff1e56]/40' : 'bg-white border-slate-200 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-1.5 mb-1 text-xs font-mono font-black text-emerald-400">
                                        <i className="fa-solid fa-tv text-[10px]" />
                                        <span>1080p & 4K</span>
                                    </div>
                                    <span className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Resolusi Sinema
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="mb-5 sm:mb-6 min-w-0">
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 pb-0">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.key && !genreId;

                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => changeTab(tab.key)}
                                    className={`relative flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border transition-all duration-200 select-none overflow-hidden group/tab whitespace-nowrap text-center cursor-pointer
                                        ${isActive
                                            ? 'bg-gradient-to-r from-[#ff1e56] to-rose-600 border-transparent text-white shadow-[0_4px_18px_rgba(255,30,86,0.35)]'
                                            : isDark
                                                ? 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200 hover:bg-white/[0.05]'
                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <i
                                        className={`fa-solid ${tab.icon} text-[9px] sm:text-[10px] ${isActive ? 'text-white' : 'text-[#ff1e56]'
                                            }`}
                                    />
                                    <span className="relative z-10">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Filter deck */}
                {!isRecent && !isAll && (
                    <div className="mb-5 sm:mb-6 min-w-0 overflow-x-auto pb-1">
                        <CatalogControlDeck
                            selectedGenre={selectedGenre}
                            setSelectedGenre={setSelectedGenre}
                            activeStatus={activeStatus}
                            setActiveStatus={setActiveStatus}
                            handleResetFilters={handleResetFilters}
                            genreOptions={genreOptions}
                            statusOptions={['Selesai', 'Berjalan']}
                            onApply={handleApplyFilters}
                            order={order}
                            setOrder={setOrder}
                            orderOptions={ORDER_OPTIONS[activeTab] ?? []}
                            showOrder={(activeTab === 'complete' || activeTab === 'ongoing') && !genreId}
                            setPage={setPage}
                        />
                    </div>
                )}

                {/* Spotlight Billboard Banner (UI UX Pro Max Featured Anime) */}
                {spotlightAnime && !showSkeleton && (
                    <div className="relative mb-6 sm:mb-8 rounded-3xl overflow-hidden border border-[#ff1e56]/30 shadow-[0_15px_45px_rgba(255,30,86,0.2)] bg-[#0c0307] group/spotlight">
                        {/* Poster Backdrop with Ken Burns effect */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 group-hover/spotlight:scale-105 transition-transform duration-1000"
                            style={{ backgroundImage: `url('${spotlightAnime.poster}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080204] via-[#080204]/90 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#080204] via-[#080204]/80 to-transparent" />

                        {/* Content */}
                        <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
                            <div className="w-24 sm:w-36 md:w-40 aspect-2/3 rounded-2xl overflow-hidden shadow-2xl border border-white/20 shrink-0 hidden xs:block relative group-hover/spotlight:scale-[1.02] transition-transform">
                                <img src={spotlightAnime.poster} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                                    <span className="text-[9px] font-mono font-bold text-white uppercase truncate">
                                        {spotlightAnime.type || 'Series'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3 flex-1 text-center sm:text-left min-w-0">
                                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                    <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#ff1e56]/20 border border-[#ff1e56]/40 text-[#ff1e56] shadow-[0_0_15px_rgba(255,30,86,0.3)]">
                                        ★ PREMIERE PILIHAN #1
                                    </span>
                                    {spotlightAnime.score && (
                                        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                            Score {spotlightAnime.score}
                                        </span>
                                    )}
                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-white/10 text-white border border-white/10 uppercase">
                                        {spotlightAnime.status || 'Aktif'}
                                    </span>
                                </div>

                                <h2 className="font-display font-black text-xl sm:text-3xl md:text-4xl text-white tracking-tight uppercase leading-tight truncate">
                                    {spotlightAnime.title}
                                </h2>

                                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl font-medium leading-relaxed">
                                    Tayangan anime unggulan resmi dengan resolusi sinema Full HD, alur audio tajam, dan pemutaran multi-server tanpa hambatan buffer.
                                </p>

                                <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                                    <button
                                        onClick={() => navigate(`/anime/detail/${spotlightAnime.animeId}`)}
                                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#ff1e56] to-rose-600 text-white shadow-[0_0_25px_rgba(255,30,86,0.5)] hover:shadow-[0_0_35px_rgba(255,30,86,0.8)] transition-all cursor-pointer flex items-center gap-2.5 hover:scale-[1.02] active:scale-95"
                                    >
                                        <i className="fa-solid fa-play text-xs" />
                                        <span>Tonton Sekarang</span>
                                    </button>
                                    <button
                                        onClick={() => navigate(`/anime/detail/${spotlightAnime.animeId}`)}
                                        className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/15 transition-all cursor-pointer"
                                    >
                                        Info Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="w-full min-w-0">
                    {/* Command Bar: Live Search & View Mode Switcher */}
                    <div
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 p-3 rounded-2xl border transition-all ${
                            isDark
                                ? 'border-white/[0.07] bg-[#0c0407]/90 backdrop-blur-xl'
                                : 'border-slate-200 bg-white shadow-sm'
                        }`}
                    >
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul anime di halaman ini..."
                                className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                                    isDark
                                        ? 'bg-white/[0.03] border-white/[0.08] focus:border-[#ff1e56]/60 text-white placeholder:text-slate-500'
                                        : 'bg-slate-50 border-slate-200 focus:border-rose-400 text-slate-800 placeholder:text-slate-400'
                                }`}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                                >
                                    <i className="fa-solid fa-xmark" />
                                </button>
                            )}
                        </div>

                        {/* Right: Results Count & View Mode Toggle */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                            <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {showSkeleton ? 'Memuat...' : `${filteredData.length} Anime`}
                            </span>

                            {/* View Mode Toggle */}
                            {!isAll && (
                                <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'border-white/[0.08] bg-white/[0.02]' : 'border-slate-200 bg-slate-100'}`}>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                                            viewMode === 'grid'
                                                ? 'bg-[#ff1e56] text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                        title="Tampilan Grid Poster"
                                    >
                                        <i className="fa-solid fa-grip" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                                            viewMode === 'list'
                                                ? 'bg-[#ff1e56] text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                        title="Tampilan List Bento"
                                    >
                                        <i className="fa-solid fa-list" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active Filters Pill Bar */}
                    {(selectedGenre || appliedStatus || searchQuery) && (
                        <div className="flex items-center gap-1.5 flex-wrap mb-4">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">Filter Aktif:</span>
                            {selectedGenre && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#ff1e56]/15 text-[#ff1e56] border border-[#ff1e56]/30">
                                    Genre: {selectedGenre}
                                    <button onClick={() => { setSelectedGenre(''); changeGenre(''); }} className="hover:text-white ml-0.5">✕</button>
                                </span>
                            )}
                            {appliedStatus && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#ff1e56]/15 text-[#ff1e56] border border-[#ff1e56]/30">
                                    Status: {appliedStatus}
                                    <button onClick={() => { setActiveStatus(''); setAppliedStatus(''); }} className="hover:text-white ml-0.5">✕</button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#ff1e56]/15 text-[#ff1e56] border border-[#ff1e56]/30">
                                    Cari: "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')} className="hover:text-white ml-0.5">✕</button>
                                </span>
                            )}
                            <button
                                onClick={handleResetFilters}
                                className="text-[10px] font-mono text-slate-400 hover:text-[#ff1e56] underline ml-1 cursor-pointer"
                            >
                                Reset Semua
                            </button>
                        </div>
                    )}

                    {/* Grid / List Content */}
                    {!error && (
                        <>
                            {/* Hubungkan Logika Deteksi Loading Awal Render */}
                            {showSkeleton ? (
                                isAll ? (
                                    <SkeletonIndexList isDark={isDark} />
                                ) : (
                                    <div className={`grid gap-3 sm:gap-5 ${contentGridClass}`}>
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <SkeletonCard key={i} isDark={isDark} />
                                        ))}
                                    </div>
                                )
                            ) : filteredData.length > 0 ? (
                                isAll ? (
                                    <div className="space-y-5 sm:space-y-8">
                                        {filteredData.map((group, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative rounded-2xl border p-3 sm:p-6 transition-all duration-300 group/section ${isDark
                                                    ? 'border-[#2a1117]/50 bg-gradient-to-br from-[#13080c]/60 to-[#0a0305]/80 hover:border-[#2a1117]'
                                                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 border-b border-dashed border-inherit min-w-0">
                                                    <span
                                                        className={`text-xl sm:text-2xl font-black shrink-0 ${isDark ? 'text-[#ff1e56]' : 'text-rose-500'
                                                            }`}
                                                    >
                                                        {group.startWith}
                                                    </span>
                                                    <div
                                                        className={`flex-1 h-px ${isDark ? 'bg-[#2a1117]' : 'bg-slate-200'
                                                            }`}
                                                    />
                                                    <span
                                                        className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'
                                                            }`}
                                                    >
                                                        {group.animeList?.length} judul
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                                                    {group.animeList?.map((anime) => (
                                                        <div
                                                            key={anime.animeId}
                                                            onClick={() => navigate(`/anime/detail/${anime.animeId}`)}
                                                            className={`group/item relative p-3 rounded-xl border text-[12px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-between overflow-hidden min-w-0 ${isDark
                                                                ? 'border-[#2a1117]/60 bg-[#13080c]/40 text-slate-300 hover:border-[#ff1e56]/30 hover:text-white hover:bg-[#1a0a10]'
                                                                : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-rose-200 hover:bg-white hover:text-slate-900'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 ${isDark
                                                                    ? 'bg-gradient-to-r from-[#ff1e56]/5 to-transparent'
                                                                    : 'bg-gradient-to-r from-rose-50 to-transparent'
                                                                    }`}
                                                            />

                                                            <span className="relative z-10 truncate pr-2 group-hover/item:translate-x-1 transition-transform duration-300 min-w-0">
                                                                {anime.title}
                                                            </span>
                                                            <i
                                                                className={`fa-solid fa-arrow-up-right-from-square text-[9px] opacity-0 group-hover/item:opacity-100 transition-all duration-300 relative z-10 shrink-0 ${isDark ? 'text-[#ff1e56]' : 'text-rose-500'
                                                                    }`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : viewMode === 'list' ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        {filteredData.map((anime, i) => (
                                            <MovieCard
                                                key={`${anime.animeId ?? 'card'}-${i}`}
                                                anime={anime}
                                                variant={isRecent ? 'recent' : 'default'}
                                                viewMode="list"
                                                onClick={() => navigate(`/anime/detail/${anime.animeId}`)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`grid gap-3 sm:gap-5 ${contentGridClass}`}>
                                        {filteredData.map((anime, i) => (
                                            <MovieCard
                                                key={`${anime.animeId ?? 'card'}-${i}`}
                                                anime={anime}
                                                variant={isRecent ? 'recent' : 'default'}
                                                viewMode="grid"
                                                onClick={() => navigate(`/anime/detail/${anime.animeId}`)}
                                            />
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div
                                    className={`relative text-center py-16 sm:py-24 px-4 rounded-3xl border border-dashed flex flex-col items-center gap-4 overflow-hidden ${
                                        isDark ? 'border-white/[0.12] bg-[#0c0307]/50' : 'border-slate-200 bg-slate-50/50'
                                    }`}
                                >
                                    <div
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl ${
                                            isDark ? 'bg-[#ff1e56]/10' : 'bg-rose-200/30'
                                        }`}
                                    />

                                    <div
                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border shadow-xl mb-1 ${
                                            isDark ? 'bg-white/[0.03] border-white/[0.1] text-[#ff1e56]' : 'bg-white border-slate-200 text-rose-500'
                                        }`}
                                    >
                                        <i className="fa-solid fa-film text-2xl sm:text-3xl" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            Tidak ada anime yang cocok
                                        </p>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Coba sesuaikan kata kunci pencarian atau ubah filter kategori Anda.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleResetFilters}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-300 relative z-10 cursor-pointer ${
                                            isDark
                                                ? 'bg-[#ff1e56]/15 border-[#ff1e56]/30 text-[#ff1e56] hover:bg-[#ff1e56] hover:text-white hover:shadow-[0_0_20px_rgba(255,30,86,0.5)]'
                                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 shadow-sm'
                                        }`}
                                    >
                                        <i className="fa-solid fa-rotate-left mr-1.5" />
                                        Reset Filter & Pencarian
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && !showSkeleton && (
                                <div className="mt-8 sm:mt-12 flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className={`group flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                                            isDark
                                                ? 'border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-[#ff1e56]/50 hover:text-white hover:bg-[#ff1e56]/10'
                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
                                        }`}
                                    >
                                        <i className="fa-solid fa-chevron-left text-[10px] group-hover:-translate-x-0.5 transition-transform" />
                                        <span>Prev</span>
                                    </button>

                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(
                                            (p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1
                                        )
                                        .reduce((acc, p, idx, arr) => {
                                            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((p, idx) =>
                                            p === '...' ? (
                                                <span
                                                    key={`dot-${idx}`}
                                                    className={`px-2 py-1.5 text-xs font-bold font-mono ${
                                                        isDark ? 'text-slate-600' : 'text-slate-400'
                                                    }`}
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    onClick={() => handlePageChange(p)}
                                                    className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-300 border min-w-9 sm:min-w-10 cursor-pointer ${
                                                        page === p
                                                            ? 'bg-gradient-to-r from-[#ff1e56] to-rose-600 border-[#ff1e56] text-white shadow-[0_0_20px_rgba(255,30,86,0.5)]'
                                                            : isDark
                                                                ? 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/[0.06]'
                                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )}

                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className={`group flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                                            isDark
                                                ? 'border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-[#ff1e56]/50 hover:text-white hover:bg-[#ff1e56]/10'
                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
                                        }`}
                                    >
                                        <span>Next</span>
                                        <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}