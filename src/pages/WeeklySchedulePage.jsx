import { useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import DaySelector from "../components/jadwal/DaySelektor";
import ScheduleCard from "../components/jadwal/Schedule";
import useSchedule from "../hooks/useSchedule";

const DAY_KEYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getTodayKey() {
    return DAY_KEYS[new Date().getDay()];
}

export default function WeeklySchedulePage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [activeDay, setActiveDay] = useState(getTodayKey());
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'airing' | 'upcoming'

    // Data dari API
    const { schedule, loading, error } = useSchedule();
    const activeSchedule = useMemo(() => schedule[activeDay] ?? [], [schedule, activeDay]);

    // Format current date in Indonesian
    const formattedToday = useMemo(() => {
        try {
            return new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(new Date());
        } catch {
            return '';
        }
    }, []);

    // Filtered by search & status
    const filteredSchedule = useMemo(() => {
        let list = [...activeSchedule];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(a =>
                a.title?.toLowerCase().includes(q) ||
                (Array.isArray(a.genres) && a.genres.some(g => g.toLowerCase().includes(q)))
            );
        }

        if (statusFilter === 'airing') {
            list = list.filter(a => a.airingInSeconds <= 0);
        } else if (statusFilter === 'upcoming') {
            list = list.filter(a => a.airingInSeconds > 0);
        }

        return list;
    }, [activeSchedule, searchQuery, statusFilter]);

    return (
        <div className={`min-h-screen transition-colors duration-500 py-4 sm:py-8 relative overflow-hidden ${isDark ? 'bg-[#050203]' : 'bg-[#faf8f5]'}`}>

            {/* Ambient glows */}
            {isDark && (
                <>
                    <div className="absolute top-[-100px] left-[-50px] w-[500px] h-[500px] rounded-full bg-[#ff1e56]/4 blur-[130px] pointer-events-none" />
                    <div className="absolute top-[30%] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#ff1e56]/3 blur-[120px] pointer-events-none" />
                </>
            )}

            <main className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 flex flex-col gap-4 sm:gap-6 relative z-10">

                {/* ── Studio Header Banner ── */}
                <header className="relative min-w-0">
                    <div
                        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-7 md:p-8 backdrop-blur-2xl transition-all duration-300 ${
                            isDark
                                ? 'bg-gradient-to-br from-[#120509]/90 via-[#0a0305]/95 to-[#070204] border-white/[0.08] shadow-2xl'
                                : 'bg-gradient-to-br from-white via-slate-50 to-rose-50/30 border-slate-200 shadow-xl'
                        }`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-[#ff1e56]/10 border border-[#ff1e56]/30 text-[#ff1e56]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-pulse" />
                                    <span>Kalender Simulcast Resmi</span>
                                </div>
                                <h1
                                    className={`font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight uppercase ${
                                        isDark ? 'text-white' : 'text-slate-900'
                                    }`}
                                >
                                    Jadwal Rilis Anime
                                </h1>
                                <p className={`text-xs sm:text-sm font-medium max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Pantau jam tayang simulcast episode terbaru setiap hari sesuai waktu rilis subtitle Indonesia resmi.
                                </p>
                            </div>

                            {/* Stats badges */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <div
                                    className={`px-3.5 py-2 rounded-xl border text-center ${
                                        isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'
                                    }`}
                                >
                                    <span className="block text-xs sm:text-sm font-mono font-bold text-[#ff1e56]">
                                        {loading ? '...' : `${activeSchedule.length} Anime`}
                                    </span>
                                    <span className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Rilis Hari Ini
                                    </span>
                                </div>
                                <div
                                    className={`px-3.5 py-2 rounded-xl border text-center ${
                                        isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'
                                    }`}
                                >
                                    <span className={`block text-xs sm:text-sm font-mono font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        Auto-Sync
                                    </span>
                                    <span className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Hitung Mundur
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom date strip */}
                        {formattedToday && (
                            <div className="mt-4 pt-3 border-t border-inherit flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                <i className="fa-regular fa-calendar text-[#ff1e56]" />
                                <span>{formattedToday}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* ── 7-Day Selector ── */}
                <DaySelector activeDay={activeDay} onDayChange={(d) => { setActiveDay(d); setSearchQuery(''); }} />

                {/* ── Command Bar: Search & Status Filters ── */}
                <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
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
                            placeholder={`Cari anime rilis hari ini (${activeDay})...`}
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

                    {/* Status Filter Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                                statusFilter === 'all'
                                    ? 'bg-[#ff1e56] border-[#ff1e56] text-white shadow-sm'
                                    : isDark
                                        ? 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-white'
                                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setStatusFilter('airing')}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                                statusFilter === 'airing'
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                    : isDark
                                        ? 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-white'
                                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            ● Sedang Tayang
                        </button>
                        <button
                            onClick={() => setStatusFilter('upcoming')}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                                statusFilter === 'upcoming'
                                    ? 'bg-[#ff1e56] border-[#ff1e56] text-white shadow-sm'
                                    : isDark
                                        ? 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-white'
                                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Segera Hadir
                        </button>
                    </div>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl aspect-16/11 animate-pulse ${
                                    isDark ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-slate-100'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="text-center py-10 text-rose-400 text-sm">{error}</div>
                )}

                {/* Schedule Grid */}
                {!loading && !error && filteredSchedule.length > 0 && (
                    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {filteredSchedule.map((anime, i) => (
                            <ScheduleCard key={`${anime.animeId}-${i}`} anime={anime} />
                        ))}
                    </section>
                )}

                {/* Empty */}
                {!loading && !error && filteredSchedule.length === 0 && (
                    <div
                        className={`text-center py-16 sm:py-20 rounded-2xl border border-dashed flex flex-col items-center gap-3 ${
                            isDark ? 'border-white/[0.08] bg-white/[0.01]' : 'border-slate-200 bg-white'
                        }`}
                    >
                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-1 ${
                                isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
                            }`}
                        >
                            <i className="fa-solid fa-calendar-xmark text-xl text-[#ff1e56]/40" />
                        </div>
                        <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {searchQuery ? `Tidak ada anime dengan kata kunci "${searchQuery}"` : 'Tidak ada jadwal rilis untuk filter ini'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase bg-[#ff1e56] text-white cursor-pointer"
                            >
                                Reset Pencarian
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}