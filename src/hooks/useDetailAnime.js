import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios';   

export default function useAnimeDetail() {
    const { slug } = useParams();              
    const [anime, setAnime] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;                    

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setAnime(null);

                const response = await api.get(`/anime/detail/${slug}`);

                // asumsikan response.data.data berisi object anime detail
                const mapped = response.data.data;
                setAnime(mapped);
                setError(null);
            } catch (error) {
                console.error("Terjadi kesalahan:", error);
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Terjadi kesalahan"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]); 

    return {
        anime,  
        loading,
        error
    };
}