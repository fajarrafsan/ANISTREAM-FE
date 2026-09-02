import { api } from "./axios";

// Publik — minta tautan reset dikirim ke email.
export async function forgotPasswordApi(email) {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
}

// Publik — tukar token dari email dengan password baru.
export async function resetPasswordApi({ token, password }) {
    const response = await api.post("/users/reset-password", { token, password });
    return response.data;
}

// Perlu login — ganti password dengan memverifikasi password lama.
export async function changePasswordApi({ currentPassword, newPassword }) {
    const response = await api.patch("/user/password", { currentPassword, newPassword });
    return response.data;
}
