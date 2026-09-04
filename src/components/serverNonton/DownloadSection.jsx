import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const getHostIcon = (title = "") => {
    const lower = title.toLowerCase();
    if (lower.includes("drive") || lower.includes("google") || lower.includes("gdrive")) return "fa-brands fa-google-drive";
    if (lower.includes("mega")) return "fa-solid fa-cloud";
    if (lower.includes("pixeldrain") || lower.includes("pixel")) return "fa-solid fa-server";
    if (lower.includes("mediafire")) return "fa-solid fa-fire-flame-simple";
    if (lower.includes("gofile")) return "fa-solid fa-arrow-up-from-bracket";
    if (lower.includes("kraken")) return "fa-solid fa-ghost";
    return "fa-solid fa-cloud-arrow-down";
};

const getResolutionMeta = (res = "") => {
    const lower = res.toLowerCase();

    if (lower.includes("1080") || lower.includes("fullhd") || lower.includes("fhd") || lower.includes("full hd")) {
        return {
            label: "1080p",
            subLabel: "Full HD • Kualitas Tertinggi",
            isHighlight: true,
        };
    }

    if (lower.includes("720") || lower.includes("mp4hd") || lower.includes("hd")) {
        return {
            label: "720p",
            subLabel: "HD • Rekomendasi Standar",
            isHighlight: false,
        };
    }

    if (lower.includes("480") || lower.includes("sd") || lower.includes("standard")) {
        return {
            label: "480p",
            subLabel: "SD • Hemat Kuota",
            isHighlight: false,
        };
    }

    if (lower.includes("360")) {
        return {
            label: "360p",
            subLabel: "LQ • Ukuran Terkecil",
            isHighlight: false,
        };
    }

    return {
        label: res,
        subLabel: "Berkas Standar",
        isHighlight: false,
    };
};

export default function DownloadSection({ formats }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [activeFormat, setActiveFormat] = useState(0);
    // Auto-expand first quality for convenience
    const [expandedQualities, setExpandedQualities] = useState(() => {
        if (formats?.[0]?.qualities?.[0]?.title) {
            return new Set([`0-${formats[0].qualities[0].title}`]);
        }
        return new Set();
    });

    if (!formats || formats.length === 0) return null;

    const current = formats[activeFormat];

    const toggleQuality = (key) => {
        setExpandedQualities((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const toggleAllQualities = () => {
        const allKeys = current.qualities.map((q) => `${activeFormat}-${q.title}`);
        const allOpen = allKeys.every((k) => expandedQualities.has(k));

        setExpandedQualities((prev) => {
            const next = new Set(prev);
            if (allOpen) {
                allKeys.forEach((k) => next.delete(k));
            } else {
                allKeys.forEach((k) => next.add(k));
            }
            return next;
        });
    };

    const isAllExpanded = current?.qualities?.length > 0 && current.qualities.every((q) => expandedQualities.has(`${activeFormat}-${q.title}`));

    return (
        <div className="relative group">
            {/* Subtle Ambient Glow */}
            {isDark && (
                <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-20 bg-gradient-to-br from-[#ff1e56]/15 via-transparent to-transparent pointer-events-none" />
            )}

            {/* Main Luxury Chassis Container */}
            <div
                className={`relative overflow-hidden transition-all duration-500 rounded-2xl sm:rounded-3xl border shadow-2xl backdrop-blur-xl p-3.5 xs:p-4 sm:p-6 md:p-7 ${
                    isDark
                        ? "bg-[#0b0406]/90 border-white/[0.07]"
                        : "bg-white/95 border-slate-200 shadow-xl"
                }`}
            >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-1 select-none">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-lg shrink-0 ${
                                isDark
                                    ? "bg-gradient-to-br from-[#2a0a12] via-[#1a050a] to-[#0f0205] border-red-900/30 text-[#ff1e56]"
                                    : "bg-white border-slate-200 text-[#ff1e56] shadow-sm"
                            }`}
                        >
                            <i className="fa-solid fa-cloud-arrow-down text-sm" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3
                                    className={`font-display font-black text-sm sm:text-base tracking-tight uppercase leading-tight ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                >
                                    Pusat Unduhan Episode
                                </h3>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#ff1e56]/10 border border-[#ff1e56]/30 text-[#ff1e56]">
                                    {formats.length} Format
                                </span>
                            </div>
                            <p
                                className={`text-[10px] sm:text-[11px] font-medium mt-0.5 ${
                                    isDark ? "text-slate-500" : "text-slate-400"
                                }`}
                            >
                                Unduh berkas video original dengan server penyimpanan cloud langsung
                            </p>
                        </div>
                    </div>

                    {/* Quick Expand All Toggle */}
                    <button
                        onClick={toggleAllQualities}
                        className={`self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                            isDark
                                ? "bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white"
                                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 shadow-sm"
                        }`}
                        title="Buka atau tutup seluruh daftar resolusi"
                    >
                        <i className={`fa-solid ${isAllExpanded ? "fa-compress" : "fa-expand"} text-[10px] text-[#ff1e56]` } />
                        <span>{isAllExpanded ? "Ciutkan Semua" : "Buka Semua"}</span>
                    </button>
                </div>

                {/* Format Selector Tabs */}
                <div className="mb-4">
                    <div
                        className={`p-1.5 rounded-2xl border flex items-center gap-1.5 overflow-x-auto scrollbar-hide ${
                            isDark ? "bg-black/40 border-white/[0.06]" : "bg-slate-100 border-slate-200"
                        }`}
                        style={{ scrollbarWidth: "none" }}
                    >
                        {formats.map((fmt, i) => {
                            const isActive = activeFormat === i;
                            return (
                                <button
                                    key={fmt.title}
                                    onClick={() => setActiveFormat(i)}
                                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0 border select-none ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#ff1e56] to-[#c4143a] text-white border-white/20 shadow-[0_0_15px_rgba(255,30,86,0.4)]"
                                            : isDark
                                                ? "bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.04]"
                                                : "bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-white/60"
                                    }`}
                                >
                                    <i className={`fa-solid ${fmt.title.toLowerCase().includes("mkv") ? "fa-box-archive" : "fa-file-video"} text-xs`} />
                                    <span>{fmt.title}</span>
                                    <span
                                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                                            isActive
                                                ? "bg-white/20 text-white"
                                                : isDark
                                                    ? "bg-white/5 text-slate-500"
                                                    : "bg-slate-200/80 text-slate-600"
                                        }`}
                                    >
                                        {fmt.qualities?.length || 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Qualities & Server Download Accordion */}
                <div className="space-y-2.5">
                    {current?.qualities?.map((q) => {
                        const key = `${activeFormat}-${q.title}`;
                        const isOpen = expandedQualities.has(key);
                        const resLabel = q.title.trim();
                        const meta = getResolutionMeta(resLabel);

                        return (
                            <div
                                key={key}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isOpen
                                        ? isDark
                                            ? "bg-[#14060a]/80 border-[#ff1e56]/40 shadow-[0_0_25px_rgba(255,30,86,0.08)]"
                                            : "bg-white border-rose-300 shadow-md shadow-rose-500/5"
                                        : isDark
                                            ? "bg-white/[0.02] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]"
                                            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                }`}
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleQuality(key)}
                                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left cursor-pointer select-none group/quality"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Minimalist Resolution Badge */}
                                        <div
                                            className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 ${
                                                meta.isHighlight
                                                    ? "bg-[#ff1e56] text-white shadow-[0_0_12px_rgba(255,30,86,0.4)]"
                                                    : isDark
                                                        ? "bg-white/[0.06] text-slate-200 border border-white/10"
                                                        : "bg-slate-100 text-slate-700 border border-slate-200"
                                            }`}
                                        >
                                            <span>{meta.label}</span>
                                        </div>

                                        {/* Subtitle / Quality note */}
                                        <span
                                            className={`text-[11px] sm:text-xs font-semibold truncate ${
                                                isDark ? "text-slate-300" : "text-slate-700"
                                            }`}
                                        >
                                            {meta.subLabel}
                                        </span>

                                        {/* Server Count */}
                                        <span
                                            className={`hidden sm:flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium ${
                                                isDark ? "text-slate-500" : "text-slate-400"
                                            }`}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-pulse" />
                                            <span>{q.urls.length} Server</span>
                                        </span>
                                    </div>

                                    {/* Action Indicator */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span
                                            className={`hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase transition-colors ${
                                                isOpen ? "text-[#ff1e56]" : isDark ? "text-slate-500" : "text-slate-400"
                                            }`}
                                        >
                                            {isOpen ? "Tutup" : "Pilih Server"}
                                        </span>
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                                                isOpen
                                                    ? "bg-[#ff1e56] text-white border-[#ff1e56] shadow-[0_0_10px_rgba(255,30,86,0.4)]"
                                                    : isDark
                                                        ? "bg-white/5 border-white/10 text-slate-400 group-hover/quality:text-white"
                                                        : "bg-slate-100 border-slate-200 text-slate-600 group-hover/quality:text-slate-900"
                                            }`}
                                        >
                                            <i
                                                className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${
                                                    isOpen ? "rotate-180" : ""
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </button>

                                {/* Server Grid (Expanded Content) */}
                                {isOpen && (
                                    <div
                                        className={`px-3 sm:px-4 pb-4 pt-1 border-t ${
                                            isDark
                                                ? "border-white/[0.06] bg-black/30"
                                                : "border-slate-100 bg-slate-50/50"
                                        }`}
                                    >
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 pt-2">
                                            {q.urls.map((host) => {
                                                const iconClass = getHostIcon(host.title);

                                                return (
                                                    <a
                                                        key={`${host.title}-${host.url}`}
                                                        href={host.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-300 group/host cursor-pointer select-none active:scale-[0.98] ${
                                                            isDark
                                                                ? "bg-white/[0.02] hover:bg-[#ff1e56]/10 border-white/[0.07] hover:border-[#ff1e56]/40 hover:shadow-[0_4px_20px_rgba(255,30,86,0.15)] text-slate-200"
                                                                : "bg-white hover:bg-rose-50/70 border-slate-200 hover:border-[#ff1e56]/40 text-slate-800 shadow-sm"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div
                                                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${
                                                                    isDark
                                                                        ? "bg-white/[0.04] group-hover/host:bg-[#ff1e56]/20 border-white/[0.06] group-hover/host:border-[#ff1e56]/30 text-slate-400 group-hover/host:text-[#ff1e56]"
                                                                        : "bg-slate-100 group-hover/host:bg-rose-100 border-slate-200 group-hover/host:border-rose-300 text-slate-600 group-hover/host:text-[#ff1e56]"
                                                                }`}
                                                            >
                                                                <i className={`${iconClass} text-xs`} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <span className="block text-[11px] sm:text-xs font-bold truncate leading-tight group-hover/host:text-white transition-colors">
                                                                    {host.title.trim()}
                                                                </span>
                                                                <span className="block text-[9px] font-mono text-slate-500 group-hover/host:text-slate-400 uppercase tracking-wider mt-0.5">
                                                                    Direct Link
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                                                isDark
                                                                    ? "bg-white/[0.04] group-hover/host:bg-[#ff1e56] text-slate-500 group-hover/host:text-white shadow-sm"
                                                                    : "bg-slate-100 group-hover/host:bg-[#ff1e56] text-slate-500 group-hover/host:text-white"
                                                            }`}
                                                        >
                                                            <i className="fa-solid fa-arrow-down text-[10px]" />
                                                        </div>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Security & Speed Strip */}
                <div
                    className={`mt-4 pt-3 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 select-none ${
                        isDark ? "border-white/5" : "border-slate-200"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold border ${
                                isDark
                                    ? "bg-white/[0.03] border-white/10 text-slate-400"
                                    : "bg-slate-100 border-slate-200 text-slate-600"
                            }`}
                        >
                            <i className="fa-solid fa-shield-halved text-[9px] text-[#ff1e56]" />
                            <span>Link Terverifikasi Aman</span>
                        </span>

                        <span
                            className={`hidden xs:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold border ${
                                isDark
                                    ? "bg-white/[0.03] border-white/10 text-slate-400"
                                    : "bg-slate-100 border-slate-200 text-slate-600"
                            }`}
                        >
                            <i className="fa-solid fa-bolt text-[9px] text-[#ff1e56]" />
                            <span>Mendukung IDM / ADM</span>
                        </span>
                    </div>

                    <span
                        className={`text-[9px] font-mono font-medium ${
                            isDark ? "text-slate-600" : "text-slate-400"
                        }`}
                    >
                        Rafsanime Download Engine
                    </span>
                </div>
            </div>
        </div>
    );
}
