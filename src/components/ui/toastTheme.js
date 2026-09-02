/** AniStream toast tokens — aligned with header / card premium theme */

import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

export const TOAST_EASE = [0.16, 1, 0.3, 1];

export const toastTypes = {
    success: {
        label: "Sukses",
        Icon: CheckCircle,
        sub: "Tindakan berhasil diselesaikan.",
        accent: "#10b981",
        accentSoft: "rgba(16,185,129,0.15)",
        border: "rgba(16,185,129,0.35)",
        glow: "rgba(16,185,129,0.2)",
    },
    error: {
        label: "Gagal",
        Icon: AlertCircle,
        sub: "Terjadi kesalahan. Silakan coba lagi.",
        accent: "#ff1e56",
        accentSoft: "rgba(255,30,86,0.12)",
        border: "rgba(255,30,86,0.35)",
        glow: "rgba(255,30,86,0.22)",
    },
    warning: {
        label: "Perhatian",
        Icon: AlertTriangle,
        sub: "Periksa kembali sebelum melanjutkan.",
        accent: "#f59e0b",
        accentSoft: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.35)",
        glow: "rgba(245,158,11,0.18)",
    },
    info: {
        label: "Info",
        Icon: Info,
        sub: "Informasi penting untuk Anda.",
        accent: "#ff1e56",
        accentSoft: "rgba(255,30,86,0.08)",
        border: "rgba(255,30,86,0.22)",
        glow: "rgba(255,30,86,0.12)",
    },
};

export const toastEnterVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.45, ease: TOAST_EASE },
    },
    exit: {
        opacity: 0,
        y: 12,
        scale: 0.97,
        filter: "blur(4px)",
        transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
    },
};

export const toastEnterVariantsDesktop = {
    hidden: { opacity: 0, x: 40, scale: 0.96, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.45, ease: TOAST_EASE },
    },
    exit: {
        opacity: 0,
        x: 24,
        scale: 0.97,
        filter: "blur(4px)",
        transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
    },
};
