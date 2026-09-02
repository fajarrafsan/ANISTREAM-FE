// RangeFilter.jsx
import { useTheme } from "../../../../context/ThemeContext"; // sesuaikan path

export default function RangeFilter({
    rangeOptions = [],
    activeRange = "",
    onRangeChange,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2.5 w-full sm:w-auto select-none">
            {/* Mengubah ukuran dari text-[10px] font-medium ke text-[9px] font-bold agar tajam di HP */}
            <span
                className={`text-[9px] sm:text-[11px] font-bold tracking-wider uppercase whitespace-nowrap ${isDark ? "text-slate-500" : "text-slate-400"
                    }`}
            >
                Range
            </span>

            <div className="relative w-full sm:w-auto">
                <select
                    value={activeRange}
                    onChange={(e) => onRangeChange(e.target.value)}
                    className={`appearance-none w-full sm:w-auto text-[10px] sm:text-[11px] font-bold pl-2.5 pr-8 min-h-[44px] sm:min-h-0 py-2 sm:py-2 rounded-lg cursor-pointer focus:outline-none transition-all duration-200 border min-w-[100px] sm:min-w-[110px] touch-manipulation ${isDark
                        ? "bg-[#13080c] border-[#2a1117]/60 text-slate-300 focus:border-red-900/50 hover:border-red-900/30"
                        : "bg-white border-slate-300 text-slate-600 focus:border-rose-400/50 hover:border-rose-300/60"
                        }`}
                    aria-label="Pilih range episode"
                >
                    {rangeOptions.length > 0 ? (
                        rangeOptions.map((range) => (
                            <option
                                key={range}
                                value={range}
                                className={
                                    isDark
                                        ? "bg-[#0d0407] text-slate-300"
                                        : "bg-white text-slate-700"
                                }
                            >
                                Eps {range}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>
                            Tidak ada range
                        </option>
                    )}
                </select>

                {/* Chevron (Diposisikan di right-2.5 agar presisi dengan ukuran ringkas baru) */}
                <div
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                >
                    <i className="fa-solid fa-chevron-down text-[8px] sm:text-[9px]" />
                </div>
            </div>
        </div>
    );
}