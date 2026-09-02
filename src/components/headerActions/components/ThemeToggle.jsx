import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export default function ThemeToggle({ isDark, toggleTheme }) {
    const reduced = useReducedMotion();
    const Icon = isDark ? Sun : Moon;

    return (
        <button
            onClick={toggleTheme}
            type="button"
            aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            className={`relative hidden sm:grid size-11 shrink-0 place-items-center rounded-full border cursor-pointer select-none transition-colors duration-200 active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                isDark
                    ? "bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.09] focus-visible:ring-offset-[#08080e]"
                    : "bg-black/[0.03] border-black/[0.08] text-gray-600 hover:text-gray-900 hover:bg-black/[0.06] focus-visible:ring-offset-white"
            }`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={isDark ? "sun" : "moon"}
                    className="grid place-items-center"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={reduced ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: reduced ? 0.12 : 0.22, ease: EASE }}
                >
                    <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
