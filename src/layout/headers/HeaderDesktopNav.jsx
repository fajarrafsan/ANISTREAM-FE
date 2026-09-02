import { useLayoutEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import useToast from "../../hooks/useToast";
import { NAV_LINKS } from "./HeaderConstants";

export default function HeaderDesktopNav({
    isDark,
    activeTab,
    setActiveTab,
    scrollToTop,
}) {
    const { isLoggedIn } = useAuth();
    const { openModal } = useAuthModal();
    const toast = useToast();
    const navigate = useNavigate();
    const reduced = useReducedMotion();

    const navRef = useRef(null);
    const itemRefs = useRef(new Map());
    const [indicator, setIndicator] = useState(null);

    // ResizeObserver menangkap resize viewport sekaligus reflow saat webfont
    // selesai dimuat — keduanya menggeser posisi tab.
    useLayoutEffect(() => {
        const measure = () => {
            const el = itemRefs.current.get(activeTab);
            if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
        };
        measure();

        const nav = navRef.current;
        if (!nav) return;
        const observer = new ResizeObserver(measure);
        observer.observe(nav);
        return () => observer.disconnect();
    }, [activeTab]);

    const handleNavClick = useCallback((linkId) => {
        if (activeTab === linkId) return;
        if (linkId !== "beranda" && !isLoggedIn) {
            toast.warning("Silakan masuk terlebih dahulu.", 3000);
            openModal({ mode: "login" });
            return;
        }
        setActiveTab(linkId);
        scrollToTop();
        navigate(linkId === "beranda" ? "/" : `/${linkId}`);
    }, [activeTab, isLoggedIn, navigate, scrollToTop, openModal, toast, setActiveTab]);

    return (
        <nav
            ref={navRef}
            aria-label="Navigasi utama"
            className="hidden lg:flex items-center gap-1 relative select-none"
        >
            {indicator && (
                <motion.span
                    aria-hidden="true"
                    className={`absolute inset-y-0 rounded-full pointer-events-none ${
                        isDark ? "bg-white/[0.07]" : "bg-black/[0.05]"
                    }`}
                    initial={false}
                    animate={{ left: indicator.left, width: indicator.width }}
                    transition={reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 38, mass: 0.8 }}
                />
            )}

            {NAV_LINKS.map((link) => {
                const isActive = activeTab === link.id;
                return (
                    <button
                        key={link.id}
                        ref={(el) => {
                            if (el) itemRefs.current.set(link.id, el);
                            else itemRefs.current.delete(link.id);
                        }}
                        onClick={() => handleNavClick(link.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`relative inline-flex items-center min-h-11 px-4 text-[13px] font-semibold tracking-wide rounded-full cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                            isDark
                                ? "focus-visible:ring-offset-[#08080e]"
                                : "focus-visible:ring-offset-white"
                        } ${
                            isActive
                                ? isDark ? "text-white" : "text-gray-900"
                                : isDark
                                    ? "text-white/60 hover:text-white"
                                    : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        {link.name}
                    </button>
                );
            })}

            {indicator && (
                <motion.span
                    aria-hidden="true"
                    className="absolute -bottom-1 h-[2px] rounded-full bg-red-500 pointer-events-none"
                    initial={false}
                    animate={{
                        left: indicator.left + indicator.width * 0.28,
                        width: indicator.width * 0.44,
                    }}
                    transition={reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 38, mass: 0.8 }}
                    style={{ boxShadow: "0 0 10px rgba(239,68,68,0.55)" }}
                />
            )}
        </nav>
    );
}
