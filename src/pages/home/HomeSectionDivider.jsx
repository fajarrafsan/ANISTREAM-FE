import { useTheme } from "../../context/ThemeContext";

export default function HomeSectionDivider({ accent = "red" }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const colorMap = {
        red: { main: "239,68,68", secondary: "249,115,22" },
        emerald: { main: "16,185,129", secondary: "20,184,166" },
    };
    const c = colorMap[accent] || colorMap.red;

    return (
        <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-8" aria-hidden="true">
            <div className="flex items-center gap-4">
                <div
                    className="flex-1 h-px"
                    style={{
                        background: isDark
                            ? `linear-gradient(to right, transparent, rgba(${c.main},0.2), rgba(${c.secondary},0.1), transparent)`
                            : `linear-gradient(to right, transparent, rgba(${c.main},0.15), rgba(${c.secondary},0.08), transparent)`,
                    }}
                />
                <div className="flex items-center gap-1.5">
                    <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: `rgba(${c.main},0.5)` }}
                    />
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: `rgba(${c.main},0.7)`, boxShadow: `0 0 8px rgba(${c.main},0.4)` }}
                    />
                    <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: `rgba(${c.main},0.5)` }}
                    />
                </div>
                <div
                    className="flex-1 h-px"
                    style={{
                        background: isDark
                            ? `linear-gradient(to left, transparent, rgba(${c.main},0.2), rgba(${c.secondary},0.1), transparent)`
                            : `linear-gradient(to left, transparent, rgba(${c.main},0.15), rgba(${c.secondary},0.08), transparent)`,
                    }}
                />
            </div>
        </div>
    );
}
