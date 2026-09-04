import { Sparkles } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

export default function AuthModalHeader({ activeTab }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const isLogin = activeTab === "login";

    return (
        <header className="mb-6 pr-10">
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                isDark
                    ? "border-red-500/20 bg-red-500/10 text-red-300"
                    : "border-red-200 bg-red-50 text-red-700"
            }`}>
                <Sparkles className="size-3" aria-hidden="true" />
                Akun Rafsanime
            </div>

            <h2
                id="auth-modal-title"
                className={`text-[1.75rem] font-black leading-tight tracking-[-0.04em] ${isDark ? "text-white" : "text-zinc-950"}`}
            >
                {isLogin ? "Selamat datang kembali" : "Mulai perjalananmu"}
            </h2>
            <p
                id="auth-modal-description"
                className={`mt-2 max-w-sm text-[13px] leading-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
            >
                {isLogin
                    ? "Masuk untuk melanjutkan tontonan dan koleksi favoritmu."
                    : "Buat akun untuk menyimpan anime favorit dan riwayat tontonanmu."}
            </p>
        </header>
    );
}
