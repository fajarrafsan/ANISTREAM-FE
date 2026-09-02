import { useTheme } from '../../../context/ThemeContext';

export default function CoverBanner({
    displayCover,
    isUploadingCover,
    coverInputRef,
    onCoverChange
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={`relative w-full h-48 sm:h-64 md:h-72 group/banner overflow-hidden border-b transition-all duration-500 ${
            isDark ? "bg-[#121214] border-white/5" : "bg-neutral-100 border-neutral-200/60"
        }`}>
            <input
                type="file"
                ref={coverInputRef}
                onChange={onCoverChange}
                accept="image/*"
                className="hidden"
            />

            {displayCover && displayCover !== "/images/clean_header_bg_perfect.png" ? (
                <>
                    <img
                        src={displayCover}
                        alt="Cover Banner"
                        className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover/banner:scale-[1.02] ${isUploadingCover ? 'blur-sm brightness-50' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-500" />
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                    <div className={`absolute inset-0 transition-all duration-700 ${
                        isDark 
                            ? "bg-gradient-to-br from-[#16040a] via-[#090204] to-[#040102]" 
                            : "bg-gradient-to-br from-rose-50 via-slate-100 to-slate-200"
                    }`} />
                    
                    {/* Micro-grid overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.15] transition-all duration-500 pointer-events-none"
                        style={{
                            backgroundImage: isDark
                                ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`
                                : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
                            backgroundSize: "24px 24px"
                        }}
                    />

                    {/* Ambient ruby glows */}
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-48 rounded-full blur-[100px] bg-[#ff1e56]/15 pointer-events-none" />
                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-40 rounded-full blur-[90px] bg-rose-900/20 pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center gap-2.5 select-none text-center px-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.2em] bg-[#ff1e56]/10 border border-[#ff1e56]/30 text-[#ff1e56] backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-pulse" />
                            <span>ANISTREAM CINEMA MEMBER LOUNGE</span>
                        </div>
                        <h3 className={`font-display font-black text-lg sm:text-xl md:text-2xl tracking-tight uppercase ${isDark ? 'text-white/80' : 'text-slate-800'}`}>
                            Studio Personal Dashboard
                        </h3>
                        <p className={`text-[10px] sm:text-xs font-mono tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Kustomisasi foto sampul akunmu agar tampil lebih personal dan sinematik
                        </p>
                    </div>

                    <div
                        className="absolute inset-0 pointer-events-none transition-all duration-500"
                        style={{
                            backgroundImage: isDark
                                ? "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 3px)"
                                : "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.008) 2px, rgba(0,0,0,0.008) 3px)",
                            backgroundSize: "100% 3px"
                        }}
                    />
                </div>
            )}

            <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${
                isDark 
                    ? "from-[#07070a] via-[#07070a]/60 to-transparent" 
                    : "from-white via-white/50 to-transparent"
            }`} />
            
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-50`} />

            {/* Overlay Loading Upload */}
            {isUploadingCover && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-red-400 font-mono tracking-wider font-semibold">Mengunggah Sampul...</span>
                    </div>
                </div>
            )}

            <div className={`absolute top-4 right-4 z-20 transition-all duration-300 ${
                !displayCover || displayCover === "/images/clean_header_bg_perfect.png"
                    ? "opacity-100"
                    : "opacity-0 group-hover/banner:opacity-100"
            }`}>
                <button
                    onClick={() => !isUploadingCover && coverInputRef.current.click()}
                    disabled={isUploadingCover}
                    className="inline-flex items-center gap-2 bg-black/60 hover:bg-red-600/90 border border-white/10 hover:border-red-400/50 px-4 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-300 backdrop-blur-md cursor-pointer text-white/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    {!displayCover || displayCover === "/images/clean_header_bg_perfect.png" ? "Tambah Sampul" : "Ubah Sampul"}
                </button>
            </div>
        </div>
    );
}