import { useTheme } from '../../../context/ThemeContext'; 

export default function AvatarSection({
    displayAvatar,
    isUploadingAvatar,
    avatarInputRef,
    onAvatarChange,
    displayName,
    getInitial,
    onOpenAvatarModal
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const handleClick = () => {
        if (isUploadingAvatar) return;
        if (onOpenAvatarModal) {
            onOpenAvatarModal();
        } else if (avatarInputRef?.current) {
            avatarInputRef.current.click();
        }
    };

    return (
        <div className="relative group shrink-0 z-20">
            <input
                type="file"
                ref={avatarInputRef}
                onChange={onAvatarChange}
                accept="image/*"
                className="hidden"
            />

            <div className={`absolute -inset-2 rounded-[2rem] bg-gradient-to-tr from-red-600 via-orange-500 to-red-700 opacity-0 group-hover:opacity-25 blur-2xl transition-all duration-700 pointer-events-none scale-90 group-hover:scale-100`}></div>

            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-[110px] md:h-[110px] rounded-[1.5rem] p-[3px] group hover:-translate-y-1.5 hover:scale-[1.03] transition-all duration-400 ease-out cursor-pointer active:scale-95 ${
                isDark 
                    ? "bg-[#121215] shadow-[0_8px_32px_rgba(0,0,0,0.5)]" 
                    : "bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            }`}>

                <div className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-br opacity-100 group-hover:opacity-0 transition-all duration-400 ease-out pointer-events-none z-0 ${
                    isDark 
                        ? "from-white/12 via-white/5 to-transparent" 
                        : "from-black/6 via-transparent to-transparent"
                }`}></div>

                <div className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-red-500 via-orange-500 to-red-800 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out pointer-events-none z-0 ${
                    isDark 
                        ? "shadow-[inset_0_0_20px_rgba(239,68,68,0.4)]" 
                        : "shadow-[inset_0_0_20px_rgba(239,68,68,0.25)]"
                }`}></div>

                <div
                    onClick={handleClick}
                    className={`relative w-full h-full rounded-[1.3rem] overflow-hidden z-10 isolate shadow-inner cursor-pointer ${
                        isDark ? "bg-[#0c0c0e]" : "bg-neutral-100 ring-1 ring-black/5"
                    }`}
                >
                    {displayAvatar ? (
                        <img
                            alt={displayName}
                            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${isUploadingAvatar ? 'blur-sm opacity-50 scale-105' : ''}`}
                            src={displayAvatar}
                            onError={(e) => {
                                // If image link fails, fallback
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className={`w-full h-full relative overflow-hidden flex flex-col items-center justify-center ${
                            isDark 
                                ? "bg-gradient-to-br from-[#240811] via-[#140409] to-[#080204]" 
                                : "bg-gradient-to-br from-rose-100 via-rose-50 to-neutral-100"
                        }`}>
                            <div className="w-full h-full flex flex-col items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
                                <span className={`font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tighter ${
                                    isDark ? "text-white drop-shadow-[0_0_12px_rgba(255,30,86,0.6)]" : "text-rose-700 drop-shadow-sm"
                                }`}>
                                    {getInitial()}
                                </span>
                                <span className="text-[7.5px] sm:text-[8px] font-mono font-bold uppercase tracking-widest text-[#ff1e56] mt-0.5">
                                    Tambah Foto
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out gap-1 z-20 pointer-events-none rounded-[1.3rem]">
                        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-[#ff1e56] text-white rounded-full shadow-[0_0_15px_rgba(255,30,86,0.8)] transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                            <i className="fa-solid fa-camera text-xs" />
                        </div>
                        <span className="text-[8.5px] sm:text-[9.5px] text-white font-mono font-black uppercase tracking-wider transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 delay-75">
                            GANTI FOTO
                        </span>
                    </div>

                    {isUploadingAvatar && (
                        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 z-30 backdrop-blur-md rounded-[1.3rem] ${
                            isDark ? "bg-black/85" : "bg-white/80"
                        }`}>
                            <div className="w-7 h-7 border-2 border-[#ff1e56] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#ff1e56]">
                                Mengunggah...
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Always Visible Camera Action Button (Bottom-Right) ── */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    title="Klik untuk mengganti foto profil"
                    className={`absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg cursor-pointer ${
                        isDark
                            ? "bg-gradient-to-br from-[#ff1e56] to-rose-700 text-white border-2 border-[#090204] shadow-[0_0_15px_rgba(255,30,86,0.6)]"
                            : "bg-[#ff1e56] text-white border-2 border-white shadow-md"
                    }`}
                >
                    <i className="fa-solid fa-camera text-[10px] sm:text-xs" />
                </button>

                {/* ── Online Status Dot (Top-Right) ── */}
                <div
                    className="absolute -top-1 -right-1 z-30 flex items-center justify-center"
                    title="Online Status: Aktif"
                >
                    <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#090204] shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </div>

            </div>
        </div>
    );
}