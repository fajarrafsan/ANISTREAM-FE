import { useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuthModal } from "../context/AuthModalContext";
import usePassword from "../hooks/usePassword";

// Backend memvalidasi minimal 6 karakter; dicerminkan di sini agar user tidak
// perlu menunggu round-trip hanya untuk tahu passwordnya terlalu pendek.
const MIN_LENGTH = 6;

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const { openModal } = useAuthModal();
    const { loading, resetPassword } = usePassword();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const problem = useMemo(() => {
        if (!password) return "";
        if (password.length < MIN_LENGTH) return `Password minimal ${MIN_LENGTH} karakter.`;
        if (confirm && password !== confirm) return "Konfirmasi password tidak cocok.";
        return "";
    }, [password, confirm]);

    const canSubmit = Boolean(token) && password.length >= MIN_LENGTH && password === confirm && !loading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!canSubmit) return;

        const result = await resetPassword({ token, password });
        if (result.ok) setDone(true);
        else setError(result.error);
    };

    const shell = `w-full max-w-md rounded-2xl border p-6 sm:p-8 backdrop-blur-xl ${
        isDark ? "bg-[#0e0e14]/90 border-white/10" : "bg-white/95 border-black/10 shadow-xl"
    }`;
    const labelClass = `block text-xs font-semibold mb-2 ${isDark ? "text-white/70" : "text-gray-700"}`;
    const fieldClass = `w-full rounded-xl border pl-10 pr-11 py-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red-500 ${
        isDark
            ? "bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
            : "bg-black/[0.02] border-black/10 text-gray-900 placeholder:text-gray-400"
    }`;
    const iconClass = `absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`;

    return (
        <div className="min-h-[70vh] grid place-items-center px-4 py-12">
            <div className={shell}>
                <h1 className={`font-display text-2xl uppercase tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>
                    Reset <span className="text-red-500">Password</span>
                </h1>

                {!token ? (
                    <div className="mt-6 flex gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-500" aria-hidden="true" />
                        <div>
                            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                Tautan tidak lengkap
                            </p>
                            <p className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-gray-600"}`}>
                                Token reset tidak ditemukan di URL. Silakan minta tautan baru lewat menu masuk.
                            </p>
                            <Link to="/" className="inline-block mt-4 text-xs font-bold text-red-500 hover:text-red-400">
                                Kembali ke beranda
                            </Link>
                        </div>
                    </div>
                ) : done ? (
                    <div className="mt-6 flex gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" aria-hidden="true" />
                        <div>
                            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                Password berhasil diubah
                            </p>
                            <p className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-gray-600"}`}>
                                Semua sesi lama sudah dikeluarkan. Masuk kembali dengan password baru.
                            </p>
                            <button
                                type="button"
                                onClick={() => { navigate("/"); openModal({ mode: "login" }); }}
                                className="mt-4 inline-flex items-center min-h-11 px-5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            >
                                Masuk sekarang
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                        <div>
                            <label htmlFor="new-password" className={labelClass}>Password baru</label>
                            <div className="relative">
                                <Lock className={iconClass} aria-hidden="true" />
                                <input
                                    id="new-password"
                                    type={show ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder={`Minimal ${MIN_LENGTH} karakter`}
                                    className={fieldClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow((s) => !s)}
                                    aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                                    className={`absolute right-1 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-lg cursor-pointer ${isDark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className={labelClass}>Ulangi password baru</label>
                            <div className="relative">
                                <Lock className={iconClass} aria-hidden="true" />
                                <input
                                    id="confirm-password"
                                    type={show ? "text" : "password"}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Ketik ulang password"
                                    className={fieldClass}
                                />
                            </div>
                        </div>

                        {(problem || error) && (
                            <p role="alert" className="text-xs font-medium text-red-500">
                                {problem || error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="mt-1 inline-flex items-center justify-center gap-2 min-h-11 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                            {loading ? "Menyimpan..." : "Simpan password baru"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
