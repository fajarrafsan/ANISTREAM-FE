import { Menu, X } from "lucide-react";

export default function Hamburger({ isDark, menuOpen, setMenuOpen }) {
    const Icon = menuOpen ? X : Menu;

    return (
        <button
            type="button"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative grid size-11 shrink-0 place-items-center rounded-xl border cursor-pointer select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 lg:hidden ${
                menuOpen
                    ? isDark
                        ? "border-red-400/30 bg-red-500/10 text-red-300 focus-visible:ring-offset-zinc-950"
                        : "border-red-200 bg-red-50 text-red-600 focus-visible:ring-offset-white"
                    : isDark
                        ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white focus-visible:ring-offset-zinc-950"
                        : "border-zinc-200 bg-white/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-offset-white"
            }`}
        >
            <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
        </button>
    );
}
