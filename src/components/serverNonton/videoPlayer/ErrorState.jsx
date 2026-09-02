import { useTheme } from "../../../context/ThemeContext";

export default function ErrorState({ error, onBack }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`w-full aspect-video rounded-2xl sm:rounded-3xl flex items-center justify-center p-4 sm:p-8 transition-colors duration-500 relative overflow-hidden select-none ${
                isDark ? "bg-[#080204]" : "bg-slate-50"
            }`}
        >
            {/* Ambient Red Glow */}
            {isDark && (
                <div className="absolute w-72 h-72 rounded-full bg-red-900/15 blur-3xl pointer-events-none" />
            )}

            <div
                className={`relative z-10 text-center max-w-md rounded-2xl sm:rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl ${
                    isDark
                        ? "bg-[#0e0407]/90 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                        : "bg-white border-slate-200 shadow-xl"
                }`}
            >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20 text-[#ff1e56]">
                    <i className="fa-solid fa-triangle-exclamation text-xl sm:text-2xl" />
                </div>

                <h3 className="font-display font-black text-base sm:text-lg tracking-tight uppercase mb-1">
                    Gagal Memuat Video
                </h3>

                <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"} mb-5`}>
                    {error || "Terjadi kesalahan saat memuat sumber video episode ini."}
                </p>

                <div className="flex items-center justify-center gap-2.5">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff1e56] to-[#c41e3a] text-white hover:shadow-[0_0_20px_rgba(255,30,86,0.5)] transition-all cursor-pointer active:scale-95 border border-white/20"
                    >
                        <i className="fa-solid fa-arrow-left text-[10px]" />
                        <span>Kembali</span>
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className={`inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                            isDark
                                ? "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        <i className="fa-solid fa-rotate-right text-[10px]" />
                        <span>Muat Ulang</span>
                    </button>
                </div>
            </div>
        </div>
    );
}