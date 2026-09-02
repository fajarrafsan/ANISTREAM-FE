import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import usePassword from "../../hooks/usePassword";

// Sama dengan batas Joi di backend.
const MIN_LENGTH = 6;

export default function ChangePassword() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { loading, changePassword } = usePassword();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState(false);

    const tooShort = newPassword.length > 0 && newPassword.length < MIN_LENGTH;
    const mismatch = confirm.length > 0 && newPassword !== confirm;
    const canSubmit =
        currentPassword.length > 0 &&
        newPassword.length >= MIN_LENGTH &&
        newPassword === confirm &&
        !loading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        const result = await changePassword({ currentPassword, newPassword });
        if (result.ok) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirm("");
        }
    };

    const fieldClass = `w-full rounded-xl border px-3 py-2.5 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#ff1e56] ${
        isDark
            ? "bg-white/[0.04] border-white/10 text-white placeholder:text-white/25"
            : "bg-black/[0.02] border-black/10 text-gray-900 placeholder:text-gray-400"
    }`;
    const labelClass = `block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
        isDark ? "text-white/45" : "text-gray-500"
    }`;

    return (
        <section
            className={`rounded-2xl border p-4 sm:p-5 ${
                isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-black/10 shadow-sm"
            }`}
            aria-labelledby="ubah-password-judul"
        >
            <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#ff1e56]/15 grid place-items-center text-[#ff1e56]">
                    <KeyRound className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                    <h2 id="ubah-password-judul" className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        Ubah Password
                    </h2>
                    <p className={`text-[10px] ${isDark ? "text-white/40" : "text-gray-500"}`}>
                        Perlu password lama untuk konfirmasi
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                <div>
                    <label htmlFor="current-password" className={labelClass}>Password lama</label>
                    <input
                        id="current-password"
                        type={show ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        placeholder="Password saat ini"
                        className={fieldClass}
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="profile-new-password" className={labelClass}>Password baru</label>
                        <input
                            id="profile-new-password"
                            type={show ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            placeholder={`Minimal ${MIN_LENGTH} karakter`}
                            className={fieldClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="profile-confirm-password" className={labelClass}>Ulangi password baru</label>
                        <input
                            id="profile-confirm-password"
                            type={show ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            autoComplete="new-password"
                            placeholder="Ketik ulang"
                            className={fieldClass}
                        />
                    </div>
                </div>

                {(tooShort || mismatch) && (
                    <p role="alert" className="text-[11px] font-medium text-[#ff1e56]">
                        {tooShort ? `Password baru minimal ${MIN_LENGTH} karakter.` : "Konfirmasi password tidak cocok."}
                    </p>
                )}

                <div className="flex items-center justify-between gap-3 mt-1">
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold cursor-pointer bg-transparent border-none p-0 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1e56] ${
                            isDark ? "text-white/45 hover:text-white/80" : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        {show ? <EyeOff className="w-3.5 h-3.5" aria-hidden="true" /> : <Eye className="w-3.5 h-3.5" aria-hidden="true" />}
                        {show ? "Sembunyikan" : "Tampilkan"} password
                    </button>

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="inline-flex items-center justify-center gap-1.5 min-h-11 px-5 rounded-full text-xs font-bold text-white bg-[#ff1e56] hover:bg-[#e01a4d] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1e56] focus-visible:ring-offset-2"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>
        </section>
    );
}
