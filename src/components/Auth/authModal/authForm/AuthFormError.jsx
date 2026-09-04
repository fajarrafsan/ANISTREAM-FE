import { AlertCircle } from "lucide-react";

export default function AuthFormError({ error, isVisible, isDark, onClose }) {
    if (!error || !isVisible) return null;

    return (
        <div role="alert" aria-live="polite">
            <div className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${isDark
                ? "border-red-500/20 bg-red-500/[0.07]"
                : "border-red-200 bg-red-50"
                }`}>
                <AlertCircle className={`mt-0.5 size-4 shrink-0 ${isDark ? "text-red-400" : "text-red-600"}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${isDark ? "text-red-300" : "text-red-700"}`}>
                        Tidak dapat melanjutkan
                    </p>
                    <p className={`mt-1 text-[11px] leading-relaxed ${isDark ? "text-red-300/80" : "text-red-700/80"}`}>
                        {error}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup pesan kesalahan"
                    className={`shrink-0 rounded-md p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark
                        ? "hover:bg-red-500/10 text-red-400/50 hover:text-red-400"
                        : "hover:bg-red-100 text-red-500/50 hover:text-red-600"
                        }`}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
