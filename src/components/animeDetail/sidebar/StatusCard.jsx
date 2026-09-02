// StatusCard.jsx
import { useTheme } from "../../../context/ThemeContext";

const STATUS_MAP = {
    FINISHED: { color: 'green', label: 'SELESAI' },
    RELEASING: { color: 'blue', label: 'TAYANG' },
    NOT_YET_RELEASED: { color: 'yellow', label: 'BELUM TAYANG' },
    CANCELLED: { color: 'red', label: 'DIBATALKAN' },
    HIATUS: { color: 'orange', label: 'HIATUS' },
};

const COLOR_CLASS = {
    green: { dot: 'bg-emerald-500 shadow-[0_0_12px_#10b981]', glow: 'rgba(16,185,129,0.2)' },
    blue: { dot: 'bg-blue-500 shadow-[0_0_12px_#3b82f6]', glow: 'rgba(59,130,246,0.2)' },
    yellow: { dot: 'bg-yellow-500 shadow-[0_0_12px_#eab308]', glow: 'rgba(234,179,8,0.2)' },
    red: { dot: 'bg-red-500 shadow-[0_0_12px_#ef4444]', glow: 'rgba(239,68,68,0.2)' },
    orange: { dot: 'bg-orange-500 shadow-[0_0_12px_#f97316]', glow: 'rgba(249,115,22,0.2)' },
};

export default function StatusCard({ anime }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const statusKey = anime?.status ?? 'FINISHED';
    const { color, label } = STATUS_MAP[statusKey] ?? STATUS_MAP.FINISHED;
    const cls = COLOR_CLASS[color];
    const totalEps = anime?.totalEpisodes;

    return (
        <div className="relative group w-full min-w-0 select-none rounded-[18px] p-[1px] overflow-hidden">
            {/* Animated Magic Border */}
            {isDark && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1e56]/30 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-all duration-500 z-0" />
            )}

            <div
                className={`relative z-10 rounded-[17px] p-4 sm:p-5 shadow-2xl transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-xl ${isDark
                    ? "bg-[#0b0406]/90 border border-white/5 hover:border-[#ff1e56]/30"
                    : "bg-white border border-slate-200 hover:border-rose-400"
                    }`}
            >
                {/* Ambient glow inside */}
                <div
                    className="absolute inset-0 rounded-[17px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, ${cls.glow}, transparent 70%)`,
                    }}
                />

                {/* Left: Status indicator */}
                <div className="flex items-center gap-3 min-w-0 z-20">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-70 ${cls.dot}`} />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cls.dot}`} />
                    </span>
                    <span
                        className={`text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase whitespace-nowrap drop-shadow-sm ${isDark ? "text-slate-300 group-hover:text-white transition-colors" : "text-slate-500"
                            }`}
                    >
                        Status Penayangan
                    </span>
                </div>

                {/* Right: Premium Badge */}
                <span
                    className={`relative overflow-hidden inline-flex items-center gap-1.5 border text-[10px] sm:text-[11px] font-black px-3.5 py-1.5 rounded-lg transition-all duration-300 w-fit shrink-0 z-20 ${isDark
                        ? "bg-[#16080b] border-[#ff1e56]/20 text-[#ff1e56] shadow-[0_0_15px_rgba(255,30,86,0.1)] group-hover:shadow-[0_0_20px_rgba(255,30,86,0.25)] group-hover:border-[#ff1e56]/50"
                        : "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                        }`}
                >
                    {isDark && (
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                    )}
                    <span className="whitespace-nowrap relative z-10">{label}</span>
                    {totalEps && (
                        <span className="text-[9px] sm:text-[10px] font-bold opacity-80 border-l border-current/30 pl-2 ml-1 whitespace-nowrap relative z-10">
                            {totalEps} EPS
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
}