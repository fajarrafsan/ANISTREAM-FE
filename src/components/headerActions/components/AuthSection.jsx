import { useState } from "react";

export default function AuthSection({
    isDark,
    isLoggedIn,
    user,
    userAvatar,
    isOnProfile,
    openModal,
    navigate,
    getImageUrl,
    onLogout,
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await onLogout();
        setDropdownOpen(false);
    };

    return (
        <div className="relative z-10 hidden sm:block">
            {isLoggedIn ? (
                <>
                    <button
                        onClick={() => { if (!isOnProfile) setDropdownOpen(!dropdownOpen); }}
                        className={`flex items-center gap-2.5 px-2 py-1 rounded-full border transition-all duration-300 focus:outline-none ${
                            isOnProfile ? "cursor-default" : "cursor-pointer"
                        } ${
                            isDark
                                ? "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07]"
                                : "border-black/[0.08] bg-black/[0.02] hover:bg-black/[0.04]"
                        }`}
                        aria-label="Menu akun"
                    >
                        <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold ${
                            isDark ? "bg-zinc-800 text-white" : "bg-red-50 text-red-600"
                        }`}>
                            {userAvatar ? (
                                <img src={getImageUrl(userAvatar, null)} alt="" className="w-full h-full object-cover" />
                            ) : (
                                user?.username?.charAt(0).toUpperCase() ?? "U"
                            )}
                        </div>
                        <span className={`text-xs font-semibold max-w-[80px] truncate ${isDark ? "text-white/80" : "text-gray-800"}`}>
                            {user?.username ?? "Akun"}
                        </span>
                    </button>

                    {dropdownOpen && !isOnProfile && (
                        <>
                            <div className="fixed inset-0 z-998" onClick={() => setDropdownOpen(false)} />
                            <div className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-2xl z-999 overflow-hidden ${
                                isDark
                                    ? "bg-[#0e0e14]/95 border-white/[0.08] backdrop-blur-lg"
                                    : "bg-white/95 border-black/[0.08] backdrop-blur-lg"
                            }`}>
                                <div className={`px-4 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
                                    <p className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                                        {user?.username}
                                    </p>
                                    <p className={`text-[10px] truncate mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="p-1.5 flex flex-col gap-0.5">
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                            isDark ? "text-white/70 hover:text-white hover:bg-white/[0.06]" : "text-gray-700 hover:bg-black/[0.04]"
                                        }`}
                                    >
                                        Profil Saya
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                            isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"
                                        }`}
                                    >
                                        Keluar
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <button
                    onClick={() => openModal()}
                    className="hidden sm:flex items-center px-5 py-2 rounded-full text-xs font-bold tracking-wide text-white bg-red-600 hover:bg-red-500 border border-red-500/30 shadow-[0_4px_16px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_24px_rgba(239,68,68,0.4)] transition-all duration-300 active:scale-[0.97] cursor-pointer"
                >
                    Masuk
                </button>
            )}
        </div>
    );
}
