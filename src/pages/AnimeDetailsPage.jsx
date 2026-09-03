import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import HeroBanner from '../components/animeDetail/HeroBanner';
import Sidebar from '../components/animeDetail/sidebar/Sidebar';
import MainContent from '../components/animeDetail/mainContent/MainContent';
import TabsSection from '../components/animeDetail/tabsSection/TabsSection';
import { customStyles } from '../components/animeDetail/constants/styles';
import { pageVariants, sectionVariants, useMotionSafe, motionProps } from '../components/animeDetail/constants/animeDetailMotion';
import useAnimeDetail from '../hooks/useDetailAnime';
import useComments from '../hooks/useComments';
import AnimeDetailSkeleton from '../skeletons/animeDetailsSkeleton/AnimeDetailSkeleton';
import { useTheme } from '../context/ThemeContext';
import { getAnimeTitle, getAnimeId } from '../utils/animeDetailUtils';
import SiteMetadata from '../components/SiteMetadata';
import { useAuth } from '../context/AuthContext';

export default function AnimeDetailsPage() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const reduced = useMotionSafe();

    const [activeTab, setActiveTab] = useState('characters');
    const [activeRange, setActiveRange] = useState('1-50');

    const { anime, loading, error } = useAnimeDetail();
    const animeId = getAnimeId(anime);
    const { isLoggedIn } = useAuth();
    const commentsApi = useComments(isLoggedIn ? animeId : null);
    const metadata = <SiteMetadata anime={anime} loading={loading} error={error} />;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    if (loading) return <>{metadata}<AnimeDetailSkeleton /></>;

    if (error) {
        return (
            <>
            {metadata}
            <div
                className={`min-h-screen flex items-center justify-center px-4 text-center text-red-400 ${isDark ? "bg-[#08080e]" : "bg-white"
                    }`}
            >
                <p className="text-sm sm:text-base">{error}</p>
            </div>
            </>
        );
    }

    if (!anime) return <>{metadata}<AnimeDetailSkeleton /></>;

    const titleMain = getAnimeTitle(anime);

    const handleBack = () => {
        // Cek apakah ada riwayat navigasi internal dalam session browser
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            // Fallback aman ke beranda jika dibuka langsung lewat URL/tab baru
            navigate("/");
        }
    };

    return (
        <>
        {metadata}
        <div
            className={`font-sans antialiased relative min-h-screen transition-colors duration-300 ${isDark ? "bg-[#08080e] text-slate-100" : "bg-white text-slate-900"
                }`}
        >
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />

            {/* Noise Grain Overlay for premium cinematic feel */}
            {isDark && (
                <div 
                    className="absolute inset-0 pointer-events-none z-[1] opacity-[0.015] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
            )}

            {isDark && (
                <div 
                    className="absolute inset-0 dotted-bg pointer-events-none z-0" 
                    style={{ 
                        maskImage: "linear-gradient(to bottom, transparent 350px, black 650px)", 
                        WebkitMaskImage: "linear-gradient(to bottom, transparent 350px, black 650px)" 
                    }}
                />
            )}

            <div
                className={`absolute top-[280px] sm:top-[340px] left-[-120px] sm:left-[-150px] w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] blur-[120px] sm:blur-[180px] rounded-full pointer-events-none z-0 ${isDark ? "bg-[#ff1e56]/10 animate-pulse" : "bg-rose-400/10"
                    }`}
            />

            {/* Ambient Indigo Glow Right */}
            <div
                className={`absolute top-[480px] right-[-100px] w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] blur-[140px] sm:blur-[200px] rounded-full pointer-events-none z-0 ${isDark ? "bg-[#4f46e5]/8" : "bg-indigo-200/20"}`}
            />

            {/* Elegant Glass Navigation Capsule */}
            <div className="absolute top-3.5 sm:top-6 left-3 sm:left-6 md:left-8 z-40 flex items-center">
                <div
                    className={`flex items-center gap-1.5 p-1 sm:p-1.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-2xl ${isDark
                        ? "bg-[#08080e]/85 border-white/10 hover:border-[#ff1e56]/30 shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
                        : "bg-white/95 border-slate-200 shadow-xl"
                        }`}
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBack}
                        aria-label="Kembali"
                        className={`group flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-2.5 sm:px-4 rounded-xl font-black text-[9px] sm:text-[11px] tracking-wider uppercase transition-all duration-200 cursor-pointer ${isDark
                            ? "bg-white/[0.04] text-slate-200 hover:text-white hover:bg-[#ff1e56] hover:shadow-[0_0_15px_rgba(255,30,86,0.5)]"
                            : "bg-slate-100 text-slate-700 hover:text-white hover:bg-[#ff1e56]"
                            }`}
                    >
                        <i className="fa-solid fa-arrow-left text-[10px] sm:text-[11px] group-hover:-translate-x-1 transition-transform" />
                        <span>Kembali</span>
                    </motion.button>

                    <div className={`w-[1px] h-3.5 sm:h-4 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

                    <Link
                        to="/"
                        aria-label="Beranda"
                        className={`group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl transition-all duration-200 ${isDark
                            ? "text-slate-400 hover:text-white hover:bg-white/[0.08]"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                        title="Kembali ke Beranda"
                    >
                        <i className="fa-solid fa-house text-[11px] sm:text-xs group-hover:scale-110 transition-transform" />
                    </Link>

                    <div className="hidden md:flex items-center gap-2 pl-1 pr-2.5 select-none">
                        <span className={`text-[10px] font-bold ${isDark ? "text-slate-600" : "text-slate-300"}`}>/</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest truncate max-w-[180px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {titleMain}
                        </span>
                    </div>
                </div>
            </div>

            <HeroBanner
                bannerImage={anime?.bannerImage}
                title={titleMain}
            />

            <motion.main
                className="relative z-20 mx-auto w-full max-w-7xl px-3 sm:px-6 md:px-8 pb-16 sm:pb-20 md:pb-24 -mt-20 xs:-mt-26 sm:-mt-32 md:-mt-40 lg:-mt-48 space-y-6 sm:space-y-8"
                {...motionProps(reduced, pageVariants)}
            >
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10 items-start w-full">
                    <motion.div
                        className="w-full lg:w-[230px] xl:w-[250px] shrink-0 min-w-0"
                        {...motionProps(reduced, sectionVariants)}
                    >
                        <Sidebar anime={anime} />
                    </motion.div>

                    <motion.div
                        className="w-full lg:flex-1 min-w-0"
                        {...motionProps(reduced, sectionVariants)}
                    >
                        <MainContent
                            anime={anime}
                            activeRange={activeRange}
                            onRangeChange={setActiveRange}
                        />
                    </motion.div>
                </div>

                <motion.div
                    className="pb-2 sm:pb-0"
                    {...motionProps(reduced, sectionVariants)}
                >
                    <TabsSection
                        anime={anime}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        commentsApi={commentsApi}
                    />
                </motion.div>
            </motion.main>

            <footer
                className={`border-t py-8 sm:py-10 md:py-12 text-center text-[11px] sm:text-xs relative z-30 transition-colors duration-300 px-4 ${isDark
                    ? "bg-[#06060a] border-[#1a0a0d] text-slate-600"
                    : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}
            >
                <p className="mb-2 tracking-wide leading-relaxed">
                    &copy; 2026 AniStream. Didesain menggunakan standar streaming antarmuka modern.
                </p>
                <p className={`text-[10px] leading-relaxed ${isDark ? "text-slate-700/80" : "text-slate-400/80"}`}>
                    Setiap aset gambar & data terintegrasi didukung oleh database publik.
                </p>
            </footer>
        </div>
        </>
    );
}
