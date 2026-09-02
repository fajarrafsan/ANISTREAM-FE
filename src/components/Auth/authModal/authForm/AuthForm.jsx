import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Mail, Lock, User } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import usePassword from "../../../../hooks/usePassword";
import useAuthForm from "./useAuthForm";
import AuthFormField from "./AuthFormField";
import AuthFormError from "./AuthFormError";

export default function AuthForm({ activeTab, onSuccess, onChange }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const {
        fields,
        errors,
        loading,
        currentError,
        isErrorVisible,
        isTransitioning,
        showPassword,
        showConfirm,
        setField,
        setShowPassword,
        setShowConfirm,
        setIsErrorVisible,
        handleSubmit,
    } = useAuthForm(activeTab, onSuccess, onChange);

    // Mode lupa password ditumpangkan di modal yang sama supaya user tidak
    // kehilangan konteks hanya untuk meminta satu tautan.
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotSent, setForgotSent] = useState(false);
    const { loading: forgotLoading, forgotPassword } = usePassword();

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail.trim() || forgotLoading) return;
        const result = await forgotPassword(forgotEmail.trim());
        if (result.ok) setForgotSent(true);
    };

    // Menggunakan warna Zinc yang lebih serasi dengan tema hitam modern
    const iconClass = isDark ? "text-zinc-500" : "text-zinc-400";
    const hoverIconClass = isDark ? "hover:text-zinc-200" : "hover:text-zinc-700";

    if (forgotMode) {
        return (
            <form className="space-y-3.5" onSubmit={handleForgotSubmit} noValidate>
                <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold cursor-pointer bg-transparent border-none p-0 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}
                >
                    <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                    Kembali ke masuk
                </button>

                {forgotSent ? (
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                        Jika email tersebut terdaftar, kami sudah mengirim tautan reset.
                        Periksa kotak masuk dan folder spam.
                    </p>
                ) : (
                    <>
                        <p className={`text-[11px] leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Masukkan email akunmu. Kami kirimkan tautan untuk membuat password baru.
                        </p>

                        <AuthFormField
                            label="Email"
                            icon={<Mail className={`w-3.5 h-3.5 ${iconClass}`} />}
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="nama@email.com"
                            isDark={isDark}
                        />

                        <button
                            type="submit"
                            disabled={forgotLoading || !forgotEmail.trim()}
                            className={`w-full py-2.5 font-semibold text-white rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 mt-4 cursor-pointer ${isDark
                                ? "bg-red-600 hover:bg-red-500 active:scale-95"
                                : "bg-red-600 hover:bg-red-700 shadow-sm"
                            } disabled:opacity-50 disabled:pointer-events-none`}
                        >
                            {forgotLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
                            <span>{forgotLoading ? "Mengirim..." : "Kirim tautan reset"}</span>
                        </button>
                    </>
                )}
            </form>
        );
    }

    return (
        <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
            <div
                className="space-y-3.5 transition-all duration-300 ease-out"
                style={{
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? "scale(0.98)" : "scale(1)",
                    filter: isTransitioning ? "blur(2px)" : "blur(0px)",
                }}
            >
                {/* Username — Register only */}
                {activeTab === "register" && (
                    <AuthFormField
                        label="Username"
                        icon={<User className={`w-3.5 h-3.5 ${iconClass}`} />}
                        value={fields.username}
                        onChange={setField("username")}
                        placeholder="nama pengguna"
                        error={errors.username}
                        isDark={isDark}
                    />
                )}

                {/* Email */}
                <AuthFormField
                    label={activeTab === "login" ? "Email atau Username" : "Email"}
                    icon={<Mail className={`w-3.5 h-3.5 ${iconClass}`} />}
                    value={fields.email}
                    onChange={setField("email")}
                    placeholder="nama@email.com"
                    error={errors.email}
                    isDark={isDark}
                />

                {/* Password */}
                <AuthFormField
                    label="Kata Sandi"
                    icon={<Lock className={`w-3.5 h-3.5 ${iconClass}`} />}
                    type={showPassword ? "text" : "password"}
                    value={fields.password}
                    onChange={setField("password")}
                    placeholder="••••••••"
                    error={errors.password}
                    isDark={isDark}
                    extraLabel={
                        activeTab === "login" && (
                            <button
                                type="button"
                                onClick={() => { setForgotMode(true); setForgotSent(false); setForgotEmail(fields.email ?? ""); }}
                                className={`text-[10px] cursor-pointer transition-colors bg-transparent border-none p-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark
                                    ? "text-zinc-400 hover:text-zinc-200"
                                    : "text-red-500 hover:text-red-600"
                                }`}
                            >
                                Lupa kata sandi?
                            </button>
                        )
                    }
                    right={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`${iconClass} ${hoverIconClass} transition-colors shrink-0`}
                        >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                    }
                />

                {/* Confirm Password — Register only */}
                {activeTab === "register" && (
                    <AuthFormField
                        label="Konfirmasi Kata Sandi"
                        icon={<Lock className={`w-3.5 h-3.5 ${iconClass}`} />}
                        type={showConfirm ? "text" : "password"}
                        value={fields.confirmPassword}
                        onChange={setField("confirmPassword")}
                        placeholder="••••••••"
                        error={errors.confirmPassword}
                        isDark={isDark}
                        right={
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className={`${iconClass} ${hoverIconClass} transition-colors shrink-0`}
                            >
                                {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                        }
                    />
                )}

                {/* Error */}
                <AuthFormError
                    error={currentError}
                    isVisible={isErrorVisible}
                    isDark={isDark}
                    onClose={() => setIsErrorVisible(false)}
                />

                {/* Submit Button - Menggunakan warna merah premium solid yang bersih */}
                <button
                    type="submit"
                    disabled={loading || isTransitioning}
                    className={`w-full py-2.5 font-semibold text-white rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 group mt-4 ${isDark
                            ? "bg-red-600 hover:bg-red-500 active:scale-95 hover:shadow-[0_0_20px_rgba(220,38,38,0.25)]"
                            : "bg-red-600 hover:bg-red-700 active:scale-98 shadow-sm hover:shadow-md"
                        } disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none`}
                    style={{
                        opacity: isTransitioning ? 0.6 : 1,
                        transform: isTransitioning ? "scale(0.97)" : "scale(1)",
                        transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{activeTab === "login" ? "Masuk..." : "Mendaftar..."}</span>
                        </>
                    ) : (
                        <>
                            <span>{activeTab === "login" ? "Masuk" : "Daftar"}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}