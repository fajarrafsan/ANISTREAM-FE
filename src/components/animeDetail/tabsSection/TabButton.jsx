import { motion } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";

export default function TabButton({ active, onClick, children }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            type="button"
            className={`relative w-full sm:w-auto shrink-0 whitespace-nowrap rounded-xl touch-manipulation transition-colors duration-200 select-none outline-none focus:outline-none overflow-hidden
                px-2 py-2 text-[9px] leading-none text-center
                xs:px-3 xs:text-[10px]
                sm:px-4 sm:py-2.5 sm:text-xs font-black uppercase tracking-wider
                ${
                    active
                        ? "text-white"
                        : isDark
                            ? "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
        >
            {active && (
                <motion.div
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] shadow-[0_0_20px_rgba(255,30,86,0.45)] border border-white/20 z-0"
                />
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}