import { useTheme } from "../../context/ThemeContext";

const DAYS = [
    { key: "SUN", label: "MIN", fullLabel: "Minggu" },
    { key: "MON", label: "SEN", fullLabel: "Senin" },
    { key: "TUE", label: "SEL", fullLabel: "Selasa" },
    { key: "WED", label: "RAB", fullLabel: "Rabu" },
    { key: "THU", label: "KAM", fullLabel: "Kamis" },
    { key: "FRI", label: "JUM", fullLabel: "Jumat" },
    { key: "SAT", label: "SAB", fullLabel: "Sabtu" },
];

const DAY_INDEX_KEYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function DaySelector({ activeDay, onDayChange }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const todayKey = DAY_INDEX_KEYS[new Date().getDay()];

    return (
        <section className="w-full relative select-none">
            {/* 7 Columns Grid on Mobile, Flex on Desktop */}
            <div className="grid grid-cols-7 sm:flex sm:flex-wrap gap-1 sm:gap-2 pb-1">
                {DAYS.map((day) => {
                    const isActive = activeDay === day.key;
                    const isToday = todayKey === day.key;

                    return (
                        <button
                            key={day.key}
                            onClick={() => onDayChange(day.key)}
                            className={`relative rounded-xl font-black uppercase transition-all duration-200 select-none overflow-hidden text-center flex flex-col items-center justify-center cursor-pointer
                                px-1 sm:px-4 py-2 sm:py-2.5 text-[8px] min-[360px]:text-[9px] min-[390px]:text-[10px] sm:text-xs tracking-wider min-w-0 sm:min-w-[70px] border
                                ${isActive
                                    ? 'bg-gradient-to-r from-[#ff1e56] to-rose-600 border-transparent text-white shadow-[0_4px_18px_rgba(255,30,86,0.35)]'
                                    : isDark
                                        ? 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/[0.06]'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                                }`}
                        >
                            <span className="relative z-10 flex items-center gap-1">
                                <span className="sm:hidden">{day.label}</span>
                                <span className="hidden sm:inline">{day.fullLabel}</span>
                                {isToday && (
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            isActive ? 'bg-white' : 'bg-[#ff1e56]'
                                        } animate-pulse`}
                                        title="Hari Ini"
                                    />
                                )}
                            </span>
                            {isToday && (
                                <span className={`text-[6px] sm:text-[7px] font-mono lowercase tracking-normal mt-0.5 opacity-80 ${
                                    isActive ? 'text-white' : 'text-[#ff1e56]'
                                }`}>
                                    hari ini
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}