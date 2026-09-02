import { useTheme } from "../../context/ThemeContext";

export default function HomeAmbientBg() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            {/* Mesh gradient orbs */}
            <div
                className="absolute -top-[20%] left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-60"
                style={{
                    background: isDark
                        ? "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute top-[40%] right-[5%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-50"
                style={{
                    background: isDark
                        ? "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute bottom-[10%] left-[30%] w-[35vw] h-[35vw] rounded-full blur-[90px] opacity-40"
                style={{
                    background: isDark
                        ? "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%)",
                }}
            />

            {/* Subtle dot grid */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "#fff" : "#000"} 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Top fade from hero */}
            <div
                className="absolute top-0 left-0 right-0 h-32"
                style={{
                    background: isDark
                        ? "linear-gradient(to bottom, rgba(10,10,15,0.8), transparent)"
                        : "linear-gradient(to bottom, rgba(248,249,250,0.9), transparent)",
                }}
            />
        </div>
    );
}
