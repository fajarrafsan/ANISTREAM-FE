import { useTheme } from "../../../context/ThemeContext";
import { useGoogleLogin as useGoogleOAuth } from "@react-oauth/google";
import useGoogleLogin from "../../../hooks/useGoogleLogin";
import { useAuth } from "../../../context/AuthContext";
import { useAuthModal } from "../../../context/AuthModalContext";
import useToast from "../../../hooks/useToast";

export default function SocialLogin() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { login } = useAuth();
    const { closeModal, getRedirectAction } = useAuthModal();
    const { googleLogin, loading, error } = useGoogleLogin();
    const toast = useToast();

    const handleGoogleOAuth = useGoogleOAuth({
        flow: "implicit",
        onSuccess: async (credentialResponse) => {
            try {
                const result = await googleLogin(credentialResponse.access_token);
                const { token, user } = result.data;
                login({ ...user, token });

                toast.success(`Selamat datang! 👋 Anda berhasil login sebagai ${user.email}`, 3000);

                setTimeout(() => {
                    const redirectAction = getRedirectAction();
                    closeModal();
                    redirectAction?.();
                }, 500);
            } catch (err) {
                console.error(err);
                const errorMsg = err.response?.data?.message || err.message || "Gagal login dengan Google";
                toast.error(errorMsg, 3000);
            }
        },
        onError: (err) => {
            console.error("Google OAuth error:", err);
            toast.error("Terjadi kesalahan saat login dengan Google", 3000);
        },
    });

    return (
        <div className="w-full">
            <div className="my-5 flex items-center">
                <div className={`h-px flex-1 ${isDark ? "bg-white/[0.08]" : "bg-zinc-200"}`} />
                <span className={`px-3 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                }`}>
                    atau
                </span>
                <div className={`h-px flex-1 ${isDark ? "bg-white/[0.08]" : "bg-zinc-200"}`} />
            </div>

            <button
                type="button"
                className={`flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border px-4 text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/15 active:scale-[0.99] ${
                    isDark
                        ? "border-white/10 bg-white/[0.04] text-zinc-200 hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                        : "border-zinc-200 bg-white text-zinc-800 shadow-sm hover:border-zinc-300 hover:bg-zinc-50"
                } ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                onClick={() => handleGoogleOAuth()}
                disabled={loading}
            >
                {loading ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" aria-hidden="true" />
                ) : (
                    <GoogleIcon />
                )}
                <span>{loading ? "Menghubungkan..." : "Lanjutkan dengan Google"}</span>
            </button>

            {error && (
                <p role="alert" className="mt-3 text-center text-[11px] font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
function GoogleIcon() {
    return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );
}
