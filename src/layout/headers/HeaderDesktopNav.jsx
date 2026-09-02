import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
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

    const navRef = useRef(null);
    const [indicator, setIndicator] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const update = () => {
            const el = document.getElementById(`nav-${activeTab}`);
            if (el && navRef.current) {
                setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
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
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 relative select-none">
            {NAV_LINKS.map((link) => {
                const isActive = activeTab === link.id;
                return (
                    <button
                        id={`nav-${link.id}`}
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={`relative px-4 py-2 text-[13px] font-semibold tracking-wide rounded-md cursor-pointer transition-colors duration-200 ${
                            isActive
                                ? isDark ? "text-white" : "text-gray-900"
                                : isDark
                                    ? "text-white/45 hover:text-white/75"
                                    : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        {link.name}
                    </button>
                );
            })}

            <motion.div
                className="absolute -bottom-0.5 h-[2px] rounded-full bg-red-500 pointer-events-none"
                initial={false}
                animate={{ left: indicator.left, width: indicator.width }}
                transition={{ type: "spring", stiffness: 400, damping: 36 }}
                style={{ boxShadow: "0 0 10px rgba(239,68,68,0.5)" }}
            />
        </nav>
    );
}
