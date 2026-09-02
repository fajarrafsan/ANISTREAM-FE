import { useTheme } from '../../../context/ThemeContext';

export default function BioSection({
    bio,
    bioInput,
    setBioInput,
    isEditingBio,
    setIsEditingBio,
    isSavingBio,
    bioRef,
    onBioSave,
    onBioCancel,
    onBioKeyDown
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="w-full">
            {isEditingBio ? (
                <div className="relative group animate-in fade-in zoom-in duration-300">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur-md opacity-75 group-focus-within:opacity-100 transition duration-500 ${isDark ? "from-red-600/30 to-orange-600/30" : "from-red-600/10 to-orange-600/10"
                        }`}></div>

                    <div className={`relative flex flex-col gap-3 backdrop-blur-xl rounded-2xl p-4 transition-all duration-300 ${isDark
                            ? "bg-[#0c0c0e]/90 border border-white/10 shadow-2xl"
                            : "bg-white/80 border border-neutral-200 shadow-xl"
                        }`}>
                        <textarea
                            ref={bioRef}
                            value={bioInput}
                            disabled={isSavingBio}
                            onChange={(e) => setBioInput(e.target.value)}
                            onKeyDown={onBioKeyDown}
                            maxLength={160}
                            rows={3}
                            placeholder="Tuliskan cerita singkatmu di sini..."
                            className={`w-full bg-transparent border-none focus:ring-0 text-sm md:text-[15px] outline-none resize-none scrollbar-hide font-medium leading-relaxed transition-colors duration-300 ${isDark
                                    ? "text-neutral-200 placeholder:text-neutral-600"
                                    : "text-neutral-800 placeholder:text-neutral-400"
                                }`}
                        />

                        <div className={`flex items-center justify-between border-t pt-3 transition-colors duration-300 ${isDark ? "border-white/10" : "border-neutral-200"
                            }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${bioInput.length >= 150 ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></div>
                                <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase font-bold">
                                    <span className={bioInput.length >= 150 ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-white" : "text-neutral-600")}>
                                        {bioInput.length}
                                    </span> / 160
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={onBioCancel}
                                    disabled={isSavingBio}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 cursor-pointer ${isDark
                                            ? "text-neutral-400 hover:text-white hover:bg-white/10"
                                            : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                                        }`}
                                >
                                    BATAL
                                </button>
                                <button
                                    onClick={onBioSave}
                                    disabled={isSavingBio}
                                    className={`px-5 py-1.5 rounded-xl text-[10px] font-black bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] ${isDark ? "shadow-red-600/20" : "shadow-red-500/20"
                                        }`}
                                >
                                    {isSavingBio ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                    ) : 'SIMPAN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="group/bio relative flex items-center w-full min-h-[56px]">
                    {bio ? (
                        <div className={`relative flex items-start gap-3 w-full p-3 md:px-4 rounded-2xl border transition-all duration-400 ${
                            isDark
                                ? "bg-white/[0.02] hover:bg-white/[0.05] border-transparent hover:border-white/5 shadow-none"
                                : "bg-neutral-50/80 hover:bg-neutral-100/80 border-neutral-100 hover:border-neutral-200/80 shadow-sm hover:shadow-md"
                        }`}>
                            <span className={`material-symbols-outlined text-2xl opacity-60 font-light -scale-x-100 shrink-0 mt-0.5 transition-all duration-300 ${
                                isDark ? "text-red-500/40 group-hover/bio:text-red-400/60" : "text-red-500/20 group-hover/bio:text-red-400/40"
                            }`}>
                                format_quote
                            </span>

                            <p className={`flex-1 text-sm md:text-[14px] font-medium leading-relaxed tracking-wide transition-all duration-300 italic text-left ${
                                isDark
                                    ? "text-neutral-300 group-hover/bio:text-white"
                                    : "text-neutral-700 group-hover/bio:text-neutral-900"
                            }`}>
                                {bio}
                            </p>

                            <button
                                onClick={() => setIsEditingBio(true)}
                                className={`opacity-0 group-hover/bio:opacity-100 p-2 rounded-xl transition-all duration-300 translate-x-2 group-hover/bio:translate-x-0 shrink-0 cursor-pointer ${
                                    isDark
                                        ? "bg-white/[0.04] text-neutral-400 hover:text-red-400 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                        : "bg-neutral-200/50 text-neutral-500 hover:text-red-600 hover:bg-neutral-200"
                                }`}
                                title="Edit Bio"
                            >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsEditingBio(true)}
                            className={`flex items-center gap-4 px-5 py-3 w-full border rounded-2xl cursor-pointer transition-all duration-400 group/placeholder ${
                                isDark
                                    ? "bg-linear-to-r from-red-500/[0.02] to-transparent hover:from-red-500/[0.06] border-red-500/10 hover:border-red-500/30 shadow-none"
                                    : "bg-linear-to-r from-red-50/50 to-transparent hover:from-red-50 border-red-100 hover:border-red-200 shadow-sm hover:shadow-md"
                            }`}
                        >
                            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${
                                isDark
                                    ? "bg-red-500/5 border-red-500/20 group-hover/placeholder:border-red-500/50"
                                    : "bg-red-50 border-red-200 group-hover/placeholder:border-red-300"
                            }`}>
                                <span className={`material-symbols-outlined text-lg transition-all duration-300 ${
                                    isDark
                                        ? "text-red-500/60 group-hover/placeholder:text-red-400"
                                        : "text-red-400 group-hover/placeholder:text-red-500"
                                }`}>
                                    add_comment
                                </span>
                            </div>

                            <div className="flex flex-col text-left">
                                <span className={`text-xs font-sora font-bold transition-all uppercase tracking-widest duration-300 ${
                                    isDark ? "text-red-400/80 group-hover/placeholder:text-red-400" : "text-red-500/80 group-hover/placeholder:text-red-600"
                                }`}>
                                    Tambahkan Bio
                                </span>
                                <span className={`text-[11px] font-mono tracking-wide mt-0.5 transition-all duration-300 ${
                                    isDark
                                        ? "text-neutral-500 group-hover/placeholder:text-neutral-400"
                                        : "text-neutral-400 group-hover/placeholder:text-neutral-600"
                                }`}>
                                    Ceritakan sedikit tentang dirimu...
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}