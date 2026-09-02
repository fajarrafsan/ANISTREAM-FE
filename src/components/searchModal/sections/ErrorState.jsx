export default function ErrorState({ isDark, onRetry }) {
    return (
        <div className="relative flex flex-col items-center justify-center gap-2 py-10 sm:py-14 px-6 text-center shrink-0">
            <p className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Gagal Memuat
            </p>
            <p className={`text-[11px] font-medium max-w-[220px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Terjadi kesalahan. Silakan coba lagi.
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className={`mt-2 px-4 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-all active:scale-95 cursor-pointer ${
                        isDark
                            ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                            : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    }`}
                >
                    Coba Lagi
                </button>
            )}
        </div>
    );
}
