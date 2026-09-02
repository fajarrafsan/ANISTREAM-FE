import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";

// Avatar bulat dengan lencana border glowing
export function CommentAvatar({ src, name, size = "md" }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const dimension = size === "sm" ? "w-7 h-7 text-[11px]" : "w-10 h-10 text-sm";
    const initial = (name?.trim()?.[0] || "?").toUpperCase();

    return (
        <div
            className={`${dimension} shrink-0 rounded-2xl overflow-hidden flex items-center justify-center font-black uppercase select-none border transition-transform duration-300 hover:scale-105 shadow-md ${isDark
                ? "bg-[#1a0a0f] border-white/10 text-[#ff1e56]"
                : "bg-rose-50 border-rose-200 text-rose-600"
                }`}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
                <span>{initial}</span>
            )}
        </div>
    );
}

export default function CommentForm({
    onSubmit,
    avatarSrc,
    displayName,
    placeholder = "Tulis komentar...",
    submitLabel = "Kirim",
    posting = false,
    compact = false,
    autoFocus = false,
    initialValue = "",
    onCancel,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [value, setValue] = useState(initialValue);
    const textareaRef = useRef(null);

    // Auto-resize textarea mengikuti isi
    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    };

    useEffect(() => {
        autoResize();
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
            const len = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(len, len);
        }
    }, [autoFocus]);

    const canSubmit = value.trim().length > 0 && !posting;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        const result = await onSubmit(value.trim());
        if (result !== null && result !== false) {
            setValue("");
            if (textareaRef.current) textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={compact ? "w-full" : "flex gap-3 sm:gap-4 w-full items-start"}>
            {!compact && (
                <div className="pt-0.5">
                    <CommentAvatar src={avatarSrc} name={displayName} />
                </div>
            )}

            <div className="min-w-0 flex-1">
                {/* Luxury Card Textarea Container */}
                <div
                    className={`rounded-2xl border transition-all duration-300 p-3 sm:p-3.5 focus-within:shadow-[0_0_25px_rgba(255,30,86,0.15)] ${isDark
                        ? "bg-white/[0.02] border-white/10 focus-within:border-[#ff1e56]/50 focus-within:bg-white/[0.04]"
                        : "bg-slate-50/70 border-slate-200 focus-within:border-rose-400 focus-within:bg-white shadow-xs"
                        }`}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            autoResize();
                        }}
                        onKeyDown={handleKeyDown}
                        rows={compact ? 1 : 2}
                        placeholder={placeholder}
                        className={`w-full min-w-[150px] resize-none bg-transparent text-[13px] sm:text-sm leading-relaxed outline-none transition-colors duration-200 placeholder:opacity-50 ${isDark ? "text-slate-100 placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"
                            }`}
                    />

                    {/* Bottom toolbar inside input box */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 select-none">
                            <span className="hidden sm:inline-flex items-center gap-1">
                                <kbd className={`px-1.5 py-0.5 rounded text-[8px] font-mono border ${isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-200 border-slate-300 text-slate-600"}`}>
                                    Ctrl + Enter
                                </kbd>
                                <span className={isDark ? "text-slate-500" : "text-slate-400"}>untuk kirim cepat</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors duration-200 cursor-pointer ${isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                        }`}
                                >
                                    Batal
                                </button>
                            )}

                            <motion.button
                                whileHover={{ scale: canSubmit ? 1.03 : 1 }}
                                whileTap={{ scale: canSubmit ? 0.95 : 1 }}
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canSubmit}
                                className={`px-4 py-1.5 flex items-center justify-center gap-1.5 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${canSubmit
                                    ? "bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white shadow-[0_0_20px_rgba(255,30,86,0.35)] hover:shadow-[0_0_25px_rgba(255,30,86,0.5)]"
                                    : isDark
                                        ? "bg-white/5 text-slate-500"
                                        : "bg-slate-200 text-slate-400"
                                    }`}
                            >
                                {posting ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin text-xs" />
                                        <span>Mengirim...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{submitLabel}</span>
                                        <i className="fa-solid fa-paper-plane text-[10px]" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}