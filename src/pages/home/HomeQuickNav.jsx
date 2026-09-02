import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useScrollReveal } from "../../hooks/UseScrollReveal";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import useToast from "../../hooks/useToast";

const NAV_ITEMS = [
    { id: "schedule", label: "Jadwal", desc: "Rilis mingguan", path: "/schedule", accent: "#3b82f6" },
    { id: "catalog", label: "Katalog", desc: "Jelajahi semua", path: "/catalog", accent: "#8b5cf6" },
    { id: "ongoing", label: "Ongoing", desc: "Sedang tayang", path: "/catalog?tab=ongoing", accent: "#ef4444" },
    { id: "complete", label: "Complete", desc: "Sudah tamat", path: "/catalog?tab=complete", accent: "#10b981" },
];

export default function HomeQuickNav() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { openModal } = useAuthModal();
    const toast = useToast();
    const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

    const handleNav = (path) => {
        if (!isLoggedIn) {
            toast.warning("Silakan login terlebih dahulu.", 3000);
            openModal({ mode: "login", redirectAction: () => navigate(path) });
            return;
        }
        navigate(path);
    };

    return (
        <section className="relative z-20 py-4 sm:py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
                <div
                    ref={ref}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
                >
                    {NAV_ITEMS.map((item, i) => (
                        <button
                            key={item.id}
                            onClick={() => handleNav(item.path)}
                            className={`group relative text-left rounded-xl sm:rounded-2xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden ${
                                isDark
                                    ? "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/[0.12]"
                                    : "bg-white border-black/[0.06] hover:shadow-md hover:border-black/[0.1]"
                            }`}
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? "translateY(0)" : "translateY(16px)",
                                transition: `opacity 450ms ease ${i * 70}ms, transform 450ms cubic-bezier(0.4,0,0.2,1) ${i * 70}ms`,
                            }}
                        >
                            {/* Accent bar */}
                            <div
                                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-all duration-300 group-hover:top-3 group-hover:bottom-3"
                                style={{ background: item.accent, boxShadow: `0 0 12px ${item.accent}55` }}
                            />

                            <div className="pl-3">
                                <span
                                    className="block font-mono text-[10px] font-bold tracking-widest mb-2 opacity-40"
                                    style={{ color: item.accent }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className={`font-display text-lg sm:text-xl tracking-wide font-bold mb-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                                    {item.label}
                                </p>
                                <p className={`text-[11px] sm:text-xs ${isDark ? "text-white/35" : "text-gray-500"}`}>
                                    {item.desc}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
