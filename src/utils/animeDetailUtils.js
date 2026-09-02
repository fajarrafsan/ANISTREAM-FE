/** Resolve display title whether API returns a string or { main, romaji, ... }. */
export function getAnimeTitle(anime, fallback = "Anime") {
    const title = anime?.title;
    if (typeof title === "string" && title.trim()) return title;
    if (title && typeof title === "object") {
        return title.main ?? title.romaji ?? title.english ?? title.native ?? fallback;
    }
    return fallback;
}

export function getAnimeTitleParts(anime) {
    const title = anime?.title;
    if (typeof title === "string") {
        return { main: title, romaji: "", native: "", english: title };
    }
    return {
        main: title?.main ?? title?.romaji ?? title?.english ?? "Anime",
        romaji: title?.romaji ?? "",
        native: title?.native ?? "",
        english: title?.english ?? "",
    };
}

export function getAnimeId(anime) {
    return anime?.animeId ?? anime?.id ?? anime?._id ?? anime?.malId ?? null;
}

export function getSeasonYear(anime) {
    return anime?.seasonYear ?? anime?.year ?? null;
}

/** Build a safe YouTube (or other) embed URL with optional autoplay. */
export function buildTrailerEmbedUrl(trailer, { autoplay = false } = {}) {
    const base =
        trailer?.embedUrl ??
        (trailer?.id ? `https://www.youtube.com/embed/${trailer.id}` : null);

    if (!base) return null;

    try {
        const url = new URL(base);
        if (autoplay) {
            url.searchParams.set("autoplay", "1");
        }
        return url.toString();
    } catch {
        if (!autoplay) return base;
        const separator = base.includes("?") ? "&" : "?";
        return `${base}${separator}autoplay=1`;
    }
}
