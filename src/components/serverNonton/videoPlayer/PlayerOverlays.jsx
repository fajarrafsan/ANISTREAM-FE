import { useTheme } from "../../../context/ThemeContext";

// ── LOADING IFRAME ──
export function IframeLoadingState() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-4 ${
                isDark ? "bg-[#0a0305]" : "bg-white"
            }`}
        >
            <div className="relative">
                <div
                    className={`absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full blur-xl animate-pulse ${
                        isDark ? "bg-[#ff1e56]/15" : "bg-rose-200/40"
                    }`}
                />
                <div
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[3px] animate-spin ${
                        isDark
                            ? "border-[#ff1e56]/20 border-t-[#ff1e56]"
                            : "border-rose-200 border-t-[#ff1e56]"
                    }`}
                />
            </div>
            <span
                className={`text-[11px] sm:text-xs font-medium ${
                    isDark ? "text-slate-500" : "text-slate-500"
                }`}
            >
                Memuat video...
            </span>
        </div>
    );
}

// ── ERROR IFRAME ──
export function IframeErrorState({ activeStreamUrl, reloadIframe }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`w-full h-full flex flex-col items-center justify-center gap-4 px-4 sm:px-6 text-center ${
                isDark
                    ? "text-slate-400 bg-gradient-to-b from-[#0a0305] to-[#0d0508]"
                    : "text-slate-600 bg-gradient-to-b from-white to-slate-50"
            }`}
        >
            <div className="relative">
                <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center ${
                        isDark
                            ? "bg-gradient-to-br from-[#1a0a0f] to-[#0a0204] border-[#2a1117]/50"
                            : "bg-white border-slate-200 shadow-sm"
                    }`}
                >
                    <i className="fa-solid fa-triangle-exclamation text-xl sm:text-2xl text-[#ff1e56]/40" />
                </div>
            </div>

            <div>
                <p
                    className={`text-sm font-bold mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-800"
                    }`}
                >
                    Gagal Memuat Video
                </p>
                <p
                    className={`text-xs max-w-xs ${
                        isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                >
                    Video tidak dapat dimuat di halaman ini.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                    onClick={reloadIframe}
                    className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#ff1e56] to-[#c4143a] hover:from-[#ff336a] hover:to-[#d91a4a] text-white font-bold px-4 py-2 rounded-xl text-sm transition-all duration-300 cursor-pointer shadow-sm w-full sm:w-auto"
                >
                    <i className="fa-solid fa-rotate-right" /> Coba Lagi
                </button>
                <a
                    href={activeStreamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 font-bold px-4 py-2 rounded-xl text-sm transition-all w-full sm:w-auto ${
                        isDark
                            ? "bg-[#1a0a0f] border border-[#2a1117]/60 text-slate-300 hover:border-[#ff1e56]/30"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-slate-50"
                    }`}
                >
                    <i className="fa-solid fa-arrow-up-right-from-square" /> Buka di Tab Baru
                </a>
            </div>
        </div>
    );
}

// ── SERVER EMBED DIBLOKIR ──
export function BlockedState({ activeStreamUrl }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`w-full h-full flex flex-col items-center justify-center gap-4 sm:gap-5 px-4 sm:px-6 text-center ${
                isDark
                    ? "text-slate-400 bg-gradient-to-b from-[#0a0305] to-[#0d0508]"
                    : "text-slate-600 bg-gradient-to-b from-white to-slate-50"
            }`}
        >
            <div className="relative">
                <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center shadow-xl ${
                        isDark
                            ? "bg-gradient-to-br from-[#1a0a0f] to-[#0a0204] border-[#2a1117]/50"
                            : "bg-white border-slate-200"
                    }`}
                >
                    <i className="fa-solid fa-circle-exclamation text-2xl sm:text-3xl text-[#ff1e56]/40" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff1e56]/20 animate-ping" />
            </div>

            <div>
                <p
                    className={`text-sm font-bold mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-800"
                    }`}
                >
                    Server Tidak Dapat Diputar Langsung
                </p>
                <p
                    className={`text-xs max-w-xs leading-relaxed ${
                        isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                >
                    Server ini membatasi embed langsung. Silakan buka di tab baru atau pilih server streaming lain di bawah.
                </p>
            </div>

            <a
                href={activeStreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff1e56] to-[#c4143a] hover:from-[#ff336a] hover:to-[#d91a4a] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 cursor-pointer shadow-lg shadow-red-900/30 hover:shadow-red-900/50 group/link w-full sm:w-auto"
            >
                <i className="fa-solid fa-arrow-up-right-from-square text-xs transition-transform" />
                Buka di Tab Baru
            </a>
        </div>
    );
}

// ── KONDISI KOSONG ──
export function EmptyState() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`w-full h-full flex flex-col items-center justify-center gap-4 px-4 ${
                isDark
                    ? "text-slate-600 bg-gradient-to-b from-[#0a0305] to-[#0d0508]"
                    : "text-slate-500 bg-gradient-to-b from-white to-slate-50"
            }`}
        >
            <div className="relative">
                <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center ${
                        isDark
                            ? "bg-gradient-to-br from-[#1a0a0f] to-[#0a0204] border-[#2a1117]/40"
                            : "bg-white border-slate-200 shadow-sm"
                    }`}
                >
                    <i
                        className={`fa-solid fa-film text-xl sm:text-2xl ${
                            isDark ? "text-slate-700" : "text-slate-400"
                        }`}
                    />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff1e56]/10 animate-ping" />
            </div>
            <span
                className={`text-sm font-bold ${
                    isDark ? "text-slate-600" : "text-slate-600"
                }`}
            >
                Video belum tersedia di server ini
            </span>
        </div>
    );
}

// ── EPISODE BERIKUTNYA ──
export function NextEpisodeOverlay({ nextEpisode, onNavigate, onClose }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-md px-4 select-none">
            <div
                className={`text-center p-6 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-2xl w-full max-w-sm ${
                    isDark
                        ? "bg-[#0c0407]/95 border-white/10 shadow-[0_0_50px_rgba(255,30,86,0.3)]"
                        : "bg-white border-slate-200 shadow-2xl"
                }`}
            >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff1e56] to-[#ff4d79] flex items-center justify-center mx-auto mb-3 text-white shadow-[0_0_20px_rgba(255,30,86,0.5)]">
                    <i className="fa-solid fa-forward text-lg" />
                </div>

                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#ff1e56] block mb-1">
                    Episode Selesai
                </span>

                <h4 className="font-display font-black text-base sm:text-lg mb-4">
                    Putar Episode Selanjutnya?
                </h4>

                <button
                    onClick={() => onNavigate(`/episode/${nextEpisode.episodeId}`)}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff1e56] to-[#c4143a] hover:from-[#ff336a] hover:to-[#d91a4a] text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(255,30,86,0.4)] cursor-pointer w-full border border-white/20 active:scale-95"
                >
                    <span>Lanjutkan Nonton</span>
                    <i className="fa-solid fa-play text-[10px]" />
                </button>

                <button
                    onClick={onClose}
                    className={`block mx-auto mt-3 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        isDark
                            ? "text-slate-500 hover:text-slate-300"
                            : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    Nanti Saja
                </button>
            </div>
        </div>
    );
}

// ── BUFFERING LOADER ──
export function BufferingOverlay() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative">
                <div
                    className={`absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full blur-xl animate-pulse ${
                        isDark ? "bg-[#ff1e56]/10" : "bg-rose-200/30"
                    }`}
                />
                <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] animate-spin ${
                        isDark
                            ? "border-[#ff1e56]/20 border-t-[#ff1e56]"
                            : "border-rose-200 border-t-[#ff1e56]"
                    }`}
                />
            </div>
        </div>
    );
}

// ── SERVER LOADING LOADER ──
export function ServerLoadingOverlay() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 z-30 backdrop-blur-md px-4 ${
                isDark ? "bg-black/80" : "bg-white/80"
            }`}
        >
            <div className="relative">
                <div
                    className={`absolute inset-0 w-12 h-12 rounded-full blur-xl animate-pulse ${
                        isDark ? "bg-[#ff1e56]/15" : "bg-rose-200/35"
                    }`}
                />
                <div
                    className={`relative w-10 h-10 rounded-full border-[3px] animate-spin ${
                        isDark
                            ? "border-[#ff1e56]/20 border-t-[#ff1e56]"
                            : "border-rose-200 border-t-[#ff1e56]"
                    }`}
                />
            </div>
            <span
                className={`text-xs font-bold tracking-wide ${
                    isDark ? "text-slate-400" : "text-slate-600"
                }`}
            >
                Memuat Server...
            </span>
        </div>
    );
}