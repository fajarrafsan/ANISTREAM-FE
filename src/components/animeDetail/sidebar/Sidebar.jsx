import { motion } from "motion/react";
import PosterCard from './PosterCard';
import StatusCard from './StatusCard';
import StatsCard from './StatsCard';
import MetadataCard from './MetaDataCard';
import { sidebarItemVariants, useMotionSafe, motionProps } from '../constants/animeDetailMotion';
import { getAnimeTitle } from '../../../utils/animeDetailUtils';

export default function Sidebar({ anime }) {
    const reduced = useMotionSafe();

    const popularRank =
        anime?.popularityRank ??
        anime?.rankings?.find(
            (r) => r.type === 'POPULAR' && r.allTime === true
        )?.rank ??
        anime?.rankings?.find(
            (r) => r.type === 'POPULAR' && r.season === null && r.allTime === false
        )?.rank;

    const displayTitle = getAnimeTitle(anime);

    const items = [
        { key: 'poster', node: (
            <PosterCard
                poster={anime?.poster}
                title={displayTitle}
                rank={popularRank}
            />
        )},
        { key: 'status', node: <StatusCard anime={anime} /> },
        { key: 'stats', node: <StatsCard anime={anime} /> },
        { key: 'meta', node: <MetadataCard anime={anime} /> },
    ];

    return (
        <aside className="w-full min-w-0">
            <motion.div
                className="space-y-4 sm:space-y-5 overflow-visible"
                {...motionProps(reduced, {
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                    },
                })}
            >
                {items.map(({ key, node }) => (
                    <motion.div
                        key={key}
                        {...motionProps(reduced, sidebarItemVariants)}
                    >
                        <div className={key === 'poster' ? "flex justify-center lg:block px-1 sm:px-0" : "px-0.5 sm:px-0"}>
                            {node}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </aside>
    );
}
