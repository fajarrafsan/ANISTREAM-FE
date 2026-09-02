import { useTheme } from "../../../context/ThemeContext";

export default function LoadingState() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-500 relative overflow-hidden select-none ${
                isDark ? "bg-[#060204] text-white" : "bg-slate-50 text-slate-900"
            }`}
        >
            {/* Ambient Cinema Aura */}
            {isDark && (
                <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-[#ff1e56]/20 via-red-950/10 to-indigo-950/20 blur-[130px] pointer-events-none animate-pulse" />
            )}

            {/* Glowing Cinema Reel Center */}
            <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-[#ff1e56]/20 blur-xl animate-pulse" />
                <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border flex items-center justify-center shadow-2xl ${
                        isDark
                            ? "bg-[#0e0407] border-white/10 shadow-[0_0_35px_rgba(255,30,86,0.3)]"
                            : "bg-white border-slate-200 shadow-xl"
                    }`}
                >
                    <div className="w-8 h-8 rounded-full border-2 border-t-[#ff1e56] border-r-[#ff1e56] border-b-transparent border-l-transparent animate-spin absolute" />
                    <i className="fa-solid fa-film text-xl sm:text-2xl text-[#ff1e56] animate-pulse" />
                </div>
            </div>

            {/* Typography */}
            <div className="text-center z-10 max-w-sm px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-3 bg-[#ff1e56]/10 border-[#ff1e56]/30 text-[#ff1e56] shadow-[0_0_15px_rgba(255,30,86,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-ping" />
                    Cinema Theater
                </div>

                <h3 className="font-display font-black text-base sm:text-lg tracking-tight uppercase mb-1">
                    Memuat Video Episode
                </h3>

                <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"} font-medium`}>
                    Menghubungkan ke server streaming terbaik...
                </p>

                {/* Animated shimmer bar */}
                <div className={`mt-5 w-48 h-1 mx-auto rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-200"}`}>
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-[#ff1e56] to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" />
                </div>
            </div>
        </div>
    );
}