import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Play } from "lucide-react";

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
            className={`group min-h-11 shrink-0 items-center gap-2.5 select-none text-left rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 ${mobileSearchOpen ? "hidden" : "inline-flex"} ${
                isDark ? "focus-visible:ring-offset-[#08080e]" : "focus-visible:ring-offset-white"
            }`}
            aria-label="AniStream — kembali ke beranda"
        >
            <span aria-hidden="true" className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-red-400/30 bg-linear-to-br from-red-500 to-red-700 text-white shadow-[0_4px_14px_rgba(220,38,38,0.2)] transition-colors group-hover:from-red-400 group-hover:to-red-600">
                <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-white/45" />
                <Play className="ml-0.5 size-[18px] fill-current" strokeWidth={1.5} />
            </span>
            <span className="flex flex-col gap-1 leading-none">
                <span className={`font-display text-[21px] sm:text-[23px] font-extrabold tracking-[-0.035em] transition-colors duration-200 ${isDark ? "text-white" : "text-zinc-950"}`}>
                    Ani<span className={isDark ? "text-red-400" : "text-red-600"}>Stream</span>
                </span>
                <span className={`text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    Anime streaming
                </span>
            </span>
        </button>
    );
}
