import { api } from "./axios";

export async function getBatchListApi(page = 1) {
    const response = await api.get("/anime/batch", { params: { page } });
    return response.data;
}

export async function getBatchDetailApi(batchId) {
    const response = await api.get(`/anime/batch/${encodeURIComponent(batchId)}`);
    return response.data;
}
