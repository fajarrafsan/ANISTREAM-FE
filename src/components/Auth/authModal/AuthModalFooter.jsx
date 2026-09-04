import { useTheme } from "../../../context/ThemeContext";

export default function AuthModalFooter({ activeTab, onSwitch }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={`mt-6 pt-5 border-t text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-colors duration-300 ${isDark ? "border-zinc-800/60" : "border-zinc-200/60"
            }`}>
            <span className={`text-[11px] font-medium transition-colors duration-300 ${isDark ? "text-zinc-500" : "text-zinc-500"
                }`}>
                {activeTab === "login" ? "Baru di Rafsanime?" : "Sudah memiliki akun?"}
            </span>

            <button
                type="button"
                onClick={onSwitch}
                className={`text-[11px] font-bold tracking-wide transition-all duration-300 inline-flex items-center gap-1 group focus:outline-none ${isDark
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-500"
                    }`}
            >
                <span>
                    {activeTab === "login" ? "Buat akun sekarang" : "Masuk ke akun Anda"}
                </span>

                {/* Efek panah interaktif yang bergeser saat dihover */}
                <span className="transition-transform duration-300 transform group-hover:translate-x-0.5 font-normal">
                    &rarr;
                </span>
            </button>
        </div>
    );
}