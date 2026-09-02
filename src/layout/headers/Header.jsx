import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect, useRef } from "react";
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

    const { isDesktop } = useBreakpoint();
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (isDesktop) setMobileSearchOpen(false);
    }, [isDesktop]);

    const showSolid = isScrolled || mobileSearchOpen;

    return (
        <header className="fixed top-0 left-0 right-0 z-9999">
            <div
                className={`absolute inset-0 border-b backdrop-blur-lg transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
                    showSolid
                        ? isDark
                            ? "bg-[#08080e]/90 border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
                            : "bg-white/92 border-black/[0.07] shadow-[0_4px_20px_rgba(0,0,0,0.07)]"
                        : isDark
                            ? "bg-[#08080e]/40 border-white/[0.04]"
                            : "bg-white/50 border-black/[0.04]"
                }`}
            />

            {/* Top highlight */}
            <div
                className={`absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none ${
                    isDark ? "via-white/10" : "via-black/[0.06]"
                }`}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div
                    className={`flex items-center justify-between transition-[height] duration-300 ease-out ${
                        isScrolled ? "h-[56px] md:h-[62px]" : "h-[60px] md:h-[72px]"
                    }`}
                >
                    <HeaderLogo
                        isDark={isDark}
                        setActiveTab={setActiveTab}
                        scrollToTop={scrollToTop}
                        mobileSearchOpen={mobileSearchOpen}
                    />

                    <HeaderDesktopNav
                        isDark={isDark}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        scrollToTop={scrollToTop}
                    />

                    <div className={mobileSearchOpen ? "flex-1 flex justify-end z-[100]" : "z-20"}>
                        <HeaderActions
                            isDark={isDark}
                            theme={theme}
                            toggleTheme={toggleTheme}
                            menuOpen={menuOpen}
                            setMenuOpen={setMenuOpen}
                            setActiveTab={setActiveTab}
                            scrollToTop={scrollToTop}
                            mobileSearchOpen={mobileSearchOpen}
                            setMobileSearchOpen={setMobileSearchOpen}
                        />
                    </div>
                </div>
            </div>

            <HeaderMobileMenu
                menuOpen={menuOpen}
                isDark={isDark}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                scrollToTop={scrollToTop}
            />

            <HeaderProgressBar scrollProgress={scrollProgress} isDark={isDark} />
        </header>
    );
}
