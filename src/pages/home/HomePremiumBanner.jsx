import { Heart, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useScrollReveal } from "../../hooks/UseScrollReveal";

const STATS = [
    { value: "800+", label: "Anime" },
    { value: "12K+", label: "Episode" },
    { value: "HD", label: "Kualitas" },
    { value: "24/7", label: "Akses" },
];

export default function HomePremiumBanner() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { ref: bannerRef, isVisible: bannerVisible } = useScrollReveal({ threshold: 0.2 });
    const { ref: textRef, isVisible: textVisible } = useScrollReveal({ threshold: 0.2 });
    const { ref: btnRef, isVisible: btnVisible } = useScrollReveal({ threshold: 0.2 });

    return (
        <section className="py-4 md:py-6 relative z-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div
                    ref={bannerRef}
                    style={{
                        opacity: bannerVisible ? 1 : 0,
                        transform: bannerVisible ? "translateY(0px) scale(1)" : "translateY(32px) scale(0.98)",
                        transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border group transition-all duration-500 ${
                        isDark
                            ? "bg-linear-to-br from-zinc-900/80 via-zinc-950/60 to-red-950/20 border-white/[0.06] shadow-2xl shadow-black/40"
                            : "bg-linear-to-br from-white via-red-50/30 to-orange-50/20 border-red-100/60 shadow-xl shadow-red-100/20"
                    }`}
                >
                    {/* Animated mesh background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div
                            className={`absolute -right-32 -top-32 w-96 h-96 rounded-full blur-[100px] transition-all duration-1000 group-hover:scale-110 ${
                                isDark ? "bg-red-600/10" : "bg-red-400/8"
                            }`}
                        />
                        <div
                            className={`absolute -left-20 -bottom-20 w-72 h-72 rounded-full blur-[80px] ${
                                isDark ? "bg-orange-500/5" : "bg-orange-300/5"
                            }`}
                        />
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "#fff" : "#000"} 1px, transparent 0)`,
                                backgroundSize: "24px 24px",
                            }}
                        />
                        {/* Top accent line */}
                        <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-red-500/40 to-transparent" />
                    </div>

                    <div className="relative z-10 p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Left: Content */}
                        <div
                            ref={textRef}
                            className="flex-1 text-center lg:text-left"
                            style={{
                                opacity: textVisible ? 1 : 0,
                                transform: textVisible ? "translateX(0px)" : "translateX(-24px)",
                                transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                                transitionDelay: textVisible ? "150ms" : "0ms",
                            }}
                        >
                            {/* Badge */}
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border ${
                                isDark
                                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                                    : "bg-red-50 border-red-200/60 text-red-600"
                            }`}>
                                <Sparkles className="w-3 h-3" />
                                Premium Experience
                            </div>

                            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wider font-extrabold text-text-primary mb-3">
                                DUKUNG <span className="bg-linear-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">KREATOR</span>
                            </h3>
                            <p className={`text-sm md:text-base max-w-lg leading-relaxed mx-auto lg:mx-0 ${
                                isDark ? "text-zinc-400" : "text-zinc-600"
                            }`}>
                                Suka dengan konten kami? Dukung kami agar dapat terus menyajikan hiburan streaming anime terbaik secara gratis dan lancar.
                            </p>

                            {/* Stats row */}
                            <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 mt-6">
                                {STATS.map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className={`font-display text-xl sm:text-2xl font-black tracking-wide ${
                                            isDark ? "text-white/90" : "text-gray-900"
                                        }`}>
                                            {stat.value}
                                        </p>
                                        <p className={`text-[10px] uppercase tracking-widest font-semibold mt-0.5 ${
                                            isDark ? "text-white/30" : "text-gray-400"
                                        }`}>
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: CTA */}
                        <div
                            ref={btnRef}
                            className="relative z-10 shrink-0"
                            style={{
                                opacity: btnVisible ? 1 : 0,
                                transform: btnVisible ? "translateX(0px)" : "translateX(24px)",
                                transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                                transitionDelay: btnVisible ? "300ms" : "0ms",
                            }}
                        >
                            <a
                                href="https://saweria.co/fajarrafsan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn relative inline-flex items-center gap-3
                                    bg-linear-to-r from-[#ff1e56] to-[#e11d48]
                                    hover:from-[#ff336a] hover:to-[#f43f5e]
                                    text-white font-bold px-8 py-4 rounded-2xl text-sm
                                    transition-all duration-300
                                    hover:scale-[1.04] active:scale-[0.96]
                                    shadow-[0_8px_32px_rgba(255,30,86,0.3)]
                                    hover:shadow-[0_12px_40px_rgba(255,30,86,0.45)]
                                    overflow-hidden"
                            >
                                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent" />

                                <div className="relative w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover/btn:bg-white/25 transition-colors duration-300">
                                    <Heart
                                        className="w-5 h-5 fill-current text-white/90
                                            transition-all duration-300
                                            group-hover/btn:scale-110
                                            animate-[pulse_1.5s_ease-in-out_infinite]"
                                    />
                                </div>

                                <div className="relative text-left">
                                    <span className="block font-black tracking-wide text-base">
                                        Dukung di Saweria
                                    </span>
                                    <span className="block text-[10px] text-white/60 font-medium tracking-wider mt-0.5">
                                        saweria.co/fajarrafsan
                                    </span>
                                </div>

                                <span className="relative ml-2 transition-transform duration-300 transform group-hover/btn:translate-x-1 text-lg">
                                    →
                                </span>

                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-75" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
