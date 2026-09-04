import { useTheme } from "../../../context/ThemeContext";

export default function AuthModalTabs({ activeTab, onChange }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            role="tablist"
            aria-label="Pilih mode autentikasi"
            className={`relative mb-6 flex rounded-2xl border p-1 ${
                isDark
                    ? "border-white/[0.08] bg-white/[0.04]"
                    : "border-zinc-200 bg-zinc-100/80"
            }`}
        >
            <div
                aria-hidden="true"
                className={`absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-xl border transition-transform duration-300 ease-out ${
                    isDark
                        ? "border-white/10 bg-white/[0.08] shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                        : "border-zinc-200 bg-white shadow-sm"
                }`}
                style={{
                    transform: activeTab === "login" ? "translateX(0)" : "translateX(100%)",
                }}
            />

            {[
                { id: "login", label: "Masuk" },
                { id: "register", label: "Daftar" },
            ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        id={`auth-${tab.id}-tab`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="auth-form-panel"
                        onClick={() => onChange(tab.id)}
                        className={`relative z-10 flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                            isActive
                                ? isDark
                                    ? "text-white"
                                    : "text-zinc-950"
                                : isDark
                                    ? "text-zinc-500 hover:text-zinc-300"
                                    : "text-zinc-500 hover:text-zinc-800"
                        }`}
                    >
                        <span
                            aria-hidden="true"
                            className={`size-1.5 rounded-full bg-red-500 transition-all ${
                                isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            }`}
                        />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
