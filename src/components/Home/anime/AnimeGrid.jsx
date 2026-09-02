import { motion } from "motion/react";
import { useTheme } from "../../../context/ThemeContext";
import { useState, useEffect } from "react";
import AnimeCards from "./AnimeCard/AnimeCards";
import { useCanHover } from "./AnimeCard/useCanHover";
import { gridContainerVariants, gridItemVariants } from "./AnimeCard/animeCardMotion";

export default function AnimeGrid({ animes = [] }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const canHover = useCanHover();
    const [activeCardId, setActiveCardId] = useState(null);

    useEffect(() => {
        if (canHover) setActiveCardId(null);
    }, [canHover]);

    if (!animes?.length) {
        return (
            <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Tidak ada data anime
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 relative overflow-visible"
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
        >
            {animes.map((anime, index) => (
                <motion.div
                    key={anime.id ?? anime.animeId ?? index}
                    variants={gridItemVariants}
                    className="relative overflow-visible"
                >
                    <AnimeCards
                        anime={anime}
                        index={index}
                        activeCardId={activeCardId}
                        setActiveCardId={setActiveCardId}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
