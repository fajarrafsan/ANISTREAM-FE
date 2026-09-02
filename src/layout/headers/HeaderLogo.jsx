import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function HeaderLogo({ setActiveTab, scrollToTop, mobileSearchOpen = false }) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const handleLogoClick = () => {
        if (setActiveTab) setActiveTab("beranda");
        navigate("/");
        if (scrollToTop) scrollToTop();
        else window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            type="button"
            onClick={handleLogoClick}
            className="cursor-pointer group shrink-0 select-none text-left bg-transparent border-none p-0"
            aria-label="AniStream Beranda"
        >
            <div
                className={`flex flex-col leading-none overflow-hidden origin-left transition-all duration-300 ${
                    mobileSearchOpen ? "w-0 opacity-0 scale-95" : "w-auto opacity-100 scale-100"
                }`}
            >
                <span className={`font-display text-xl sm:text-2xl tracking-[0.06em] uppercase transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Ani<span className="text-red-500 group-hover:text-red-400 transition-colors">Stream</span>
                </span>
                <span className={`hidden min-[360px]:block text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.28em] mt-1 transition-colors duration-300 ${isDark ? "text-white/35" : "text-gray-500"}`}>
                    Premium Anime
                </span>
            </div>
        </button>
    );
}
