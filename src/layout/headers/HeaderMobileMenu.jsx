import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";
import { NAV_LINKS } from "./HeaderConstants";
import { useAuthModal } from "../../context/AuthModalContext";
import { useAuth } from "../../context/AuthContext";

export default function HeaderMobileMenu({
    menuOpen,
    isDark,
    activeTab,
    setActiveTab,
    scrollToTop,
}) {
    const { openModal } = useAuthModal();
    const { user, isLoggedIn, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const displayName = user?.username || user?.name || user?.email || "Pengguna";
    const displayEmail = user?.email || "";
    const displayAvatar = user?.profil?.avatar || user?.avatar || user?.profile?.avatar || null;

    useEffect(() => {
        const currentPath = location.pathname.split("/")[1] || "beranda";
        setActiveTab(currentPath);
    }, [location.pathname, setActiveTab]);

    const handleNavClick = (linkId) => {
        if (linkId !== "beranda" && !isLoggedIn) {
            openModal({
                mode: "login",
            });
            return;
        }

        setActiveTab(linkId);
        scrollToTop();

        if (linkId === "beranda") {
            navigate("/");
        } else {
            navigate(`/${linkId}`);
        }
    };

    // Fungsi untuk navigasi ke halaman profil
    const handleProfileClick = () => {
        navigate("/profile");
        setActiveTab("profile");
        scrollToTop();
    };

    return (
        <div
            id="header-mobile-menu"
            className={`lg:hidden absolute inset-x-0 top-full z-50 transition-all duration-500 ease-in-out ${menuOpen
                ? "translate-y-0 opacity-100 visible"
                : "-translate-y-4 opacity-0 invisible pointer-events-none"
                }`}
        >
            <div
                className={`
                    mx-2 mt-1 p-2.5 sm:p-5
                    rounded-2xl border shadow-2xl backdrop-blur-2xl
                    max-h-[calc(100vh-4.5rem)] overflow-y-auto
                    ${isDark
                        ? "bg-[#0a0a0c]/95 border-white/10"
                        : "bg-white/95 border-gray-200"
                    }
                `}
            >
                <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavClick(link.id)}
                                className={`
                                    flex items-center justify-between
                                    px-3 sm:px-4
                                    py-1.5 sm:py-3
                                    rounded-xl transition-all
                                    min-h-[34px] sm:min-h-[44px]
                                    ${activeTab === link.id
                                        ? "bg-red-600 text-white"
                                        : isDark
                                            ? "hover:bg-white/5 text-gray-300"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }
                                `}
                            >
                                <span className="font-semibold text-xs sm:text-sm">
                                    {link.name}
                                </span>
                                {activeTab === link.id && (
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full shadow-[0_0_6px_white]" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-0.5 pt-2 border-t border-dashed border-gray-500/15 dark:border-white/5">
                        {isLoggedIn ? (
                            <div
                                className={`flex flex-col gap-2.5 p-2 rounded-xl border ${isDark
                                    ? "bg-white/[0.02] border-white/5"
                                    : "bg-slate-50 border-gray-100 shadow-sm"
                                    }`}
                            >
                                {/* Bagian Informasi Profil (Bisa Diklik) */}
                                <div
                                    onClick={handleProfileClick}
                                    className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all duration-300
                                        ${isDark
                                            ? "hover:bg-white/5 active:bg-white/10"
                                            : "hover:bg-slate-100 active:bg-slate-200"
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="absolute -inset-0.5 rounded-full bg-linear-to-tr from-[#ff1e56] to-[#c41e3a] opacity-50 blur-sm animate-pulse" />
                                        <div
                                            className={`relative w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden border flex items-center justify-center ${isDark
                                                ? "bg-[#13080c] border-[#2a1117]"
                                                : "bg-white border-slate-200"
                                                }`}
                                        >
                                            {displayAvatar ? (
                                                <img
                                                    src={displayAvatar}
                                                    alt={displayName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <User className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className={`font-black text-[11px] sm:text-xs truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                            {displayName}
                                        </p>
                                        {displayEmail && (
                                            <p className={`text-[9px] sm:text-[10px] truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                {displayEmail}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => logout()}
                                    className="
                                        flex items-center justify-center gap-1.5
                                        w-full
                                        bg-red-500/10 border border-red-500/20 hover:border-red-500 hover:bg-red-500
                                        text-red-500 hover:text-white
                                        py-1.5 sm:py-2.5
                                        rounded-xl font-bold
                                        text-[10px] sm:text-sm
                                        min-h-[32px] sm:min-h-[44px]
                                        transition-all duration-300 active:scale-95 cursor-pointer
                                    "
                                >
                                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Keluar Akun</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => openModal()}
                                className="
                                    flex items-center justify-center gap-2
                                    w-full
                                    bg-slate-900 dark:bg-white
                                    text-white dark:text-black
                                    py-2 sm:py-3
                                    rounded-xl font-bold
                                    text-xs sm:text-sm
                                    min-h-[36px] sm:min-h-[44px]
                                    shadow-xl
                                    transition-all active:scale-95 cursor-pointer
                                "
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Masuk ke Akun</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}