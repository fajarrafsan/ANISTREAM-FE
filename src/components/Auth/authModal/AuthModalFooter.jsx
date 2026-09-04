import { useTheme } from "../../../context/ThemeContext";

export default function AuthModalFooter({ activeTab, onSwitch }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={`mt-6 flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-3.5 text-center min-[380px]:flex-row ${isDark ? "border-white/[0.08] bg-white/[0.025]" : "border-zinc-200 bg-zinc-50/80"
            }`}>
            <span className={`text-[11px] font-medium ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                {activeTab === "login" ? "Baru di Rafsanime?" : "Sudah memiliki akun?"}
            </span>

            <button
                type="button"
                onClick={onSwitch}
                className={`group inline-flex items-center gap-1 rounded text-[11px] font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-500"
                    }`}
            >
                <span>
                    {activeTab === "login" ? "Buat akun sekarang" : "Masuk ke akun Anda"}
                </span>

                <span className="font-normal transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                    &rarr;
                </span>
            </button>
        </div>
    );
}
