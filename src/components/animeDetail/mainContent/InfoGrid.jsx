import { useState, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { buildTrailerEmbedUrl, getAnimeTitle } from "../../../utils/animeDetailUtils";

export default function InfoGrid({ anime }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const trailer = anime?.trailer;
    const embedUrl = buildTrailerEmbedUrl(trailer);
    const embedUrlAutoplay = buildTrailerEmbedUrl(trailer, { autoplay: true });

    const thumbnail = trailer?.thumbnail;
    const synopsis = anime?.description ?? anime?.synopsis ?? "-";
    const genres = anime?.genres ?? [];
    const [trailerLoaded, setTrailerLoaded] = useState(false);
    const [translatedText, setTranslatedText] = useState(null);
    const [translating, setTranslating] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const translationCache = useRef({});

    const cleanSynopsis = String(synopsis)
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const handleTranslate = async () => {
        if (showTranslation) {
            setShowTranslation(false);
            return;
        }
        if (translationCache.current[cleanSynopsis]) {
            setTranslatedText(translationCache.current[cleanSynopsis]);
            setShowTranslation(true);
            return;
        }
        setTranslating(true);
        try {
            const res = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanSynopsis.slice(0, 500))}&langpair=en|id`
            );
            const data = await res.json();
            const result = data?.responseData?.translatedText ?? cleanSynopsis;
            translationCache.current[cleanSynopsis] = result;
            setTranslatedText(result);
            setShowTranslation(true);
        } catch {
            setTranslatedText(cleanSynopsis);
            setShowTranslation(true);
        } finally {
            setTranslating(false);
        }
    };

    const cardClass = `relative rounded-3xl p-[1px] shadow-2xl overflow-hidden h-full flex flex-col group transition-all duration-500`;

    const innerCardClass = `relative z-10 p-3.5 xs:p-4 sm:p-5 h-full rounded-[23px] flex flex-col backdrop-blur-xl transition-colors duration-500 ${isDark
        ? "bg-[#0b0406]/90 border border-white/5 group-hover:border-[#ff1e56]/30"
        : "bg-white/95 border border-slate-200 group-hover:border-rose-400"
    }`;

    const iconBoxClass = `w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110 ${isDark
        ? "bg-[#14080b] border-[#ff1e56]/20 shadow-[0_0_15px_rgba(255,30,86,0.15)] group-hover:shadow-[0_0_25px_rgba(255,30,86,0.3)]"
        : "bg-rose-50 border-rose-200 shadow-sm"
    }`;

    const headingClass = `font-black text-sm sm:text-base tracking-tight uppercase mb-0.5 ${isDark ? "text-slate-200 group-hover:text-white transition-colors" : "text-slate-800"}`;
    const subClass = `text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${isDark ? "text-slate-500" : "text-slate-400"}`;

    return (
        <div id="section-trailer" className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 pt-2 w-full min-w-0">
            {/* ── TRAILER CARD ── */}
            <div className="relative group/card min-w-0">
                {/* Magic Ambient Glow */}
                {isDark && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff1e56]/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />
                )}
                
                <div className={cardClass}>
                    {/* Animated Magic Border */}
                    {isDark && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1e56]/40 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite] transition-all duration-500 z-0" />
                    )}

                    <div className={innerCardClass}>
                        {/* Header */}
                        <div className="flex items-center gap-3.5 mb-4">
                            <div className={iconBoxClass}>
                                <i className="fa-brands fa-youtube text-base sm:text-lg text-[#ff1e56]" />
                            </div>
                            <div>
                                <h3 className={headingClass}>Official Trailer</h3>
                                <p className={subClass}>Preview resmi dari studio</p>
                            </div>
                        </div>

                        {/* Video container */}
                        <div
                            className={`relative w-full aspect-video min-h-[140px] sm:min-h-[240px] rounded-2xl overflow-hidden border transition-all duration-500 ${isDark
                                ? "bg-[#0a0305] border-[#2a1117] shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover/card:border-[#ff1e56]/40"
                                : "bg-slate-200 border-slate-300 shadow-md"
                            }`}
                        >
                            {embedUrl ? (
                                <>
                                    {!trailerLoaded ? (
                                        <button
                                            onClick={() => setTrailerLoaded(true)}
                                            className="w-full h-full relative group/play"
                                            type="button"
                                            aria-label="Play trailer"
                                        >
                                            {thumbnail && (
                                                <img
                                                    src={thumbnail}
                                                    alt="Trailer thumbnail"
                                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover/play:scale-105 ${isDark ? "opacity-70 group-hover/play:opacity-100" : "opacity-80 group-hover/play:opacity-100"}`}
                                                    loading="lazy"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative">
                                                    <div className="absolute inset-0 rounded-full bg-[#ff1e56]/40 animate-ping" style={{ animationDuration: "2s" }} />
                                                    <div className="absolute -inset-2 rounded-full bg-[#ff1e56]/20 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
                                                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#ff1e56] to-[#c41e3a] flex items-center justify-center shadow-[0_0_30px_rgba(255,30,86,0.6)] group-hover/play:shadow-[0_0_50px_rgba(255,30,86,0.8)] group-hover/play:scale-110 transition-all duration-300 border border-white/20">
                                                        <i className="fa-solid fa-play text-white text-sm sm:text-xl ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
                                                <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                                    Putar Video
                                                </span>
                                            </div>
                                        </button>
                                    ) : (
                                        <iframe
                                            className="w-full h-full"
                                            src={embedUrlAutoplay}
                                            title={`${getAnimeTitle(anime)} Trailer`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    )}
                                </>
                            ) : (
                                <div className={`w-full h-full flex flex-col items-center justify-center gap-3 px-4 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${isDark ? "bg-[#1a0a0f] border-[#2a1117]" : "bg-slate-200 border-slate-300"}`}>
                                        <i className="fa-solid fa-film text-sm" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center">
                                        Trailer tidak tersedia
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SYNOPSIS & EDITORIAL CARD ── */}
            <div className="relative group/card min-w-0">
                {/* Magic Ambient Glow */}
                {isDark && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff1e56]/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />
                )}

                <div className={cardClass}>
                    {/* Animated Magic Border */}
                    {isDark && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1e56]/40 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite] transition-all duration-500 z-0 delay-150" />
                    )}

                    <div className={innerCardClass}>
                        <div className="flex-1 flex flex-col justify-between space-y-4 min-h-0 relative z-10">
                            {/* Synopsis Header */}
                            <div>
                                <div className="flex items-center gap-3.5 mb-3.5">
                                    <div className={iconBoxClass}>
                                        <i className="fa-solid fa-book-open text-base sm:text-lg text-[#ff1e56]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={headingClass}>Sinopsis & Ikhtisar</h3>
                                        <p className={subClass}>Narasi Cerita Resmi</p>
                                    </div>
                                    <button
                                        onClick={handleTranslate}
                                        disabled={translating}
                                        className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 border backdrop-blur-sm
                                            ${translating ? "opacity-50 pointer-events-none" : ""}
                                            ${isDark
                                                ? "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-[#ff1e56]/20 hover:text-white hover:border-[#ff1e56]/40 hover:shadow-[0_0_15px_rgba(255,30,86,0.2)]"
                                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 shadow-sm"
                                            }`}
                                    >
                                        {translating ? (
                                            <i className="fa-solid fa-spinner text-[10px] animate-spin text-[#ff1e56]" />
                                        ) : (
                                            <i className={`fa-solid fa-language text-[11px] ${isDark ? "text-[#ff1e56]" : "text-rose-500"}`} />
                                        )}
                                        <span className="hidden xs:inline">
                                            {showTranslation ? "Teks Asli" : "Terjemah"}
                                        </span>
                                    </button>
                                </div>

                                <div className="relative group/text">
                                    {/* Glowing left line */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b ${isDark ? "from-[#ff1e56]/80 via-[#ff1e56]/20 to-transparent group-hover/text:shadow-[0_0_10px_#ff1e56]" : "from-rose-400/80 via-rose-300/20 to-transparent"} transition-shadow duration-500`} />
                                    
                                    <p className={`text-[11px] sm:text-[12px] leading-[1.85] sm:leading-[1.9] pl-3.5 font-medium transition-colors duration-300 line-clamp-6 sm:line-clamp-none ${isDark ? "text-slate-300 group-hover/text:text-white" : "text-slate-600"}`}>
                                        {showTranslation && translatedText ? translatedText : cleanSynopsis}
                                        {translating && (
                                            <span className="inline-flex gap-1 ml-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-bounce shadow-[0_0_5px_#ff1e56]" style={{ animationDelay: "0s" }} />
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-bounce shadow-[0_0_5px_#ff1e56]" style={{ animationDelay: "0.15s" }} />
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-bounce shadow-[0_0_5px_#ff1e56]" style={{ animationDelay: "0.3s" }} />
                                            </span>
                                        )}
                                    </p>
                                    {showTranslation && translatedText && translatedText !== cleanSynopsis && (
                                        <p className={`mt-2.5 pl-3.5 text-[9px] font-black uppercase tracking-widest ${isDark ? "text-[#ff1e56]" : "text-rose-500"}`}>
                                            <i className="fa-solid fa-check text-[8px] mr-1.5" />
                                            Terjemahan Bahasa Indonesia Aktif
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Production Highlight Capsules */}
                            <div className="pt-3 border-t border-white/5">
                                <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                    Sorotan Produksi
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {anime?.studios?.[0]?.name && (
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold ${isDark ? "bg-white/[0.02] border-white/5 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                            <i className="fa-solid fa-clapperboard text-[#ff1e56] text-[8px]" />
                                            <span>Studio: {anime.studios[0].name}</span>
                                        </div>
                                    )}
                                    {anime?.duration && (
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold ${isDark ? "bg-white/[0.02] border-white/5 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                            <i className="fa-solid fa-clock text-amber-400 text-[8px]" />
                                            <span>{anime.duration} Menit/Episode</span>
                                        </div>
                                    )}
                                    {anime?.source && (
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold ${isDark ? "bg-white/[0.02] border-white/5 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                            <i className="fa-solid fa-book text-cyan-400 text-[8px]" />
                                            <span>Sumber: {anime.source}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}