import { useState, useCallback } from "react";
import useToast from "./useToast";
import { forgotPasswordApi, resetPasswordApi, changePasswordApi } from "../api/passwordApi";

// Pesan error server dipakai apa adanya bila ada, karena backend sudah
// mengirim teks berbahasa Indonesia yang layak ditampilkan.
const errorText = (error, fallback) =>
    error?.response?.data?.errors ?? error?.response?.data?.message ?? fallback;

export default function usePassword() {
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const forgotPassword = useCallback(async (email) => {
        setLoading(true);
        try {
            await forgotPasswordApi(email);
            // Server sengaja tidak membocorkan apakah email terdaftar.
            toast.success("Jika email terdaftar, tautan reset sudah dikirim.", 5000);
            return { ok: true };
        } catch (error) {
            const msg = errorText(error, "Gagal mengirim tautan reset.");
            toast.error(msg, 4000);
            return { ok: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const resetPassword = useCallback(async ({ token, password }) => {
        setLoading(true);
        try {
            await resetPasswordApi({ token, password });
            toast.success("Password berhasil direset. Silakan masuk.", 4000);
            return { ok: true };
        } catch (error) {
            const msg = errorText(error, "Token tidak valid atau sudah kedaluwarsa.");
            toast.error(msg, 4000);
            return { ok: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
        setLoading(true);
        try {
            await changePasswordApi({ currentPassword, newPassword });
            toast.success("Password berhasil diubah.", 3000);
            return { ok: true };
        } catch (error) {
            const msg = errorText(error, "Gagal mengubah password.");
            toast.error(msg, 4000);
            return { ok: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    return { loading, forgotPassword, resetPassword, changePassword };
}
