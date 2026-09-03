import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, LogIn, LogOut, UserRound } from "lucide-react";

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
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const dropdownId = useId();

    useEffect(() => {
        if (!dropdownOpen) return;
        const closeOnOutsideClick = (event) => {
            if (!containerRef.current?.contains(event.target)) setDropdownOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key !== "Escape") return;
            setDropdownOpen(false);
            triggerRef.current?.focus();
        };
        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [dropdownOpen]);

    const handleLogout = async () => {
        await onLogout();
        setDropdownOpen(false);
    };

    return (
        <div
            ref={containerRef}
            className="relative z-10 hidden shrink-0 sm:block"
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setDropdownOpen(false);
            }}
        >
            {isLoggedIn ? (
                <>
                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={() => { if (!isOnProfile) setDropdownOpen(!dropdownOpen); }}
                        className={`flex h-11 w-[104px] items-center gap-1.5 rounded-xl border px-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 xl:w-[132px] ${
                            isOnProfile ? "cursor-default" : "cursor-pointer"
                        } ${
                            isDark
                                ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.08] focus-visible:ring-offset-zinc-950"
                                : "border-zinc-200 bg-white/80 hover:bg-zinc-100 focus-visible:ring-offset-white"
                        }`}
                        aria-label="Menu akun"
                        aria-expanded={dropdownOpen && !isOnProfile}
                        aria-controls={dropdownId}
                        disabled={isOnProfile}
                    >
                        <div className={`flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg text-xs font-bold ${
                            isDark ? "bg-zinc-800 text-white" : "bg-red-100 text-red-700"
                        }`}>
                            {userAvatar ? (
                                <img src={getImageUrl(userAvatar, null)} alt="" className="w-full h-full object-cover" />
                            ) : (
                                user?.username?.charAt(0).toUpperCase() ?? "U"
                            )}
                        </div>
                        <span className={`min-w-0 flex-1 truncate text-left text-xs font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                            {user?.username ?? "Akun"}
                        </span>
                        <ChevronDown size={13} strokeWidth={1.8} aria-hidden="true" className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${dropdownOpen ? "rotate-180" : ""} ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
                    </button>

                    {dropdownOpen && !isOnProfile && (
                            <div id={dropdownId} className={`absolute right-0 z-50 mt-3 w-60 overflow-hidden rounded-2xl border p-1.5 shadow-2xl backdrop-blur-xl ${
                                isDark
                                    ? "bg-zinc-950/95 border-white/10 shadow-black/40"
                                    : "bg-white/95 border-zinc-200 shadow-zinc-900/10"
                            }`}>
                                <div className={`mx-1 mb-1 border-b px-2 py-3 ${isDark ? "border-white/[0.08]" : "border-zinc-100"}`}>
                                    <p className={`truncate text-sm font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                                        {user?.username}
                                    </p>
                                    <p className={`mt-1 truncate text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                                        className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                                            isDark ? "text-zinc-300 hover:text-white hover:bg-white/[0.06]" : "text-zinc-700 hover:bg-zinc-100"
                                        }`}
                                    >
                                        <UserRound size={17} strokeWidth={1.8} aria-hidden="true" />
                                        Profil Saya
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                                            isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"
                                        }`}
                                    >
                                        <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
                                        Keluar
                                    </button>
                                </div>
                            </div>
                    )}
                </>
            ) : (
                <button
                    type="button"
                    onClick={() => openModal()}
                    className={`flex h-11 w-[88px] items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-600 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_14px_rgba(220,38,38,0.18)] transition-colors duration-200 hover:bg-red-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${isDark ? "focus-visible:ring-offset-zinc-950" : "focus-visible:ring-offset-white"}`}
                >
                    <LogIn size={16} strokeWidth={1.8} aria-hidden="true" />
                    Masuk
                </button>
            )}
        </div>
    );
}
