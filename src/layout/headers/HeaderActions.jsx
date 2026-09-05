/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthModalActions } from "../../context/AuthModalContext";
import { useAuth } from "../../context/AuthContext";
import useToast from "../../hooks/useToast";
import useAnimeSearch from "../../hooks/useSearchAnime";
import { getImageUrl } from "../../components/headerActions/constants";
import DesktopSearch from "../../components/headerActions/components/DesktopSearch";
import MobileSearch from "../../components/headerActions/components/SearchMobile";
import ThemeToggle from "../../components/headerActions/components/ThemeToggle";
import AuthSection from "../../components/headerActions/components/AuthSection";
import Hamburger from "../../components/headerActions/components/Hamburger";

export default function HeaderActions({
    isDark,
    theme,
    toggleTheme,
    menuOpen,
    setMenuOpen,
    setActiveTab,
    scrollToTop,
    mobileSearchOpen,
    setMobileSearchOpen,
}) {
    const { openModal } = useAuthModalActions();
    const { isLoggedIn, logout, user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const [isFocused, setIsFocused] = useState(false);

    const {
        query: searchQuery,
        setQuery: setSearchQuery,
        results: searchResults,
        isOpen: isSearchOpen,
        phase: searchPhase,
        loading: searchLoading,
        openSearch,
        searchAnime: triggerSearch,
        closeSearch,
        resetSearch,
    } = useAnimeSearch();

    const isOnProfile = location.pathname === "/profile";
    const userAvatar = user?.profil?.avatar || user?.profile?.avatar || user?.avatar || null;

    const handleCloseSearch = useCallback(() => {
        closeSearch();
        setIsFocused(false);
    }, [closeSearch]);

    const handleCloseMobileSearch = useCallback(() => {
        setMobileSearchOpen(false);
        setIsFocused(false);
        resetSearch();
    }, [setMobileSearchOpen, resetSearch]);

    const handleLocalSubmit = useCallback(() => {
        const q = searchQuery.trim();
        if (!q || searchLoading) return;

        if (!isLoggedIn) {
            toast.warning("Silakan masuk terlebih dahulu untuk mencari anime.", 3000);
            openModal({ mode: "login" });
            return;
        }

        // Enter membuka halaman hasil; modal hanya untuk pratinjau saat mengetik.
        // Lewat URL agar hasil bisa di-bookmark, dibagikan, dan tombol kembali
        // browser berperilaku seperti yang diharapkan.
        handleCloseSearch();
        setMobileSearchOpen(false);
        navigate(`/search?q=${encodeURIComponent(q)}`);
    }, [searchQuery, searchLoading, isLoggedIn, toast, openModal, navigate, handleCloseSearch, setMobileSearchOpen]);

    const handleLocalKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleLocalSubmit();
        }
        if (e.key === "Escape") {
            e.preventDefault();
            if (mobileSearchOpen) {
                handleCloseMobileSearch();
            } else {
                handleCloseSearch();
            }
        }
    }, [handleLocalSubmit, mobileSearchOpen, handleCloseMobileSearch, handleCloseSearch]);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Berhasil logout! Sampai jumpa lagi!", 3000);
        } catch {
            toast.error("Gagal logout. Silakan coba lagi.", 3000);
        }
    };

    return (
        <div className={`flex items-center gap-2 ${
            mobileSearchOpen ? "min-w-0 flex-1 justify-end max-w-full" : "shrink-0"
        }`}>
            <DesktopSearch
                isDark={isDark}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isFocused={isFocused}
                setIsFocused={setIsFocused}
                searchLoading={searchLoading}
                onKeyDown={handleLocalKeyDown}
                isSearchOpen={isSearchOpen && !mobileSearchOpen}
                searchResults={searchResults}
                searchPhase={searchPhase}
                openSearch={openSearch}
                onClose={handleCloseSearch}
                onSubmit={handleLocalSubmit}
            />

            <MobileSearch
                isDark={isDark}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchLoading={searchLoading}
                onSubmit={handleLocalSubmit}
                onKeyDown={handleLocalKeyDown}
                onCloseMobileSearch={handleCloseMobileSearch}
                isSearchOpen={isSearchOpen}
                searchResults={searchResults}
                searchPhase={searchPhase}
                openSearch={openSearch}
                mobileSearchOpen={mobileSearchOpen}
                setMobileSearchOpen={setMobileSearchOpen}
            />

            {!mobileSearchOpen && (
                <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            )}

            {!mobileSearchOpen && (
                <AuthSection
                    isDark={isDark}
                    isLoggedIn={isLoggedIn}
                    user={user}
                    userAvatar={userAvatar}
                    isOnProfile={isOnProfile}
                    openModal={openModal}
                    navigate={navigate}
                    getImageUrl={getImageUrl}
                    onLogout={handleLogout}
                />
            )}

            {!mobileSearchOpen && (
                <Hamburger isDark={isDark} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            )}
        </div>
    );
}
