import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Play, ShieldCheck, Sparkles, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../context/ThemeContext";

const focusableSelector = [
    "button:not([disabled])",
    "input:not([disabled])",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function AuthModalLayout({ isOpen, onClose, children }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const dialogRef = useRef(null);
    const previousFocusRef = useRef(null);
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    const handleClose = useCallback(() => onClose?.(), [onClose]);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const frame = requestAnimationFrame(() => setIsVisible(true));
            return () => cancelAnimationFrame(frame);
        }

        setIsVisible(false);
        const timer = window.setTimeout(() => setShouldRender(false), 240);
        return () => window.clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        previousFocusRef.current = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusTimer = window.setTimeout(() => {
            dialogRef.current?.querySelector("input, button")?.focus();
        }, 100);

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                handleClose();
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) return;
            const focusableElements = [...dialogRef.current.querySelectorAll(focusableSelector)];
            if (!focusableElements.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements.at(-1);
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            previousFocusRef.current?.focus?.();
        };
    }, [handleClose, isOpen]);

    if (!shouldRender) return null;

    return createPortal(
        <div
            className={`aml-root fixed inset-0 z-99999 flex items-center justify-center p-3 sm:p-6 ${isVisible ? "is-visible" : ""}`}
        >
            <div
                className="aml-backdrop absolute inset-0 bg-zinc-950/75 backdrop-blur-md"
                aria-hidden="true"
                onMouseDown={handleClose}
            />

            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
                aria-describedby="auth-modal-description"
                className={`aml-dialog relative grid w-full max-w-[900px] overflow-hidden rounded-[26px] border shadow-2xl md:grid-cols-[0.9fr_1.1fr] ${
                    isDark
                        ? "border-white/10 bg-[#0d0d10] shadow-black/60"
                        : "border-zinc-200 bg-white shadow-zinc-950/20"
                }`}
            >
                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Tutup modal autentikasi"
                    className={`absolute right-3 top-3 z-30 flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:right-4 sm:top-4 ${
                        isDark
                            ? "border-white/10 bg-white/[0.06] text-zinc-300 hover:bg-white/10 hover:text-white"
                            : "border-zinc-200 bg-white/90 text-zinc-500 shadow-sm hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                >
                    <X className="size-[18px]" aria-hidden="true" />
                </button>

                <aside className="aml-brand-panel relative hidden min-h-[610px] overflow-hidden bg-[#151519] p-9 text-white md:flex md:flex-col md:justify-between lg:p-11">
                    <div className="aml-grid-pattern absolute inset-0 opacity-60" aria-hidden="true" />
                    <div className="absolute -left-24 top-16 size-64 rounded-full bg-red-600/20 blur-[80px]" aria-hidden="true" />
                    <div className="absolute -bottom-24 right-0 size-72 rounded-full bg-rose-500/10 blur-[90px]" aria-hidden="true" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-3">
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-red-600 shadow-[0_12px_30px_rgba(220,38,38,0.35)]">
                                <Play className="size-[18px] translate-x-px fill-white" aria-hidden="true" />
                            </span>
                            <span className="text-xl font-black tracking-[-0.04em]">
                                Rafsa<span className="text-red-500">nime</span>
                            </span>
                        </div>

                        <div className="mt-16 max-w-xs">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                                <Sparkles className="size-3 text-red-400" aria-hidden="true" />
                                Ruang tontonanmu
                            </div>
                            <p className="text-4xl font-black leading-[1.08] tracking-[-0.05em]">
                                Satu akun.<br />Semua cerita.
                            </p>
                            <p className="mt-5 text-[13px] leading-6 text-zinc-400">
                                Simpan favorit, lanjutkan episode, dan nikmati pengalaman menonton yang terasa personal.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-3">
                        {["Koleksi tersimpan rapi", "Akses cepat di semua perangkat"].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-xs font-medium text-zinc-300">
                                <span className="flex size-6 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
                                    <Check className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
                                </span>
                                {item}
                            </div>
                        ))}
                        <div className="mt-6 flex items-center gap-2 border-t border-white/[0.08] pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            <ShieldCheck className="size-4 text-zinc-400" aria-hidden="true" />
                            Akses aman dan terlindungi
                        </div>
                    </div>
                </aside>

                <div className={`aml-content max-h-[calc(100dvh-24px)] overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 md:max-h-[calc(100dvh-48px)] lg:px-11 lg:py-10 ${
                    isDark ? "bg-[#0d0d10]" : "bg-white"
                }`}>
                    {children}
                </div>
            </section>
        </div>,
        document.body,
    );
}
