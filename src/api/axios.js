import axios from "axios";

export const api = axios.create({
    baseURL: 'https://anistreasm-be.onrender.com/api',
    timeout: 30000,
    withCredentials: true
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};

// Route yang tidak boleh diintercept
const AUTH_ROUTES = [
    "/users/login",
    "/users/register",
    "/google/login",
    "/users/refresh",
    "/users/forgot-password",
    "/users/reset-password",
];

const isAuthRoute = (url) => AUTH_ROUTES.some(route => url?.includes(route));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Route auth — langsung lempar, jangan intercept
        if (isAuthRoute(originalRequest.url)) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest))
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post("/users/refresh");
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);

                const isAuthError = refreshError.response &&
                    (refreshError.response.status === 401 ||
                        refreshError.response.status === 403 ||
                        refreshError.response.status === 400);

                if (isAuthError) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                } else {
                    console.warn("Gagal memperbarui token akibat masalah koneksi/server. Sesi lokal dipertahankan.");
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);