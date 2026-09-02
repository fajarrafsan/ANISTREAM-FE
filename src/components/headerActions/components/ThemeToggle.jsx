export default function ThemeToggle({ isDark, toggleTheme }) {
    return (
        <button
            onClick={toggleTheme}
            type="button"
            aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            className={`hidden sm:flex items-center px-3 py-1.5 rounded-full border text-[11px] font-semibold tracking-wide transition-colors duration-300 cursor-pointer select-none outline-none ${
                isDark
                    ? "bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                    : "bg-black/[0.03] border-black/[0.08] text-gray-600 hover:text-gray-900 hover:bg-black/[0.05]"
            }`}
        >
            {isDark ? "Terang" : "Gelap"}
        </button>
    );
}
