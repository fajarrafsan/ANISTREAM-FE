import { motion } from "motion/react";
import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { toastTypes, toastEnterVariants, toastEnterVariantsDesktop } from "./toastTheme";

export default function Toast({ toast, onRemove, isDesktop = false }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const config = toastTypes[toast.type] ?? toastTypes.info;
    const Icon = config.Icon;
    const variants = isDesktop ? toastEnterVariantsDesktop : toastEnterVariants;

    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), toast.duration);
        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    return (
        <motion.div
            layout
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
            aria-live="polite"
            className={`group relative flex max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] items-start gap-3 max-sm:gap-y-2.5 p-3.5 sm:p-4 rounded-2xl border overflow-hidden backdrop-blur-xl w-full sm:min-w-[320px] sm:max-w-[400px] ${
                isDark ? "bg-[#0a0810]/92" : "bg-white/95"
            }`}
            style={{
                borderColor: config.border,
                boxShadow: isDark
                    ? `0 16px 40px -12px rgba(0,0,0,0.75), 0 0 28px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`
                    : `0 12px 32px -10px rgba(0,0,0,0.12), 0 0 20px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.9)`,
            }}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    background: `linear-gradient(135deg, ${config.accentSoft} 0%, transparent 55%)`,
                }}
            />

            <div
                className="absolute top-0 left-4 right-4 h-px"
                style={{
                    background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)`,
                }}
            />

            <div
                className="relative z-10 shrink-0 max-sm:justify-self-start mt-0.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border backdrop-blur-sm"
                style={{
                    color: config.accent,
                    backgroundColor: config.accentSoft,
                    borderColor: config.border,
                    boxShadow: `0 0 14px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
            >
                <Icon
                    className="w-4 h-4 shrink-0"
                    strokeWidth={2.25}
                    aria-hidden="true"
                    style={{ filter: `drop-shadow(0 0 5px ${config.glow})` }}
                />
                <span className="font-bold uppercase tracking-[0.12em] text-[9px] sm:text-[10px]">
                    {config.label}
                </span>
            </div>

            <div className="relative z-10 flex-1 min-w-0 max-sm:col-span-2 max-sm:row-start-2 max-sm:wrap-break-word pt-0.5 pr-1">
                <p
                    className={`text-[13px] sm:text-sm font-semibold leading-snug tracking-tight ${
                        isDark ? "text-white/95" : "text-gray-900"
                    }`}
                >
                    {toast.message}
                </p>
                {(toast.subMessage || config.sub) && (
                    <p
                        className={`text-[11px] sm:text-xs mt-1 leading-relaxed line-clamp-2 ${
                            isDark ? "text-white/45" : "text-gray-500"
                        }`}
                    >
                        {toast.subMessage || config.sub}
                    </p>
                )}
            </div>

            <motion.button
                type="button"
                onClick={() => onRemove(toast.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Tutup notifikasi"
                className={`relative z-10 shrink-0 max-sm:col-start-2 max-sm:row-start-1 max-sm:justify-self-end px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    isDark
                        ? "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
                        : "text-gray-400 hover:text-gray-700 hover:bg-black/[0.04]"
                }`}
            >
                Tutup
            </motion.button>

            <div
                className={`absolute bottom-0 left-0 right-0 h-[2px] ${isDark ? "bg-white/[0.06]" : "bg-black/[0.05]"}`}
            >
                <div
                    className="h-full w-full origin-left"
                    style={{
                        background: `linear-gradient(90deg, ${config.accent}, ${config.accent}99)`,
                        boxShadow: `0 0 8px ${config.glow}`,
                        animation: `toast-progress ${toast.duration}ms linear forwards`,
                    }}
                />
            </div>
        </motion.div>
    );
}
