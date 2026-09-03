import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect, useCallback } from "react";
import useHeader from "./useHeader";

import HeaderLogo from "./HeaderLogo";
import HeaderDesktopNav from "./HeaderDesktopNav";
import HeaderMobileMenu from "./HeaderMobileMenu";
import HeaderProgressBar from "./HeaderProgressBar";
import HeaderActions from "./HeaderActions";
import useBreakpoint from "../../components/headerActions/hooks/useBreakPoint";

export default function Header({ activeTab, setActiveTab }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const {
        menuOpen,
        setMenuOpen,
        isScrolled,
        scrollProgress,
        scrollToTop,
    } = useHeader();

    const { isMobile, isDesktop } = useBreakpoint();
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    useEffect(() => {
        if (!isMobile) setMobileSearchOpen(false);
        if (isDesktop) setMenuOpen(false);
    }, [isMobile, isDesktop, setMenuOpen]);

    const closeMenu = useCallback(() => setMenuOpen(false), [setMenuOpen]);
    const handleMobileSearchChange = useCallback((open) => {
        setMobileSearchOpen(open);
        if (open) setMenuOpen(false);
    }, [setMenuOpen]);

    const showSolid = isScrolled || mobileSearchOpen || menuOpen;

    return (
        <header className="fixed top-0 inset-x-0 z-9999">
            <div
                className={`pointer-events-none absolute inset-0 border-b backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none ${
                    showSolid
                        ? isDark
                            ? "bg-[#0a0a10]/95 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                            : "bg-white/95 border-black/[0.08] shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
                        : isDark
                            ? "bg-[#0a0a10]/80 border-white/[0.07]"
                            : "bg-white/85 border-black/[0.06]"
                }`}
            />

            {/* A restrained highlight keeps the glass surface distinct. */}
            <div
                className={`absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none ${
                    isDark ? "via-red-400/35" : "via-red-500/20"
                }`}
            />

            <div className="relative max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
                <div className="flex h-[60px] md:h-[68px] items-center justify-between gap-3 lg:gap-5">
                    <HeaderLogo
                        isDark={isDark}
                        setActiveTab={setActiveTab}
                        scrollToTop={scrollToTop}
                        mobileSearchOpen={mobileSearchOpen}
                    />

                    <div className="hidden lg:flex flex-1 min-w-0 justify-center">
                        <HeaderDesktopNav
                            isDark={isDark}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            scrollToTop={scrollToTop}
                        />
                    </div>

                    <div className={mobileSearchOpen ? "relative z-[100] flex min-w-0 flex-1 justify-end" : "relative z-20 shrink-0"}>
                        <HeaderActions
                            isDark={isDark}
                            theme={theme}
                            toggleTheme={toggleTheme}
                            menuOpen={menuOpen}
                            setMenuOpen={setMenuOpen}
                            setActiveTab={setActiveTab}
                            scrollToTop={scrollToTop}
                            mobileSearchOpen={mobileSearchOpen}
                            setMobileSearchOpen={handleMobileSearchChange}
                        />
                    </div>
                </div>
            </div>

            {menuOpen && !isDesktop && (
                <button
                    type="button"
                    tabIndex={-1}
                    aria-label="Tutup navigasi"
                    onClick={closeMenu}
                    className="fixed inset-x-0 bottom-0 top-[60px] md:top-[68px] z-10 bg-black/30 cursor-default lg:hidden"
                />
            )}

            <HeaderMobileMenu
                menuOpen={menuOpen}
                isDark={isDark}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                scrollToTop={scrollToTop}
                onClose={closeMenu}
            />

            <HeaderProgressBar scrollProgress={scrollProgress} isDark={isDark} />
        </header>
    );
}
