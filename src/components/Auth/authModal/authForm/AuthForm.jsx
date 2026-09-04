import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight, ArrowLeft, CircleCheck, Loader2, Mail, Lock, User } from "lucide-react";
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

    const [forgotMode, setForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotSent, setForgotSent] = useState(false);
    const { loading: forgotLoading, forgotPassword } = usePassword();

    useEffect(() => {
        setForgotMode(false);
        setForgotSent(false);
    }, [activeTab]);

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail.trim() || forgotLoading) return;
        const result = await forgotPassword(forgotEmail.trim());
        if (result.ok) setForgotSent(true);
    };

    const iconClass = isDark ? "text-zinc-500" : "text-zinc-400";
    const hoverIconClass = isDark ? "hover:text-zinc-200" : "hover:text-zinc-700";

    if (forgotMode) {
        return (
            <form id="auth-form-panel" role="tabpanel" aria-labelledby="auth-login-tab" className="space-y-5" onSubmit={handleForgotSubmit} noValidate>
                <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className={`inline-flex min-h-8 items-center gap-1.5 rounded-md bg-transparent p-0 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-900"}`}
                >
                    <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                    Kembali ke masuk
                </button>

                {forgotSent ? (
                    <div className={`rounded-2xl border p-4 ${isDark ? "border-emerald-500/20 bg-emerald-500/[0.07]" : "border-emerald-200 bg-emerald-50"}`}>
                        <CircleCheck className={`mb-3 size-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} aria-hidden="true" />
                        <p className={`text-sm font-bold ${isDark ? "text-emerald-200" : "text-emerald-900"}`}>Periksa emailmu</p>
                        <p className={`mt-1.5 text-[11px] leading-5 ${isDark ? "text-emerald-200/70" : "text-emerald-800/75"}`}>
                            Jika email terdaftar, tautan reset sudah dikirim. Periksa kotak masuk dan folder spam.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className={`text-[12px] leading-5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Masukkan email akunmu. Kami kirimkan tautan untuk membuat password baru.
                        </p>

                        <AuthFormField
                            label="Email"
                            icon={<Mail className={`w-3.5 h-3.5 ${iconClass}`} />}
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="nama@email.com"
                            id="forgot-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            isDark={isDark}
                        />

                        <button
                            type="submit"
                            disabled={forgotLoading || !forgotEmail.trim()}
                            className="mt-1 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white shadow-[0_10px_24px_rgba(220,38,38,0.2)] transition-[background-color,box-shadow,transform] hover:bg-red-500 hover:shadow-[0_14px_30px_rgba(220,38,38,0.28)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
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
        <form
            id="auth-form-panel"
            role="tabpanel"
            aria-labelledby={`auth-${activeTab}-tab`}
            className="space-y-4"
            onSubmit={handleSubmit}
            noValidate
        >
            <div
                className="space-y-4 transition-[opacity,transform,filter] duration-200 ease-out"
                style={{
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? "scale(0.98)" : "scale(1)",
                    filter: isTransitioning ? "blur(2px)" : "blur(0px)",
                }}
            >
                {activeTab === "register" && (
                    <AuthFormField
                        label="Username"
                        icon={<User className={`w-3.5 h-3.5 ${iconClass}`} />}
                        value={fields.username}
                        onChange={setField("username")}
                        placeholder="nama pengguna"
                        id="register-username"
                        name="username"
                        autoComplete="username"
                        error={errors.username}
                        isDark={isDark}
                    />
                )}

                <AuthFormField
                    label={activeTab === "login" ? "Email atau Username" : "Email"}
                    icon={<Mail className={`w-3.5 h-3.5 ${iconClass}`} />}
                    value={fields.email}
                    onChange={setField("email")}
                    placeholder={activeTab === "login" ? "email atau username" : "nama@email.com"}
                    id={activeTab === "login" ? "login-identifier" : "register-email"}
                    name="email"
                    type={activeTab === "login" ? "text" : "email"}
                    autoComplete={activeTab === "login" ? "username" : "email"}
                    inputMode={activeTab === "login" ? undefined : "email"}
                    error={errors.email}
                    isDark={isDark}
                />

                <AuthFormField
                    label="Kata Sandi"
                    icon={<Lock className={`w-3.5 h-3.5 ${iconClass}`} />}
                    type={showPassword ? "text" : "password"}
                    value={fields.password}
                    onChange={setField("password")}
                    placeholder="••••••••"
                    id={activeTab === "login" ? "login-password" : "register-password"}
                    name="password"
                    autoComplete={activeTab === "login" ? "current-password" : "new-password"}
                    error={errors.password}
                    isDark={isDark}
                    extraLabel={
                        activeTab === "login" && (
                            <button
                                type="button"
                                onClick={() => { setForgotMode(true); setForgotSent(false); setForgotEmail(fields.email ?? ""); }}
                                className={`rounded bg-transparent p-0 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDark
                                    ? "text-red-400 hover:text-red-300"
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
                            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${iconClass} ${hoverIconClass}`}
                        >
                            {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                        </button>
                    }
                />

                {activeTab === "register" && (
                    <AuthFormField
                        label="Konfirmasi Kata Sandi"
                        icon={<Lock className={`w-3.5 h-3.5 ${iconClass}`} />}
                        type={showConfirm ? "text" : "password"}
                        value={fields.confirmPassword}
                        onChange={setField("confirmPassword")}
                        placeholder="••••••••"
                        id="register-confirm-password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        error={errors.confirmPassword}
                        isDark={isDark}
                        right={
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                aria-label={showConfirm ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                                className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${iconClass} ${hoverIconClass}`}
                            >
                                {showConfirm ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                            </button>
                        }
                    />
                )}

                <AuthFormError
                    error={currentError}
                    isVisible={isErrorVisible}
                    isDark={isDark}
                    onClose={() => setIsErrorVisible(false)}
                />

                <button
                    type="submit"
                    disabled={loading || isTransitioning}
                    className="group mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white shadow-[0_10px_24px_rgba(220,38,38,0.2)] transition-[background-color,box-shadow,transform] hover:bg-red-500 hover:shadow-[0_14px_30px_rgba(220,38,38,0.28)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    style={{
                        opacity: isTransitioning ? 0.6 : 1,
                        transform: isTransitioning ? "scale(0.97)" : "scale(1)",
                        transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                            <span>{activeTab === "login" ? "Masuk..." : "Mendaftar..."}</span>
                        </>
                    ) : (
                        <>
                            <span>{activeTab === "login" ? "Masuk" : "Daftar"}</span>
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
