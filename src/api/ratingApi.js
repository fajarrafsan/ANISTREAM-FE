import { api } from "./axios";

// Kirim skor 1-10. Skor 0 menghapus rating milik user.
export async function rateAnimeApi({ animeId, score }) {
    const response = await api.post("/anime/rating", { animeId, score });
    return response.data;
}

// Rata-rata + jumlah voter, sekaligus skor milik user sendiri.
export async function getAnimeRatingApi(animeId) {
    const response = await api.get(`/anime/rating/${encodeURIComponent(animeId)}`);
    return response.data;
}

// Semua rating milik user, untuk pengecekan massal.
export async function getUserRatingsApi() {
    const response = await api.get("/anime/ratings");
    return response.data;
}
