import HeroCarousel from "../../components/Home/hero/HeroCarousel";
import AnimeSection from "../../components/Home/anime/AnimeSection";
import HomePremiumBanner from "./HomePremiumBanner";
import HomeAmbientBg from "./HomeAmbientBg";
import HomeQuickNav from "./HomeQuickNav";
import HomeSectionDivider from "./HomeSectionDivider";
import useAnimeHome from "../../hooks/useAnimeHome";
import HeroCarouselSkeleton from "../../skeletons/heroCarouselSkeleton/HeroCarouselSkeleton";

import AnimeSectionSkeleton from "../../components/Home/anime/AnimeSectionSkeleton";
import useAnimeCompleteHome from "../../hooks/useAnimeCompleteHome";
import { useEffect, useRef } from "react";
import useToast from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import useHeroAnimeHome from "../../hooks/useHeroAnimeHome";

export default function HomePage() {
    const toast = useToast();
    const navigate = useNavigate();

    const toastRef = useRef(toast);
    const errorShown = useRef({ hero: false, ongoing: false, complete: false });
    const toastShown = useRef({ hero: false, ongoing: false, complete: false });
    const timers = useRef({ hero: null, ongoing: null, complete: null });

    useEffect(() => {
        toastRef.current = toast;
    }, [toast]);

    const { ongoingAnime, loading, error } = useAnimeHome();
    const { completeAnime, loading: loading2, error: error2 } = useAnimeCompleteHome();
    const { heroAnime, loading: loading3, error: error3 } = useHeroAnimeHome();

    const isDataNotAvailable = !heroAnime || (Array.isArray(heroAnime) && heroAnime.length === 0);
    const shouldShowSkeleton = loading3 || isDataNotAvailable;

    useEffect(() => {
        if (heroAnime?.length > 0 && !toastShown.current.hero && !timers.current.hero) {
            timers.current.hero = setTimeout(() => {
                toastRef.current.success(`Berhasil memuat ${heroAnime.length} anime unggulan!`);
                toastShown.current.hero = true;
                timers.current.hero = null;
            }, 400);
        }

        return () => {
            if (timers.current.hero) {
                clearTimeout(timers.current.hero);
                timers.current.hero = null;
            }
        };
    }, [heroAnime, toast]);

    useEffect(() => {
        if (ongoingAnime?.length > 0 && !toastShown.current.ongoing && !timers.current.ongoing) {
            timers.current.ongoing = setTimeout(() => {
                toastRef.current.success(`${ongoingAnime.length} anime ongoing siap ditonton`);
                toastShown.current.ongoing = true;
                timers.current.ongoing = null;
            }, 600);
        }

        return () => {
            if (timers.current.ongoing) {
                clearTimeout(timers.current.ongoing);
                timers.current.ongoing = null;
            }
        };
    }, [ongoingAnime, toast]);

    useEffect(() => {
        if (completeAnime?.length > 0 && !toastShown.current.complete && !timers.current.complete) {
            timers.current.complete = setTimeout(() => {
                toastRef.current.success(`${completeAnime.length} anime complete tersedia`);
                toastShown.current.complete = true;
                timers.current.complete = null;
            }, 800);
        }

        return () => {
            if (timers.current.complete) {
                clearTimeout(timers.current.complete);
                timers.current.complete = null;
            }
        };
    }, [completeAnime, toast]);

    useEffect(() => {
        const showError = (type, message) => {
            if (!errorShown.current[type]) {
                toastRef.current.error(message);
                errorShown.current[type] = true;
            }
        };

        if (loading3) errorShown.current.hero = false;
        if (loading) errorShown.current.ongoing = false;
        if (loading2) errorShown.current.complete = false;

        if (error3) showError('hero', "Gagal memuat data hero");
        if (error) showError('ongoing', "Gagal memuat anime ongoing");
        if (error2) showError('complete', "Gagal memuat anime complete");
    }, [error, error2, error3, loading, loading2, loading3]);

    return (
        <div className="relative">
            <HomeAmbientBg />

            {/* Hero */}
            <div className="relative z-10">
                {shouldShowSkeleton ? <HeroCarouselSkeleton /> : <HeroCarousel animeList={heroAnime} />}
            </div>

            <HomeQuickNav />

            {/* Ongoing */}
            {loading ? (
                <div className="relative z-20">
                    <AnimeSectionSkeleton title="LAGI TAYANG" />
                </div>
            ) : (
                <div className="relative z-20 transition-colors duration-300">
                    <AnimeSection
                        title="SEDANG TAYANG"
                        subtitle="Episode terbaru setiap minggu"
                        accent="bg-red-600"
                        animeList={ongoingAnime}
                        viewAllLabel="Lihat Semua Ongoing"

                        // 1. Matikan default href '#' menggunakan e.preventDefault()
                        onViewAll={(e) => {
                            if (e) e.preventDefault();
                            navigate('/catalog?tab=ongoing');
                        }}
                        onViewAllClick={(e) => {
                            if (e) e.preventDefault();
                            navigate('/catalog?tab=ongoing');
                        }}

                        // 2. Kirimkan link format HashRouter jika komponen memakai href tag <a> langsung
                        link="#/catalog?tab=ongoing"
                        viewAllLink="#/catalog?tab=ongoing"

                        // 3. Kirimkan link format BrowserRouter jika komponen memakai komponen <Link to={...}>
                        to="/catalog?tab=ongoing"
                    />
                </div>
            )}

            <HomeSectionDivider accent="red" />
            <HomePremiumBanner />
            <HomeSectionDivider accent="emerald" />

            {/* Complete */}
            {loading2 ? (
                <div className="relative z-20">
                    <AnimeSectionSkeleton title="SUDAH TAMAT" />
                </div>
            ) : (
                <div className="relative z-20 transition-colors duration-300">
                    <AnimeSection
                        title="SUDAH TAMAT"
                        subtitle="Koleksi anime yang sudah selesai"
                        accent="bg-emerald-500"
                        animeList={completeAnime}
                        viewAllLabel="Lihat Semua Complete"

                        // 1. Matikan default href '#' menggunakan e.preventDefault()
                        onViewAll={(e) => {
                            if (e) e.preventDefault();
                            navigate('/catalog?tab=complete');
                        }}
                        onViewAllClick={(e) => {
                            if (e) e.preventDefault();
                            navigate('/catalog?tab=complete');
                        }}

                        // 2. Kirimkan link format HashRouter jika komponen memakai href tag <a> langsung
                        link="#/catalog?tab=complete"
                        viewAllLink="#/catalog?tab=complete"

                        // 3. Kirimkan link format BrowserRouter jika komponen memakai komponen <Link to={...}>
                        to="/catalog?tab=complete"
                    />
                </div>
            )}
        </div>
    );
}