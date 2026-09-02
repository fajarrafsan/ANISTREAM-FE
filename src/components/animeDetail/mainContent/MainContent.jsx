import TitleSection from './TitleSection';
import InfoGrid from './InfoGrid';
import EpisodeDirectory from './episodeDirectory/EpisodeDirectory';

export default function MainContent({ anime, activeRange, onRangeChange }) {
    return (
        <div className="w-full min-w-0 space-y-6">
            <TitleSection anime={anime} />
            <InfoGrid anime={anime} />
            <EpisodeDirectory
                episodes={anime?.episodes ?? []}
                poster={anime?.poster}
                duration={anime?.duration}
                activeRange={activeRange}
                onRangeChange={onRangeChange}
            />
        </div>
    );
}