import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { getAnimeTitle } from '../utils/animeDetailUtils';

export default function useAnimeDetail() {
    const { slug } = useParams();
    const [result, setResult] = useState({ slug: null, anime: null, loading: true, error: null });

    useEffect(() => {
        if (!slug) return;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await api.get(`/anime/detail/${encodeURIComponent(slug)}`, {
                    signal: controller.signal,
                });
                const anime = response.data.data;
                if (!getAnimeTitle(anime, '').trim()) throw new Error('Data anime tidak tersedia.');
                if (!controller.signal.aborted) setResult({ slug, anime, loading: false, error: null });
            } catch (error) {
                if (controller.signal.aborted) return;
                setResult({ slug, anime: null, loading: false,
                    error: error.response?.data?.message || error.message || 'Terjadi kesalahan' });
            }
        };

        fetchData();
        return () => controller.abort();
    }, [slug]); 

    // Do not expose the previous title/content while another slug is loading.
    return result.slug === slug ? result : { anime: null, loading: true, error: null };
}
