export default function Hamburger({ isDark, menuOpen, setMenuOpen }) {
    return (
        <button
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            type="button"
            className={`lg:hidden px-3 py-1.5 rounded-full border text-[11px] font-semibold tracking-wide transition-all cursor-pointer select-none outline-none ${
                isDark
                    ? "bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
                    : "bg-black/[0.03] border-black/[0.08] text-gray-700 hover:bg-black/[0.05]"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
        >
            {menuOpen ? "Tutup" : "Menu"}
        </button>
    );
}
