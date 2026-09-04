import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, ChevronRight, House, Layers3, LayoutGrid, LogIn, LogOut, Moon, User } from "lucide-react";
import { NAV_LINKS } from "./HeaderConstants";
import { useAuthModal } from "../../context/AuthModalContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const NAV_DETAILS = {
    beranda: { icon: House, description: "Pilihan anime untukmu" },
    catalog: { icon: LayoutGrid, description: "Temukan cerita favoritmu" },
    schedule: { icon: CalendarDays, description: "Ikuti episode terbaru" },
    batch: { icon: Layers3, description: "Koleksi episode lengkap" },
};

export default function HeaderMobileMenu({
    menuOpen,
    isDark,
    activeTab,
    setActiveTab,
    scrollToTop,
    onClose,
}) {
    const { openModal } = useAuthModal();
    const { user, isLoggedIn, logout } = useAuth();
    const { toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const displayName = user?.username || user?.name || user?.email || "Pengguna";
    const displayEmail = user?.email || "Lihat profil kamu";
    const displayAvatar = user?.profil?.avatar || user?.avatar || user?.profile?.avatar || null;
    const focusStyles = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500";

    useEffect(() => {
        const currentPath = location.pathname.split("/")[1] || "beranda";
        setActiveTab(currentPath);
    }, [location.pathname, setActiveTab]);

    useEffect(() => {
        if (!menuOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
                document.querySelector('[aria-controls="header-mobile-menu"]')?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [menuOpen, onClose]);

    const handleLogin = () => {
        onClose?.();
        openModal({ mode: "login" });
    };

    const handleNavClick = (linkId) => {
        if (linkId !== "beranda" && !isLoggedIn) {
            handleLogin();
            return;
        }

        setActiveTab(linkId);
        onClose?.();
        scrollToTop();
        navigate(linkId === "beranda" ? "/" : `/${linkId}`);
    };

    const handleProfileClick = () => {
        navigate("/profile");
        setActiveTab("profile");
        onClose?.();
        scrollToTop();
    };

    return (
        <div
            id="header-mobile-menu"
            aria-hidden={!menuOpen}
            inert={!menuOpen}
            className={`absolute inset-x-0 top-full z-50 lg:hidden transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none ${menuOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0 pointer-events-none"
                }`}
        >
            <div
                className={`mx-3 mt-2 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain rounded-2xl border p-3 sm:mx-6 sm:p-4 md:max-h-[calc(100dvh-5.5rem)] backdrop-blur-2xl shadow-[0_24px_64px_-20px_rgba(0,0,0,0.55)] ${isDark
                    ? "border-white/10 bg-[#111116]/98"
                    : "border-slate-200 bg-white/98"
                    }`}
            >
                <p className={`px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Jelajahi Rafsanime
                </p>

                <nav aria-label="Navigasi utama seluler" className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => {
                        const { icon: Icon, description } = NAV_DETAILS[link.id];
                        const isActive = activeTab === link.id;

                        return (
                            <button
                                key={link.id}
                                type="button"
                                aria-current={isActive ? "page" : undefined}
                                onClick={() => handleNavClick(link.id)}
                                className={`relative flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 motion-reduce:transition-none ${focusStyles} ${isActive
                                    ? isDark
                                        ? "bg-red-500/10 text-white"
                                        : "bg-red-50 text-slate-950"
                                    : isDark
                                        ? "text-slate-300 hover:bg-white/5 active:bg-white/10"
                                        : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                                    }`}
                            >
                                <Icon
                                    aria-hidden="true"
                                    className={`h-5 w-5 shrink-0 ${isActive ? (isDark ? "text-red-400" : "text-red-600") : "opacity-80"}`}
                                    strokeWidth={1.8}
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-semibold leading-5">{link.name}</span>
                                    <span className={`block text-xs leading-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        {description}
                                    </span>
                                </span>
                                <ChevronRight aria-hidden="true" className={`h-4 w-4 shrink-0 ${isActive ? (isDark ? "text-red-400" : "text-red-600") : "opacity-40"}`} />
                            </button>
                        );
                    })}
                </nav>

                <div className={`mt-3 border-t pt-2 sm:hidden ${isDark ? "border-white/[0.08]" : "border-slate-200"}`}>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isDark}
                        aria-label="Mode gelap"
                        onClick={toggleTheme}
                        className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-200 motion-reduce:transition-none ${focusStyles} ${isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-100"}`}
                    >
                        <Moon aria-hidden="true" className="h-5 w-5 shrink-0 opacity-80" strokeWidth={1.8} />
                        <span className="flex-1 text-left font-medium">Mode gelap</span>
                        <span aria-hidden="true" className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 motion-reduce:transition-none ${isDark ? "bg-red-600" : "bg-slate-300"}`}>
                            <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 motion-reduce:transition-none ${isDark ? "translate-x-4" : "translate-x-0"}`} />
                        </span>
                    </button>
                </div>

                <div className={`mt-2 border-t pt-3 ${isDark ? "border-white/[0.08]" : "border-slate-200"}`}>
                    {isLoggedIn ? (
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleProfileClick}
                                className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-200 motion-reduce:transition-none ${focusStyles} ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
                            >
                                <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border ${isDark ? "border-white/10 bg-white/5 text-slate-400" : "border-slate-200 bg-slate-100 text-slate-500"}`}>
                                    <User aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                                    {displayAvatar && (
                                        <img
                                            src={displayAvatar}
                                            alt=""
                                            className="absolute inset-0 h-full w-full object-cover"
                                            onError={(event) => { event.currentTarget.style.display = "none"; }}
                                        />
                                    )}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className={`block truncate text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{displayName}</span>
                                    <span className={`block truncate text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{displayEmail}</span>
                                </span>
                                <ChevronRight aria-hidden="true" className={`h-4 w-4 shrink-0 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                            </button>
                            <button
                                type="button"
                                onClick={() => { onClose?.(); logout(); }}
                                className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-200 motion-reduce:transition-none ${focusStyles} ${isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
                            >
                                <LogOut aria-hidden="true" className="h-4 w-4" />
                                Keluar akun
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleLogin}
                            className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-500 active:bg-red-700 motion-reduce:transition-none ${focusStyles}`}
                        >
                            <LogIn aria-hidden="true" className="h-4 w-4" />
                            Masuk ke akun
                            <ChevronRight aria-hidden="true" className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
