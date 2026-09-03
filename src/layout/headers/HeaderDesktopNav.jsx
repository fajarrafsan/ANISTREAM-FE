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
            setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
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
            className={`relative hidden lg:flex shrink-0 items-center gap-0.5 rounded-2xl border p-1 select-none ${
                isDark ? "border-white/[0.06] bg-black/20" : "border-black/[0.05] bg-zinc-100/70"
            }`}
        >
            {indicator && (
                <motion.span
                    aria-hidden="true"
                    className={`absolute inset-y-1 rounded-xl border pointer-events-none ${
                        isDark
                            ? "border-white/10 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                            : "border-black/[0.05] bg-white shadow-sm"
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
                        type="button"
                        key={link.id}
                        ref={(el) => {
                            if (el) itemRefs.current.set(link.id, el);
                            else itemRefs.current.delete(link.id);
                        }}
                        onClick={() => handleNavClick(link.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group relative inline-flex items-center justify-center gap-2 min-h-11 px-3 xl:px-4 text-xs font-semibold rounded-xl cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
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
                        <span aria-hidden="true" className={`size-1.5 rounded-full transition-colors ${
                            isActive ? "bg-red-500" : isDark ? "bg-white/20 group-hover:bg-white/50" : "bg-zinc-300 group-hover:bg-zinc-500"
                        }`} />
                        {link.name}
                    </button>
                );
            })}
        </nav>
    );
}
