export default function Hamburger({ isDark, menuOpen, setMenuOpen }) {
    const line = `absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDark ? "bg-white/75" : "bg-gray-700"
    }`;

    return (
        <button
            type="button"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative lg:hidden size-11 shrink-0 rounded-full border cursor-pointer select-none transition-colors duration-200 active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                isDark
                    ? "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.09] focus-visible:ring-offset-[#08080e]"
                    : "bg-black/[0.03] border-black/[0.08] hover:bg-black/[0.06] focus-visible:ring-offset-white"
            }`}
        >
            <span className={`${line} ${menuOpen ? "top-[21px] rotate-45" : "top-[15px]"}`} />
            <span className={`${line} top-[21px] ${menuOpen ? "opacity-0 scale-x-50" : "opacity-100"}`} />
            <span className={`${line} ${menuOpen ? "top-[21px] -rotate-45" : "top-[27px]"}`} />
        </button>
    );
}
