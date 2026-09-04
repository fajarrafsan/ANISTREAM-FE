import { useTheme } from "../../../context/ThemeContext";

export default function ScrollPaddles({ canScrollLeft, canScrollRight, onScroll }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const buttonClass = isDark
        ? "bg-black/85 hover:bg-[#ff1e56] border-white/20 hover:border-[#ff1e56] text-white shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
        : "bg-white/95 hover:bg-[#ff1e56] hover:text-white border-slate-300 hover:border-[#ff1e56] text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)]";

    return (
        <>
            {canScrollLeft && (
                <button
                    onClick={() => onScroll(-1)}
                    className={`absolute left-2 top-[44%] z-30 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-100 backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-95 sm:flex lg:opacity-0 lg:group-hover/section:opacity-100 ${buttonClass}`}
                    aria-label="Scroll ke kiri"
                >
                    <i className="fa-solid fa-chevron-left text-[11px] sm:text-xs font-black -translate-x-0.5" />
                </button>
            )}

            {canScrollRight && (
                <button
                    onClick={() => onScroll(1)}
                    className={`absolute right-2 top-[44%] z-30 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-100 backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-95 sm:flex lg:opacity-0 lg:group-hover/section:opacity-100 ${buttonClass}`}
                    aria-label="Scroll ke kanan"
                >
                    <i className="fa-solid fa-chevron-right text-[11px] sm:text-xs font-black translate-x-0.5" />
                </button>
            )}
        </>
    );
}
