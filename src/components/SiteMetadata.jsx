import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAnimeTitle } from "../utils/animeDetailUtils";
import { stripHtml } from "../utils/htmlParser";

const SITE_URL = "https://rafsanime.fajarrafsan.my.id/";
const HOME_TITLE = "Rafsanime — Nonton Anime Subtitle Indonesia";
const HOME_DESCRIPTION =
    "Nonton anime subtitle Indonesia di Rafsanime. Jelajahi koleksi anime, cek jadwal tayang, dan temukan unduhan batch dalam berbagai kualitas.";

const PAGE_TITLES = {
    profile: "Profil",
    catalog: "Katalog Anime",
    schedule: "Jadwal Anime",
    batch: "Batch Anime",
    anime: "Detail Anime",
    episode: "Tonton Anime",
    "reset-password": "Atur Ulang Kata Sandi",
    unauthorized: "Akses Terbatas",
    403: "Akses Terbatas",
};

function setMeta(attribute, name, content) {
    let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
    }
    element.content = content;
}

export default function SiteMetadata({ anime = null, loading = false, error = null }) {
    const { pathname } = useLocation();

    useEffect(() => {
        const isHome = pathname === "/";
        const isDetail = /^\/anime\/detail\/[^/]+\/?$/.test(pathname);
        const animeTitle = !loading && !error ? getAnimeTitle(anime, "").trim() : "";
        const hasAnime = isDetail && Boolean(animeTitle);
        const pageUrl = `${SITE_URL}${pathname.slice(1).replace(/\/$/, "")}`;
        const pageTitle = PAGE_TITLES[pathname.split("/")[1]] || "Halaman";
        const title = isHome ? HOME_TITLE
            : hasAnime ? `${animeTitle} Subtitle Indonesia | Rafsanime`
            : isDetail && error ? "Anime Tidak Tersedia | Rafsanime"
            : `${pageTitle} | Rafsanime`;
        const synopsis = typeof anime?.synopsis === "string" ? stripHtml(anime.synopsis) : "";
        const description = isHome
            ? HOME_DESCRIPTION
            : hasAnime ? `${animeTitle} di Rafsanime. ${synopsis || "Informasi anime, sinopsis, genre, dan daftar episode subtitle Indonesia."}`.slice(0, 160)
            : `${pageTitle} di Rafsanime.`;

        document.title = title;
        setMeta("name", "description", description);
        // Keep pending public pages renderable; failed/missing anime are not search results.
        const indexable = isHome || (isDetail && !error && (loading || hasAnime));
        setMeta("name", "robots", indexable ? "index, follow" : "noindex, follow");
        setMeta("property", "og:title", title);
        setMeta("property", "og:description", description);
        setMeta("property", "og:url", pageUrl);
        setMeta("name", "twitter:title", title);
        setMeta("name", "twitter:description", description);

        let canonical = document.head.querySelector('link[rel="canonical"]');
        let website = document.getElementById("website-structured-data");
        document.getElementById("anime-structured-data")?.remove();

        if (!isHome) website?.remove();
        if (!indexable) {
            canonical?.remove();
            return;
        }

        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = pageUrl;

        if (isDetail) {
            if (hasAnime) {
                const structured = document.createElement("script");
                structured.id = "anime-structured-data";
                structured.type = "application/ld+json";
                structured.textContent = JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: title,
                    description,
                    url: pageUrl,
                    inLanguage: "id-ID",
                    isPartOf: { "@type": "WebSite", name: "Rafsanime", url: SITE_URL },
                    about: { "@type": "CreativeWork", name: animeTitle },
                });
                document.head.appendChild(structured);
            }
            return;
        }

        if (!website) {
            website = document.createElement("script");
            website.id = "website-structured-data";
            website.type = "application/ld+json";
            document.head.appendChild(website);
        }
        website.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Rafsanime",
            url: SITE_URL,
            inLanguage: "id-ID",
        });
    }, [pathname, anime, loading, error]);

    return null;
}
